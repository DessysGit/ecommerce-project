# My Ecommerce Project

A full-stack single-vendor ecommerce web application built from scratch as a learning project. Users can browse products, manage their cart, place orders, and track their purchase history.

## 🎯 Project Goal

Learning to build a complete, production-ready ecommerce platform from the ground up, understanding every layer from database design to user interface, with a focus on deep learning through hands-on practice.

## 🛠️ Tech Stack (PERN)

- **PostgreSQL** - Relational database (hosted on Neon)
- **Express.js** - Backend framework and REST API
- **React** - Frontend library with Vite build tool
- **Node.js** - JavaScript runtime environment

## ✨ Features

### Customer Features
✅ **Authentication & Account Management**
- User registration with secure password hashing
- Login with JWT token authentication
- Persistent sessions with automatic token refresh

✅ **Product Browsing & Discovery**
- Product catalog with responsive grid layout
- Real-time search with debounced input
- Category filtering
- Multiple sort options (price, name, date)
- Product detail pages with large images
- Related products suggestions
- Clear filters functionality

✅ **Shopping Experience**
- Add products to cart
- Update item quantities
- Remove items from cart
- Persistent cart (database-backed for logged-in users)
- Guest cart (localStorage for non-authenticated users)
- Real-time cart count in header

✅ **Checkout & Orders**
- Checkout with shipping information
- Order creation with database transactions
- Automatic stock management
- Order confirmation page
- Order history with expandable details
- Order status tracking (pending, completed, cancelled)
- View past order items and totals

✅ **Navigation & UX**
- React Router for seamless navigation
- Browser back/forward button support
- Direct URL access to any page
- Responsive design (mobile, tablet, desktop)
- Loading states and error handling

### Security Features
✅ Password hashing with bcrypt (10 salt rounds)  
✅ JWT-based authentication with 24-hour expiration  
✅ Protected API routes with authentication middleware  
✅ SQL injection prevention (parameterized queries)  
✅ CORS configuration for secure cross-origin requests  

### Technical Features
✅ RESTful API design with logical endpoints  
✅ Database transactions for order creation (ACID compliance)  
✅ Foreign key relationships and referential integrity  
✅ React Context API for global state management  
✅ Dual-mode cart (guest vs authenticated)  
✅ Debounced search (500ms delay) for performance  
✅ Dynamic query building for flexible filtering  
✅ Expandable UI components with smooth animations  

## 📦 API Endpoints

### Public Endpoints
```
GET  /api/products              # Get all products (with optional filters)
GET  /api/products/categories   # Get all product categories
GET  /api/products/:id          # Get single product by ID
POST /api/auth/signup           # Create new account
POST /api/auth/login            # Login and get JWT token
```

### Protected Endpoints (Require JWT Token)
```
# Cart Management
GET    /api/cart                      # Get user's cart items
POST   /api/cart/add                  # Add item to cart
PUT    /api/cart/update/:productId    # Update item quantity
DELETE /api/cart/remove/:productId    # Remove item from cart
DELETE /api/cart/clear                # Clear entire cart

# Order Management
POST   /api/orders/create             # Create new order
GET    /api/orders                    # Get user's order history
GET    /api/orders/:id                # Get specific order details
```

### Query Parameters for Products
```
?search=laptop           # Search in name and description
?category=Electronics    # Filter by category
?sortBy=price_asc       # Sort (price_asc, price_desc, name_asc, name_desc, newest)
```

## 📁 Project Structure

