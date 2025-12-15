# LuxeHome Furniture Management System - Frontend

A modern, full-featured furniture management system built with **React 19**, **Vite**, and **Tailwind CSS v4**.

## 🚀 Features

- **Modern Tech Stack**: React 19, Vite, Tailwind CSS v4
- **Authentication**: Login/Register with mock authentication
- **Role-Based Access Control (RBAC)**: Admin, Staff, and Customer roles
- **Inventory Management**: Full CRUD operations for products with filtering and search
- **Order Management**: Track orders with status workflows and timeline views
- **Suppliers Management**: Manage supplier information and contacts
- **Purchase Tracking**: Record and track inventory purchases
- **Dashboard**: KPI cards, charts, and analytics
- **Reports**: Sales trends, top products, and low stock alerts
- **Responsive Design**: Mobile-first design with adaptive layouts
- **Mock Mode**: Fully functional without backend using mock data

## 📁 Project Structure

```
apps/frontend/
├── public/              # Static assets
├── src/
│   ├── assets/         # Images, icons
│   ├── components/
│   │   ├── layout/     # AppLayout, Sidebar, Topbar, Footer
│   │   ├── ui/         # Reusable UI components (Button, Input, Card, etc.)
│   │   ├── product/    # Product-specific components
│   │   ├── order/      # Order-specific components
│   │   └── routes/     # PublicRoute, ProtectedRoute
│   ├── contexts/       # AuthContext, ToastContext
│   ├── hooks/          # Custom hooks (useAuth, useDebounce, usePagination)
│   ├── lib/            # Utilities, constants, API client, RBAC
│   ├── pages/          # Page components
│   ├── styles/         # Global styles
│   ├── App.jsx         # Root component
│   ├── main.jsx        # Entry point
│   └── routes.jsx      # Route configuration
├── .env                # Environment variables
├── .eslintrc.cjs       # ESLint configuration
├── .prettierrc         # Prettier configuration
├── index.html          # HTML template
├── package.json        # Dependencies and scripts
├── vite.config.js      # Vite configuration
└── README.md           # This file
```

## 🛠️ Setup & Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation Steps

1. **Navigate to the frontend directory**:
   ```powershell
   cd apps/frontend
   ```

2. **Install dependencies**:
   ```powershell
   npm install
   ```

3. **Configure environment variables**:
   The `.env` file is already configured with mock mode enabled:
   ```env
   VITE_APP_NAME=LuxeHome Furniture
   VITE_API_URL=http://localhost:5000/api
   VITE_USE_MOCK=true
   ```

4. **Start the development server**:
   ```powershell
   npm run dev
   ```

   The app will open at `http://localhost:3000`

## 📜 Available Scripts

- **`npm run dev`** - Start development server
- **`npm run build`** - Build for production
- **`npm run preview`** - Preview production build
- **`npm run lint`** - Run ESLint
- **`npm run format`** - Format code with Prettier

## 🔑 Mock Authentication

The app runs in **mock mode** by default (`VITE_USE_MOCK=true`).

### Login Credentials

You can log in with **any email and password**. Mock users are created automatically:

- **Email**: `admin@luxehome.com` (or any email)
- **Password**: `password` (or any password)
- **Role**: Admin (default in mock mode)

After login, you'll be assigned a mock user with admin privileges.

### Mock Data

The app includes pre-populated mock data for:
- **6 Products** (furniture items with images, prices, stock)
- **3 Orders** (with different statuses and customer info)
- **3 Suppliers** (with contact details)
- **2 Purchase Records**
- **Dashboard Analytics** (KPIs, charts, trends)

All CRUD operations work in mock mode with optimistic UI updates.

## 🎨 Features by Page

### Landing Page (`/`)
- Hero section with background image
- Product categories showcase
- Trending products carousel
- Newsletter subscription
- Responsive navbar and footer

### Login Page (`/login`)
- Email/password form with validation
- Remember me checkbox
- Forgot password link
- Redirects to register page

### Register Page (`/register`)
- Full name, email, password fields
- Password confirmation
- Terms & conditions checkbox
- Form validation with inline errors
- Disabled submit until form is valid

### Dashboard (`/dashboard`)
- KPI cards (Revenue, Orders, Products, Low Stock)
- Sales trend line chart
- Top products bar chart
- Tables for top sellers and low stock items

### Inventory (`/inventory`)
- Product list with images, pricing, stock levels
- Filters (search, category, material, price range, in-stock only)
- CRUD operations (Create, Read, Update, Delete)
- Low stock badges
- Pagination

### Orders (`/orders`)
- Order table with customer info, status, totals
- Status filters (Pending, In Progress, Delivered, Cancelled)
- Create/edit/delete orders
- Navigate to order details

### Order Details (`/orders/:id`)
- Order timeline with visual status tracking
- Customer information card
- Payment details
- Order items table with totals
- Quick action buttons (update status, cancel order)

### Suppliers (`/suppliers`)
- Supplier list with contact information
- Add/edit/delete suppliers
- Modal forms

### Purchases (`/purchases`)
- Purchase records from suppliers
- Items received and total spent
- Purchase date tracking

### Reports (`/reports`)
- Sales trend charts
- Top products analysis
- Low stock alerts
- Export buttons (CSV/PDF placeholders)
- Period selector (Daily/Weekly/Monthly)

## 🎯 Role-Based Access

The sidebar adapts based on user role:

- **Admin**: Full access to all modules
- **Staff**: Access to Inventory, Orders, Purchases, Dashboard
- **Customer**: Access to Dashboard, Orders (view only)

## 🧩 Key Technologies

- **React 19** - Latest React with improved performance
- **Vite** - Lightning-fast build tool
- **Tailwind CSS v4** - Utility-first CSS framework
- **React Router v6** - Client-side routing
- **React Hook Form** - Form state management
- **Zod** - Schema validation
- **Axios** - HTTP client
- **Recharts** - Charting library
- **Lucide React** - Icon library

## 🔧 Customization

### Toggle Backend Mode

To connect to a real backend:

1. Update `.env`:
   ```env
   VITE_USE_MOCK=false
   VITE_API_URL=http://your-backend-url/api
   ```

2. Ensure your backend implements the expected API endpoints (see `src/lib/apiClient.js`)

### Styling

- **Theme tokens** are defined in `src/styles/index.css`
- **Tailwind config** uses Tailwind v4 with `@tailwindcss/vite` plugin
- **Component styles** use Tailwind utility classes

## 📝 Notes & Assumptions

### Assumptions
- Mock mode provides a fully functional UI without a backend
- Image URLs use placeholders and Unsplash for demonstration
- Authentication in mock mode accepts any credentials
- All mock users are assigned the Admin role by default

### TODOs (Backend Integration Required)
- Real authentication with JWT tokens
- Image upload functionality
- Email verification
- Password reset flow
- Real-time notifications
- Advanced filtering and search
- PDF/CSV export implementation
- Payment gateway integration

## 🐛 Known Issues

- Tailwind CSS errors in `index.css` are cosmetic (CSS linter doesn't recognize Tailwind v4 syntax)
- The app is designed for modern browsers (Chrome, Firefox, Safari, Edge)

## 📞 Support

For issues or questions, contact: **support@luxehome.com**

---

Built with ❤️ using React 19, Vite, and Tailwind CSS
