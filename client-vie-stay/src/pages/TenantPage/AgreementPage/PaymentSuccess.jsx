import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { CheckCircle, ArrowLeft } from 'lucide-react';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const amount = searchParams.get('amount');
  const confirmationId = searchParams.get('confirmationId');
  
  useEffect(() => {
    console.log('🎉 Payment Success page loaded');
    console.log('Amount:', amount);
    console.log('Confirmation ID:', confirmationId);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-800">
            Payment Successful!
          </CardTitle>
        </CardHeader>
        
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            Your deposit payment has been processed successfully.
          </p>
          
          {amount && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Amount Paid</p>
              <p className="text-xl font-bold text-gray-800">
                {formatCurrency(amount)}
              </p>
            </div>
          )}
          
          {confirmationId && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Confirmation ID</p>
              <p className="text-sm font-mono text-gray-800">
                {confirmationId}
              </p>
            </div>
          )}
          
          <div className="space-y-2 pt-4">
            <Button 
              onClick={() => navigate('/tenant/dashboard')}
              className="w-full"
            >
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
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;