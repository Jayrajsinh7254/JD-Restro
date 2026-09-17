# Drizzle Restaurant - Full Stack Application

A complete, premium fine-dining restaurant website built with the MERN stack (MongoDB, Express, React, Node.js). It features a beautiful public-facing website with dynamic menus, table reservations, and an interactive gallery, alongside a comprehensive, secure Admin Dashboard for restaurant staff to manage operations.

## ✨ Features

### Public Website
- **Modern, Premium UI**: Built with Tailwind CSS and Framer Motion for smooth, elegant animations.
- **Dynamic Menu**: Categorized, filterable menu displaying items with dietary tags (vegetarian, gluten-free), prices, and images.
- **Table Reservations**: An intuitive booking system allowing guests to select party size, date, time, and add special requests.
- **Gallery**: A masonry-style image grid with category filters and a lightbox viewer for a visual feast.
- **Loyalty Program**: A mock rewards program showcasing tiered benefits (Silver, Gold, Platinum).
- **Cart & Ordering**: Built-in state for online ordering (UI only; ready to connect to backend).
- **Responsive Design**: Flawless experience across all devices, from mobile to ultra-wide monitors.

### Admin Dashboard (Secured via JWT)
- **Live Orders**: Kanban-style board to track and manage order statuses (Preparing -> Ready -> Completed).
- **Manage Menu**: Full CRUD (Create, Read, Update, Delete) interface to update restaurant offerings instantly.
- **Manage Reservations**: Track upcoming bookings, confirm pending requests, or cancel reservations.
- **Dashboard Stats**: Real-time business metrics like revenue, new customers, and active orders.

## 🛠 Tech Stack

**Frontend (Client)**
- React 18
- Vite
- Tailwind CSS 3
- Framer Motion (Animations)
- React Router DOM 6
- Context API (State Management)
- Axios (API requests)
- React Hook Form (Forms validation)
- React Hot Toast (Notifications)
- Lucide React (Icons)

**Backend (Server)**
- Node.js
- Express.js
- MongoDB & Mongoose
- JSON Web Token (JWT)
- Bcrypt.js (Password hashing)
- Multer & Cloudinary (Image uploads)
- Nodemailer (Email service)

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB instance (Atlas or local)
- Cloudinary account (for image uploads)

### Installation

1. **Clone the repository** (if applicable) and navigate into the project directory:
   ```bash
   cd New-JD-Restro
   ```

2. **Setup the Backend**
   ```bash
   cd server
   npm install
   ```
   - Create a `.env` file in the `server` directory (use `.env.example` as a reference):
     ```env
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret_key
     JWT_EXPIRE=30d
     CLOUDINARY_CLOUD_NAME=your_cloud_name
     CLOUDINARY_API_KEY=your_api_key
     CLOUDINARY_API_SECRET=your_api_secret
     EMAIL_HOST=smtp.your-email.com
     EMAIL_PORT=587
     EMAIL_USER=your_email@example.com
     EMAIL_PASS=your_email_password
     NODE_ENV=development
     CLIENT_URL=http://localhost:5173
     ```
   - *Optional:* Seed the database with sample data:
     ```bash
     node seed.js
     ```
   - Start the backend server:
     ```bash
     npm run dev
     ```

3. **Setup the Frontend**
   ```bash
   cd ../client
   npm install
   ```
   - Create a `.env` file in the `client` directory:
     ```env
     VITE_API_URL=http://localhost:5000/api
     ```
   - Start the frontend development server:
     ```bash
     npm run dev
     ```

4. **Access the Application**
   - Public Site: `http://localhost:5173`
   - Admin Dashboard: `http://localhost:5173/admin/login`
     - *Default Admin Credentials (if seeded):* 
       - Email: `admin@drizzle.com`
       - Password: `Admin@123`

## 📁 Project Structure

```
New-JD-Restro/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── admin/          # Admin Dashboard views
│   │   ├── components/     # Reusable UI components (Navbar, Footer)
│   │   ├── context/        # Global state (Auth, Cart, Loyalty)
│   │   ├── hooks/          # Custom data-fetching hooks
│   │   ├── pages/          # Public-facing views
│   │   ├── services/       # Axios API integration
│   │   └── utils/          # Helpers (formatDate, formatPrice)
│   ├── index.html
│   ├── tailwind.config.js
│   └── vite.config.js
└── server/                 # Express Backend
    ├── config/             # DB & Cloudinary config
    ├── controllers/        # Route logic
    ├── middleware/         # Auth & Error handling
    ├── models/             # Mongoose schemas
    ├── routes/             # API endpoints
    ├── utils/              # Email & Token utilities
    └── server.js           # Server entry point
```

## 🎨 Design System

The application uses a carefully curated design system defined in `client/src/index.css` via custom CSS properties, ensuring consistency across the Tailwind application. It features a sophisticated dark mode palette (Very Dark Espresso, Rich Crimson Red) contrasted with warm creams and aesthetic typography utilizing `Castoro` (Serif) and `DM Sans` (Sans-Serif).

## 📝 License

This project is open-source and available under the MIT License.
