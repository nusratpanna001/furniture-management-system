# 🚀 Quick Start Guide - LuxeHome Frontend

## Installation & Running

### Step 1: Navigate to Frontend Directory
```powershell
cd "d:\New folder\nusrat-panna-main\apps\frontend"
```

### Step 2: Install Dependencies
```powershell
npm install
```

This will install:
- React 19.0.0
- Vite 5.1.0
- Tailwind CSS v4 (alpha)
- React Router DOM 6.22.0
- React Hook Form 7.50.1
- Zod 3.22.4
- Axios 1.6.7
- Recharts 2.12.0
- Lucide React (icons)
- And more...

### Step 3: Start Development Server
```powershell
npm run dev
```

The app will automatically open at: **http://localhost:3000**

## 📱 Using the Application

### 1. Landing Page
- Visit `http://localhost:3000`
- Explore the public landing page
- Click "Login" button in navbar

### 2. Login
- **Email**: Enter any email (e.g., `admin@luxehome.com`)
- **Password**: Enter any password (e.g., `password`)
- Click "Login"
- You'll be logged in as an Admin user (mock mode)

### 3. Dashboard
After login, you'll see:
- **KPI Cards**: Revenue, Orders, Products, Low Stock
- **Sales Trend Chart**: Line chart showing sales over time
- **Top Products**: Bar chart and table
- **Low Stock Alerts**: Products needing restock

### 4. Navigation (Sidebar)
- **Dashboard**: Overview and analytics
- **Inventory**: Manage products
- **Orders**: Track customer orders
- **Suppliers**: Manage supplier information (Admin only)
- **Purchases**: Track inventory purchases (Admin/Staff)
- **Reports**: Detailed analytics (Admin only)

### 5. Inventory Management
1. Click "Inventory" in sidebar
2. Use filters to search/filter products
3. Click "Add Product" to create new product
4. Click edit icon to modify product
5. Click delete icon to remove product

### 6. Order Management
1. Click "Orders" in sidebar
2. Filter by status (Pending, In Progress, etc.)
3. Click eye icon to view order details
4. Click "Create Order" to add new order
5. In order details, use timeline to track status

### 7. Logout
- Click user avatar in top-right
- Select "Logout"
- Returns to landing page

## 🎨 Features to Try

### Filters & Search
- **Inventory**: Search by name, filter by category/material/price
- **Orders**: Filter by status

### Pagination
- **Product List**: Navigate through pages
- **Order List**: View paginated orders

### Forms & Validation
- Try submitting forms with invalid data
- See inline error messages
- Submit button disabled until form is valid

### Responsive Design
- Resize browser to see mobile layout
- Sidebar becomes drawer on mobile
- Tap hamburger menu to open sidebar

### Charts & Analytics
- **Dashboard**: Interactive charts (hover for tooltips)
- **Reports**: Sales trends and top products

## 🔧 Build & Production

### Build for Production
```powershell
npm run build
```
- Creates optimized build in `dist/` folder
- Minified and tree-shaken
- Ready for deployment

### Preview Production Build
```powershell
npm run preview
```
- Serves the production build locally
- Test before deploying

### Code Quality
```powershell
# Lint code
npm run lint

# Format code
npm run format
```

## 🎯 Mock Data Overview

The app comes pre-loaded with:
- **6 Products**: Various furniture items with images and pricing
- **3 Orders**: Different statuses and customer info
- **3 Suppliers**: Complete contact information
- **2 Purchase Records**: Historical purchase data
- **Dashboard Analytics**: KPIs, sales trends, top products

All data is stored in `src/lib/mockData.js` and can be modified.

## 🔐 Mock Authentication Details

### How It Works
1. Any email/password combination is accepted
2. Mock user created with:
   - ID: Auto-generated
   - Name: "Admin User"
   - Email: What you entered
   - Role: ADMIN (default)
3. Token stored in localStorage
4. User persists across page refreshes

### Testing Different Roles
Modify `src/contexts/AuthContext.jsx` to test different roles:
```javascript
const mockUser = {
  id: '1',
  name: 'Staff User',
  email: credentials.email,
  role: ROLES.STAFF, // Change this to STAFF or CUSTOMER
};
```

## 📋 Common Tasks

### Add New Product
1. Go to Inventory page
2. Click "Add Product"
3. Fill form:
   - Name: "Luxury Sofa"
   - Category: Select from dropdown
   - Material: Select material
   - Size: Select size
   - Price: 599.99
   - Stock: 10
   - Image URL: (optional)
4. Click "Create Product"

### Create Order
1. Go to Orders page
2. Click "Create Order"
3. Fill customer details
4. Click "Create Order"
5. View in order list

### View Reports
1. Go to Reports page (Admin only)
2. Change period (Daily/Weekly/Monthly)
3. Click "CSV" or "PDF" to export (placeholder)

## 🐛 Troubleshooting

### Port Already in Use
If port 3000 is taken:
1. Stop the process using port 3000
2. Or modify `vite.config.js` to use different port

### Dependencies Not Installing
```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules
Remove-Item -Recurse -Force node_modules

# Reinstall
npm install
```

### Build Errors
- Ensure Node.js version is 18+
- Check for syntax errors in files
- Run `npm run lint` to check for issues

## 📚 Next Steps

### Backend Integration
1. Set `VITE_USE_MOCK=false` in `.env`
2. Update `VITE_API_URL` to your backend
3. Ensure backend implements expected endpoints
4. Test with real data

### Customization
- Modify colors in `src/styles/index.css`
- Add new components in `src/components/`
- Update mock data in `src/lib/mockData.js`
- Add new pages in `src/pages/`

### Deployment
- Build: `npm run build`
- Deploy `dist/` folder to:
  - Vercel
  - Netlify
  - GitHub Pages
  - Your server

## ✅ Success Criteria Checklist

- [x] App builds and runs without errors
- [x] Landing, Login, Register pages match HTML design
- [x] Protected routes require authentication
- [x] Sidebar adapts to user role
- [x] Inventory page has full CRUD + filters
- [x] Orders page with status management
- [x] Dashboard with KPIs and charts
- [x] Reports with analytics
- [x] Suppliers and Purchases pages functional
- [x] Mock mode works without backend
- [x] Responsive on mobile devices
- [x] Forms validate with Zod
- [x] Toast notifications work
- [x] Pagination functions correctly

---

**Enjoy building with LuxeHome! 🏡✨**
