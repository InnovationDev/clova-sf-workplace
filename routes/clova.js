const express = require('express');
const router = express.Router();

const clova = require('../clova');

router.post(`/extension`, clova);
router.get(`/login`, login);

module.exports = router;
