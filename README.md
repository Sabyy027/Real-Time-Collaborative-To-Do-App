# Real-Time Collaborative To-Do Board

A full-stack MERN application that allows multiple users to collaborate on a shared to-do board in real-time.

## Live Links

-   Deployed App: https://todoboardsabeer.netlify.app
-   Demo Video: [Your Video Link Here]
  
## Deployment Notes

During the deployment of the backend, I encountered persistent platform-specific build errors with the initial cloud hosting service. To ensure a stable and fully functional live demo, the backend is being served from a local environment and exposed publicly and securely via an ngrok tunnel. The frontend is fully deployed on Netlify.

**To test the live application, the local backend and the ngrok tunnel must be running.**

## Tech Stack

-   Frontend: React, Vite, Socket.IO Client, Dnd Kit
-   Backend: Node.js, Express, MongoDB, Mongoose, Socket.IO, JWT

## Features

-   Secure user registration and JWT-based authentication.
-   Real-time task board with smooth drag-and-drop functionality.
-   Live activity log showing the last 20 actions.
-   "Smart Assign" feature to delegate tasks automatically to the user with the fewest active tasks.
-   Direct task assignment via a dropdown menu on each card.
-   Conflict handling to prevent data loss from simultaneous edits.
-   Fully responsive design for desktop, tablet, and mobile.

## Local Setup and Installation

### Backend

1.  Navigate to the `backend` folder: `cd backend`
2.  Install dependencies: `npm install`
3.  Create a `.env` file and add `MONGO_URI`, `JWT_SECRET`, and `PORT`.
4.  Start the server: `npm run dev`

### Frontend

1.  Navigate to the `frontend` folder: `cd frontend`
2.  Install dependencies: `npm install`
3.  Start the client: `npm run dev`

## Logic Explanation

### Smart Assign

My Smart Assign logic works by first finding all registered users. It then counts the number of "active" (Todo or In Progress) tasks currently assigned to each user. Finally, it assigns the selected task to the user who has the lowest count of active tasks, ensuring an even workload distribution.

### Conflict Handling

My conflict handling system works by using the `updatedAt` timestamp of a task as a version identifier. When a user tries to update a task, the frontend sends the timestamp of the task data it currently has. The backend compares this to the timestamp in the database. If they don't match, it means another user has updated the task in the meantime. The backend then rejects the update with a `409 Conflict` error, preventing the overwrite and informing the user.
