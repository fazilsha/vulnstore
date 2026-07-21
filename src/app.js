const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const db = require('./database/db');
const PORT = 3000;



app.use(express.urlencoded({
    extended: true
}));
/*
====================================
Home Page
====================================
*/
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

/*
====================================
Products Page
====================================
*/
app.get('/products', (req, res) => {
    res.send('Products Page');
});

/*
====================================
Login Page
====================================
*/
app.get('/login', (req, res) => {
    res.send('Login Page');
});

/*
====================================
Register Page
====================================
*/


app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
});


app.post('/register', (req, res) => {

    const { username, password } = req.body;

    db.run(
        'INSERT INTO users(username,password) VALUES (?,?)',
        [username, password],
        function(err) {
            if(err){
                return res.send(err.message);
            }

            res.send("Registration successful");
        }
    );
});
/*
====================================
Search Page
Query Parameter Example
====================================

Example:
GET /search?q=laptop

req.query becomes:

{
  q: "laptop"
}
*/
app.get('/search', (req, res) => {

    const searchTerm = req.query.q;

    res.send(`Searching for: ${searchTerm}`);
});

/*
====================================
Product Details Page
Route Parameter Example
====================================

Example:
GET /products/10

req.params becomes:

{
  id: "10"
}
*/
app.get('/products/:id', (req, res) => {

    const productId = req.params.id;

    res.send(`Product ID: ${productId}`);
});
/*
====================================
orders Page with Second-Order SQL Injection
====================================
*/

/*
====================================
Lesson 5
Second-Order SQL Injection
====================================
*/

app.get('/orders/:id', (req, res) => {

    const userId = req.params.id;

    console.log("\n========== Step 1 ==========");
    console.log("Finding username...");

    // Safe query
    db.get(
        "SELECT username FROM users WHERE id = ?",
        [userId],
        (err, user) => {

            if(err){
                return res.status(500).send(err.message);
            }

            if(!user){
                return res.status(404).send("User not found");
            }

            console.log("Username found:");
            console.log(user.username);

            console.log("\n========== Step 2 ==========");
            console.log("Building SQL query...");

            // INTENTIONALLY VULNERABLE
            const query =
                `SELECT * FROM orders WHERE owner='${user.username}'`;

            console.log(query);

            console.log("\n========== Step 3 ==========");
            console.log("Executing query...\n");

            db.all(query, (err, rows) => {

                if(err){
                    return res.status(500).send(err.message);
                }

                res.json(rows);

            });

        }

    );

});

app.get("/orders", (req,res)=>{

    res.sendFile(path.join(__dirname,"views","orders.html"));

});

app.listen(PORT, () => {
    console.log(`🚀 VulnStore running on http://localhost:${PORT}`);
});