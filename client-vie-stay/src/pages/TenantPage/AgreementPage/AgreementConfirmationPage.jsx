import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Separator } from '../../../components/ui/separator';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Home, 
  Calendar, 
  DollarSign, 
  User, 
  Building,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import axiosInstance from '../../../utils/AxiosInstance';

const AgreementConfirmationPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [confirmation, setConfirmation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchConfirmationDetails();
  }, [token]);

  const fetchConfirmationDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/agreement-confirmations/confirm/${token}`);
      
      if (response.data.success) {
        setConfirmation(response.data.data);
      } else {
        setError(response.data.message || 'Failed to load confirmation details');
      }
    } catch (error) {
      setError(
        error.response?.data?.message || 
        'Confirmation not found or expired'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    try {
      setSubmitting(true);

      const response = await axiosInstance.post(`/agreement-confirmations/confirm/${token}`);
      if (response.data.success) {
        toast.success('Agreement confirmed successfully!');
        
        const confirmationId = response.data.data?._id || confirmation?._id;
        
      
        
        if (confirmationId) {
          
          navigate(`/tenant/payment/${confirmationId}`);
          
        } else {
          
          toast.error('Could not get confirmation ID');
        }
      } else {
        toast.error(response.data.message || 'Failed to confirm agreement');
      }
    } catch (error) { 
      toast.error(
        error.response?.data?.message || 
        'Failed to confirm agreement'
      );
    } finally {
      setSubmitting(false);
    }
  };
  const handleReject = async () => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;
    try {
      setSubmitting(true);
      const response = await axiosInstance.post(`/agreement-confirmations/reject/${token}`, {
        reason
      });     
      if (response.data.success) {
        toast.success('Agreement rejected');
        navigate('/tenant/dashboard');
      } else {
        toast.error(response.data.message || 'Failed to reject agreement');
      }
    } catch (error) {
      console.error('Error rejecting agreement:', error);
      toast.error(
        error.response?.data?.message || 
        'Failed to reject agreement'
      );
    } finally {
      setSubmitting(false);
    }
  };
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Clock className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading confirmation details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Confirmation Not Found
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => navigate('/tenant/dashboard')} variant="outline">
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!confirmation) return null;

  const { agreementTerms, roomId, tenantId } = confirmation;
  const room = roomId;
  const accommodation = room?.accommodationId;

  // Calculate total monthly cost
  let totalMonthlyCost = agreementTerms.monthlyRent;
  if (agreementTerms.utilityRates) {
    if (agreementTerms.utilityRates.water?.type === 'fixed') {
      totalMonthlyCost += agreementTerms.utilityRates.water.rate;
    }
    if (agreementTerms.utilityRates.electricity?.type === 'fixed') {
      totalMonthlyCost += agreementTerms.utilityRates.electricity.rate;
    }
    if (agreementTerms.utilityRates.internet?.rate) {
      totalMonthlyCost += agreementTerms.utilityRates.internet.rate;
    }
    if (agreementTerms.utilityRates.sanitation?.rate) {
      totalMonthlyCost += agreementTerms.utilityRates.sanitation.rate;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎉 Agreement Confirmation
          </h1>
          <p className="text-gray-600">
            Please review the agreement details below and confirm your acceptance
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Property Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{room?.name || `Room ${room?.roomNumber}`}</h3>
                  <p className="text-gray-600">{accommodation?.name}</p>
                  <p className="text-sm text-gray-500">
                    {accommodation?.address?.fullAddress || 
                     accommodation?.address?.street || 
                     'Address not available'}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">  
                  <div>
                    <span className="text-gray-500">Room Type:</span>
                    <p className="font-medium">{room?.type || 'Standard'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Area:</span>
                    <p className="font-medium">{room?.area || 'N/A'} m²</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Agreement Terms */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Agreement Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500">Lease Period</p>
                      <p className="font-medium">
                        {formatDate(agreementTerms.startDate)} - {formatDate(agreementTerms.endDate)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-500">Monthly Rent</p>
                      <p className="font-medium text-lg">{formatCurrency(agreementTerms.monthlyRent)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="text-sm text-gray-500">Security Deposit</p>
                      <p className="font-medium text-lg">{formatCurrency(agreementTerms.deposit)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="text-sm text-gray-500">Landlord</p>
                      <p className="font-medium">{accommodation?.ownerId?.name}</p>
                    </div>
                  </div>
                </div>

                {agreementTerms.notes && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Additional Notes:</p>
                    <p className="text-sm bg-gray-50 p-3 rounded-lg">{agreementTerms.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Utility Costs */}
            {agreementTerms.utilityRates && (
              <Card>
                <CardHeader>
                  <CardTitle>Utility Costs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {agreementTerms.utilityRates.water && (
                      <div className="flex justify-between">
                        <span>Water</span>
                        <span>
                          {formatCurrency(agreementTerms.utilityRates.water.rate)}
                          {agreementTerms.utilityRates.water.type === 'fixed' ? '/month' : '/m³'}
                        </span>
                      </div>
                    )}
                    {agreementTerms.utilityRates.electricity && (
                      <div className="flex justify-between">
                        <span>Electricity</span>
                        <span>
                          {formatCurrency(agreementTerms.utilityRates.electricity.rate)}
                          {agreementTerms.utilityRates.electricity.type === 'fixed' ? '/month' : '/kWh'}
                        </span>
                      </div>
                    )}
                    {agreementTerms.utilityRates.internet?.rate && (
                      <div className="flex justify-between">
                        <span>Internet</span>
                        <span>{formatCurrency(agreementTerms.utilityRates.internet.rate)}/month</span>
                      </div>
                    )}
                    {agreementTerms.utilityRates.sanitation?.rate && (
                      <div className="flex justify-between">
                        <span>Sanitation</span>
                        <span>{formatCurrency(agreementTerms.utilityRates.sanitation.rate)}/month</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Security Deposit:</span>
                  <span className="font-medium">{formatCurrency(agreementTerms.deposit)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total to Pay Now:</span>
                  <span className="text-green-600">{formatCurrency(agreementTerms.deposit)}</span>
                </div>
                <div className="text-sm text-gray-500">
                  <p>Estimated monthly cost: {formatCurrency(totalMonthlyCost)}</p>
                  <p className="text-xs mt-1">*Excluding variable utility costs</p>
                </div>
              </CardContent>
            </Card>

            {/* Important Notice */}
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> By confirming this agreement, you agree to pay the security deposit. 
                After payment, you'll receive landlord contact details for key handover.
              </AlertDescription>
            </Alert>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={handleConfirm}
                disabled={submitting}
                className="w-full"
                size="lg"
              >
                {submitting ? 'Processing...' : '✅ Confirm & Proceed to Payment'}
              </Button>
              
              <Button 
                onClick={handleReject}
                disabled={submitting}
                variant="outline"
                className="w-full"
                size="lg"
              >
                ❌ Reject Agreement
              </Button>
            </div>

            {/* Expiry Warning */}
            <Alert variant="destructive">
              <Clock className="h-4 w-4" />
              <AlertDescription>
                This confirmation expires in 48 hours from the time it was sent.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgreementConfirmationPage;