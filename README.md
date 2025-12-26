# My Ecommerce Project

A full-stack single-vendor ecommerce web application built from scratch as a learning project. Users can browse products, add items to cart, checkout, and manage their orders.

## 🎯 Project Goal

Learning to build a complete, production-ready ecommerce platform from the ground up, understanding every layer from database design to user interface.

## 🛠️ Tech Stack (PERN)

- **PostgreSQL** - Relational database (hosted on Neon)
- **Express.js** - Backend framework and REST API
- **React** - Frontend library with Vite build tool
- **Node.js** - JavaScript runtime environment

## ✨ Features

### User Features
✅ User registration and authentication  
✅ Secure login with JWT tokens  
✅ Browse product catalog with images  
✅ Add products to shopping cart  
✅ Update cart quantities  
✅ Remove items from cart  
✅ Persistent cart (database-backed for logged-in users)  
✅ Guest cart (localStorage for non-logged-in users)  
✅ Checkout with shipping information  
✅ Order creation and confirmation  
✅ Automatic stock management  
✅ Responsive design (mobile-friendly)  

### Security Features
✅ Password hashing with bcrypt  
✅ JWT-based authentication  
✅ Protected API routes with middleware  
✅ SQL injection prevention (parameterized queries)  
✅ CORS configuration  

### Technical Features
✅ RESTful API design  
✅ Database transactions for order creation  
✅ Foreign key relationships  
✅ React Context API for state management  
✅ Dual-mode cart (guest vs authenticated)  
✅ Real-time cart updates  

## 📦 What's Built

### Backend (Server)
- Express server with CORS enabled
- PostgreSQL database connection with connection pooling
- **Authentication API:**
  - `POST /api/auth/signup` - Create new user account
  - `POST /api/auth/login` - Authenticate and get JWT token
- **Products API:**
  - `GET /api/products` - Fetch all products
  - `POST /api/products/add` - Add new product
- **Cart API** (Protected):
  - `GET /api/cart` - Get user's cart items
  - `POST /api/cart/add` - Add item to cart
  - `PUT /api/cart/update/:productId` - Update item quantity
  - `DELETE /api/cart/remove/:productId` - Remove item
  - `DELETE /api/cart/clear` - Clear entire cart
- **Orders API** (Protected):
  - `POST /api/orders/create` - Create new order
  - `GET /api/orders` - Get user's order history
  - `GET /api/orders/:id` - Get specific order details
- **Middleware:**
  - `authenticateToken` - JWT verification for protected routes

### Database Schema
```sql
users
  - id (PRIMARY KEY)
  - email (UNIQUE)
  - password_hash
  - first_name, last_name
  - created_at

products
  - id (PRIMARY KEY)
  - name, description
  - price, stock_quantity
  - category, image_url
  - created_at, updated_at

cart_items
  - id (PRIMARY KEY)
  - user_id (FOREIGN KEY → users)
  - product_id (FOREIGN KEY → products)
  - quantity
  - UNIQUE(user_id, product_id)

orders
  - id (PRIMARY KEY)
  - user_id (FOREIGN KEY → users)
  - total_amount
  - status (pending, completed, cancelled)
  - shipping_address
  - created_at

order_items
  - id (PRIMARY KEY)
  - order_id (FOREIGN KEY → orders)
  - product_id (FOREIGN KEY → products)
  - quantity, price
```

### Frontend (Client)
- React with Vite for fast development
- **Components:**
  - `ProductList` - Display products in responsive grid
  - `Cart` - Shopping cart management
  - `Checkout` - Order checkout form
  - `Login/Signup` - Authentication forms
- **Context Providers:**
  - `AuthContext` - User authentication state
  - `CartContext` - Shopping cart state management
- **Features:**
  - Protected routes (show/hide based on auth)
  - Form validation
  - Error handling and loading states
  - Order confirmation page
  - Responsive navigation

## 📁 Project Structure

```
ecommerce-project/
├── server/                      # Backend
│   ├── middleware/
│   │   └── auth.js             # JWT authentication middleware
│   ├── server.js               # Main server file
│   ├── products.js             # Product routes
│   ├── auth.js                 # Authentication routes
│   ├── cart.js                 # Cart routes
│   ├── orders.js               # Order routes
│   ├── database.sql            # Database schema
│   ├── setup-database.js       # Database initialization
│   ├── .env                    # Environment variables (not tracked)
│   └── package.json            # Backend dependencies
│
├── client/                      # Frontend
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── ProductList.jsx
│   │   │   ├── ProductList.css
│   │   │   ├── Cart.jsx
│   │   │   ├── Cart.css
│   │   │   ├── Checkout.jsx
│   │   │   ├── Checkout.css
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── Auth.css
│   │   ├── context/            # React Context
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   ├── App.jsx             # Main app component
│   │   ├── App.css
│   │   ├── main.jsx            # Entry point
│   │   └── index.css
│   └── package.json            # Frontend dependencies
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v22+)
- PostgreSQL account (Neon recommended)
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
   ```env
   DATABASE_URL=your_neon_connection_string_here
   JWT_SECRET=your_secret_key_here_change_in_production
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

