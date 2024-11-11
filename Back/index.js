"use strict";
const express = require('express');
const app = express();
const fs = require('fs')
const mysql = require('mysql2/promise');
const PORT = 20871;
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const multer = require('multer');
const { error } = require('console');
const { spawn } = require('child_process');
app.use(express.json());
app.use(cors());

app.use('/uploads/images', express.static(path.join(__dirname, 'uploads/images')));
app.use('/grafiques', express.static(path.join(__dirname, 'grafiques')));
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

let uploadedImages = {};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/images');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const fileName = uniqueSuffix + path.extname(file.originalname);

        uploadedImages[fileName] = Date.now();

        cb(null, fileName);
    }
});

const upload = multer({ storage: storage });

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);
    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id);
    });
});

function createConnection() {
    return mysql.createConnection({
        host: 'dam.inspedralbes.cat',
        user: 'a23marclacas_tr1_juicengo',
        password: 'InsPedralbes2024',
        database: 'a23marclacas_tr1_juicengo',
        // host: 'localhost',
        // user: 'root',
        // password: '',
        // database: 'a21rublormar_TR1_GR6',
        // port: 3306
    })
        .then(connection => {
            console.log("Connexió creada");
            return connection;
        })
        .catch(err => {
            console.error('Error de connexió: ' + err);
            throw err;
        });
}

app.get('/getProductesBD', (req, res) => {
    createConnection()
        .then(connection => {
            return connection.connect()
                .then(() => {
                    return connection.query('SELECT * FROM producte');
                })
                .then(([resultats]) => {
                    const response = {
                        productes: resultats.map(producte => ({
                            idProducte: producte.idProducte,
                            nomProducte: producte.nomProducte,
                            Descripcio: producte.Descripcio,
                            Preu: parseFloat(producte.Preu),
                            Stock: producte.Stock,
                            Imatge: producte.Imatge,
                            Activat: producte.Activat
                        }))
                    };
                    res.json(response);
                })
                .finally(() => {
                    connection.end();
                });
        })
        .catch(error => {
            console.error('Error fetching products:', error);
            res.status(500).send('Error fetching products');
        });
});

app.get('/getComandesBD', (req, res) => {
    console.log("hola");
    createConnection()
        .then(connection => {
            return connection.connect()
                .then(() => {
                    return connection.query('SELECT * FROM comandes');
                })
                .then(([resultats]) => {
                    const response = {
                        comandes: resultats.map(comandes => {
                            try {
                                console.log('Contenido de Productes:', comandes.Productes);
                                const productesParsed = comandes.Productes ? JSON.parse(comandes.Productes) : null;
                                return {
                                    idComanda: comandes.idComanda,
                                    idUsuari: comandes.idUsuari,
                                    Productes: productesParsed,
                                    PreuTotal: parseFloat(comandes.PreuTotal),
                                    Estat: comandes.Estat,
                                    data: new Date(comandes.data).toISOString()
                                };
                            } catch (error) {
                                console.error('Error parsing Productes:', error, 'Contenido:', comandes.Productes);
                                return {
                                    idComanda: comandes.idComanda,
                                    idUsuari: comandes.idUsuari,
                                    Productes: null,
                                    PreuTotal: parseFloat(comandes.PreuTotal),
                                    Estat: comandes.Estat,
                                    data: new Date(comandes.data).toISOString()
                                };
                            }
                        })
                    };
                    res.json(response);
                })
                .finally(() => {
                    connection.end();
                });
        })
        .catch(err => {
            console.error('Error creating connection or executing query:', err);
            res.status(500).send('Error interno del servidor');
        });
});

