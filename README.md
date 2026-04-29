# 🔗 LinkBond

LinkBond is a full-stack professional networking platform where users can connect, share posts, and manage their professional profiles.

## 🚀 Live Website

👉 https://link-bond.vercel.app/

---

## ✨ Features

### 🔐 Authentication

* Secure user signup and login
* JWT-based authentication

### 👤 Profile Management

* Edit profile details:

  * Profile picture
  * Name
  * Education
  * Work
  * Position
* View user profiles

### 📝 Posts

* Create posts with images
* Like and comment on posts
* Share posts directly to Twitter

### 🤝 Connections

* Send connection requests
* Accept connection requests
* View all connections

### 📄 Resume Generator

* Upload and generate resume instantly using Multer
* Download resume directly from the platform

### 📰 Feed

* View posts from connections
* Interactive social feed system

---

## 🛠️ Tech Stack

### Frontend

* Next.js

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### Other Tools

* Multer (for file upload)

---

## 📂 Project Structure

```
LinkBond/
│
├── frontend/     # Next.js frontend
├── backend/      # Node.js + Express backend
├── README.md
```

---

## ⚙️ Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/your-username/linkbond.git
cd linkbond
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```
PORT=9090
MONGO_URI=your_database_url
JWT_SECRET=your_secret_key
```

Run backend:

```bash
npm start
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 📌 Highlights

* Full-stack production-ready project
* Clean UI and responsive design
* Real-world social networking features
* Resume builder integration

---

## 🚀 Future Roadmap

* [ ] Implement Real-time Chat functionality.
* [ ] Add Notifications for connection requests and likes.
* [ ] Enhance Search functionality for users and posts.
* [ ] Add Dark Mode support.

---
