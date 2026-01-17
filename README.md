# 🌟 User Management API

This is a simple **User Management API** built with **Express.js**.  
It demonstrates **CRUD operations**, **query parameters**, **path parameters**, **status codes**, and **validation**.

---

## HTTP Methods
- **GET**: Read data
- **POST**: Create new data
- **PUT/PATCH**: Update existing data
- **DELETE**: Remove data

---

## HTTP Status Codes
- **200 OK**: The request was successful.
- **201 Created**: A new resource was successfully created.
- **400 Bad Request**: The client sent invalid data.
- **404 Not Found**: The requested resource could not be found.
- **500 Internal Server Error**: The server encountered an unexpected condition.

---

## CRUD Concept
- **Create** → POST
- **Read** → GET
- **Update** → PUT/PATCH
- **Delete** → DELETE

---

## Path Parameters
- **Used to specify a particular resource.**
- Example: `/users/:id`, where `:id` is a dynamic path parameter representing the user ID.

---

## Query Parameters
- **Used for filtering or searching data.**
- Example: `/users?country=Egypt&active=true`, filters users by country and active status.

| Parameter | Example | Description |
|-----------|---------|-------------|
| age       | 25      | Filter by age |
| role      | admin   | Filter by role |
| country   | Egypt   | Filter by country |
| active    | true    | Filter by active status |
| status    | online  | Filter by online/offline |

---

## Example API Requests

### 1️⃣ **GET** /users: Get all users
- **Description**: Returns a list of all users.

#### Request:
```http
GET http://localhost:3000/users