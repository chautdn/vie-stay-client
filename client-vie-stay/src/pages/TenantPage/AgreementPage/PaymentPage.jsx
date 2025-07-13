import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { CreditCard, Wallet, Building, ArrowLeft, AlertCircle } from 'lucide-react';
import axiosInstance from '../../../utils/AxiosInstance';
import { toast } from 'react-hot-toast';

const PaymentPage = () => {
  const { confirmationId } = useParams();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('vnpay');
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    console.log('🔍 PaymentPage loaded with confirmationId:', confirmationId);
    
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }
    
    if (confirmationId) {
      fetchConfirmationData();
    } else {
      console.error('❌ No confirmationId provided');
      toast.error('Invalid payment link');
      navigate('/tenant/dashboard');
    }
  }, [confirmationId, navigate]);

  const fetchConfirmationData = async () => {
    try {
      setPageLoading(true);
      
      console.log('🔍 Fetching confirmation data for ID:', confirmationId);
      
      // ✅ SỬA: Sử dụng đúng endpoint
      const response = await axiosInstance.get(`/agreement-confirmations/${confirmationId}`, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token') || localStorage.getItem('token')}`
        }
      });
      
      console.log('📄 Confirmation API response:', response.data);
      
      if (response.data.success) {
        const confirmationData = response.data.data;
        console.log('✅ Confirmation data loaded:', confirmationData);
        
        // ✅ KIỂM TRA: Confirmation phải đã được confirmed
        if (confirmationData.status !== 'confirmed') {
          console.log('⚠️ Agreement not confirmed yet, status:', confirmationData.status);
          toast.error('You must confirm the agreement before making payment');
          // Redirect về confirmation page nếu có token
          if (confirmationData.confirmationToken) {
            navigate(`/agreement/confirm/${confirmationData.confirmationToken}`);
          } else {
            navigate('/tenant/dashboard');
          }
          return;
        }
        
        // ✅ KIỂM TRA: Đã thanh toán chưa
        if (confirmationData.paymentStatus === 'completed') {
          console.log('✅ Payment already completed');
          toast.success('Payment has already been completed');
          navigate('/payment/success');
          return;
        }
        
        setConfirmation(confirmationData);
      } else {
        console.error('❌ API returned error:', response.data);
        toast.error(response.data.message || 'Failed to load payment details');
        navigate('/tenant/dashboard');
      }
    } catch (error) {
      console.error('❌ Error fetching confirmation:', error);
      console.error('Error response:', error.response?.data);
      
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        navigate('/login');
      } else if (error.response?.status === 403) {
        toast.error('You can only view your own confirmations');
        navigate('/tenant/dashboard');
      } else if (error.response?.status === 404) {
        toast.error('Confirmation not found');
        navigate('/tenant/dashboard');
      } else {
        toast.error(error.response?.data?.message || 'Failed to load confirmation details');
        navigate('/tenant/dashboard');
      }
    } finally {
      setPageLoading(false);
    }
  };

  const handlePayment = async (e) => {
    if (e) e.preventDefault();
    
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    
    if (!token) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }

    if (!confirmation) {
      toast.error('Confirmation data not loaded');
      return;
    }

    try {
      setLoading(true);
      
      const requestData = { paymentMethod };
      console.log('💳 Creating payment with data:', requestData);
      console.log('💳 For confirmation ID:', confirmationId);
      
      const response = await axiosInstance.post(
        `/agreement-confirmations/payment/${confirmationId}`,
        requestData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('✅ Payment API response:', response.data);
      
      if (response.data.success) {
        console.log('✅ Payment created successfully');
        console.log('📄 Full payment data:', response.data.data);
        
        // ✅ KIỂM TRA: có paymentUrl không
        if (response.data.data && response.data.data.paymentUrl) {
          const paymentUrl = response.data.data.paymentUrl;
          console.log('🔗 Found paymentUrl:', paymentUrl);
          
          // ✅ VALIDATE: URL phải hợp lệ
          if (paymentUrl.includes('vnpayment.vn')) {
            console.log('✅ Valid VNPay URL, redirecting now...');
            console.log('🚀 About to redirect to:', paymentUrl);
            
            // ✅ SỬA: Force redirect ngay lập tức
            window.location.href = paymentUrl;
            
            // ✅ THÊM: Prevent further execution
            return;
          } else {
            console.error('❌ Invalid payment URL format:', paymentUrl);
            toast.error('Invalid payment URL received');
          }
        } else {
          console.error('❌ No paymentUrl in response data:', response.data.data);
          toast.error('No payment URL received from server');
        }
      } else {
        console.error('❌ Payment creation failed:', response.data.message);
        toast.error(response.data.message || 'Failed to create payment');
      }
    } catch (error) {
      console.error('❌ === PAYMENT ERROR ===');
      console.error('Error object:', error);
      console.error('Error response status:', error.response?.status);
      console.error('Error response data:', error.response?.data);
      
      toast.error(error.response?.data?.message || error.message || 'Failed to create payment');
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // ✅ THÊM: Debug information
  console.log('🔍 Current confirmation state:', confirmation);
  console.log('🔍 Current confirmationId:', confirmationId);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto px-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment for Security Deposit
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {confirmation && (
              <>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Payment Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Property:</span>
                      <span className="font-medium">
                        {confirmation.roomId?.accommodationId?.name || 'Property Name'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Room:</span>
                      <span className="font-medium">
                        {confirmation.roomId?.name || `Room ${confirmation.roomId?.roomNumber}` || 'Room'}
                      </span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Security Deposit:</span>
                        <span className="text-blue-600">
                          {formatCurrency(confirmation.agreementTerms?.deposit || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ✅ THÊM: Debug info */}
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-sm">
                  <h4 className="font-medium mb-2">Debug Info:</h4>
                  <div className="space-y-1">
                    <p><strong>Confirmation ID:</strong> {confirmationId}</p>
                    <p><strong>Status:</strong> {confirmation.status}</p>
                    <p><strong>Payment Status:</strong> {confirmation.paymentStatus}</p>
                    <p><strong>Confirmed At:</strong> {confirmation.confirmedAt ? new Date(confirmation.confirmedAt).toLocaleString() : 'Not confirmed'}</p>
                  </div>
                </div>

                {/* ✅ THÊM: Confirmation status check */}
                {confirmation.status === 'confirmed' && confirmation.paymentStatus === 'pending' && (
                  <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-green-600" />
                      <span className="text-green-800 font-medium">
                        Agreement Confirmed - Ready for Payment
                      </span>
                    </div>
                    <p className="text-green-700 text-sm mt-1">
                      You have confirmed the agreement. Complete the payment to secure your room.
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Payment Methods */}
            <div className="space-y-3">
              <h4 className="font-medium">Choose Payment Method</h4>
              
              {/* VNPay Option */}
              <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="vnpay"
                  checked={paymentMethod === 'vnpay'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-blue-600"
                />
                <CreditCard className="w-5 h-5 text-blue-600" />
                <div className="flex-1">
                  <span className="font-medium">VNPay</span>
                  <p className="text-sm text-gray-500">Credit/Debit card, Bank transfer</p>
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                  Recommended
                </span>
              </label>
            </div>

            {/* Payment Button */}
            <Button 
              onClick={handlePayment}
              disabled={
                loading || 
                !confirmation || 
                confirmation.status !== 'confirmed' ||
                confirmation.paymentStatus !== 'pending'
              }
              className="w-full"
              size="lg"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing...
                </div>
              ) : (
                `Pay ${confirmation ? formatCurrency(confirmation.agreementTerms?.deposit || 0) : ''}`
              )}
            </Button>

            {/* ✅ THÊM: Button state debug */}
            {confirmation && (
              <div className="text-xs text-gray-500 text-center">
                Button disabled: {loading || !confirmation || confirmation.status !== 'confirmed' || confirmation.paymentStatus !== 'pending' ? 'Yes' : 'No'}
                <br />
                Reasons: {[
                  loading && 'Loading',
                  !confirmation && 'No confirmation',
                  confirmation?.status !== 'confirmed' && `Status: ${confirmation?.status}`,
                  confirmation?.paymentStatus !== 'pending' && `Payment: ${confirmation?.paymentStatus}`
                ].filter(Boolean).join(', ') || 'None'}
              </div>
            )}

            {/* Security Note */}
            <div className="text-center text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
              🔒 Your payment is secured with SSL encryption
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentPage;