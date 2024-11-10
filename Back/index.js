"use strict";
const express = require('express');
const app = express();
const fs = require('fs')
const mysql = require('mysql2/promise');
const PORT = 3010;
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
        origin: "*", // Or restrict it to your Android emulator/device IP
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

let json;
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

// Llegir el fitxer JSON amb els productes
app.get('/getProductes', (req, res) => {
    res.send(json.productes);
});

// Eliminar producte JSON
app.delete('/deleteProduct/:id', (req, res) => {
    const idProduct = parseInt(req.params.id);
    let productes = json.productes;

    const producteIndex = productes.findIndex(p => parseInt(p.idProducte) === idProduct);
    if (producteIndex === -1) {
        return res.status(404).send('Producte no trobat');
    };

    productes.splice(producteIndex, 1);
    console.log("Producte esborrat: " + productes[producteIndex]);

    json.productes = productes;

    fs.writeFile('./db/Productes.json', JSON.stringify(json, null, 2), (err) => {
        if (err) {
            console.error('Error escrivint el fitxer JSON', err);
            return res.status(500).send('Error eliminant el producte');
        }
        console.log("producte index", idProduct);
        res.json(idProduct);
    });
});

// Actualitzar Producte JSON
app.put('/putProducte/:id', (req, res) => {
    const idProduct = parseInt(req.params.id);
    let productes = json.productes;

    const producte = productes.find(p => p.idProducte === idProduct);

    if (!producte) {
        return res.status(404).send("Producte no trobat");
    }

    producte.nomProducte = req.body.nomProducte || producte.nomProducte;
    producte.Descripcio = req.body.Descripcio || producte.Descripcio;
    producte.Preu = req.body.Preu || producte.Preu;
    producte.Stock = req.body.Stock || producte.Stock;
    producte.Imatge = req.body.Imatge || producte.Imatge;

    json.productes = productes;

    fs.writeFile('./db/Productes.json', JSON.stringify(json, null, 2), (err) => {
        if (err) {
            console.error('Error escrivint el fitxer JSON', err);
            return res.status(500).send('Error actualitzant el producte');
        }
        res.json(producte);
    });
});


// Afegir Producte JSON
app.post('/postProducte', (req, res) => {
    const newProduct = req.body;
    let productes = json.productes;

    const newIndex = productes.length + 1;
    newProduct.idProducte = newIndex;
    productes.push(newProduct);

    json.productes = productes;
    console.log("array productes", productes);

    fs.writeFile('./db/Productes.json', JSON.stringify(json, null, 2), (err) => {
        if (err) {
            console.error('Error escrivint el fitxer JSON', err);
            return res.status(500).send('Error afegint el producte');
        }
        res.json({ message: 'Producte afegit correctament!', product: newProduct })
    });

});

// Crear connexió de Base de Dades
function createConnection() {
    return mysql.createConnection({
        // host: 'dam.inspedralbes.cat',
        // user: 'a21rublormar_admin',
        // password: 'InsPedralbes2024',
        // database: 'a21rublormar_TR1_GR6'
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'a21rublormar_TR1_GR6',
        port: 3306
    })
        .then(connection => {
            console.log("Connexió creada");
            return connection;
        })
        .catch(err => {
            console.error('Error de connexió: ' + err);
            throw err; // Re-lanzar el error para que pueda ser manejado por el llamador
        });
}

// Get Preguntes Base de Dades
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

// Get Comandes Base de Dades
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


// Post Producte Base de Dades
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

// Update Producte Base de Dades
app.put('/putProducteBD/:id', upload.single('Imatge'), async (req, res) => {
    const idProducte = parseInt(req.params.id);
    const { nomProducte, Descripcio, Preu, Stock, Activat } = req.body;

    const connection = await createConnection();

    // Verificar si se ha subido una nueva imagen
    let imatgePath = req.file ? req.file.path : null; // Si no se sube nueva imagen, será null
    const imatge = imatgePath ? path.basename(imatgePath) : null;

    // Obtener la imagen actual de la base de datos
    const [rows] = await connection.execute(`SELECT Imatge FROM producte WHERE idProducte = ?`, [idProducte]);
    const currentImagePath = rows.length > 0 ? rows[0].Imatge : null; // Imagen actual

    const finalImage = imatge || currentImagePath;

    // Si no hay una nueva imagen, mantén la imagen actual
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


// Delete Producte Base de Dades
app.delete('/deleteProducteBD/:id', async (req, res) => {
    const idProducte = req.params.id;
    console.log("idProducte", idProducte);

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

// Get de les comandes del historial de l'usuari desde l'Android
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

app.post('/RegisterBD', async (req, res) => {
    const { Nom, Correu, Contrasenya } = req.body;

    const connection = await createConnection();

    try {
        // Ejecutar la inserción
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

        console.log("Usuari afegit: ", newUsuari);
        res.json(JSON.stringify(newUsuari));

    } catch (error) {
        console.error('Error afegint usuari:', error);
        res.json({ Confirmacio: false });
    } finally {
        await connection.end(); // Asegúrate de cerrar la conexión
    }
});

app.post('/loginBD', async (req, res) => {
    const { Correu, Contrasenya } = req.body

    const connection = await createConnection();

    console.log("Correu: " + Correu + " Contrasenya: " + Contrasenya)

    try {
        const [usuari] = await connection.execute(`SELECT * FROM usuari WHERE Correu = ? AND Contrasenya = ?`, [Correu, Contrasenya]);
        const response = {
            idUser: usuari[0].idUser,
            Nom: usuari[0].Nom,
            Correu: usuari[0].Correu,
            Contrasenya: usuari[0].Contrasenya,
            Confirmacio: true
        }

        console.log(1)
        res.json(response)
    } catch (err) {
        console.log(2)
        res.json({ Confirmacio: false });
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

        // Preparar respuesta para enviar a través de Socket.IO y al cliente
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
        console.log("Conexión a la base de datos establecida");

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


app.get('/estadistiques-clients', async (req, res) => {
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

        console.log("rows", rows);

        const rowsJson = JSON.stringify(rows);


        // Guardar los datos en un archivo temporal
        const tempFilePath = path.join(__dirname, 'python', 'temp_dataClients.json');
        require('fs').writeFileSync(tempFilePath, rowsJson);

        // Llamar al script de Python usando spawn y enviar la ruta del archivo temporal como argumento
        const scriptPath = path.join(__dirname, 'python', 'pruebaClients.py');
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
            res.json({ success: true, imagePaths: [imagePath] });

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
        const tempFilePath = path.join(__dirname, 'python', 'temp_dataClient.json');
        require('fs').writeFileSync(tempFilePath, rowsJson);

        // Llamar al script de Python usando spawn y enviar el correo como argumento
        const scriptPath = path.join(__dirname, 'python', 'client.py');
        // const pythonProcess = spawn('python3', [scriptPath, tempFilePath]);
        const pythonProcess = spawn('py', [scriptPath, tempFilePath]);

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
            const imagePath = path.join(pythonOutput.trim());
            console.log("imagePath", imagePath);
            res.json({ success: true, imagePaths: [imagePath] });
        });
    } catch (error) {
        console.error("Error en executar la consulta: ", error);
        res.status(500).json({ message: "No es va poder executar la consulta", error: error.message });
    } finally {
        connection.end();
    }
});



// Iniciar el servidor
server.listen(PORT, () => {
    console.log(`Servidor en funcionament a http://localhost:${PORT}`);
});