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
Profile Page with Second-Order SQL Injection
====================================
*/

app.get('/profile/:id', (req, res) => {

    // 1. Read the user ID from the route parameter.
    const userId = req.params.id;

    // 2. First query: Safely retrieve the user's record using a parameterized query.
    // No SQL injection is possible at this stage.
    db.get(
        'SELECT username FROM users WHERE id = ?',
        [userId],
        (err, user) => {

            // 3. Handle database errors or a missing user.
            if (err) {
                return res.status(500).send(err.message);
            }
            if (!user) {
                return res.status(404).send('User not found');
            }

            // 4. VULNERABLE STEP: Build a second query using string concatenation.
            // The username is retrieved from the database and trusted, but it
            // originated from user input during registration. This is the "second order" part.
            const query = `SELECT * FROM orders WHERE owner='${user.username}'`;

            // 5. Log the malicious query to the console for the lesson.
            console.log("Executing vulnerable query:", query);

            // 6. Execute the unsafe query and return the results.
            // If user.username is "admin' OR 1=1 --", this will dump all orders.
            db.all(query, (err, rows) => {
                if (err) {
                    return res.status(500).send(err.message);
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