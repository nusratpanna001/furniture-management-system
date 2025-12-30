# SSLCommerz Integration Troubleshooting Guide

## Common Issues and Solutions

### Issue 1: Not redirecting to SSLCommerz page

#### Check these steps:

1. **Check Browser Console**
   - Open browser DevTools (F12)
   - Go to Console tab
   - Look for any errors when clicking "Place Order"

2. **Check Network Tab**
   - Open DevTools → Network tab
   - Click "Place Order" with online payment selected
   - Look for the `/api/payment/initiate` request
   - Check the response

3. **Check Laravel Logs**
   ```bash
   cd BackEnd
   tail -f storage/logs/laravel.log
   ```
   - Watch for logs when placing order
   - Look for "Payment initiation request received"

4. **Verify Environment Variables**
   
   Check `BackEnd/.env` file has:
   ```env
   SSLCOMMERZ_SANDBOX=true
   SSLCOMMERZ_STORE_ID=testbox
   SSLCOMMERZ_STORE_PASSWORD=qwerty
   FRONTEND_URL=http://localhost:3000
   APP_URL=http://localhost:8000
   ```

5. **Test Backend API Directly**
   
   Use Postman or curl to test:
   ```bash
   # First, login and get token
   curl -X POST http://localhost:8000/api/login \
     -H "Content-Type: application/json" \
     -d '{"email":"user@example.com","password":"password"}'
   
   # Then test payment initiation (replace TOKEN and order_id)
   curl -X POST http://localhost:8000/api/payment/initiate \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{
       "order_id": 1,
       "customer_name": "Test User",
       "customer_email": "test@example.com",
       "customer_phone": "01712345678",
       "amount": 1000
     }'
   ```

6. **Check if curl is enabled in PHP**
   ```bash
   php -m | grep curl
   ```
   Should show "curl"

7. **Test SSLCommerz Connection**
   
   Create a test file: `BackEnd/test_sslcommerz.php`
   ```php
   <?php
   
   $api_url = 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php';
   
   $post_data = array();
   $post_data['store_id'] = 'testbox';
   $post_data['store_passwd'] = 'qwerty';
   $post_data['total_amount'] = '100';
   $post_data['currency'] = 'BDT';
   $post_data['tran_id'] = 'TEST-' . time();
   $post_data['success_url'] = 'http://localhost:8000/success';
   $post_data['fail_url'] = 'http://localhost:8000/fail';
   $post_data['cancel_url'] = 'http://localhost:8000/cancel';
   $post_data['cus_name'] = 'Test Customer';
   $post_data['cus_email'] = 'test@example.com';
   $post_data['cus_add1'] = 'Test Address';
   $post_data['cus_city'] = 'Dhaka';
   $post_data['cus_country'] = 'Bangladesh';
   $post_data['cus_phone'] = '01712345678';
   $post_data['product_name'] = 'Test Product';
   $post_data['product_category'] = 'general';
   $post_data['product_profile'] = 'general';
   $post_data['shipping_method'] = 'NO';
   
   $handle = curl_init();
   curl_setopt($handle, CURLOPT_URL, $api_url);
   curl_setopt($handle, CURLOPT_TIMEOUT, 30);
   curl_setopt($handle, CURLOPT_CONNECTTIMEOUT, 30);
   curl_setopt($handle, CURLOPT_POST, 1);
   curl_setopt($handle, CURLOPT_POSTFIELDS, $post_data);
   curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
   curl_setopt($handle, CURLOPT_SSL_VERIFYPEER, FALSE);
   
   $content = curl_exec($handle);
   $code = curl_getinfo($handle, CURLINFO_HTTP_CODE);
   $error = curl_error($handle);
   
   echo "HTTP Code: $code\n";
   echo "Error: $error\n";
   echo "Response: $content\n";
   
   $response = json_decode($content, true);
   print_r($response);
   
   if (isset($response['GatewayPageURL'])) {
       echo "\n\nGateway URL: " . $response['GatewayPageURL'] . "\n";
   }
   ```
   
   Run it:
   ```bash
   php BackEnd/test_sslcommerz.php
   ```

### Common Error Messages:

#### "Failed to initiate online payment"
- Check backend is running
- Check authentication token is valid
- Check order was created successfully

#### "Failed to connect to payment gateway"
- Check internet connection
- Check curl is enabled
- Check PHP has openssl extension

#### "No gateway URL in response"
- Check SSLCommerz credentials are correct
- Check all required fields are sent
- Check SSLCommerz API response in logs

#### Console error: "api.payment.initiate is not a function"
- Clear browser cache
- Restart frontend dev server
- Check apiClient.js was updated correctly

### Debug Checklist:

- [ ] Backend server running on port 8000
- [ ] Frontend server running on port 3000
- [ ] User is logged in
- [ ] Order created successfully (check browser console)
- [ ] Environment variables set in .env
- [ ] curl extension enabled in PHP
- [ ] Internet connection working
- [ ] Browser console shows no errors
- [ ] Network tab shows /api/payment/initiate request
- [ ] Laravel logs show payment initiation

### Quick Fix Commands:

```bash
# Restart backend
cd BackEnd
php artisan config:clear
php artisan cache:clear
php artisan serve

# Restart frontend (in another terminal)
cd FrontEnd
npm run dev
```

### Still not working?

Check the browser console and Laravel logs, then share:
1. Browser console error messages
2. Network tab response for /api/payment/initiate
3. Laravel log entries (last 20 lines)
