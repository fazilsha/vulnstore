# Lesson 3 – Routing, User Input, Query Parameters, Route Parameters, and First XSS

## Objective

In this lesson, we move from a single endpoint application to a multi-route application.

By the end of this lesson, we will understand:

* Express Routing
* Route Matching
* HTTP GET Requests
* Query Parameters
* Route Parameters
* Request Object (`req`)
* Response Object (`res`)
* User-Controlled Input
* Source and Sink Concepts
* First Reflected XSS Vulnerability

---

# Current Application Structure

```text
vulnstore/
│
├── src/
│   └── app.js
│
├── docs/
│   └── lessons/
│       ├── lesson1.md
│       ├── lesson2.md
│       └── lesson3.md
│
├── package.json
│
└── node_modules/
```

---

# Understanding Routes

A route maps:

```text
HTTP Method + URL Path
```

to

```text
Application Logic
```

Example:

```http
GET /
```

maps to:

```javascript
app.get('/')
```

---

# Complete app.js

```javascript
const express = require('express');

const app = express();

const PORT = 3000;

/*
 Home Page
*/
app.get('/', (req, res) => {
    res.send('Welcome to VulnStore');
});

/*
 Products Page
*/
app.get('/products', (req, res) => {
    res.send('Products Page');
});

/*
 Login Page
*/
app.get('/login', (req, res) => {
    res.send('Login Page');
});

/*
 Register Page
*/
app.get('/register', (req, res) => {
    res.send('Register Page');
});

/*
 Search Page
*/
app.get('/search', (req, res) => {

    const searchTerm = req.query.q;

    res.send(`Searching for: ${searchTerm}`);
});

/*
 Product Details
*/
app.get('/products/:id', (req, res) => {

    const productId = req.params.id;

    res.send(`Product ID: ${productId}`);
});

app.listen(PORT, () => {
    console.log(`VulnStore running on port ${PORT}`);
});
```

---

# Route 1 – Home Page

```javascript
app.get('/', (req, res) => {
    res.send('Welcome to VulnStore');
});
```

Request:

```http
GET /
```

Response:

```text
Welcome to VulnStore
```

Purpose:

* Application landing page

User Input:

```text
None
```

Attack Surface:

```text
Minimal
```

---

# Route 2 – Products Page

```javascript
app.get('/products', (req, res) => {
    res.send('Products Page');
});
```

Request:

```http
GET /products
```

Response:

```text
Products Page
```

Future Purpose:

* Product Listing
* Product Search
* Product Filters

---

# Route 3 – Login Page

```javascript
app.get('/login', (req, res) => {
    res.send('Login Page');
});
```

Request:

```http
GET /login
```

Response:

```text
Login Page
```

Future Purpose:

* User Authentication
* Session Creation

---

# Route 4 – Register Page

```javascript
app.get('/register', (req, res) => {
    res.send('Register Page');
});
```

Request:

```http
GET /register
```

Response:

```text
Register Page
```

Future Purpose:

* User Registration
* Account Creation

---

# Route 5 – Search Page

```javascript
app.get('/search', (req, res) => {

    const searchTerm = req.query.q;

    res.send(`Searching for: ${searchTerm}`);
});
```

---

# Understanding Query Parameters

Request:

```http
GET /search?q=laptop
```

URL Breakdown:

```text
/search
```

Path

```text
q=laptop
```

Query String

---

Express automatically parses query parameters.

Internally:

```javascript
req.query = {
    q: "laptop"
};
```

Therefore:

```javascript
req.query.q
```

returns:

```text
laptop
```

---

# Multiple Query Parameters

Request:

```http
GET /search?q=laptop&sort=price
```

Express creates:

```javascript
req.query = {
    q: "laptop",
    sort: "price"
};
```

Access values:

```javascript
req.query.q
req.query.sort
```

---

# Route 6 – Product Details

```javascript
app.get('/products/:id', (req, res) => {

    const productId = req.params.id;

    res.send(`Product ID: ${productId}`);
});
```

---

# Understanding Route Parameters

Request:

```http
GET /products/10
```

Route:

```javascript
/products/:id
```

Express creates:

```javascript
req.params = {
    id: "10"
};
```

Therefore:

```javascript
req.params.id
```

returns:

```text
10
```

---

# Request Object (req)

The request object contains information sent by the client.

Common properties:

```javascript
req.query
req.params
req.body
req.headers
req.method
req.path
```

Examples:

```javascript
req.query.q
```

Gets value from:

```http
/search?q=test
```

---

```javascript
req.params.id
```

Gets value from:

```http
/products/10
```

---

```javascript
req.headers
```

Gets values from:

```http
User-Agent
Cookie
Authorization
Host
```

---

# Response Object (res)

The response object sends data back to the client.

Examples:

```javascript
res.send('Hello');
```

---

```javascript
res.json({
    success: true
});
```

---

```javascript
res.redirect('/login');
```

---

# AppSec Perspective

Every input source should be treated as attacker-controlled.

Examples:

```javascript
req.query
req.params
req.body
req.headers
req.cookies
```

Never trust these values.

---

# Understanding Sources

Source:

```text
Location where user input enters the application
```

Examples:

```javascript
req.query.q
req.params.id
req.body.username
req.headers.host
```

---

# Understanding Sinks

Sink:

```text
Location where user input becomes dangerous
```

Examples:

```javascript
res.send()
db.query()
exec()
innerHTML
```

---

# Source to Sink Flow

Example:

```javascript
const searchTerm = req.query.q;

res.send(searchTerm);
```

Flow:

```text
Source
 ↓
req.query.q

Sink
 ↓
res.send()

Potential Vulnerability
 ↓
Reflected XSS
```

---

# First Reflected XSS

Application Code:

```javascript
app.get('/search', (req, res) => {

    const searchTerm = req.query.q;

    res.send(searchTerm);
});
```

Request:

```http
GET /search?q=<script>alert(1)</script>
```

Response:

```html
<script>alert(1)</script>
```

Browser executes:

```javascript
alert(1);
```

Result:

```text
Reflected Cross-Site Scripting (XSS)
```

---

# Why Did XSS Occur?

Because:

```text
User Input
```

was sent directly into:

```text
HTML Response
```

without:

```text
Output Encoding
```

---

# XSS Formula

```text
Source
+
Sink
-
Output Encoding
=
XSS
```

Example:

```text
req.query.q
+
res.send()
-
HTML Encoding
=
Reflected XSS
```

---

# Future Vulnerabilities From Route Parameters

Example:

```http
GET /orders/100
```

Application:

```javascript
req.params.id
```

Potential Issues:

```text
IDOR
BOLA
Broken Access Control
```

because attackers can manipulate IDs.

Example:

```http
GET /orders/101
GET /orders/102
GET /orders/103
```

---

# Security Observations

Current VulnStore Has:

```text
No Authentication
No Authorization
No Input Validation
No Output Encoding
No Security Headers
No Session Management
```

This is intentional for learning purposes.

---

# Testing Checklist

Test the following routes:

```http
GET /
GET /products
GET /login
GET /register
GET /products/1
GET /products/999
GET /search?q=test
GET /search?q=<script>alert(1)</script>
```

For each request identify:

1. Which route matched?
2. What values exist in req.query?
3. What values exist in req.params?
4. Is there a source?
5. Is there a sink?
6. Is a vulnerability possible?

---

# Key Takeaways

1. Routes map HTTP requests to application logic.
2. Express automatically parses query parameters into req.query.
3. Express automatically parses route parameters into req.params.
4. req contains client-supplied data.
5. res is used to create responses.
6. User-controlled input is considered a source.
7. Dangerous operations are considered sinks.
8. Source-to-sink analysis is fundamental to Application Security.
9. Reflected XSS occurs when user input is rendered without output encoding.
10. Route parameters are often the starting point for IDOR and BOLA vulnerabilities.

---

What We Have NOT Learned Yet

Still pending:

POST Requests
Forms
req.body
HTML Pages
Templates
SQLite
Authentication
Sessions
Cookies
Authorization
Middleware
Controllers
Services
DevSecOps

# Next Lesson

Lesson 4 – HTML Pages, Forms, POST Requests, Request Bodies, and User Registration