```
ecommerce-project/
├── server/                      # Backend (Express API)
│   ├── middleware/
│   │   └── auth.js             # JWT authentication middleware
│   ├── server.js               # Main server file with route mounting
│   ├── products.js             # Product routes (CRUD + search/filter)
│   ├── auth.js                 # Authentication routes (signup/login)
│   ├── cart.js                 # Cart routes (add/update/remove)
│   ├── orders.js               # Order routes (create/history)
│   ├── database.sql            # Database schema definition
│   ├── setup-database.js       # Database initialization script
│   ├── .env                    # Environment variables (not tracked)
│   └── package.json            # Backend dependencies
│
├── client/                      # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── ProductList.jsx       # Product catalog with filters
│   │   │   ├── ProductList.css
│   │   │   ├── ProductDetail.jsx     # Individual product page
│   │   │   ├── ProductDetail.css
│   │   │   ├── Cart.jsx              # Shopping cart
│   │   │   ├── Cart.css
│   │   │   ├── Checkout.jsx          # Checkout form
│   │   │   ├── Checkout.css
│   │   │   ├── OrderHistory.jsx      # Past orders
│   │   │   ├── OrderHistory.css
│   │   │   ├── Login.jsx             # Login form
│   │   │   ├── Signup.jsx            # Registration form
│   │   │   └── Auth.css              # Shared auth styles
│   │   ├── context/            # React Context for state
│   │   │   ├── AuthContext.jsx       # User authentication state
│   │   │   └── CartContext.jsx       # Shopping cart state
│   │   ├── App.jsx             # Main app with routing
│   │   ├── App.css             # Global app styles
│   │   ├── main.jsx            # Entry point with providers
│   │   └── index.css           # Base CSS reset
│   └── package.json            # Frontend dependencies
│
└── README.md                   # This file
```

## 💾 Database Schema

```sql
users
  ├─ id (PRIMARY KEY, SERIAL)
  ├─ email (UNIQUE, NOT NULL)
  ├─ password_hash (NOT NULL)
  ├─ first_name
  ├─ last_name
  └─ created_at (TIMESTAMP)

products
  ├─ id (PRIMARY KEY, SERIAL)
  ├─ name (NOT NULL)
  ├─ description (TEXT)
  ├─ price (DECIMAL, NOT NULL)
  ├─ stock_quantity (INTEGER, DEFAULT 0)
  ├─ category
  ├─ image_url
  ├─ created_at (TIMESTAMP)
  └─ updated_at (TIMESTAMP)

cart_items
  ├─ id (PRIMARY KEY, SERIAL)
  ├─ user_id (FOREIGN KEY → users.id)
  ├─ product_id (FOREIGN KEY → products.id)
  ├─ quantity (INTEGER, DEFAULT 1)
  ├─ created_at (TIMESTAMP)
  └─ UNIQUE(user_id, product_id)

orders
  ├─ id (PRIMARY KEY, SERIAL)
  ├─ user_id (FOREIGN KEY → users.id)
  ├─ total_amount (DECIMAL, NOT NULL)
  ├─ status (VARCHAR, DEFAULT 'pending')
  ├─ shipping_address (TEXT)
  └─ created_at (TIMESTAMP)

order_items
  ├─ id (PRIMARY KEY, SERIAL)
  ├─ order_id (FOREIGN KEY → orders.id)
  ├─ product_id (FOREIGN KEY → products.id)
  ├─ quantity (INTEGER, NOT NULL)
  └─ price (DECIMAL, NOT NULL)
```

## 🚀 Getting Started

### Prerequisites
- Node.js v22 or higher
- PostgreSQL account (Neon recommended for cloud hosting)
- Git for version control

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
   JWT_SECRET=your_secret_key_here_change_in_production_123456
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

**You need TWO terminal windows running simultaneously:**

**Terminal 1 - Backend Server:**
```bash
cd server
npm start
```
✅ Server runs on http://localhost:5000

**Terminal 2 - Frontend Dev Server:**
```bash
cd client
npm run dev
```
✅ App runs on http://localhost:5173

### Testing the App

1. Open browser to http://localhost:5173
2. **Sign up** for a new account
3. **Browse products** - use search and filters
4. **Click a product** to see details
5. **Add items** to cart
6. **View cart** and update quantities
7. **Proceed to checkout**
8. **Place order** and see confirmation
9. **View order history** to see past orders
10. **Log out and log back in** - cart persists!

