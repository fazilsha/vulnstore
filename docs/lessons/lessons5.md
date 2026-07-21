# Lesson 5: Second-Order SQL Injection

## Objective

Learn how **Second-Order SQL Injection** occurs when user input is safely stored in a database but later reused unsafely to construct another SQL query.

Unlike **Classic SQL Injection**, the payload is **not executed immediately**. Instead, it remains harmless until the application retrieves the stored value and uses it in another SQL statement.

---

# Learning Objectives

After completing this lesson, you will understand:

- What Second-Order SQL Injection is
- How it differs from Classic SQL Injection
- Why storing user input safely is not enough
- Why data retrieved from a database should still be treated as untrusted
- How parameterized queries prevent Second-Order SQL Injection

---

# Prerequisites

Before starting this lesson, ensure you have completed:

- Lesson 1 – Project Setup
- Lesson 2 – Express.js Basics
- Lesson 3 – Routes & Parameters
- Lesson 4 – Forms and User Registration

At the end of Lesson 4, users can register successfully using:

```http
POST /register
```

The registration uses a **parameterized query**, making it secure.

```javascript
db.run(
    "INSERT INTO users(username,password) VALUES (?,?)",
    [username, password]
);
```

---

# What is Second-Order SQL Injection?

Second-Order SQL Injection happens when:

1. A user submits malicious input.
2. The application stores it safely in the database.
3. The application later retrieves that value.
4. The retrieved value is concatenated into another SQL query.
5. SQL Injection occurs during the second query.

The important point is:

> **The payload is stored first and executed later.**

---

# Application Workflow

```
User Registration
        │
        ▼
Parameterized INSERT
        │
        ▼
Database
        │
        ▼
Retrieve Username
        │
        ▼
Build Dynamic SQL Query
        │
        ▼
SQL Injection
```

---

# Step 1 – Register a User

Suppose an attacker registers with the following username:

```text
admin' OR 1=1 --
```

Registration request:

```http
POST /register

username=admin' OR 1=1 --
password=test123
```

The application stores the value using a parameterized query:

```javascript
db.run(
    "INSERT INTO users(username,password) VALUES (?,?)",
    [username, password]
);
```

The database now contains:

| id | username |
|----|----------------------|
| 1 | admin' OR 1=1 -- |

At this stage:

✅ No SQL Injection occurs.

The payload is treated as plain text.

---

# Step 2 – Orders Table

For this lesson, create an `orders` table.

| id | owner | product |
|----|--------|----------|
|1|admin|MacBook|
|2|admin|iPhone|
|3|john|Keyboard|
|4|alice|Mouse|

Notice that each order belongs to a specific user.

---

# Step 3 – Retrieve Username

Suppose the application provides this endpoint:

```http
GET /orders/:id
```

The first query retrieves the username safely.

```javascript
db.get(
    "SELECT username FROM users WHERE id = ?",
    [userId],
    ...
);
```

If the request is:

```text
GET /orders/1
```

The database returns:

```text
admin' OR 1=1 --
```

This query is completely safe because it uses a parameterized statement.

---

# Step 4 – Vulnerable Query

Next, the application builds another SQL query.

```javascript
const query =
    `SELECT * FROM orders WHERE owner='${user.username}'`;

db.all(query, (err, rows) => {
    res.json(rows);
});
```

Since `user.username` contains:

```text
admin' OR 1=1 --
```

The generated SQL becomes:

```sql
SELECT *
FROM orders
WHERE owner='admin' OR 1=1 --'
```

The database interprets:

```sql
OR 1=1
```

as part of the SQL statement.

Instead of returning only one user's orders, every order is returned.

---

# Why Does This Happen?

Many developers assume:

> "The value came from our database, so it must be safe."

This assumption is incorrect.

The username originally came from:

```
User Input
```

Even after storing it in the database, it remains **untrusted data**.

Whenever user-controlled data is reused, it must still be handled safely.

---

# Root Cause

The application safely stored the input.

However, it later trusted the stored value and concatenated it into another SQL statement.

The vulnerability is **not** in the registration process.

The vulnerability is in the later query.

---

# Vulnerable Code

```javascript
const query =
    `SELECT * FROM orders WHERE owner='${user.username}'`;

db.all(query, (err, rows) => {
    res.json(rows);
});
```

---

# Secure Implementation

Always use parameterized queries.

```javascript
db.all(
    "SELECT * FROM orders WHERE owner = ?",
    [user.username],
    (err, rows) => {
        res.json(rows);
    }
);
```

SQLite now treats the username as **data**, not executable SQL.

---

# Classic SQL Injection vs Second-Order SQL Injection

## Classic SQL Injection

```
HTTP Request
      │
      ▼
SQL Query
      │
      ▼
Injection Happens Immediately
```

Example:

```sql
SELECT * FROM users
WHERE id = 1 OR 1=1
```

---

## Second-Order SQL Injection

```
User Input
      │
      ▼
Database
      │
      ▼
Retrieve Stored Value
      │
      ▼
Build Another SQL Query
      │
      ▼
Injection Happens Later
```

The payload may remain in the database for days, weeks, or months before it is executed.

---

# Real-World Examples

Second-Order SQL Injection commonly appears in:

- User profile pages
- Reporting dashboards
- Search functionality
- Order history
- Admin panels
- Export features
- Audit reports

---

# Key Takeaways

- Storing user input safely does **not** make it trusted.
- Data retrieved from a database can still contain malicious input.
- Every SQL query should use parameterized statements.
- Second-Order SQL Injection is often overlooked during code reviews.
- Treat all user-originated data as untrusted, regardless of where it is stored.

---

# Lab Verification

## Step 1

Register a new user.

```text
Username:
admin' OR 1=1 --

Password:
test123
```

---

## Step 2

Verify the user exists.

```sql
SELECT * FROM users;
```

---

## Step 3

Visit:

```text
http://localhost:3000/orders/<user-id>
```

---

## Step 4

Observe the generated SQL in the server console.

```sql
SELECT *
FROM orders
WHERE owner='admin' OR 1=1 --'
```

---

## Step 5

Notice that all orders are returned instead of only the attacker's orders.

---

# Next Lesson

In **Lesson 6**, you'll learn about **Stored Cross-Site Scripting (Stored XSS)** and understand how malicious data stored in a database can also become dangerous when rendered into HTML without proper output encoding.
