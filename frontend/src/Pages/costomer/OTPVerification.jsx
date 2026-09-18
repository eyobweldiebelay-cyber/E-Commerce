import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

import api from '../../api/api';

function OTPVerification() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    paymentId,
    orderId,
    testOtp
  } = {
    paymentId: location.state?.paymentId,
    orderId: location.state?.orderId,
    testOtp: location.state?.testOtp
  };

  const [otp, setOtp] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async (event) => {
    event.preventDefault();

    setError('');

    if (!otp) {
      setError('Please enter the OTP.');
      return;
    }

    if (otp.length !== 6) {
      setError('OTP must contain 6 digits.');
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        '/payments/verify',
        {
          paymentId,
          otp
        }
      );

      navigate(`/order-confirmation/${response.data.orderId}`);

    } catch (error) {
      console.error(
        'OTP verification failed:',
        error
      );

      setError(
        error.response?.data?.message ||
        'Invalid or expired OTP.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="payment-page">
      <div className="container">

        <div className="otp-container">

          <div className="otp-icon">
            <ShieldCheck size={45} />
          </div>

          <div className="payment-header">
            <h1>Verify OTP</h1>

            <p>
              Enter the 6-digit verification code.
            </p>
          </div>

          {testOtp && (
            <div className="test-otp">
              <strong>Test OTP:</strong>{' '}
              {testOtp}
            </div>
          )}

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <form onSubmit={handleVerify}>

            <div className="form-group">
              <label>OTP Code</label>

              <input
                className="otp-input"
                type="text"
                inputMode="numeric"
                maxLength="6"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(event) =>
                  setOtp(
                    event.target.value.replace(
                      /\D/g,
                      ''
                    )
                  )
                }
              />
            </div>

            <button
              type="submit"
              className="auth-button"
              disabled={loading}
            >
              {loading
                ? 'Verifying...'
                : 'Verify Payment'}
            </button>

          </form>

        </div>

      </div>
    </main>
  );
}

export default OTPVerification;