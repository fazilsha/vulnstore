const express = require('express');
const path = require('path');

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
    res.send('Welcome to VulnStore');
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
Profile page with SQL Injection Vulnerability
====================================
*/



app.get('/profile/:id', (req, res) => {

    const userId = req.params.id;

    db.get(
        'SELECT username FROM users WHERE id = ?',
        [userId],
        (err, user) => {

            if (err || !user) {
                return res.send('User not found');
            }

            const query =
                `SELECT * FROM orders WHERE owner='${user.username}'`;

            console.log(query);

            db.all(query, (err, rows) => {

                if (err) {
                    return res.send(err.message);
                }

                res.json(rows);
            });
        }
    );
});

/*
====================================
Start Server
====================================
*/
app.listen(PORT, () => {
    console.log(`🚀 VulnStore running on http://localhost:${PORT}`);
});