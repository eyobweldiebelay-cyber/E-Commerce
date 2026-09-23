import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Smartphone, CreditCard, FlaskConical } from 'lucide-react';

import api from '../../api/api';

function Payment() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [method, setMethod] = useState('test');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async (event) => {
    event.preventDefault();

    setError('');

    try {
      setLoading(true);

      const response = await api.post('/payments', {
        orderId,
        method
      });

      const paymentId = response.data.paymentId;
      const testOtp = response.data.testOtp;

      if (!paymentId) {
        setError('Payment was created but payment ID was not returned.');
        return;
      }

     navigate(`/otp-verification/${paymentId}`, {
  state: {
    paymentId,
    orderId,
    testOtp
  }
});

    } catch (error) {
      console.error('Payment creation failed:', error);

      setError(
        error.response?.data?.message ||
        'Failed to create payment.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="payment-page">
      <div className="container">

        <div className="payment-container">

          <div className="payment-header">
            <h1>Payment</h1>

            <p>
              Choose your preferred payment method For Buy.
            </p>
          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <form onSubmit={handlePayment}>

            <div className="payment-methods">

              {/* Telebirr */}
              <label
                className={`payment-method ${
                  method === 'telebirr'
                    ? 'selected'
                    : ''
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="telebirr"
                  checked={method === 'telebirr'}
                  onChange={(event) =>
                    setMethod(event.target.value)
                  }
                />

                <Smartphone size={24} />

                <div>
                  <strong>Telebirr</strong>
                  <p>Pay using Telebirr</p>
                </div>
              </label>

              {/* CBE */}
              <label
                className={`payment-method ${
                  method === 'cbe'
                    ? 'selected'
                    : ''
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cbe"
                  checked={method === 'cbe'}
                  onChange={(event) =>
                    setMethod(event.target.value)
                  }
                />

                <CreditCard size={24} />

                <div>
                  <strong>CBE</strong>
                  <p>Pay using CBE</p>
                </div>
              </label>

              {/* Test Payment */}
              <label
                className={`payment-method ${
                  method === 'test'
                    ? 'selected'
                    : ''
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="test"
                  checked={method === 'test'}
                  onChange={(event) =>
                    setMethod(event.target.value)
                  }
                />

                <FlaskConical size={24} />

                <div>
                  <strong>Test Payment</strong>
                  <p>For development and testing</p>
                </div>
              </label>

            </div>

            <button
              type="submit"
              className="auth-button payment-button"
              disabled={loading}
            >
              {loading
                ? 'Processing...'
                : 'Continue to OTP'}
            </button>

          </form>

        </div>

      </div>
    </main>
  );
}

export default Payment;