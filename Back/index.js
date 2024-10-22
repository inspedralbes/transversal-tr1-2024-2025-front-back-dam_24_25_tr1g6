"use strict";
const express = require('express');
const app = express();
const mysql = require('mysql2/promise');
const PORT = 3000;
app.use(express.json());


// Llegir el fitxer JSON amb els productes
app.get('/getProductesJson', (req, res) => {
    let productes = require('./db/Productes.json');
    res.json(productes);
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