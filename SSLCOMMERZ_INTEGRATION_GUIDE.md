# SSLCommerz Payment Gateway Integration

## Overview
SSLCommerz payment gateway has been successfully integrated into your Furniture Management System. Customers can now make online payments using various payment methods including cards, mobile banking, and internet banking.

## Features Implemented

### Backend (Laravel)
1. **Payment Controller** - Handles all payment operations
   - Payment initiation
   - Success/failure/cancellation callbacks
   - Payment validation with SSLCommerz

2. **Payment Model** - Stores payment transactions
   - Transaction tracking
   - Payment status management
   - Payment response logging

3. **Database Migration** - `payments` table created with:
   - Transaction details
   - Payment status
   - SSLCommerz response data

### Frontend (React)
1. **Payment Integration** in Checkout Page
   - Online payment option
   - Cash on Delivery option
   - Automatic redirect to SSLCommerz gateway

2. **Payment Status Pages**
   - Payment Success page
   - Payment Failed page
   - Payment Cancelled page

## Configuration

### Backend (.env)
```env
# SSLCommerz Payment Gateway Configuration
SSLCOMMERZ_STORE_ID=testbox
SSLCOMMERZ_STORE_PASSWORD=qwerty
SSLCOMMERZ_SANDBOX=true
SSLCOMMERZ_SUCCESS_URL=http://localhost:8000/api/payment/success
SSLCOMMERZ_FAIL_URL=http://localhost:8000/api/payment/fail
SSLCOMMERZ_CANCEL_URL=http://localhost:8000/api/payment/cancel
FRONTEND_URL=http://localhost:3000
```

### Production Setup
1. Register at https://sslcommerz.com/
2. Get your Store ID and Store Password
3. Update `.env` file:
   ```env
   SSLCOMMERZ_STORE_ID=your_store_id
   SSLCOMMERZ_STORE_PASSWORD=your_store_password
   SSLCOMMERZ_SANDBOX=false
   ```

## API Endpoints

### Payment Initiation (Protected)
**POST** `/api/payment/initiate`
```json
{
  "order_id": 123
}
```

### Callback URLs (Public)
- **Success**: `/api/payment/success` (POST)
- **Fail**: `/api/payment/fail` (POST)
- **Cancel**: `/api/payment/cancel` (POST)

### Payment Status Check
**GET** `/api/payment/status/{orderId}`

## Payment Flow

1. **Customer** places an order and selects "Online Payment"
2. **Frontend** creates order and calls payment initiation API
3. **Backend** initializes SSLCommerz session and returns gateway URL
4. **Customer** is redirected to SSLCommerz payment page
5. **Customer** completes payment using their preferred method
6. **SSLCommerz** processes payment and calls callback URL
7. **Backend** validates payment and updates order status
8. **Customer** is redirected to success/failure page

## Database Schema

### Payments Table
```sql
- id (Primary Key)
- order_id (Foreign Key → orders)
- transaction_id (Unique)
- session_key
- validation_id
- amount (Decimal)
- status (pending/completed/failed/cancelled)
- payment_method (sslcommerz)
- card_type
- payment_response (JSON)
- timestamps
```

## Testing

### Sandbox Testing Credentials
- **Store ID**: testbox
- **Store Password**: qwerty

### Test Cards (Sandbox)
1. **Visa**: 4111111111111111
2. **MasterCard**: 5500000000000004
3. **AMEX**: 370000000000002

**Card Details:**
- CVV: Any 3 digits
- Expiry: Any future date

### Mobile Banking (Sandbox)
- Use any mobile number
- OTP: 123456

## Files Created/Modified

### Backend
- ✅ `app/Http/Controllers/PaymentController.php`
- ✅ `app/Models/Payment.php`
- ✅ `database/migrations/2026_01_18_000000_create_payments_table.php`
- ✅ `routes/api.php` (updated)
- ✅ `.env` (updated)

### Frontend
- ✅ `src/pages/PaymentSuccess.jsx`
- ✅ `src/pages/PaymentFailed.jsx`
- ✅ `src/pages/PaymentCancelled.jsx`
- ✅ `src/pages/CheckoutPage.jsx` (updated)
- ✅ `src/routes.jsx` (updated)
- ✅ `src/lib/apiClient.js` (already had payment endpoint)

## Usage

### For Customers
1. Add products to cart
2. Go to checkout
3. Fill in shipping information
4. Select "Online Payment" as payment method
5. Click "Place Order"
6. Complete payment on SSLCommerz gateway
7. Get redirected to success/failure page

### For Admins
1. View all orders in the Orders page
2. Check payment status for each order
3. Order status automatically updates after successful payment

## Troubleshooting

### Payment Not Initiating
- Check if `SSLCOMMERZ_STORE_ID` and `SSLCOMMERZ_STORE_PASSWORD` are set in `.env`
- Ensure payment migration has been run
- Check Laravel logs: `storage/logs/laravel.log`

### Callback Not Working
- Make sure callback URLs are accessible publicly
- For local testing, use ngrok to expose your localhost
- Verify callback URLs in `.env` are correct

### Payment Status Not Updating
- Check if callbacks are being received (check logs)
- Ensure payment validation is working
- Verify database connection

## Security Notes

1. **Never commit** your production credentials to version control
2. Use **environment variables** for sensitive data
3. Enable **SSL/TLS** in production
4. Implement **CSRF protection** (already enabled in Laravel)
5. Validate all **callback data** from SSLCommerz

## Support

For SSLCommerz support:
- Website: https://sslcommerz.com/
- Email: support@sslcommerz.com
- Documentation: https://developer.sslcommerz.com/

## Next Steps

1. ✅ Test payment flow in sandbox mode
2. ⏳ Register for production credentials
3. ⏳ Update `.env` with production credentials
4. ⏳ Test in production environment
5. ⏳ Go live!

---
**Integration Completed: January 18, 2026**
