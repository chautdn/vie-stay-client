import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { CreditCard, Wallet, Building, ArrowLeft } from 'lucide-react';
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
    
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
     
    }
    
    fetchConfirmationData();
  }, [confirmationId]);

  const fetchConfirmationData = async () => {
    try {
      setPageLoading(true);
      
      // Debug token trước khi call API
      const token = sessionStorage.getItem('token');
     
      
      const response = await axiosInstance.get(`/agreement-confirmations/${confirmationId}`);
      
      if (response.data.success) {
        setConfirmation(response.data.data);
      
      } else {
        toast.error('Failed to load payment details');
        navigate('/tenant/dashboard');
      }
    } catch (error) {
      
      if (error.response?.status !== 401) {
        navigate('/tenant/dashboard');
      }
    } finally {
      setPageLoading(false);
    }
  };

  const handlePayment = async (e) => {
    // Prevent default form submission
    if (e) e.preventDefault();
    
   
    const token = sessionStorage.getItem('token');
    
    
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      
      
      const requestData = { paymentMethod };
    
      
      const response = await axiosInstance.post(
        `/agreement-confirmations/payment/${confirmationId}`,
        requestData
      );
      
     
      if (response.data.success) {
       
        
        if (response.data.data.paymentUrl) {
          
          window.location.href = response.data.data.paymentUrl;
        } else {
         
          toast.success('Payment created successfully!');
          navigate('/payment/success');
        }
      } else {
       
        toast.error(response.data.message || 'Failed to create payment');
      }
    } catch (error) {
      console.error('❌ === PAYMENT ERROR ===');
      console.error('Error object:', error);
      console.error('Error response status:', error.response?.status);
      console.error('Error response data:', error.response?.data);
      
      toast.error(
        error.response?.data?.message || 
        error.message ||
        'Failed to create payment'
      );
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
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Payment Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Property:</span>
                    <span className="font-medium">
                      {confirmation.roomId?.accommodationId?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Room:</span>
                    <span className="font-medium">
                      {confirmation.roomId?.name || `Room ${confirmation.roomId?.roomNumber}`}
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
            )}

            {/* Payment Methods - Sử dụng radio buttons thông thường */}
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
              
              {/* MoMo Option - Disabled */}
              <label className="flex items-center space-x-3 p-3 border rounded-lg opacity-50 cursor-not-allowed">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="momo"
                  disabled
                  className="text-pink-600"
                />
                <Wallet className="w-5 h-5 text-pink-600" />
                <div className="flex-1">
                  <span className="font-medium">MoMo</span>
                  <p className="text-sm text-gray-500">Digital wallet payment</p>
                </div>
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
                  Coming Soon
                </span>
              </label>
              
              {/* Bank Transfer Option - Disabled */}
              <label className="flex items-center space-x-3 p-3 border rounded-lg opacity-50 cursor-not-allowed">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bank"
                  disabled
                  className="text-blue-600"
                />
                <Building className="w-5 h-5 text-blue-600" />
                <div className="flex-1">
                  <span className="font-medium">Bank Transfer</span>
                  <p className="text-sm text-gray-500">Direct bank transfer</p>
                </div>
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
                  Coming Soon
                </span>
              </label>
            </div>

            {/* Payment Button */}
            <Button 
              onClick={handlePayment}
              disabled={loading}
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