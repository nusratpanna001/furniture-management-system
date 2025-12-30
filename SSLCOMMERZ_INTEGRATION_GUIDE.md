# SSLCommerz Payment Gateway Integration - Setup Guide

## 📋 Overview
This guide will help you integrate SSLCommerz payment gateway with your Furniture Management System.

## 🚀 Quick Start

### 1. Backend Setup (Laravel)

#### Step 1: Update Database Migration
The migration has already been updated to include `transaction_id` field in the orders table.

Run the migration:
```bash
cd BackEnd
php artisan migrate:fresh
```

#### Step 2: Configure Environment Variables
Add the following to your `BackEnd/.env` file:

```env
# SSLCommerz Configuration
SSLCOMMERZ_SANDBOX=true
SSLCOMMERZ_STORE_ID=testbox
SSLCOMMERZ_STORE_PASSWORD=qwerty
FRONTEND_URL=http://localhost:3000
```

**For Production:**
- Set `SSLCOMMERZ_SANDBOX=false`
- Replace `SSLCOMMERZ_STORE_ID` and `SSLCOMMERZ_STORE_PASSWORD` with your actual credentials from SSLCommerz
- Update `FRONTEND_URL` to your production frontend URL

#### Step 3: Start Backend Server
```bash
php artisan serve
```

The backend should be running at `http://localhost:8000`

---

### 2. Frontend Setup (React)

The frontend code has already been updated. Just make sure your frontend is running:

```bash
cd FrontEnd
npm run dev
```

The frontend should be running at `http://localhost:3000`

---

## 🔄 How It Works

### Payment Flow:

1. **User fills checkout form** and selects "Online Payment (SSLCommerz)"
2. **Order is created** in your database with `payment_status = 'unpaid'`
3. **Backend calls SSLCommerz API** to initiate payment session
4. **User is redirected** to SSLCommerz payment gateway
5. **User completes payment** on SSLCommerz page
6. **SSLCommerz redirects back** to your application:
   - **Success**: `/payment-success?order_id=X&tran_id=Y`
   - **Fail/Cancel**: `/payment-fail?tran_id=Y`
7. **Backend validates payment** and updates order status
8. **User sees confirmation** page with order details

---

## 📁 Files Created/Modified

### Backend Files:
- ✅ `app/Http/Controllers/PaymentController.php` - Payment handling logic
- ✅ `routes/api.php` - Payment routes added
- ✅ `database/migrations/*_create_orders_table.php` - Added transaction_id field
- ✅ `.env.sslcommerz.example` - Environment variable template

### Frontend Files:
- ✅ `src/pages/CheckoutPage.jsx` - Updated with SSLCommerz integration
- ✅ `src/pages/PaymentSuccessPage.jsx` - Success confirmation page
- ✅ `src/pages/PaymentFailPage.jsx` - Failure/cancellation page
- ✅ `src/routes.jsx` - Added payment success/fail routes

---

## 🧪 Testing (Sandbox Mode)

### SSLCommerz Sandbox Test Cards:

**Visa Card:**
- Card Number: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date

**Mastercard:**
- Card Number: `5555 5555 5555 4444`
- CVV: Any 3 digits
- Expiry: Any future date

### Test Flow:
1. Go to `http://localhost:3000/checkout`
2. Fill in shipping information
3. Select "Online Payment (SSLCommerz)"
4. Click "Place Order"
5. You'll be redirected to SSLCommerz sandbox
6. Use test card details above
7. Complete payment
8. You'll be redirected back to success/fail page

---

## 🔐 Production Deployment

### Get SSLCommerz Credentials:
1. Register at [SSLCommerz](https://www.sslcommerz.com/)
2. Complete KYC verification
3. Get your Store ID and Store Password
4. Update `.env` file with production credentials:

```env
SSLCOMMERZ_SANDBOX=false
SSLCOMMERZ_STORE_ID=your_actual_store_id
SSLCOMMERZ_STORE_PASSWORD=your_actual_store_password
FRONTEND_URL=https://your-domain.com
```

### Important Production Notes:
- Enable HTTPS for your application
- Set proper CORS settings
- Test thoroughly with real cards before going live
- Monitor payment logs regularly

---

## 🛠️ API Endpoints

### Payment Routes:

#### Initiate Payment (Protected)
```
POST /api/payment/initiate
Authorization: Bearer {token}

Body:
{
  "order_id": 1,
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "customer_phone": "01712345678",
  "amount": 5000.00
}

Response:
{
  "success": true,
  "gateway_url": "https://sandbox.sslcommerz.com/...",
  "transaction_id": "ORDER-1-1703936400"
}
```

#### Payment Callbacks (Public - Called by SSLCommerz)
```
POST /api/payment/success
POST /api/payment/fail
POST /api/payment/cancel
```

---

## 🐛 Troubleshooting

### Common Issues:

**1. "Failed to initiate online payment"**
- Check if backend is running
- Verify SSLCOMMERZ credentials in .env
- Check network connectivity

**2. "Transaction ID already exists"**
- This is a database constraint error
- Each transaction must be unique
- Clear test data: `php artisan migrate:fresh`

**3. Payment success but order not updated**
- Check backend logs: `storage/logs/laravel.log`
- Verify payment validation logic
- Ensure frontend and backend URLs are correct

**4. CORS errors**
- Update `config/cors.php` with proper origins
- Add frontend URL to allowed origins

---

## 📊 Database Schema

### Orders Table (Updated):
```sql
- id
- user_id
- order_number
- subtotal
- tax
- shipping
- total
- status (pending/processing/shipped/delivered/cancelled)
- payment_method (cod/online)
- payment_status (unpaid/paid/failed/cancelled/refunded)
- transaction_id (unique, for online payments) ⬅️ NEW
- shipping_address
- customer_name
- customer_phone
- notes
- timestamps
```

---

## 📞 Support

For SSLCommerz integration issues:
- SSLCommerz Documentation: https://developer.sslcommerz.com/
- SSLCommerz Support: https://www.sslcommerz.com/contact/

---

## ✅ Checklist

- [ ] Backend migration ran successfully
- [ ] Environment variables configured
- [ ] Backend server running
- [ ] Frontend server running
- [ ] Test payment in sandbox mode successful
- [ ] Success page displays correctly
- [ ] Fail page displays correctly
- [ ] Order status updates after payment
- [ ] Cart clears after successful payment

---

## 🎉 That's it!

Your SSLCommerz payment gateway is now integrated. Test it thoroughly in sandbox mode before going to production.
