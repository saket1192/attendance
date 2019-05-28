const express = require('express');
const router = express.Router();
const sql = require('../../db')
const checkAuth = require('../middleware/check-auth');

router.get('/:employee_id', checkAuth,  (req,res,next) => {
    const employee_id = req.params.employee_id

    sql.query('SELECT * FROM employee_skill WHERE employee_id = ?', [employee_id], (error, results, fields) => {
        if(error) {
            res.status(500).json({
                failed: 'error occured during query'
            })
        } else {
            res.status(200).json({
                skills: results                
            })
        }
    })
})

router.get('/skill_code/get_skill', checkAuth, (req,res,next) => {
    sql.query('SELECT skill_code FROM skill', (error, results, fields) => {
        if(error) {
            res.status(500).json({
                message: 'sql error'
            })
        } else {
            res.status(200).json({
                skills: results
            })
        }
    })
})

router.post('/create_skill',checkAuth , (req,res,next) => {
    const skill_code = req.body.skill_code;
    const employee_id = req.body.employee_id;
    const years = req.body.year_of_experience;
    const rating = req.body.rating;
    const remarks = req.body.remarks;
    
    sql.query('SELECT * FROM employee_skill WHERE skill_code = ? AND employee_id = ?',[skill_code,employee_id], (error,results, fields) => {
        if(error) {
            res.status(500).json({
                failed:'error occured during query'
            })
        } else {
            if(results.length > 0){
                res.status(201).json({
                    message: 'Skill Set Already Exist'
                })
            } else {
                const skills = {
                            
                    "employee_id":employee_id,
                    "skill_code":skill_code,
                    "year_of_experience":years,
                    "rating":rating,
                    "remarks": remarks
                }

                sql.query('INSERT INTO employee_skill SET ?', skills, (error, results, fields) => {
                    if(error){
                        res.status(400).json({
                            error: error
                        })
                    } else {
                        res.status(200).json({
                            message: 'Skills Created Successfully'
                        })
                    }
                })
            }
        }
    })
})


module.exports = router;