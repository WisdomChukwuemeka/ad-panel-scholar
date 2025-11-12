'use client'; // Use this for client-side rendering in Next.js

import { useState } from 'react';
import { PaystackButton } from 'react-paystack';

export default function PaymentTest() {
  const publicKey = 'pk_test_your_test_public_key_here'; // Replace with your Paystack test public key
  const amount = 10000 * 100; // Test amount: NGN 10,000 in kobo (Paystack requires smallest unit)
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const componentProps = {
    email,
    amount,
    publicKey,
    text: 'Pay Now (Test)',
    onSuccess: (reference) => {
      alert(`Payment successful! Reference: ${reference.reference}`);
      // For real app: Verify on backend via Paystack API
    },
    onClose: () => alert('Payment window closed. Try again?'),
    metadata: {
      name,
      phone,
    },
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2>Test Paystack Payment</h2>
      <form>
        <div style={{ marginBottom: '10px' }}>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Phone:</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
      </form>
      <PaystackButton
        {...componentProps}
        style={{
          backgroundColor: '#0070f3',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          width: '100%',
        }}
      />
    </div>
  );
}