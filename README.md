# My Ecommerce Project

A full-stack single-vendor ecommerce web application built from scratch as a learning project.

## 🎯 Project Goal
Learning to build a complete ecommerce platform where customers can browse products, add items to cart, checkout, and manage orders.

## 🛠️ Tech Stack (PERN)
- **PostgreSQL** - Relational database (hosted on Neon)
- **Express.js** - Backend framework
- **React** - Frontend library (using Vite)
- **Node.js** - JavaScript runtime

## 📦 What's Built So Far

### Backend (Server)
- ✅ Express server setup with CORS
- ✅ PostgreSQL database connection
- ✅ RESTful API endpoints for products
  - GET `/api/products` - Fetch all products
  - POST `/api/products/add` - Add new product
- ✅ Database tables:
  - `products` - Store product information
  - `users` - User accounts
  - `orders` - Customer orders
  - `order_items` - Items in each order

### Frontend (Client)
- ✅ React setup with Vite (fast development)
- ✅ Product listing page with grid layout
- ✅ Shopping cart functionality
  - Add to cart
  - Update quantities
  - Remove items
  - Calculate totals
  - Persistent cart (localStorage)
- ✅ Cart Context (React Context API for state management)
- ✅ Responsive design
- ✅ Navigation between products and cart pages

## 📁 Project Structure
```
ecommerce-project/
├── server/                 # Backend
│   ├── server.js          # Main server file
│   ├── products.js        # Product routes
│   ├── database.sql       # Database schema
│   ├── setup-database.js  # Database initialization
│   ├── .env              # Environment variables (not tracked)
│   └── package.json      # Backend dependencies
├── client/                # Frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   │   ├── ProductList.jsx
│   │   │   ├── ProductList.css
│   │   │   ├── Cart.jsx
│   │   │   └── Cart.css
│   │   ├── context/      # React Context
│   │   │   └── CartContext.jsx
│   │   ├── App.jsx       # Main app component
│   │   ├── App.css
│   │   ├── main.jsx      # Entry point
│   │   └── index.css
│   └── package.json      # Frontend dependencies
└── README.md

```

## 🚀 Getting Started

### Prerequisites
- Node.js (v22+)
- PostgreSQL account (Neon)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ecommerce-project
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   ```
   
   Create `.env` file in server directory:
   ```
   DATABASE_URL=your_neon_connection_string
   PORT=5000
   ```
   
   Initialize database:
   ```bash
   node setup-database.js
   ```

3. **Setup Frontend**
   ```bash
   cd ../client
   npm install
   ```

### Running the Application

**Terminal 1 - Backend:**
```bash
cd server
npm start
```
Server runs on http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
App runs on http://localhost:5173

## 🎓 Learning Approach

This project follows a guided learning methodology:
1. Understand concepts before coding
2. Write code with guidance (not just copy-paste)
3. Review and explain what was written
4. Build features incrementally
5. Debug and problem-solve independently

## 📝 Features To Build (Roadmap)

### Phase 1: Core Shopping ✅
- [x] Product listing
- [x] Shopping cart
- [ ] User authentication (sign up/login)
- [ ] Checkout process
- [ ] Order confirmation

### Phase 2: User Features
- [ ] User profile
- [ ] Order history
- [ ] Product search and filters
- [ ] Product categories

### Phase 3: Admin Features
- [ ] Admin dashboard
- [ ] Add/edit/delete products
- [ ] View all orders
- [ ] Inventory management

### Phase 4: Advanced Features
- [ ] Payment integration
- [ ] Email notifications
- [ ] Product reviews and ratings
- [ ] Wishlist
- [ ] Related products

## 🐛 Known Issues
- Cart empties on page refresh (localStorage bug to fix)

## 📚 What I'm Learning
- Full-stack development workflow
- RESTful API design
- React state management (Context API)
- PostgreSQL database design
- Async JavaScript (promises, async/await)
- Component-based architecture
- Git version control

## 🔧 Technologies & Tools
- **Backend:** Node.js, Express, pg (node-postgres), dotenv, cors
- **Frontend:** React, Vite, Axios
- **Database:** PostgreSQL (Neon cloud hosting)
- **Dev Tools:** VS Code, Git, pgAdmin/DBeaver
- **Package Manager:** npm

## 📖 Resources Used
- React Documentation
- Express.js Documentation
- PostgreSQL Documentation
- MDN Web Docs

---

**Started:** December 23, 2025
**Status:** In Active Development
**Developer:** Learning by Building
