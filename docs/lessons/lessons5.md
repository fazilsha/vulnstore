# Lesson 5: Second-Order SQL Injection

## Objective

Understand how SQL Injection can occur even when user input is safely stored in the database.

Unlike traditional SQL Injection, the payload is not executed immediately. Instead, it is stored and later used in another SQL query, causing injection at a different point in the application.

---

## What is Second-Order SQL Injection?

Second-Order SQL Injection occurs when:

1. User input is stored in the database.
2. The application later retrieves the stored value.
3. The retrieved value is concatenated into a SQL query.
4. SQL Injection occurs during the later operation.

---

## Vulnerable Workflow

### Registration

User submits:

```http
POST /register

username=admin' OR 1=1 --
password=test123
```

The application safely stores the value:

```sql
INSERT INTO users(username,password)
VALUES (?,?)
```

Database contents:

| id | username         |
| -- | ---------------- |
| 1  | admin' OR 1=1 -- |

No SQL Injection occurs at this stage.

---

### Profile Lookup

Application retrieves the username:

```javascript
db.get(
    'SELECT username FROM users WHERE id = ?',
    [userId]
);
```

Later constructs a SQL query:

```javascript
const query =
    `SELECT * FROM orders WHERE owner='${user.username}'`;
```

Generated query:

```sql
SELECT * FROM orders WHERE owner='admin' OR 1=1 --'
```

---

## Impact

The attacker gains access to records they should not be able to access.

Example:

```sql
SELECT * FROM orders WHERE owner='admin' OR 1=1 --'
```

Returns all orders instead of only the attacker's orders.

---

## Vulnerable Code

```javascript
const query =
    `SELECT * FROM orders WHERE owner='${user.username}'`;

db.all(query, (err, rows) => {
    res.json(rows);
});
```

---

## Root Cause

User-controlled data is trusted after being read from the database.

Developers often assume:

```text
Data came from our database, therefore it is safe.
```

This assumption is incorrect.

Stored data should be treated as untrusted if it originated from user input.

---

## Secure Implementation

Use parameterized queries:

```javascript
db.all(
    'SELECT * FROM orders WHERE owner = ?',
    [user.username],
    (err, rows) => {
        res.json(rows);
    }
);
```

SQLite treats the value as data rather than executable SQL.

--- 

## Key Learning Points

* Data stored in a database is not automatically trusted.
* SQL Injection can occur long after the payload is submitted.
* Parameterized queries should be used for every SQL operation.
* Second-Order SQL Injection is often missed during code reviews.
* Real-world applications frequently contain this vulnerability in reporting, search, profile, and admin functionality.

---

## Lab Verification

1. Register a user:

```text
admin' OR 1=1 --
```

2. Determine the user ID:

```sql
SELECT * FROM users;
```

3. Visit:

```text
http://localhost:3000/profile/<id>
```

4. Observe the generated SQL query in the server console.

5. Verify that all orders are returned.

---