app.post('/postProducteBD', upload.single('Imatge'), async (req, res) => {
    const { nomProducte, Descripcio, Preu, Stock, Activat } = req.body;

    if (!req.file) {
        console.error("no se ha subido ninguna imagen");
        return res.status(400).send('No s\'ha pujat cap imatge');
    }

    const connection = await createConnection();
    const imatgePath = req.file ? req.file.path : null;
    const imatge = imatgePath ? path.basename(imatgePath) : null;


    return connection.execute(
        `INSERT INTO producte (nomProducte, Descripcio, Preu, Stock, Imatge, Activat) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [nomProducte, Descripcio, Preu, Stock, imatge, Activat]
    )
        .then(([result]) => {
            const productId = result.insertId;
            const newProduct = {
                "idProducte": productId,
                "nomProducte": nomProducte,
                "Descripcio": Descripcio,
                "Preu": Preu,
                "Stock": Stock,
                "Imatge": imatge,
                "Activat": Activat
            }
            io.emit("new-product", JSON.stringify(newProduct))
            return connection.query('SELECT * FROM producte WHERE idProducte = ?', [productId]);
        })
        .then(([resultats]) => {
            const producte = resultats[0];
            res.json({
                message: 'Producte afegit correctament',
                producte: { idProducte: producte.idProducte, nomProducte: producte.nomProducte, Descripcio: producte.Descripcio, Preu: parseFloat(producte.Preu), Stock: producte.Stock, Imatge: producte.Imatge, Activat: producte.Activat }
            });
            console.log("Producte afegit: ", producte);

        })
        .catch(error => {
            console.error('Error afegint producte:', error);
            res.status(500).send('Error afegint producte');
        })
        .finally(() => {
            connection.end();
        });
});

app.put('/putProducteBD/:id', upload.single('Imatge'), async (req, res) => {
    const idProducte = parseInt(req.params.id);
    const { nomProducte, Descripcio, Preu, Stock, Activat } = req.body;

    const connection = await createConnection();

    let imatgePath = req.file ? req.file.path : null;
    const imatge = imatgePath ? path.basename(imatgePath) : null;

    const [rows] = await connection.execute(`SELECT Imatge FROM producte WHERE idProducte = ?`, [idProducte]);
    const currentImagePath = rows.length > 0 ? rows[0].Imatge : null;

    const finalImage = imatge || currentImagePath;

    return connection.execute(
        `UPDATE producte 
        SET nomProducte = ?, Descripcio = ?, Preu = ?, Stock = ?, Imatge = ?, Activat = ? 
        WHERE idProducte = ?`,
        [nomProducte, Descripcio, Preu, Stock, finalImage, Activat, idProducte]
    )
        .then(() => {
            const updateProduct = {
                "idProducte": idProducte,
                "nomProducte": nomProducte,
                "Descripcio": Descripcio,
                "Preu": Preu,
                "Stock": Stock,
                "Imatge": finalImage,
                "Activat": Activat
            }
            io.emit("update-product", JSON.stringify(updateProduct))
            res.json({
                message: 'Producte actualitzat correctament',
                producte: { idProducte, nomProducte, Descripcio, Preu, Stock, Activat, imatgePath }
            });
            console.log("Producte actualitzat: ", res.json);
        })
        .finally(() => {
            connection.end();
        });
});

app.delete('/deleteProducteBD/:id', async (req, res) => {
    const idProducte = req.params.id;

    const connection = await createConnection();

    try {
        const [rows] = await connection.execute(`SELECT * FROM producte WHERE idProducte = ?`, [idProducte]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Producte no trobat' });
        }

        await connection.execute(`DELETE FROM producte WHERE idProducte = ?`, [idProducte]);

        io.emit('delete-product', JSON.stringify(idProducte))

        res.json({
            message: 'Producte eliminat correctament',
            idProducte: idProducte
        });

    } catch (error) {
        console.error("Error eliminant producte: ", error);
        res.status(500).json({
            error: 'Error eliminant producte',
            details: error.details
        })
    } finally {
        connection.end();
    }
});

function data(data) {
    const dataISO = String(data.toISOString())
    const dataFormatjada = dataISO.substring(0, 10);
    return dataFormatjada;
}

app.get('/getHistorialComandes/:id', async (req, res) => {
    const idUsuari = parseInt(req.params.id);

    const connection = await createConnection();

    try {
        const [resultats] = await connection.execute('SELECT * FROM comandes WHERE idUsuari = ?', [idUsuari]);

        const response = {
            Comandes: resultats.map(comanda => ({
                idComanda: comanda.idComanda,
                Productes: JSON.parse(comanda.Productes),
                PreuTotal: comanda.PreuTotal,
                Data: data(comanda.data),
                Estat: comanda.Estat
            }))
        };

        res.json(response);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).send('Error fetching orders');
    } finally {
        connection.end();
    }
});

app.post('/registerBD', async (req, res) => {
    const { Nom, Correu, Contrasenya } = req.body;

    const connection = await createConnection();

    try {
        const [result] = await connection.execute(
            `INSERT INTO usuari (Nom, Correu, Contrasenya) 
            VALUES (?, ?, ?)`,
            [Nom, Correu, Contrasenya]
        );

        const idUser = result.insertId;
        const newUsuari = {
            idUser: idUser,
            Nom: Nom,
            Correu: Correu,
            Contrasenya: Contrasenya,
            Confirmacio: true
        };

        res.json(newUsuari);
    } catch (error) {
        console.error('Error afegint usuari:', error);
        res.json({ Confirmacio: false });
    } finally {
        await connection.end();
    }
});

app.post('/loginBD', async (req, res) => {
    const { Correu, Contrasenya } = req.body

    const connection = await createConnection();

    try {
        const [usuari] = await connection.execute(`SELECT * FROM usuari WHERE Correu = ? AND Contrasenya = ?`, [Correu, Contrasenya]);
        const response = {
            idUser: usuari[0].idUser,
            Nom: usuari[0].Nom,
            Correu: usuari[0].Correu,
            Contrasenya: usuari[0].Contrasenya,
            Confirmacio: true
        }

        res.json(response)
    } catch (err) {
        res.json({ Confirmacio: false });
    }
});

app.put('/updatePerfil/:id', async (req, res) => {
    const idUsuari = parseInt(req.params.id);
    const { Nom, Correu, Contrasenya } = req.body;

    const connection = await createConnection();

    try {
        await connection.execute(`UPDATE usuari SET Nom = ?, Correu = ?, Contrasenya = ? WHERE idUser = ?`,
            [Nom, Correu, Contrasenya, idUsuari]);

        res.json({ message: "Actualitzat el perfil" });
    } catch (error) {
        res.json({ message: "No s'actualitzat el perfil" });
    } finally {
        connection.end();
    }
});

function dataActual() {
    const dataActual = new Date();
    const dia = dataActual.getDate();
    const mes = dataActual.getMonth() + 1;
    const any = dataActual.getFullYear();

    return `${any}-${mes}-${dia}`;
}

app.post('/newComandesBD', async (req, res) => {
    const { idUsuari, Productes, PreuTotal } = req.body;

    const connection = await createConnection();

    try {
        const ProductesText = JSON.stringify(Productes);

        const [resultComanda] = await connection.execute('INSERT INTO comandes (idUsuari, Productes, PreuTotal, data) VALUES (?, ?, ?, ?)',
            [idUsuari, ProductesText, PreuTotal, dataActual()]);

        const idComanda = resultComanda.insertId;

        const [result] = await connection.execute('SELECT * FROM comandes WHERE idComanda = ?', [idComanda]);

        for (const element of Productes) {
            await connection.execute(
                `UPDATE producte SET Stock = GREATEST(Stock - ?, 0) WHERE idProducte = ?`,
                [element.quantitat, element.idProducte]
            );
        }

        const responseVue = {
            idComanda: result[0].idComanda,
            idUsuari: result[0].idUsuari,
            PreuTotal: result[0].PreuTotal,
            Productes: JSON.parse(result[0].Productes),
            Estat: result[0].Estat,
            data: result[0].data
        }

        const response = Productes.map(element => ({
            idProducte: element.idProducte,
            Stock: element.quantitat
        }));

        io.emit('new-comanda', responseVue);
        io.emit('update-stock', JSON.stringify(response));
        res.json({ message: 'Gracies per compra' });
    } catch (error) {
        res.json({ message: "No s'ha pogut compra" });
    } finally {
        connection.end();
    }
});

app.put('/putEstatBD/:id', async (req, res) => {
    const idComanda = parseInt(req.params.id);
    const { Estat } = req.body;

    try {
        const connection = await createConnection();

        await connection.execute(
            `UPDATE comandes SET Estat = ? WHERE idComanda = ?`,
            [Estat, idComanda]
        );

        io.emit("update-estat", JSON.stringify({ "idComanda": idComanda, "Estat": Estat }));

        res.json({ message: "Actualitzat l'estat de la comanda" });
    } catch (error) {
        console.error("Error al actualizar el estado en la base de datos:", error);
        res.json({ message: "No s'actualitzat l'estat de la comanda" });
    }
});


app.post('/estadistiques-clients', async (req, res) => {
    const connection = await createConnection();

    try {
        const [rows] = await connection.execute(`
            SELECT idUsuari AS ID, u.Nom AS Clients,
                   COUNT(c.idComanda) AS Ventes,
                   SUM(c.PreuTotal) AS Diners,
                   AVG(c.PreuTotal) AS \`Diners/venda\`
            FROM usuari u
            JOIN comandes c ON u.idUser = c.idUsuari
            GROUP BY u.Nom;
        `);

        const rowsJson = JSON.stringify(rows);
        // Guardar los datos en un archivo temporal
        const tempFilePath = path.join(__dirname, 'python', `temp_dataClients_${Date.now()}.json`);
        require('fs').writeFileSync(tempFilePath, rowsJson);

        // Llamar al script de Python usando spawn y enviar la ruta del archivo temporal como argumento
        const scriptPath = path.join(__dirname, 'python', 'clients.py');
        const pythonProcess = spawn('python3', [scriptPath, tempFilePath]);

        let pythonOutput = '';

        pythonProcess.stdout.on('data', (data) => {
            pythonOutput += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`Error en el script de Python: ${data}`);
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                return res.status(500).json({ message: "Error generando gráficos" });
            }

            const imagePath = pythonOutput.trim();
            res.json({ success: true, imagePathsClients: [imagePath] });

            // Eliminar el archivo temporal
            require('fs').unlinkSync(tempFilePath);
        });
    } catch (error) {
        console.error("Error al ejecutar la consulta:", error);
        res.status(500).json({ message: "No es va poder executar la consulta", error: error.message });
    } finally {
        connection.end();
    }
});


