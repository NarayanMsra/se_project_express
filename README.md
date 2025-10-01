# WTWR (What to Wear?): Back End

The back-end project is focused on creating a server for the WTWR application. You’ll gain a deeper understanding of how to work with databases, set up security and testing, and deploy web applications on a remote machine. The eventual goal is to create a server with an API and user authorization.

## Running the Project

`npm run start` — to launch the server  

`npm run dev` — to launch the server with the hot reload feature  

### Testing
The file `sprint.txt` should contain the number of the sprint you're currently working on. For example: `12`.

---

## 🛠️ Tech Stack and Key Implementation Details

- **Node.js** & **Express.js** — for building the REST API server and routing.
- **MongoDB** with **Mongoose** — to model and manage application data (e.g., users and clothing items).
- **Validator** — for validating fields like image URLs.
- **ESLint (Airbnb config)** & **Prettier** — for consistent code style and linting.
- **Nodemon** — used in development for automatic server restarts on file changes.

### Key Features Implemented
- Clothing item model includes:
  - `owner` field to track which user created the item.
  - `likes` array to track users who liked an item.
  - `createdAt` timestamp.
- User model with validation and error handling.
- Controllers for:
  - Creating, reading, and deleting clothing items.
  - Liking and disliking clothing items.
  - Managing users (create, fetch all, fetch by ID).
- Centralized error handling with proper status codes.
- Temporary authorization middleware that injects a test `req.user._id` for development (to be replaced with real authentication later).

---

