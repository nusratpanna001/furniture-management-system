<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    /**
     * Initialize payment with SSLCommerz
     */
    public function initiatePayment(Request $request)
    {
        \Log::info('Payment initiation started', ['request_data' => $request->all()]);
        
        try {
            $validated = $request->validate([
                'order_id' => 'required|exists:orders,id',
            ]);

            \Log::info('Payment validation passed', ['order_id' => $validated['order_id']]);
            
            $order = Order::with('items.product', 'user')->findOrFail($validated['order_id']);
            
            \Log::info('Order loaded', ['order_number' => $order->order_number, 'total' => $order->total]);

            // Check if order is already paid
            if ($order->payment_status === 'paid') {
                return response()->json([
                    'success' => false,
                    'message' => 'This order has already been paid'
                ], 400);
            }

            // SSLCommerz configuration
            $post_data = array();
            $post_data['store_id'] = env('SSLCOMMERZ_STORE_ID');
            $post_data['store_passwd'] = env('SSLCOMMERZ_STORE_PASSWORD');
            $post_data['total_amount'] = $order->total;
            $post_data['currency'] = 'BDT';
            $post_data['tran_id'] = 'TRANS_' . $order->order_number . '_' . time();
            $post_data['success_url'] = env('SSLCOMMERZ_SUCCESS_URL', env('APP_URL') . '/api/payment/success');
            $post_data['fail_url'] = env('SSLCOMMERZ_FAIL_URL', env('APP_URL') . '/api/payment/fail');
            $post_data['cancel_url'] = env('SSLCOMMERZ_CANCEL_URL', env('APP_URL') . '/api/payment/cancel');
            
            // Customer information
            $post_data['cus_name'] = $order->customer_name ?? $order->user->name;
            $post_data['cus_email'] = $order->user->email;
            $post_data['cus_phone'] = $order->customer_phone ?? '01700000000';
            $post_data['cus_add1'] = $order->shipping_address ?? 'Dhaka';
            $post_data['cus_city'] = 'Dhaka';
            $post_data['cus_country'] = 'Bangladesh';
            
            // Shipment information
            $post_data['shipping_method'] = 'NO';
            $post_data['product_name'] = 'Order #' . $order->order_number;
            $post_data['product_category'] = 'Furniture';
            $post_data['product_profile'] = 'general';

            // Create payment record
            \Log::info('Creating payment record', ['order_id' => $order->id, 'tran_id' => $post_data['tran_id']]);
            
            $payment = Payment::create([
                'order_id' => $order->id,
                'transaction_id' => $post_data['tran_id'],
                'amount' => $order->total,
                'status' => 'pending',
                'payment_method' => 'sslcommerz',
            ]);

            \Log::info('Payment record created', ['payment_id' => $payment->id]);

            // Determine SSLCommerz endpoint
            $direct_api_url = env('SSLCOMMERZ_SANDBOX', true) 
                ? "https://sandbox.sslcommerz.com/gwprocess/v4/api.php"
                : "https://securepay.sslcommerz.com/gwprocess/v4/api.php";

            // Initialize cURL
            $handle = curl_init();
            curl_setopt($handle, CURLOPT_URL, $direct_api_url);
            curl_setopt($handle, CURLOPT_TIMEOUT, 30);
            curl_setopt($handle, CURLOPT_CONNECTTIMEOUT, 30);
            curl_setopt($handle, CURLOPT_POST, 1);
            curl_setopt($handle, CURLOPT_POSTFIELDS, http_build_query($post_data));
            curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($handle, CURLOPT_SSL_VERIFYPEER, false);

            $content = curl_exec($handle);
            $code = curl_getinfo($handle, CURLINFO_HTTP_CODE);
            
            \Log::info('SSLCommerz API Response', [
                'status_code' => $code,
                'response' => $content,
                'curl_error' => curl_errno($handle) ? curl_error($handle) : 'none'
            ]);

            if ($code == 200 && !(curl_errno($handle))) {
                curl_close($handle);
                $sslcommerzResponse = json_decode($content, true);
                
                \Log::info('SSLCommerz Response Decoded', [
                    'has_gateway_url' => isset($sslcommerzResponse['GatewayPageURL']),
                    'gateway_url' => $sslcommerzResponse['GatewayPageURL'] ?? 'not set',
                    'status' => $sslcommerzResponse['status'] ?? 'not set'
                ]);

                if (isset($sslcommerzResponse['GatewayPageURL']) && $sslcommerzResponse['GatewayPageURL'] != "") {
                    // Update payment with session key
                    $payment->update([
                        'session_key' => $sslcommerzResponse['sessionkey'] ?? null,
                    ]);

                    $responseData = [
                        'success' => true,
                        'message' => 'Payment gateway initialized successfully',
                        'data' => [
                            'payment_url' => $sslcommerzResponse['GatewayPageURL'],
                            'transaction_id' => $post_data['tran_id'],
                        ]
                    ];
                    
                    \Log::info('Sending payment response', $responseData);
                    
                    return response()->json($responseData);
                } else {
                    return response()->json([
                        'success' => false,
                        'message' => 'Payment gateway initialization failed',
                        'error' => $sslcommerzResponse['failedreason'] ?? 'Unknown error'
                    ], 400);
                }
            } else {
                curl_close($handle);
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to connect to payment gateway'
                ], 500);
            }

        } catch (\Exception $e) {
            Log::error('Payment initiation error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while processing payment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Payment success callback
     */
    public function paymentSuccess(Request $request)
    {
        try {
            Log::info('Payment success callback received', $request->all());

            $tran_id = $request->input('tran_id');
            $val_id = $request->input('val_id');
            $amount = $request->input('amount');
            $card_type = $request->input('card_type');

            // Validate payment with SSLCommerz
            $validation = $this->validatePayment($val_id);

            if ($validation['status'] === 'VALID' || $validation['status'] === 'VALIDATED') {
                // Find payment record
                $payment = Payment::where('transaction_id', $tran_id)->first();

                if ($payment) {
                    DB::beginTransaction();
                    try {
                        // Update payment
                        $payment->update([
                            'status' => 'completed',
                            'validation_id' => $val_id,
                            'card_type' => $card_type,
                            'payment_response' => json_encode($request->all()),
                        ]);

                        // Update order
                        $order = Order::find($payment->order_id);
                        $order->update([
                            'payment_status' => 'paid',
                            'payment_method' => 'SSLCommerz',
                            'status' => 'processing',
                        ]);

                        DB::commit();

                        // Redirect to frontend success page
                        $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');
                        return redirect($frontendUrl . '/payment/success?order=' . $order->order_number);

                    } catch (\Exception $e) {
                        DB::rollBack();
                        Log::error('Payment update error: ' . $e->getMessage());
                        $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');
                        return redirect($frontendUrl . '/payment/failed');
                    }
                }
            }

            // If validation fails
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');
            return redirect($frontendUrl . '/payment/failed');

        } catch (\Exception $e) {
            Log::error('Payment success callback error: ' . $e->getMessage());
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');
            return redirect($frontendUrl . '/payment/failed');
        }
    }

    /**
     * Payment failed callback
     */
    public function paymentFail(Request $request)
    {
        try {
            Log::info('Payment failed callback received', $request->all());

            $tran_id = $request->input('tran_id');

            $payment = Payment::where('transaction_id', $tran_id)->first();
            if ($payment) {
                $payment->update([
                    'status' => 'failed',
                    'payment_response' => json_encode($request->all()),
                ]);
            }

            $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');
            return redirect($frontendUrl . '/payment/failed?reason=payment_failed');

        } catch (\Exception $e) {
            Log::error('Payment fail callback error: ' . $e->getMessage());
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');
            return redirect($frontendUrl . '/payment/failed');
        }
    }

    /**
     * Payment cancelled callback
     */
    public function paymentCancel(Request $request)
    {
        try {
            Log::info('Payment cancelled callback received', $request->all());

            $tran_id = $request->input('tran_id');

            $payment = Payment::where('transaction_id', $tran_id)->first();
            if ($payment) {
                $payment->update([
                    'status' => 'cancelled',
                    'payment_response' => json_encode($request->all()),
                ]);
            }

            $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');
            return redirect($frontendUrl . '/payment/cancelled');

        } catch (\Exception $e) {
            Log::error('Payment cancel callback error: ' . $e->getMessage());
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');
            return redirect($frontendUrl . '/payment/cancelled');
        }
    }

    /**
     * Validate payment with SSLCommerz
     */
    private function validatePayment($val_id)
    {
        $store_id = env('SSLCOMMERZ_STORE_ID');
        $store_passwd = env('SSLCOMMERZ_STORE_PASSWORD');
        
        $validation_url = env('SSLCOMMERZ_SANDBOX', true)
            ? "https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php"
            : "https://securepay.sslcommerz.com/validator/api/validationserverAPI.php";

        $validation_url .= "?val_id=" . $val_id . "&store_id=" . $store_id . "&store_passwd=" . $store_passwd . "&v=1&format=json";

        $handle = curl_init();
        curl_setopt($handle, CURLOPT_URL, $validation_url);
        curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($handle, CURLOPT_SSL_VERIFYPEER, false);

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

    /**
     * Get payment status
     */
    public function getPaymentStatus($orderId)
    {
        try {
            $order = Order::findOrFail($orderId);
            $payment = Payment::where('order_id', $orderId)->latest()->first();

            return response()->json([
                'success' => true,
                'data' => [
                    'order_number' => $order->order_number,
                    'payment_status' => $order->payment_status,
                    'total' => $order->total,
                    'payment' => $payment
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }
    }
}
