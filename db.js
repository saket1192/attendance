const mysql = require('mysql2')

const pool = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'av_attendance',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  })
  
  pool.connect((err) => {
    if(err) throw err
  })

  module.exports = pool;