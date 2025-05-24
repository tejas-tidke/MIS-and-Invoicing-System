# MIS & Invoicing System

## 🌐 Live URL
- **Frontend**: [Netlify Link](https://heroic-cupcake-046906.netlify.app)
- **Backend**: Hosted on Render
- ⏳ Note: The backend is deployed on a free server (Render). It may take 3-4 minutes to wake up if inactive. Please wait for the first request to process.

---

## 📌 Project Overview
This project consists of a **Spring Boot REST API** as the backend and a **React-based frontend** for user authentication and employee management. It includes features like user registration, login, password reset, and employee payroll management. The backend is deployed using **Docker Hub** and hosted on **Render**, while the database is managed using **Neon.tech PostgreSQL**. The frontend is hosted on **Netlify**.

## 🚀 Features
### Backend
- **User Registration**: Users can sign up with a unique email and password.
- **User Login**: JWT-based authentication for secure access.
- **Password Reset**: Supports password reset for both logged-in and non-logged-in users.
- **Security**: Utilizes **Spring Security** with JWT authentication.

### Frontend
- **Manage Brands**
- **Manage Chains**
- **Manage Estimates**
- **Manage Groups**
- **Manage Invoices**
- **Manage Subzones**
- **Material UI for Styling**


## 🛠️ Tech Stack
- **Backend**: Java, Spring Boot, Spring Security, JWT
- **Database**: PostgreSQL (via Neon.tech)
- **Containerization**: Docker
- **Frontend**: React.js
- **Styling**: Material UI
- **Hosting**:
  - **Backend**: Render (via Docker Hub)
  - **Frontend**: Netlify

## 📂 Backend Project Structure
```
backend/
│── src/
│   ├── main/java/com/example/authentication/  # Main Java files
│   │   ├── controller/  # REST Controllers
│   │   ├── service/  # Business logic
│   │   ├── repository/  # Database interactions
│   │   ├── security/  # JWT Security configuration
│   │   ├── config/  # App configurations
│   ├── resources/
│   │   ├── application.properties  # Database & server configuration
│── Dockerfile  # Containerization setup
│── .gitignore  # Files to ignore (includes .env)
│── README.md  # Documentation
```

## ⚙️ Backend Installation & Setup
### 1️⃣ Clone the Repository
```sh
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

### 2️⃣ Setup Environment Variables
Create a `.env` file in the root directory and add:
```
DB_URL=your_neon_tech_postgres_url
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
JWT_SECRET=your_jwt_secret
```

### 3️⃣ Build & Run the Application
```sh
mvn clean install
mvn spring-boot:run
```

## 🐳 Running with Docker
### 1️⃣ Build Docker Image
```sh
docker build -t username/auth-backend .
```

### 2️⃣ Run Docker Container
```sh
docker run -p 8080:8080 --env-file .env username/auth-backend
```

## 🚀 Backend Deployment on Render (via Docker Hub)
1. Push your image to **Docker Hub**:
   ```sh
   docker push username/auth-backend
   ```
2. Deploy on **Render** by linking the Docker image.

---

## 📂 Frontend Project Structure
```
frontend/
│── src/
│   ├── components/     # Navbar, Login, Register, etc.
│   ├── pages/          # Employee Management, Payroll, etc.
│   ├── services/       # API calls (authService.js)
│   ├── App.jsx         # Main application file
│   ├── index.js        # Entry point
│── public/             # Static assets
│── .env                # Environment variables
│── package.json        # Dependencies and scripts
```

## ⚙️ Frontend Installation & Setup
### 1️⃣ Clone the Repository
```sh
git clone https://github.com/your-username/your-repo.git
cd your-repo/frontend
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Set Up Environment Variables
Create a `.env` file in the root directory:
```
REACT_APP_API_URL=https://your-backend-url
```

### 4️⃣ Run the Application
```sh
npm run dev
```

## 🚀 Frontend Deployment on Netlify
1. **Build the project**:
   ```sh
   npm run build
   ```
2. **Upload the `dist/` folder to Netlify**
3. **Configure Netlify Redirects** (For React Router)
   - Create a `_redirects` file in `public/`
   - Add this line:
     ```
     /* /index.html 200
     ```

## 📜 License
This project is licensed under the MIT License.

---
### 📞 Contact
For any issues or improvements, feel free to open an **issue** or submit a **pull request**. 🚀
