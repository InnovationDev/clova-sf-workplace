const express = require('express');
const router = express.Router();

const clova = require('../clova');

router.post(`/token`, clova);

module.exports = router;
