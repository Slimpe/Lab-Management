const mysql = require('mysql2');
const dbConnection = mysql.createPool({
    host     : 'localhost', // MYSQL HOST NAME
    user     : 'user', // MYSQL USERNAME
    password : 'pass', // MYSQL PASSWORD
    database : 'labb' // MYSQL DB NAME
}).promise();
module.exports = dbConnection;