## 🎓 What I Learned

### Technical Skills Mastered
- **Full-stack development workflow** - Building coordinated frontend and backend
- **RESTful API design** - Creating intuitive, RESTful endpoints
- **Database design** - Normalizing data, creating relationships, ensuring integrity
- **Authentication & Security** - JWT tokens, password hashing, protected routes
- **React ecosystem** - Components, hooks, context, router
- **State management** - Context API, localStorage, server state
- **Async JavaScript** - Promises, async/await, error handling
- **SQL proficiency** - CRUD operations, JOINs, transactions, query optimization
- **Git workflow** - Regular commits, meaningful commit messages

### Key Concepts Understood
- Frontend ↔ Backend communication via HTTP/REST
- Database transactions (all-or-nothing operations)
- Middleware pattern for route protection
- Token-based authentication flow
- Debouncing for performance optimization
- Conditional rendering and component composition
- Form handling and validation
- Error boundaries and loading states
- Responsive web design principles
- Component lifecycle and side effects

### Problem-Solving Skills Developed
- Reading and interpreting error messages
- Debugging with browser DevTools and console logs
- Following and adapting code patterns
- Breaking complex problems into manageable steps
- Researching solutions independently
- Understanding when to ask for help
- Testing thoroughly before moving forward

## 📚 Technologies & Libraries

### Backend Dependencies
- **express** (^4.18.0) - Web framework
- **pg** (^8.11.0) - PostgreSQL client
- **bcryptjs** (^2.4.3) - Password hashing
- **jsonwebtoken** (^9.0.0) - JWT creation/verification
- **dotenv** (^16.0.0) - Environment variables
- **cors** (^2.8.5) - Cross-origin resource sharing

### Frontend Dependencies
- **react** (^18.2.0) - UI library
- **react-dom** (^18.2.0) - React DOM rendering
- **react-router-dom** (^6.20.0) - Client-side routing
- **vite** (^5.0.0) - Build tool and dev server
- **axios** (^1.6.0) - HTTP client

### Development Tools
- **VS Code** - Code editor with extensions
- **Git** - Version control
- **Chrome DevTools** - Debugging and network inspection
- **Postman/curl** - API testing
- **pgAdmin** - Database management (optional)

## 🎯 Future Enhancements

### High Priority
- [ ] User profile management
- [ ] Change password functionality
- [ ] Input validation (frontend + backend)
- [ ] Toast notifications (replace alerts)
- [ ] Loading skeletons for better UX
- [ ] Pagination for products

### Medium Priority
- [ ] Admin dashboard
- [ ] Add/edit products from UI
- [ ] Order status updates
- [ ] Email notifications
- [ ] Password reset flow
- [ ] Wishlist feature
- [ ] Product reviews & ratings

### Low Priority / Advanced
- [ ] Payment integration (Stripe)
- [ ] Real-time notifications (WebSockets)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Progressive Web App (PWA)
- [ ] Image upload for products
- [ ] Promo codes and discounts

## 🐛 Known Issues
- None currently! 🎉

## 📖 Learning Resources Used
- React Documentation (https://react.dev)
- Express.js Documentation (https://expressjs.com)
- PostgreSQL Documentation (https://www.postgresql.org/docs)
- MDN Web Docs (https://developer.mozilla.org)
- React Router Documentation (https://reactrouter.com)

## 🙏 Acknowledgments

Built as a comprehensive learning project to deeply understand full-stack web development. Every feature was implemented with the goal of understanding the "why" behind the code, not just copying and pasting solutions.

Special focus on:
- Writing clean, commented code
- Understanding before implementing
- Debugging and problem-solving independently
- Following best practices and patterns
- Regular git commits with meaningful messages

---

**Started:** December 23, 2025  
**Core Features Completed:** December 28, 2025  
**Status:** ✅ Feature-Complete MVP - Adding Polish  
**Developer:** Learning Through Building  
**Learning Methodology:** Deep understanding through guided practice and independent problem-solving
