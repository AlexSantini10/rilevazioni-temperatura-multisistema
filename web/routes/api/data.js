const express = require('express');
const router = express.Router();
const path = require('path');

var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "temperatura"
});

router.get('/last', (req, res) => {
    
});

module.exports = router;