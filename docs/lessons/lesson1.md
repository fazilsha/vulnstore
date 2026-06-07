# Lesson 1 – Understanding How Web Applications Actually Work

## Objective

Before writing any code, understand:

* What Node.js is
* What Express is
* What SQLite is
* How a request flows through an application
* Where vulnerabilities are introduced
* How an AppSec engineer views an application

---

# The Most Important Concept

Every web application is simply:

```text
Input → Processing → Storage → Output
```

Everything else is implementation details.

Examples:

```text
Login
Search
Wishlist
Checkout
Profile Update
```

All follow the same pattern.

---

# Vulnstore Architecture

We will build a vulnerable e-commerce application called:

```text
VulnStore
```

High-level architecture:

```text
Browser
   |
   v
Express Application
   |
   v
Business Logic
   |
   v
SQLite Database
```

---

# What Is Node.js?

Node.js is a JavaScript runtime.

Before Node.js:

```text
JavaScript only ran in browsers.
```

After Node.js:

```text
JavaScript can run on servers.
```

Example:

```javascript
console.log("Hello World");
```

Can run inside:

* Chrome Browser
* Node.js Server

Same language.

Different environment.

---

# What Is Express?

Express is a web framework built on top of Node.js.

Think:

```text
Node.js = Engine

Express = Car
```

Node.js provides:

* HTTP capabilities
* File system access
* Network access

Express provides:

* Routing
* Request handling
* Response handling
* Middleware

Without Express:

```javascript
Create HTTP server manually
Parse requests manually
Handle routing manually
```

With Express:

```javascript
app.get('/products')
```

Much simpler.

---

# What Is SQLite?

SQLite is a lightweight database.

Think:

```text
Excel Sheet
+
SQL Queries
+
Stored In A File
```

Example table:

| id | username | password |
| -- | -------- | -------- |
| 1  | admin    | admin123 |

Example query:

```sql
SELECT * FROM users;
```

SQLite is perfect for learning because:

* No database server required
* Easy setup
* Real SQL concepts

---

# Request Flow

Let's analyze a login request.

User enters:

```text
Username: fazil
Password: pass123
```

Browser sends:

```http
POST /login
```

Request flow:

```text
Browser
   ↓
Express Route
   ↓
Validation
   ↓
Database Query
   ↓
Database Response
   ↓
Business Logic
   ↓
HTTP Response
   ↓
Browser
```

This flow is the foundation of AppSec.

---

# Sources and Sinks

An AppSec engineer always identifies:

## Sources

Places where user input enters.

Examples:

```text
Login Form
Search Box
Profile Update
URL Parameters
Headers
Cookies
JSON Request Bodies
```

Example:

```http
GET /search?q=laptop
```

Source:

```
q=laptop
```

---

## Sinks

Places where input becomes dangerous.

Examples:

```text
SQL Query
HTML Rendering
File Write
Command Execution
XML Parser
Template Engine
```

Example:

```javascript
res.send(userInput);
```

Potential XSS sink.

Example:

```javascript
db.query(userInput);
```

Potential SQL Injection sink.

---

# How Vulnerabilities Are Born

Vulnerabilities are usually:

```text
Source
     +
Unsafe Sink
     +
Missing Security Control
```

Example:

```text
User Input
     +
SQL Query
     +
No Parameterization
```

Result:

```text
SQL Injection
```

---

Example:

```text
User Input
     +
HTML Rendering
     +
No Output Encoding
```

Result:

```text
Stored XSS
```

---

# AppSec Perspective

Developers often see:

```text
Feature
```

AppSec engineers see:

```text
Attack Surface
```

Example:

Developer sees:

```text
Wishlist Name
```

AppSec sees:

```text
Stored XSS Candidate
```

---

Developer sees:

```text
User ID Parameter
```

AppSec sees:

```text
Potential IDOR/BOLA
```

---

# Secure SDLC Thinking

Before building any feature:

## Feature

```text
Wishlist
```

---

## Assets

What are we protecting?

```text
User Data
Session
Orders
Payment Information
```

---

## Threats

Possible attacks:

```text
Stored XSS
CSRF
IDOR
SQL Injection
```

---

## Controls

Security mechanisms:

```text
Output Encoding
CSRF Tokens
Parameterized Queries
Authorization Checks
```

---

## Testing

Validation:

```text
SAST
DAST
Manual Testing
Code Review
```

---

# Mental Exercise

Consider a registration page.

Flow:

```text
Browser
 ↓
Express
 ↓
Validation
 ↓
Database
 ↓
Response
```

Identify:

### Sources

Where does user input enter?

### Sinks

Where can input become dangerous?

### Controls

What security controls should be applied?

Think through this before moving to Lesson 2.

---

# Key Takeaways

1. Every application is Input → Processing → Storage → Output.
2. AppSec starts by identifying Sources and Sinks.
3. Node.js runs JavaScript on the server.
4. Express handles HTTP requests and routing.
5. SQLite stores application data.
6. Most vulnerabilities occur because user-controlled input reaches dangerous sinks without proper security controls.
7. Understanding data flow is more important than memorizing vulnerabilities.

---

# Next Lesson

Lesson 2 – HTTP Requests, Routes, Express Middleware, and How Data Reaches the Database
