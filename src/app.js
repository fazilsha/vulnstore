const express = require('express');
const path = require('path');

const app = express();

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
    res.sendFile(path.join( __dirname, 'views', 'register.html' ));
});
console.log(__dirname);

app.post('/register', (req, res) => {
    console.log('Received registration data:', req.body);
    res.send('Registration successful!');
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
Start Server
====================================
*/
app.listen(PORT, () => {
    console.log(`🚀 VulnStore running on http://localhost:${PORT}`);
});