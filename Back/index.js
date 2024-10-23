"use strict";
const express = require('express');
const app = express();
const fs = require('fs')
const mysql = require('mysql2/promise');
const PORT = 3001;
const cors = require('cors');
app.use(express.json());
app.use(cors());

let json;

fs.readFile('./db/Productes.json', 'utf-8', (err, data) => {
    if (err) {
        console.error('Error leyendo el JSON');
        return;
    }
    json = JSON.parse(data);
})

app.get('/', (req, res) => {
    res.send(json)
})

// Llegir el fitxer JSON amb els productes
app.get('/getProductesJson', (req, res) => {
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
        res.send('Producte eliminat correctament');
    });
});

// TODO: Llegir els productes de la Base de Dades
app.get('/getProductesBD', (req, res) => {

    mysql.createConnection({
        host: 'dam.inspedralbes.cat',
        user: 'a21rublormar_admin',
        password: 'InsPedralbes2024',
        database: 'a21rublormar_TR1_GR6'
    })
        .then(connection => {
            console.log("Connexió creada")
            return connection.execute('SELECT * FROM productes')
                .then(([resultats, camps]) => {
                    console.log(resultats);
                })
                .finally(() => connection.end());
        })
        .catch(err => {
            console.error('Error: ', err);
        });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor en funcionament a http://localhost:${PORT}`);
});