<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    private $store_id;
    private $store_password;
    private $api_url;
    private $is_sandbox;

    public function __construct()
    {
        // SSLCommerz Sandbox Credentials (for testing)
        $this->store_id = env('SSLCOMMERZ_STORE_ID', 'testbox');
        $this->store_password = env('SSLCOMMERZ_STORE_PASSWORD', 'qwerty');
        $this->is_sandbox = env('SSLCOMMERZ_SANDBOX', true);
        
        // API URL
        $this->api_url = $this->is_sandbox 
            ? 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php'
            : 'https://securepay.sslcommerz.com/gwprocess/v4/api.php';
    }

    /**
     * Initiate SSLCommerz Payment
     */
    public function initiatePayment(Request $request)
    {
        try {
            \Log::info('Payment initiation request received', ['data' => $request->all()]);
            
            $validated = $request->validate([
                'order_id' => 'required|exists:orders,id',
                'customer_name' => 'required|string',
                'customer_email' => 'required|email',
                'customer_phone' => 'required|string',
                'amount' => 'required|numeric',
            ]);

            \Log::info('Validation passed', ['validated' => $validated]);

            $order = Order::findOrFail($validated['order_id']);
            
            // Check if order belongs to authenticated user
            if ($order->user_id !== $request->user()->id) {
                \Log::error('Unauthorized payment attempt', ['order_user' => $order->user_id, 'request_user' => $request->user()->id]);
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to order'
                ], 403);
            }

            // Generate unique transaction ID
            $tran_id = 'ORDER-' . $order->id . '-' . time();

            \Log::info('Transaction ID generated', ['tran_id' => $tran_id]);

            // Update order with transaction ID
            $order->transaction_id = $tran_id;
            $order->save();

            // Base URL for callbacks
            $base_url = env('FRONTEND_URL', 'http://localhost:3000');
            $backend_url = env('APP_URL', 'http://localhost:8000');

            \Log::info('URLs configured', ['frontend' => $base_url, 'backend' => $backend_url]);

            // SSLCommerz Payment Data
            $post_data = array();
            $post_data['store_id'] = $this->store_id;
            $post_data['store_passwd'] = $this->store_password;
            $post_data['total_amount'] = $validated['amount'];
            $post_data['currency'] = 'BDT';
            $post_data['tran_id'] = $tran_id;
            $post_data['success_url'] = $backend_url . '/api/payment/success';
            $post_data['fail_url'] = $backend_url . '/api/payment/fail';
            $post_data['cancel_url'] = $backend_url . '/api/payment/cancel';

            // Customer Information
            $post_data['cus_name'] = $validated['customer_name'];
            $post_data['cus_email'] = $validated['customer_email'];
            $post_data['cus_add1'] = $order->shipping_address ?? 'N/A';
            $post_data['cus_city'] = 'Dhaka';
            $post_data['cus_country'] = 'Bangladesh';
            $post_data['cus_phone'] = $validated['customer_phone'];

            // Product Information
            $post_data['product_name'] = 'Furniture Order #' . $order->id;
            $post_data['product_category'] = 'Furniture';
            $post_data['product_profile'] = 'general';
            
            // Disable EMI completely to prevent sandbox errors
            $post_data['emi_option'] = 0;
            $post_data['emi_max_inst_option'] = 0;
            $post_data['emi_selected_inst'] = 0;
            $post_data['emi_allow_only'] = 0;

            // Shipment Information (Required by SSLCommerz)
            $post_data['shipping_method'] = 'YES';
            $post_data['num_of_item'] = $order->items->count();
            $post_data['ship_name'] = $validated['customer_name'];
            $post_data['ship_add1'] = $order->shipping_address ?? 'N/A';
            $post_data['ship_city'] = 'Dhaka';
            $post_data['ship_postcode'] = '1000';
            $post_data['ship_country'] = 'Bangladesh';

            // Call SSLCommerz API
            \Log::info('Calling SSLCommerz API', ['api_url' => $this->api_url, 'post_data' => $post_data]);
            
            $handle = curl_init();
            curl_setopt($handle, CURLOPT_URL, $this->api_url);
            curl_setopt($handle, CURLOPT_TIMEOUT, 30);
            curl_setopt($handle, CURLOPT_CONNECTTIMEOUT, 30);
            curl_setopt($handle, CURLOPT_POST, 1);
            curl_setopt($handle, CURLOPT_POSTFIELDS, $post_data);
            curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($handle, CURLOPT_SSL_VERIFYPEER, FALSE);

            $content = curl_exec($handle);
            $code = curl_getinfo($handle, CURLINFO_HTTP_CODE);
            $curl_error = curl_error($handle);

            \Log::info('SSLCommerz API response', ['code' => $code, 'content' => $content, 'curl_error' => $curl_error]);

            if ($code == 200 && !(curl_errno($handle))) {
                curl_close($handle);
                $sslcommerzResponse = json_decode($content, true);

                \Log::info('SSLCommerz response decoded', ['response' => $sslcommerzResponse]);

                if (isset($sslcommerzResponse['GatewayPageURL']) && $sslcommerzResponse['GatewayPageURL'] != "") {
                    \Log::info('Gateway URL received', ['url' => $sslcommerzResponse['GatewayPageURL']]);
                    // Return the gateway URL to frontend
                    return response()->json([
                        'success' => true,
                        'gateway_url' => $sslcommerzResponse['GatewayPageURL'],
                        'transaction_id' => $tran_id,
                    ]);
                } else {
                    \Log::error('No Gateway URL in response', ['response' => $sslcommerzResponse]);
                    return response()->json([
                        'success' => false,
                        'message' => 'Failed to get payment gateway URL',
                        'error' => $sslcommerzResponse
                    ], 400);
                }
            } else {
                curl_close($handle);
                \Log::error('SSLCommerz API call failed', ['code' => $code, 'error' => $curl_error]);
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to connect to payment gateway',
                    'error' => $curl_error
                ], 500);
            }

        } catch (\Exception $e) {
            \Log::error('Payment initiation exception', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json([
                'success' => false,
                'message' => 'Payment initiation failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Payment Success Callback
     */
    public function paymentSuccess(Request $request)
    {
        $tran_id = $request->input('tran_id');
        $val_id = $request->input('val_id');
        $amount = $request->input('amount');
        $card_type = $request->input('card_type');

        // Validate the payment
        $validation = $this->validatePayment($val_id);

        if ($validation['status'] === 'VALID' || $validation['status'] === 'VALIDATED') {
            // Find order by transaction ID
            $order = Order::where('transaction_id', $tran_id)->first();

            if ($order) {
                // Update order status
                $order->payment_status = 'paid';
                $order->status = 'confirmed';
                $order->save();

                // Redirect to frontend success page
                $frontend_url = env('FRONTEND_URL', 'http://localhost:3000');
                return redirect($frontend_url . '/payment-success?order_id=' . $order->id . '&tran_id=' . $tran_id);
            }
        }

        // If validation fails, redirect to fail page
        $frontend_url = env('FRONTEND_URL', 'http://localhost:3000');
        return redirect($frontend_url . '/payment-fail?tran_id=' . $tran_id);
    }

    /**
     * Payment Fail Callback
     */
    public function paymentFail(Request $request)
    {
        $tran_id = $request->input('tran_id');
        
        // Find order and update status
        $order = Order::where('transaction_id', $tran_id)->first();
        
        if ($order) {
            $order->payment_status = 'failed';
            $order->save();
        }

        // Redirect to frontend fail page
        $frontend_url = env('FRONTEND_URL', 'http://localhost:3000');
        return redirect($frontend_url . '/payment-fail?tran_id=' . $tran_id);
    }

    /**
     * Payment Cancel Callback
     */
    public function paymentCancel(Request $request)
    {
        $tran_id = $request->input('tran_id');
        
        // Find order and update status
        $order = Order::where('transaction_id', $tran_id)->first();
        
        if ($order) {
            $order->payment_status = 'cancelled';
            $order->save();
        }

        // Redirect to frontend cancel page
        $frontend_url = env('FRONTEND_URL', 'http://localhost:3000');
        return redirect($frontend_url . '/payment-fail?tran_id=' . $tran_id . '&status=cancelled');
    }

    /**
     * Validate SSLCommerz Payment
     */
    private function validatePayment($val_id)
    {
        $validation_url = $this->is_sandbox 
            ? 'https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php'
            : 'https://securepay.sslcommerz.com/validator/api/validationserverAPI.php';

        $val_data = array(
            'val_id' => $val_id,
            'store_id' => $this->store_id,
            'store_passwd' => $this->store_password,
            'format' => 'json'
        );

        $handle = curl_init();
        curl_setopt($handle, CURLOPT_URL, $validation_url);
        curl_setopt($handle, CURLOPT_TIMEOUT, 30);
        curl_setopt($handle, CURLOPT_CONNECTTIMEOUT, 30);
        curl_setopt($handle, CURLOPT_POST, 1);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $val_data);
        curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($handle, CURLOPT_SSL_VERIFYPEER, FALSE);

        $result = curl_exec($handle);
        $code = curl_getinfo($handle, CURLINFO_HTTP_CODE);

        if ($code == 200 && !(curl_errno($handle))) {
            curl_close($handle);
            return json_decode($result, true);
        } else {
            curl_close($handle);
            return ['status' => 'FAILED'];
        }
    }
}
