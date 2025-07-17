import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { CheckCircle, ArrowLeft, Home, Mail, Phone } from 'lucide-react';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  
  const transactionId = searchParams.get('transactionId');
  const amount = searchParams.get('amount');
  const confirmationId = searchParams.get('confirmationId');
  
  useEffect(() => {
    console.log('🎉 Payment Success page loaded');
    console.log('Transaction ID:', transactionId);
    console.log('Amount:', amount);
    console.log('Confirmation ID:', confirmationId);
    console.log('🔍 Full URL params:', Object.fromEntries(searchParams.entries()));
    
    if (transactionId && amount && confirmationId) {
      fetchPaymentDetails();
    } else {
      console.log('⚠️ Missing URL parameters, showing generic success');
      setLoading(false);
    }
  }, [transactionId, amount, confirmationId]);

  const fetchPaymentDetails = async () => {
    try {
      // Có thể gọi API để lấy chi tiết thanh toán nếu cần
      // Hiện tại chỉ sử dụng data từ URL params
      setPaymentData({
        transactionId,
        amount: amount ? parseFloat(amount) : 0,
        confirmationId,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error fetching payment details:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDateTime = (timestamp) => {
    return new Date(timestamp).toLocaleString('vi-VN');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing payment result...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-800">
            🎉 Payment Successful!
          </CardTitle>
        </CardHeader>
        
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            Your deposit payment has been processed successfully. Your tenancy agreement is now active!
          </p>
          
          {/* Payment Details */}
          {paymentData && (
            <div className="space-y-3">
              {paymentData.amount > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Amount Paid</p>
                  <p className="text-xl font-bold text-gray-800">
                    {formatCurrency(paymentData.amount)}
                  </p>
                </div>
              )}
              
              {paymentData.transactionId && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Transaction ID</p>
                  <p className="text-sm font-mono text-gray-800">
                    {paymentData.transactionId}
                  </p>
                </div>
              )}
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Payment Time</p>
                <p className="text-sm text-gray-800">
                  {formatDateTime(paymentData.timestamp)}
                </p>
              </div>
            </div>
          )}

          {/* Success Messages */}
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">✅ What happens next?</h4>
            <ul className="text-sm text-green-700 space-y-1 text-left">
              <li>• Your tenancy agreement is now active</li>
              <li>• You have been added to the room as a tenant</li>
              <li>• Landlord contact details will be shared with you</li>
              <li>• Check your email for confirmation and next steps</li>
            </ul>
          </div>

          {/* Contact Information Note */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-800">Check Your Email</span>
            </div>
            <p className="text-sm text-blue-700 text-left">
              We've sent you a confirmation email with:
            </p>
            <ul className="text-sm text-blue-700 mt-1 text-left">
              <li>• Payment receipt</li>
              <li>• Landlord contact information</li>
              <li>• Move-in instructions</li>
              <li>• Important reminders</li>
            </ul>
          </div>

          {/* Important Reminders */}
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">📋 Important Reminders</h4>
            <ul className="text-sm text-yellow-700 space-y-1 text-left">
              <li>• Contact your landlord to arrange key handover</li>
              <li>• Bring your ID when moving in</li>
              <li>• Keep this payment confirmation</li>
              <li>• Read the tenancy agreement carefully</li>
            </ul>
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-2 pt-4">
            <Button 
              onClick={() => navigate('/tenant/dashboard')}
              className="w-full"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Button>
            
            <Button 
              onClick={() => navigate(-1)}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>

          {/* Support Contact */}
          <div className="text-center text-xs text-gray-500 border-t pt-4">
            <p>Need help? Contact our support team:</p>
            <p className="flex items-center justify-center gap-1 mt-1">
              <Phone className="w-3 h-3" />
              support@viestay.com
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;