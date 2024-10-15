var mysql = require('mysql');

//am creating a connection with xampp sql 
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'demodb'
})

connection.connect((err)=>{
    if (!err){console.log("Connection Established successfully")}
    else{console.log("Connection failed" + JSON.stringify(err,undefined,2))}
})

module.exports = connection