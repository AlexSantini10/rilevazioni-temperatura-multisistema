const express = require('express');

const db = require('../../db');

const router = express.Router();

router.get('/', async (_req, res, next) => {
  try {
    const readings = await db.query('SELECT * FROM rilevazioni');
    res.json(readings);
  } catch (error) {
    next(error);
  }
});

router.get('/setname/:stanza/:nome', async (req, res, next) => {
  const { stanza, nome } = req.params;

  try {
    await db.query('UPDATE rilevazioni SET nome = ? WHERE stanza = ?', [nome, stanza]);
    res.json({
      message: 'Nome stanza aggiornato',
      stanza,
      nome
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
