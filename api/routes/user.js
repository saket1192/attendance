const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sql = require('../../db')
const checkAuth = require('../middleware/check-auth');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/');
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {

    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')
        {cb(null,true);}
        else{
            cb(null, false);
        }
    

}

const upload = multer({storage: storage,
     limits: {
    fileSize: 1024 * 1024 * 5
}
,fileFilter: fileFilter
});

router.post('/signup',upload.single('userImage'), (req,res,next) => {
    const email = req.body.email;
    const employee_id = req.body.employee_id;
    const designation = req.body.designation;
    const manager_id = req.body.manager_id;
    const address = req.body.address;
    const phone = req.body.phone;
    const image =  req.file.path;
    
    sql.query('SELECT * FROM user WHERE email = ?',[email], (error,results, fields) => {
        if(error) {
            res.status(500).json({
                failed:'error occured during query'
            })
        } else {
            if(results.length > 0){
                res.status(201).json({
                    message: 'email already exists'
                })
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if(err) {
                        return res.status(500).json({
                            error: err
                        })
                    } else {
                        const users = {
                            
                            "employee_id":employee_id,
                            "email":req.body.email,
                            "password":hash,
                            "username":req.body.username,
                            "created": new Date(),
                            "modified": new Date(),
                            "manager_id":manager_id,
                            "designation":designation,
                            "phone": phone,
                            "address":address,
                            "image":image
                        }

                        sql.query('INSERT INTO user SET ?', users, (error, results, fields) => {
                            if(error){
                                res.status(400).json({
                                    error: error
                                })
                            } else {
                                res.status(200).json({
                                    message: 'User Created Successfully'
                                })
                            }
                        })
                    }
                })
            }
        }
    })
})

router.post('/login', (req,res,next) => {
    const email = req.body.email

    sql.query('SELECT * FROM user WHERE email = ?', [email], (error, results, fields) => {
        if(error) {
            res.status(500).json({
                failed: 'error occured during query'
            })
        } else {
            if(results.length < 1){
                return res.status(401).json({
                    message: 'Authorization Failed'
                })
            }
            bcrypt.compare(req.body.password, results[0].password, (err, result) => {
                if(err) {
                    return res.status(401).json({
                        message: 'Authorization Failed'
                    })
                }
                if(result){
                    const token = jwt.sign({
                        email: results[0].email,
                        employee_id: results[0].employee_id,
                        username: results[0].username
                    },
                    "secret",
                    {
                        expiresIn: "365d"
                    })
                    return res.status(200).json({
                        message: 'Authorization Successful',
                        token: token
                    })
                }
                res.status(401).json({
                    message: 'Authorization Failed'
                })
            })
        }
    } )
})

router.get('/profile/:email',checkAuth,  (req,res,next) => {
    const email = req.params.email

    sql.query('SELECT e1.employee_id, e1.username, e1.email, e1.phone, e1.designation, e1.address, e1.created, e1.modified, e1.image, e2.username AS managername, e2.phone AS managerphone FROM user e1 INNER JOIN user e2 ON e1.manager_id = e2.employee_id AND e1.email = ?', [email], (error, results, fields) => {
        if(error) {
            res.status(500).json({
                failed: 'error occured during query'
            })
        } else {
            if(results!=null){
                res.status(200).json({
                    user: {
                         
                        employee_id: results[0].employee_id,
                        email: results[0].email,
                        phone: results[0].phone,
                        created: results[0].created,
                        username: results[0].username,
                        address: results[0].address,
                        modified: results[0].modified,
                        manager_name: results[0].managername,
                        designation: results[0].designation,
                        manager_phone: results[0].managerphone,
                        image: results[0].image
                    }
                    
                })
            }
           
        }
    })
})

module.exports = router;