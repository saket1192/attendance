const express = require('express')
const router = express.Router()
const sql = require('../../db')
const checkAuth = require('../middleware/check-auth')


router.get('/:user_id', checkAuth, (req,res,next) => {
    const userId = req.params.user_id;

    sql.query('SELECT * FROM task WHERE user_id = ?',[userId], (error, results, fields) => {
        if(error) {
            res.status(500).json({
                message: 'sql error'
            })
        } else {
            var data = new Array;
            results.forEach(result => {
                var category = result.created;
                if(!typeof data[category] === null){
                    data[category] = [
                        title = category,
                         section = new Array()
                    ];
                }
                data[category] = [section = {
                    task_id : result.task_id,
                    task : result.task,
                    project_id : result.project_id  
                }
                        
            ]
            });
            console.log(data)

            res.status(200).json({
                task: data
            })
        }
    })
})

module.exports = router;
