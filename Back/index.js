"use strict";
const express = require('express');
const app = express();
const fs = require('fs')
const mysql = require('mysql2/promise');
const PORT = 3001;
const path = require('path');
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

app.use('/assets', express.static(path.join(__dirname, 'assets')));

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
        res.send('Producte actualitzat correctament');
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

    fs.writeFile('./db/Productes.json', JSON.stringify(json, null, 2), (err) => {
        if (err) {
            console.error('Error escrivint el fitxer JSON', err);
            return res.status(500).send('Error afegint el producte');
        }
        res.send('Producte afegit correctament');
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