**You need TWO terminal windows:**

**Terminal 1 - Backend Server:**
```bash
cd server
npm start
```
Server runs on http://localhost:5000

**Terminal 2 - Frontend Dev Server:**
```bash
cd client
npm run dev
```
App runs on http://localhost:5173

### Testing the App

1. **Sign up** for a new account
2. **Browse products** on the home page
3. **Add items** to your cart
4. **View cart** by clicking the cart icon
5. **Proceed to checkout** and fill in shipping info
6. **Place order** and see confirmation
7. **Log out and log back in** - your cart persists!

## 🎓 What I Learned

### Technical Skills
- **Full-stack development workflow** - Building both frontend and backend
- **RESTful API design** - Creating logical, RESTful endpoints
- **Database design** - Normalizing data and creating relationships
- **Authentication & Security** - JWT tokens, password hashing, protected routes
- **React state management** - Context API, hooks (useState, useEffect, useContext, useRef)
- **Async JavaScript** - Promises, async/await patterns
- **SQL queries** - CRUD operations, JOINs, transactions
- **Git version control** - Committing changes and tracking progress

### Key Concepts Mastered
- Frontend ↔ Backend communication via HTTP
- Database transactions (all-or-nothing operations)
- Middleware pattern for route protection
- Token-based authentication flow
- Form handling and validation
- Error handling (try/catch, error states)
- Loading states and user feedback
- Responsive web design
- Component-based architecture

### Problem-Solving Skills
- Reading and understanding error messages
- Debugging with console logs and DevTools
- Following code patterns and conventions
- Breaking down complex problems into steps
- Researching solutions when stuck

## 📚 Technologies & Libraries

### Backend Dependencies
- **express** - Web framework for Node.js
- **pg** (node-postgres) - PostgreSQL client
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT creation and verification
- **dotenv** - Environment variable management
- **cors** - Cross-Origin Resource Sharing

### Frontend Dependencies
- **react** - UI library
- **vite** - Build tool and dev server
- **axios** - HTTP client for API requests

### Development Tools
- **VS Code** - Code editor
- **Git** - Version control
- **Command Prompt/Terminal** - Running scripts
- **Chrome DevTools** - Debugging and testing
- **pgAdmin/DBeaver** - Database management (optional)

## 🔧 API Endpoints

### Public Endpoints
```
GET  /api/products          # Get all products
POST /api/auth/signup       # Create account
POST /api/auth/login        # Login
```

### Protected Endpoints (Require JWT Token)
```
GET    /api/cart                      # Get user's cart
POST   /api/cart/add                  # Add item to cart
PUT    /api/cart/update/:productId    # Update quantity
DELETE /api/cart/remove/:productId    # Remove item
DELETE /api/cart/clear                # Clear cart

POST   /api/orders/create             # Create order
GET    /api/orders                    # Get user's orders
GET    /api/orders/:id                # Get order details
```

## 🎯 Future Improvements

### High Priority
- [ ] Order history page
- [ ] User profile management
- [ ] Product search functionality
- [ ] Category filters
- [ ] Input validation (frontend + backend)
- [ ] Better error messages

### Medium Priority
- [ ] Admin dashboard
- [ ] Add/edit products from UI
- [ ] Order status updates
- [ ] Email notifications
- [ ] Password reset functionality
- [ ] Product detail pages

### Low Priority / Advanced
- [ ] Payment integration (Stripe)
- [ ] Product reviews and ratings
- [ ] Wishlist feature
- [ ] Promo codes and discounts
- [ ] Real-time notifications
- [ ] Image upload for products
- [ ] Advanced analytics
- [ ] Multi-language support

## 🐛 Known Issues
- None currently! 🎉

## 📖 Learning Resources Used
- React Documentation (https://react.dev)
- Express.js Documentation (https://expressjs.com)
- PostgreSQL Documentation (https://www.postgresql.org/docs)
- MDN Web Docs (https://developer.mozilla.org)
- Node.js Documentation (https://nodejs.org/docs)

## 🙏 Acknowledgments

Built as a comprehensive learning project to understand full-stack web development from the ground up. Every line of code was written with the goal of deep understanding, not just copying.

---

**Started:** December 23, 2025  
**Completed Core Features:** December 26, 2025  
**Status:** ✅ Functional MVP - Actively Improving  
**Developer:** Learning by Building  
**Learning Approach:** Deep understanding through guided practice
