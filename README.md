# 📖 Reading Recap

A full-stack application to track and visualize your reading habits throughout the year.

## ✨ Features

- 📚 Track books read with comprehensive details (title, author, pages, genres, etc.)
- 📊 View statistics about your reading habits
- 📅 Filter books by year
- ⭐ Rate books with a visual star rating system
- 📱 Responsive design for desktop and mobile (coming soon)

## 🛠️ Tech Stack

### 🎨 Frontend

- ⚛️ React
- 🗂️ Redux for state management
- 🔄 React Query for data fetching
- 🏷️ TypeScript
- 🎨 CSS Modules for styling

### 🔧 Backend

- 🟢 Node.js
- 🚀 Express.js
- 🍃 MongoDB with Mongoose
- 🏷️ TypeScript

## ⚡ Installation

### 1️⃣ Clone the repository:

```bash
 git clone https://github.com/aleksbanks/reading-recap.git
 cd reading-recap
```

### 2️⃣ Install dependencies:

```bash
# 📦 Install root dependencies
npm install

# 📦 Install frontend dependencies
📂 cd frontend
npm install

# 📦 Install backend dependencies
📂 cd ../backend
npm install
```

### 3️⃣ Setup MongoDB Atlas (Cloud)

- 🏗️ Create a MongoDB Atlas account
- 🚀 Create a new cluster (the free tier works well for development)
- 🔑 Set up database access:
  - Create a database user with read/write permissions
  - Remember the username and password
- 🌍 Set up network access:
  - Add your IP address to the access list
  - For development, you can allow access from anywhere (0.0.0.0/0)
- 🔗 Get your connection string:
  - Click "Connect" on your cluster
  - Select "Connect your application"
  - Copy the provided connection string

### 4️⃣ Create a `.env` file in the backend directory with the following:

```
PORT=5002
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/reading-recap?retryWrites=true&w=majority
```

### ✅ Verifying MongoDB Connection

To verify your MongoDB connection is working correctly:

- ▶️ Start your backend server
- 🖥️ Check the console for the message: `Connected to MongoDB`
- ❌ If you encounter connection errors, verify:
  - Your MongoDB service is running (for local setup)
  - Your connection string is correct
  - Your network access settings allow connections from your application
  - Your database user credentials are correct

### 5️⃣ Start the application

```bash
# 🚀 From the root directory
npm start

# 🚀 Or start frontend and backend separately
# 📂 Frontend (from frontend directory)
npm start

# 📂 Backend (from backend directory)
npm start
```
