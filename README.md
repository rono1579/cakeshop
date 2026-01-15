# 🍰 Sweet Treats Cakes

A modern, full-stack e-commerce platform for custom cake orders, built with React, TypeScript, Node.js, and Firebase.

## 🚀 Features

- **Custom Cake Builder** - Interactive 3D cake customization
- **User Authentication** - Secure signup/login with Firebase Auth
- **Admin Dashboard** - Manage products, orders, and users
- **Responsive Design** - Works on all devices
- **Secure Checkout** - Integrated with M-Pesa payment gateway
- **Real-time Updates** - Live order tracking and notifications

## 🛠 Tech Stack

### Frontend
- React 18 with TypeScript
- Vite (Build Tool)
- Tailwind CSS + shadcn/ui
- Redux Toolkit (State Management)
- React Hook Form (Form Handling)
- Framer Motion (Animations)
- React Three Fiber (3D Cake Builder)

### Backend
- Node.js with Express
- TypeScript
- Firebase Admin SDK
- Firestore Database
- Firebase Storage
- M-Pesa API Integration

## 📦 Prerequisites

- Node.js 18+
- npm 9+ or pnpm 8+
- Firebase Project (with Firestore and Auth enabled)
- M-Pesa API Credentials (for payment processing)

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/rono1579/sweet-treats-cakes.git
   cd sweet-treats-cakes
   ```

2. **Install dependencies**
   ```bash
   # Using pnpm (recommended)
   pnpm install
   
   # Or using npm
   npm install
   ```

3. **Set up environment variables**

   Create `.env` files in both `frontend` and `server` directories:

   **Frontend (`.env`)**
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_MPESA_CONSUMER_KEY=your_mpesa_consumer_key
   VITE_MPESA_CONSUMER_SECRET=your_mpesa_secret
   ```

   **Server (`.env`)**
   ```env
   PORT=5000
   FIREBASE_SERVICE_ACCOUNT=./path/to/serviceAccountKey.json
   MPESA_CONSUMER_KEY=your_mpesa_consumer_key
   MPESA_CONSUMER_SECRET=your_mpesa_secret
   MPESA_PASSKEY=your_mpesa_passkey
   MPESA_SHORTCODE=your_mpesa_shortcode
   ```

4. **Start the development servers**
   ```bash
   # Start both frontend and backend
   pnpm dev

   # Or start them separately
   cd frontend && pnpm dev
   cd server && pnpm dev
   ```

5. **Access the application**
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:5000
   - Admin Dashboard: http://localhost:8080/admin

## 📂 Project Structure

```
sweet-treats-cakes/
├── frontend/               # React frontend
│   ├── public/             # Static files
│   ├── src/                # Source code
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Redux store and slices
│   │   ├── services/       # API services
│   │   └── App.tsx         # Main App component
│   └── ...                 # Configuration files
│
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Data models
│   │   └── routes/         # API routes
│   └── ...                 # Configuration files
│
└── scripts/                # Utility scripts
    ├── seed_cakes.py       # Script to seed cake data
    └── start_driver.py     # Selenium web driver setup
```

## 🔧 Development

### Available Scripts

```bash
# Install dependencies
pnpm install

# Start development servers
pnpm dev

# Build for production
pnpm build

# Lint code
pnpm lint
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

Made with ❤️ by [Fredrick Mwaura](https://github.com/fredrick-mwaura)
# cakeshop
