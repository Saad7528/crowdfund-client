import React, { useContext, useState } from 'react';
import { AuthContext } from '../../providers/AuthProvider';
import { CreditCard, CheckCircle, ShieldAlert } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const STRIPE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder_key';

// Initialize stripe only if a valid key is provided
let stripePromise = null;
if (STRIPE_KEY && STRIPE_KEY !== 'pk_test_placeholder_key') {
  stripePromise = loadStripe(STRIPE_KEY);
}

// Inner Stripe checkout form
const StripeCheckoutForm = ({ selectedPackage, onSuccess, onError, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useContext(AuthContext);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    setProcessing(true);
    
    try {
      // 1. Create payment intent on server
      const token = localStorage.getItem('access-token');
      const intentRes = await fetch(`${API_URL}/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ price: selectedPackage.price })
      });

      if (!intentRes.ok) {
        throw new Error("Failed to create Stripe payment intent");
      }

      const { clientSecret } = await intentRes.json();

      // 2. Confirm card payment
      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            name: user.name,
            email: user.email
          }
        }
      });

      if (error) {
        onError(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        // 3. Save payment to server database
        const paymentSaveRes = await fetch(`${API_URL}/payments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            credits: selectedPackage.credits,
            price: selectedPackage.price,
            paymentIntentId: paymentIntent.id
          })
        });

        if (paymentSaveRes.ok) {
          onSuccess();
        } else {
          onError("Payment succeeded on Stripe but failed to record in the database.");
        }
      }
    } catch (err) {
      console.error(err);
      onError(err.message || "An error occurred during Stripe processing.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="stripe-form-container">
      <div className="stripe-input-box">
        <CardElement 
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#f4f4f5',
                '::placeholder': { color: '#71717a' },
              },
              invalid: { color: '#ef4444' },
            },
          }}
        />
      </div>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <button type="button" onClick={onCancel} className="btn btn-secondary" disabled={processing}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={!stripe || processing}>
          {processing ? 'Processing...' : `Pay $${selectedPackage.price}`}
        </button>
      </div>
    </form>
  );
};

// Main Component
const PurchaseCredit = () => {
  const { user, syncUserSession } = useContext(AuthContext);
  const [selectedPackage, setSelectedPackage] = useState(null);
  
  // Custom dummy payment form states
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [processingMock, setProcessingMock] = useState(false);

  const packages = [
    { credits: 100, price: 10 },
    { credits: 300, price: 25 },
    { credits: 800, price: 60 },
    { credits: 1500, price: 110 }
  ];

  const handlePaymentSuccess = async () => {
    setPaymentSuccess(true);
    setPaymentError('');
    setSelectedPackage(null);
    const token = localStorage.getItem('access-token');
    await syncUserSession(user.email, token);
    
    setTimeout(() => {
      setPaymentSuccess(false);
    }, 4000);
  };

  // Process Mock Payment (Fallback mode)
  const handleMockPaymentSubmit = async (e) => {
    e.preventDefault();
    setProcessingMock(true);
    setPaymentError('');

    const token = localStorage.getItem('access-token');
    try {
      const response = await fetch(`${API_URL}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          credits: selectedPackage.credits,
          price: selectedPackage.price,
          paymentIntentId: 'mock_tx_' + Math.floor(Math.random()*10000000)
        })
      });

      if (response.ok) {
        handlePaymentSuccess();
      } else {
        setPaymentError('Failed to record credits top-up.');
      }
    } catch (err) {
      console.error(err);
      setPaymentError('Server error processing payment.');
    } finally {
      setProcessingMock(false);
    }
  };

  return (
    <div style={{ textAlign: 'left' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Purchase Credits</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Securely buy credits using Stripe to pledge to creator campaigns.</p>

      {paymentSuccess && (
        <div className="alert alert-success" style={{ marginBottom: '30px' }}>
          <CheckCircle size={18} />
          <span>Credits purchased successfully! Your balance has been topped up.</span>
        </div>
      )}

      {paymentError && (
        <div className="alert alert-error" style={{ marginBottom: '30px' }}>
          <ShieldAlert size={18} />
          <span>{paymentError}</span>
        </div>
      )}

      {/* Packages Grid */}
      <div className="packages-grid">
        {packages.map((pkg, idx) => (
          <div key={idx} className="package-card" onClick={() => { setSelectedPackage(pkg); setPaymentError(''); }}>
            <div>
              <div className="package-credits">+{pkg.credits} Credits</div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '15px' }}>NovaFund Credit Pack</p>
            </div>
            <div>
              <div className="package-price">${pkg.price}</div>
              <button className="btn btn-primary" style={{ width: '100%' }}>Select Pack</button>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Modal/Overlay */}
      {selectedPackage && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: '550px' }}>
            <h3 className="modal-title">Payment Checkout</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '25px' }}>
              Confirm your purchase of <strong>{selectedPackage.credits} Credits</strong> for <strong>${selectedPackage.price}</strong>.
            </p>

            {stripePromise ? (
              /* Stripe Integration enabled */
              <Elements stripe={stripePromise}>
                <StripeCheckoutForm 
                  selectedPackage={selectedPackage}
                  onSuccess={handlePaymentSuccess}
                  onError={(err) => setPaymentError(err)}
                  onCancel={() => setSelectedPackage(null)}
                />
              </Elements>
            ) : (
              /* Fallback Mock Form if stripe key is not provided */
              <form onSubmit={handleMockPaymentSubmit}>
                <div style={{ padding: '10px 14px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '8px', color: '#fcd34d', fontSize: '0.8rem', marginBottom: '20px' }}>
                  <strong>Developer Notice:</strong> Active Stripe Publishable key is unconfigured. Running in Mock checkout mode.
                </div>

                <div className="form-group">
                  <label className="form-label">Card Number</label>
                  <input 
                    type="text" 
                    value={cardNumber} 
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4242 4242 4242 4242"
                    className="form-input"
                    maxLength={19}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                  <div className="form-group" style={{ marginBottom: '0' }}>
                    <label className="form-label">Expiry Date</label>
                    <input 
                      type="text" 
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="form-input"
                      maxLength={5}
                      required
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: '0' }}>
                    <label className="form-label">CVC</label>
                    <input 
                      type="password" 
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      placeholder="123"
                      className="form-input"
                      maxLength={3}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '30px' }}>
                  <button 
                    type="button" 
                    onClick={() => setSelectedPackage(null)} 
                    className="btn btn-secondary"
                    disabled={processingMock}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-accent"
                    disabled={processingMock}
                  >
                    {processingMock ? 'Checking out...' : `Complete Payment $${selectedPackage.price}`}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default PurchaseCredit;
