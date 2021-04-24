const express = require('express');
const router = express.Router();
const path = require('path');

var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "temperaturalolin"
});

router.get('/', (req, res) => {
    con.query("SELECT * FROM rilevazioni", (err, result) => { 
        if (err) throw err;

        res.json(result);
    });
});

router.get('/setname/:stanza/:nome', (req, res) => {
    con.query("UPDATE rilevazioni SET nome='" + req.params.nome + "' WHERE stanza='" + req.params.stanza + "'" , (err, result) => {
        if (err) throw err;

        res.send("UPDATE rilevazioni SET nome='" + req.params.nome + "' WHERE stanza='" + req.params.stanza + "'");
    })
})

module.exports = router;