'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Swal from 'sweetalert2';
import { FiX, FiLock } from 'react-icons/fi';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface PaymentFormProps {
  clientSecret: string;
  amount: number;
  originalPrice?: number;
  discountPercentage?: number;
  eventTitle: string;
  onSuccess: (paymentIntentId: string) => void;
  onCancel: () => void;
}

function PaymentForm({ clientSecret, amount, originalPrice, discountPercentage, eventTitle, onSuccess, onCancel }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setMessage('');

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        setMessage(error.message || 'Payment failed');
        Swal.fire({
          icon: 'error',
          title: 'Payment Failed',
          text: error.message || 'Something went wrong with your payment',
        });
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Don't show success message here, let parent handle it
        onSuccess(paymentIntent.id);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setMessage(errorMessage);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-700 font-semibold">Event:</span>
          <span className="text-gray-900">{eventTitle}</span>
        </div>
        {originalPrice && discountPercentage && discountPercentage > 0 ? (
          <>
            <div className="flex items-center justify-between mb-1">
              <span className="text-gray-700">Original Price:</span>
              <span className="text-gray-500 line-through">${originalPrice.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-600 font-semibold">Subscription Discount ({discountPercentage}%):</span>
              <span className="text-green-600 font-semibold">-${(originalPrice - amount).toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-blue-300">
              <span className="text-gray-700 font-semibold">Final Amount:</span>
              <span className="text-2xl font-bold text-blue-600">${amount.toFixed(2)}</span>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-gray-700 font-semibold">Amount:</span>
            <span className="text-2xl font-bold text-blue-600">${amount.toFixed(2)}</span>
          </div>
        )}
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <PaymentElement />
      </div>

      {message && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {message}
        </div>
      )}

      <div className="flex items-center justify-center text-sm text-gray-500 gap-2">
        <FiLock className="text-green-600" />
        <span>Secured by Stripe</span>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={!stripe || processing}
          className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {processing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={processing}
          className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

interface PaymentModalProps {
  isOpen: boolean;
  clientSecret: string;
  amount: number;
  originalPrice?: number;
  discountPercentage?: number;
  eventTitle: string;
  onSuccess: (paymentIntentId: string) => void;
  onClose: () => void;
}

export default function PaymentModal({
  isOpen,
  clientSecret,
  amount,
  originalPrice,
  discountPercentage,
  eventTitle,
  onSuccess,
  onClose,
}: PaymentModalProps) {
  if (!isOpen) return null;

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#2563eb',
      },
    },
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative my-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition z-10"
        >
          <FiX className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-2 text-gray-900">Complete Payment</h2>
        <p className="text-gray-600 mb-6">Enter your payment details to join the event</p>

        <Elements stripe={stripePromise} options={options}>
          <PaymentForm
            clientSecret={clientSecret}
            amount={amount}
            originalPrice={originalPrice}
            discountPercentage={discountPercentage}
            eventTitle={eventTitle}
            onSuccess={onSuccess}
            onCancel={onClose}
          />
        </Elements>
      </div>
    </div>
  );
}
