const express = require('express');
const app = express();
const morgan = require('morgan');
const userRoutes = require('./api/routes/user');
const skillRoutes = require('./api/routes/skills');
const projectsRoutes = require('./api/routes/projects');
const taskRoutes = require('./api/routes/task');
const bodyParser = require('body-parser');
const mysql = require('mysql2')

const pool = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'av_attendance',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  })
  
  pool.connect()




app.use(morgan('dev'));
app.use('/api/v1/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
      return res.status(200).json({});
    }
    next();
  });



app.use('/api/v1/user', userRoutes);
app.use('/api/v1/skill', skillRoutes);
app.use('/api/v1/projects', projectsRoutes );
app.use('/api/v1/task', taskRoutes );

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;