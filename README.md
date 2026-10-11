# Task Manager

A simple task management web app built with Node.js, Express, SQLite, and vanilla JavaScript. Users can register and log in, then create and manage their own tasks.

## Features

- User registration and login
- Password hashing with `bcrypt`
- JWT-based authentication
- Create, view, update, and delete tasks
- SQLite database initialized automatically on startup
- Static frontend served by Express

## Requirements

- Node.js 18 or later
- npm

## Getting started

1. Clone the repository and enter its directory:

   ```bash
   git clone https://github.com/YOUR-USERNAME/task-manager.git
   cd task-manager
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root and set a JWT secret:

   ```env
   JWT_SECRET=replace-this-with-a-long-random-secret
   ```

   Keep `.env` private; it is excluded from Git by `.gitignore`.

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:5000](http://localhost:5000) in your browser. The server creates `task-manager.db` in the project directory when it starts.

## API overview

All request and response bodies use JSON.

| Method | Endpoint | Description | Authentication |
| --- | --- | --- | --- |
| `GET` | `/api/health` | Check that the API is running | No |
| `POST` | `/api/auth` | Register a user (`username`, `email`, `password`) | No |
| `POST` | `/api/auth/login` | Log in (`username`, `password`); returns a JWT | No |
| `GET` | `/api/tasks` | List the signed-in user's tasks | Yes |
| `POST` | `/api/tasks` | Create a task (`title`, optional `description`) | Yes |
| `PUT` | `/api/tasks/:id` | Update a task (`title`, optional `description`) | Yes |
| `DELETE` | `/api/tasks/:id` | Delete a task | Yes |

For protected task endpoints, send the login token in the request header:

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

## Project structure

```text
controllers/   Request handlers for authentication and tasks
database/      SQLite database setup
middleware/    JWT authentication middleware
public/        HTML, CSS, and browser-side JavaScript
routes/        Express API routes
app.js         Express application entry point
```

## Development

Run `npm run dev` to start the server with Nodemon, which restarts it when server files change.
