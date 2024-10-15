const express = require('express');
const connection = require('../config/config');
const router = express.Router();

// Endpoint to register employee
router.post('/register_employee', (req, res) => {
    // Ensure all required fields are provided
    const { firstname, lastname, salary, userId } = req.body;
    if (!firstname || !lastname || !salary || !userId) {
        return res.status(400).send({ success: false, message: "All fields are required" });
    }

    // SQL query to insert a new employee
    var sql = `INSERT INTO employee (firstname, lastname, salary, userId) VALUES (?, ?, ?, ?)`;
    var sql_body = [firstname, lastname, salary, userId];

    connection.query(sql, sql_body, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ success: false, message: "Database error" });
        }
        
        if (results.affectedRows != 0) {
            res.send({ success: true, message: "Successfully registered" }); 
        } else {
            res.send({ success: false, message: "Unable to register" });
        }
    });
});

//using post for login 
router.post('/login',(req, res) => {
   
    connection.query(`SELECT * FROM users WHERE email  = '${req.body.email}'`,(err, results) =>{
        if (err) {
            console.error(err);
            return res.status(500).send({ success: false, message: "Database error" });
        }
        if (results.length > 0) {
            if(results[0].password === req.body.password){
              res.send({ success: true, message: "Successfully logged in", results}); 
            }
        } else {
             res.send({ success: false, message: "Wrong user name, or password" });
        }
    })
})

//getting all employees 
router.get('/employees',(req, res) => {
   
    connection.query(`SELECT * FROM employee`,(err, results) =>{
        if (err) {
            console.error(err);
            return res.status(500).send({ success: false, message: "Database error" });
        }
        if (results.length > 0) {
             res.send({ success: true, message: "Retrieved all users", results}); 
        } else {
             res.send({ success: false, message: "no users found" });
        }
    })
})

//get user by id 
router.get('/get_userById/:userId',(req, res) => {
   
    connection.query(`SELECT email,firstname,lastname,salary 
        FROM users u, employee e 
        WHERE u.id = e.userId
        AND e.userId = ?`, req.params.userId,(err, results) =>{
        if (err) {
            console.error(err);
            return res.status(500).send({ success: false, message: "Database error" });
        }
        if (results.length > 0) {
             res.send({ success: true, message: "Retrieved all users", results}); 
        } else {
             res.send({ success: false, message: "no users found" });
        }
    })
})

// Update employee values
router.put('/update_employees/:empId', (req, res) => {
    const empId = req.params.empId;
    const { firstname, lastname, salary } = req.body;

    // Ensure all required fields are provided
    if (!firstname || !lastname || !salary) {
        return res.status(400).send({ success: false, message: "All fields are required" });
    }

    // SQL query to update an employee
    var sql = `UPDATE employee 
               SET lastname = ?, 
                   firstname = ?, 
                   salary = ? 
               WHERE id = ?`;

    var sql_body = [lastname, firstname, salary, empId];

    connection.query(sql, sql_body, (err, results) => {
        if (err) {
            console.error('Database error: ', err);
            return res.status(500).send({ success: false, message: "Database error", error: err.message });
        }

        if (results.affectedRows != 0) {
            res.send({ success: true, message: "Successful Update", results });
        } else {
            res.status(404).send({ success: false, message: "Failed to update: Employee not found" });
        }
    });
});

// Delete an employee
router.delete('/delete/:empId', (req, res) => {
    const empId = req.params.empId;

    // SQL query to delete an employee using a parameterized query
    var sql = `DELETE FROM employee WHERE id = ?`;

    connection.query(sql, [empId], (err, results) => {
        if (err) {
            console.error('Database error: ', err);
            return res.status(500).send({ success: false, message: "Database error", error: err.message });
        }

        if (results.affectedRows != 0) {
            res.send({ success: true, message: "Successfully deleted employee" });
        } else {
            res.status(404).send({ success: false, message: "Unable to delete employee: Employee not found" });
        }
    });
});

module.exports = router;