app.post('/estadistiques-client', async (req, res) => {
    const { Correu } = req.body;

    if (!Correu) {
        return res.status(400).json({ message: "Correu és requerit" });
    }

    const connection = await createConnection();

    try {
        const [idUsuariResult] = await connection.execute(`SELECT idUser FROM usuari WHERE Correu = ?`, [Correu]);

        if (idUsuariResult.length === 0) {
            return res.status(404).json({ message: "Usuari no trobat" });
        }

        const idUsuari = idUsuariResult[0].idUser;

        const [rows] = await connection.execute('SELECT * FROM comandes WHERE idUsuari = ?', [idUsuari]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "No hi ha comandes per aquest usuari" });
        }

        const rowsJson = JSON.stringify(rows);

        // Guardar los datos en un archivo temporal
        const tempFilePath = path.join(__dirname, 'python', `temp_dataClient_${Date.now()}.json`);
        require('fs').writeFileSync(tempFilePath, rowsJson);

        // Llamar al script de Python usando spawn y enviar el correo como argumento
        const scriptPath = path.join(__dirname, 'python', 'client.py');
        const pythonProcess = spawn('python3', [scriptPath, tempFilePath]);

        let pythonOutput = '';

        pythonProcess.stdout.on('data', (data) => {
            pythonOutput += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`Error en el script de Python: ${data}`);
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                return res.status(500).json({ message: "Error generando gráficos" });
            }

            // Asegúrate de que pythonOutput sea la ruta completa de la imagen
            const imagePath = pythonOutput.trim();
            console.log("imagePath", imagePath);
            res.json({ success: true, imagePaths: [imagePath] });

            // Eliminar el archivo temporal
            require('fs').unlinkSync(tempFilePath);
        });
    } catch (error) {
        console.error("Error en executar la consulta: ", error);
        res.status(500).json({ message: "No es va poder executar la consulta", error: error.message });
    } finally {
        connection.end();
    }
});

server.listen(PORT, () => {
    console.log(`Servidor en funcionament a http://juicengo.dam.inspedralbes.cat:${PORT}`);
});