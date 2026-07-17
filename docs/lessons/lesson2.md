# Lesson 2 – HTTP Requests, Express Middleware, and the Request Lifecycle

## Objective

In Lesson 1, we learned the high-level architecture of a web application.

In this lesson, we will zoom into what happens between the browser and our application.

By the end of this lesson, you will understand:

* HTTP Requests and Responses
* HTTP Methods
* Request Anatomy
* Response Anatomy
* Express Request Lifecycle
* Express Middleware
* Request Object (`req`)
* Response Object (`res`)
* How Express prepares data for our routes
* Why middleware is important for Application Security

---

# Recap from Lesson 1

We learned that every web application follows the same pattern:

```text
Input
   ↓
Processing
   ↓
Storage
   ↓
Output
```

For VulnStore:

```text
Browser
   ↓
Express
   ↓
Business Logic
   ↓
SQLite
```

But how does the browser actually communicate with Express?

That is the purpose of HTTP.

---

# What is HTTP?

HTTP (HyperText Transfer Protocol) is the communication protocol used between clients and servers.

Example:

```text
Browser
     ⇄
HTTP
     ⇄
Express Server
```

Every button click, page load, login, search, and checkout becomes an HTTP request.

---

# HTTP Request vs HTTP Response

Every interaction consists of two parts.

Request:

```text
Client → Server
```

Response:

```text
Server → Client
```

Example:

```text
Browser
   │
   │ GET /products
   ▼
Express
   │
   │ 200 OK
   ▼
Browser
```

---

# Common HTTP Methods

| Method | Purpose               |
| ------ | --------------------- |
| GET    | Retrieve data         |
| POST   | Create new data       |
| PUT    | Replace existing data |
| PATCH  | Update existing data  |
| DELETE | Remove data           |

Examples:

```http
GET /products
```

```http
POST /register
```

```http
PUT /profile
```

```http
DELETE /cart/5
```

---

# Anatomy of an HTTP Request

Example request:

```http
GET /products/10?q=laptop HTTP/1.1
Host: localhost:3000
User-Agent: Chrome
Accept: text/html
Cookie: session=abc123
```

Components:

```text
Method
URL
Headers
Cookies
Body (for POST/PUT)
```

---

# Anatomy of an HTTP Response

Example:

```http
HTTP/1.1 200 OK
Content-Type: text/html

Welcome to VulnStore
```

Response contains:

* Status Code
* Headers
* Response Body

---

# Express Request Lifecycle

Every request follows the same journey.

```text
Browser
      ↓
HTTP Request
      ↓
Express Server
      ↓
Middleware
      ↓
Route Matching
      ↓
Route Handler
      ↓
Business Logic
      ↓
HTTP Response
      ↓
Browser
```

This flow happens for every request.

---

# What is Middleware?

Middleware is code that executes before the request reaches a route.

Example:

```javascript
app.use((req, res, next) => {

    console.log(req.method, req.path);

    next();

});
```

Flow:

```text
Request
   ↓
Middleware
   ↓
Route
   ↓
Response
```

The `next()` function tells Express to continue processing the request.

Without calling `next()`, the request stops there.

---

# Why Middleware Matters

Middleware allows us to perform common tasks before route execution.

Examples:

* Authentication
* Authorization
* Logging
* Rate Limiting
* Security Headers
* Request Validation
* Body Parsing

As an AppSec engineer, middleware is one of the first places you look for security controls.

---

# Parsing Request Bodies

Browsers submit form data in the request body.

Express cannot read that body automatically.

We enable body parsing with:

```javascript
app.use(express.urlencoded({
    extended: true
}));
```

Without this middleware:

```javascript
req.body
```

would be:

```text
undefined
```

This middleware prepares the data so future lessons can access:

```javascript
req.body.username
req.body.password
```

---

# The Request Object (req)

Express creates a request object for every incoming request.

Common properties:

```javascript
req.method
req.path
req.query
req.params
req.body
req.headers
req.cookies
```

In the next lesson we will explore `req.query` and `req.params`.

Later we will use `req.body` for HTML forms.

---

# The Response Object (res)

The response object is used to send data back to the browser.

Examples:

```javascript
res.send("Hello");
```

```javascript
res.json({
    success: true
});
```

```javascript
res.redirect('/login');
```

Every Express route eventually returns a response.

---

# Express Request Flow

Putting everything together:

```text
Browser
      ↓
HTTP Request
      ↓
Middleware
      ↓
Express Route
      ↓
Business Logic
      ↓
Response
      ↓
Browser
```

This request lifecycle forms the foundation for every web application.

---

# AppSec Perspective

Application Security engineers don't just see HTTP requests.

They see possible attack surfaces.

Examples of user-controlled input include:

* URL
* Query Parameters
* Route Parameters
* Form Data
* Headers
* Cookies

Every request should be considered potentially malicious until validated.

---

# Looking Ahead

Now that we understand:

* HTTP
* Request Lifecycle
* Middleware
* Requests
* Responses

we are ready to build multiple routes.

In the next lesson we will learn:

* Express Routing
* Query Parameters
* Route Parameters
* Source → Sink Analysis
* Our First Reflected XSS

---

# Key Takeaways

1. Every browser interaction becomes an HTTP request.
2. Express receives requests and returns responses.
3. Every request passes through middleware before reaching a route.
4. Middleware is commonly used for security controls such as authentication, logging, and rate limiting.
5. `express.urlencoded()` enables Express to parse form data.
6. Express creates `req` and `res` objects for every request.
7. Understanding the request lifecycle is essential before learning web vulnerabilities.

---

# Next Lesson

**Lesson 3 – Routing, User Input, Query Parameters, Route Parameters, and Your First Reflected XSS**
