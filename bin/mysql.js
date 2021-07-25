var mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'password',
    database : 'music player'
  });
  
  connection.connect((err) => {
    console.log('success')
  })
  
module.exports = connection;