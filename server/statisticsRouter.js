const express = require('express');
const router = express.Router();
const analyzeAllTime = require('../server/modules/analyzeAllTime.js');
const analyzePeriod = require('../server/modules/analyzePeriod.js')

//render statistics page if user login
router.get('/', (req, res) => {
    if (!req.cookies.isLogIn) {
        res.redirect('/');
    } else {
        analyzeAllTime.getData(req, res);
    }
});

router.post('/analyze-period', (req, res) => {
    analyzePeriod.getData(req, res);
});

module.exports = router;