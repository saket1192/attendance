const express = require('express')
const router = express.Router()
const sql = require('../../db')
const checkAuth = require('../middleware/check-auth')


router.get('/', checkAuth, (req,res,next) => {
    sql.query('SELECT * FROM project', (error, results, fields) => {
        if(error) {
            res.status(500).json({
                message: 'sql error'
            })
        } else {
            res.status(200).json({
                projects: results
            })
        }
    })
})

module.exports = router;