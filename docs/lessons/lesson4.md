# Lesson 4 – HTML Pages, Forms, POST Requests, Request Bodies, and User Registration

## Objective

In previous lessons, VulnStore only responded with text.

Example:

```javascript
app.get('/register', (req, res) => {
    res.send('Register Page');
});
```

This is not how real web applications work.

In this lesson, we will:

* Serve real HTML pages
* Learn how forms work
* Understand GET vs POST
* Understand request bodies
* Learn `req.body`
* Build the first registration page
* Process user-submitted data
* Identify AppSec attack surfaces

---

# Where We Left Off

Current Architecture:

```text
Browser
   ↓
GET Request
   ↓
Express Route
   ↓
Text Response
   ↓
Browser
```

Example:

```http
GET /register
```

Response:

```text
Register Page
```

---

# What We Want

Instead of returning plain text:

```text
Register Page
```

we want:

```html
<h1>Register</h1>

<form>
    Username
    Password
    Register Button
</form>
```

A real webpage.

---

# Updated Project Structure

```text
vulnstore/
│
├── src/
│   ├── app.js
│   └── views/
│       ├── register.html
│       └── login.html
│
├── docs/
│   └── lessons/
│       └── lesson4.md
```

---

# What Is HTML?

HTML stands for:

```text
HyperText Markup Language
```

It describes:

```text
Headings
Forms
Buttons
Inputs
Tables
Links
```

Browsers render HTML into webpages.

---

# Create register.html

Location:

```text
src/views/register.html
```

Content:

```html
<!DOCTYPE html>
<html>

<head>
    <title>Register</title>
</head>

<body>

    <h1>Register</h1>

    <form>

        <label>Username</label>
        <input type="text">

        <br><br>

        <label>Password</label>
        <input type="password">

        <br><br>

        <button>Register</button>

    </form>

</body>

</html>
```

---

# What Is A Form?

Forms are one of the most important concepts in web applications.

Purpose:

```text
Collect Data
↓
Send Data To Server
```

Examples:

```text
Login
Registration
Checkout
Profile Update
Password Reset
```

All use forms.

---

# Serving HTML From Express

Add:

```javascript
const path = require('path');
```

Update route:

```javascript
app.get('/register', (req, res) => {

    res.sendFile(
        path.join(__dirname, 'views', 'register.html')
    );

});
```

---

# Understanding path.join()

Different operating systems use different path formats.

Examples:

Windows:

```text
C:\project\views\register.html
```

Linux/macOS:

```text
/project/views/register.html
```

`path.join()` normalizes paths.

---

# Understanding __dirname

Special Node.js variable.

Inside:

```text
src/app.js
```

`__dirname` becomes:

```text
/vulnstore/src
```

Current directory of the executing file.

---

# Testing

Visit:

```text
http://localhost:3000/register
```

Expected:

```text
Register
Username
Password
Register Button
```

---

# Why The Form Still Doesn't Work

Current form:

```html
<form>
```

No destination.

No submission method.

Browser does not know where to send data.

---

# Add Action And Method

Update:

```html
<form action="/register" method="POST">
```

---

# Understanding action

```html
action="/register"
```

Meaning:

```text
Send Form Data To

/register
```

---

# Understanding method

```html
method="POST"
```

Meaning:

```text
Use HTTP POST
```

instead of:

```http
GET
```

---

# Add Input Names

Without `name`, browsers do not submit field values.

Update:

```html
<input
    type="text"
    name="username">
```

and

```html
<input
    type="password"
    name="password">
```

---

# Final Form

```html
<form action="/register" method="POST">

    <label>Username</label>
    <input
        type="text"
        name="username">

    <br><br>

    <label>Password</label>
    <input
        type="password"
        name="password">

    <br><br>

    <button type="submit">
        Register
    </button>

</form>
```

---

# What Browser Sends

User enters:

```text
Username: fazil
Password: test123
```

Clicks:

```text
Register
```

Browser sends:

```http
POST /register

username=fazil&password=test123
```

---

# Where Does This Data Go?

Not:

```javascript
req.query
```

Not:

```javascript
req.params
```

Into:

```javascript
req.body
```

---

# req.query vs req.params vs req.body

| Property   | Source           |
| ---------- | ---------------- |
| req.query  | URL Query String |
| req.params | Route Parameters |
| req.body   | Request Body     |

Examples:

Query:

```http
/search?q=laptop
```

↓

```javascript
req.query.q
```

---

Route Parameter:

```http
/products/10
```

↓

```javascript
req.params.id
```

---

Request Body:

```http
POST /register

username=fazil
```

↓

```javascript
req.body.username
```

---

# Express Cannot Read Form Data Automatically

Add middleware:

```javascript
app.use(express.urlencoded({
    extended: true
}));
```

Place this after:

```javascript
const app = express();
```

---

# What Middleware Does

Browser sends:

```http
username=fazil&password=test123
```

Express converts:

```javascript
req.body = {
    username: 'fazil',
    password: 'test123'
};
```

---

# Create POST Route

Add:

```javascript
app.post('/register', (req, res) => {

    console.log(req.body);

    res.send('Registration received');

});
```

---

# Registration Flow

```text
User
 ↓
register.html
 ↓
POST /register
 ↓
Express Middleware
 ↓
req.body
 ↓
Route Handler
 ↓
Response
```

---

# Example Request

```http
POST /register

username=fazil
password=test123
```

---

# Express Creates

```javascript
req.body = {
    username: 'fazil',
    password: 'test123'
};
```

---

# Server Output

```javascript
{
  username: 'fazil',
  password: 'test123'
}
```

---

# AppSec Perspective

This is our first major attack surface.

Sources:

```javascript
req.body.username
req.body.password
```

These values are completely attacker controlled.

Never trust them.

---

# Future SQL Injection

Potential flow:

```text
req.body.username
      ↓
SQL Query
```

Example:

```sql
INSERT INTO users (...)
```

Potential vulnerability:

```text
SQL Injection
```

---

# Future Stored XSS

Potential flow:

```text
req.body.username
      ↓
Profile Page
```

Potential vulnerability:

```text
Stored XSS
```

---

# Future Weak Authentication Issues

Potential risks:

```text
Weak Password Policy
Password Reuse
Plain Text Password Storage
User Enumeration
```

---

# Security Observations

Current VulnStore Still Lacks:

```text
Input Validation
Output Encoding
Authentication
Authorization
Password Hashing
CSRF Protection
Security Headers
Database Storage
```

This is intentional.

We will introduce vulnerabilities first and secure them later.

---

# Key Takeaways

1. HTML pages are served using `res.sendFile()`.
2. Forms collect user input and send it to the server.
3. `action` defines the destination.
4. `method` defines the HTTP method.
5. Form data is received through `req.body`.
6. `express.urlencoded()` parses form submissions.
7. User input in `req.body` is attacker-controlled.
8. Registration introduces attack surfaces such as SQL Injection and Stored XSS.
9. Most business functionality in web applications follows the same form submission lifecycle.
10. Understanding request flow is more important than memorizing syntax.

---

# Next Lesson

Lesson 5 – SQLite Integration, Database Design, User Storage, and First SQL Injection
