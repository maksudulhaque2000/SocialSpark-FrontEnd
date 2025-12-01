'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  getSubscriptionPlans,
  getUserSubscription,
  subscribeToPlan,
  confirmSubscriptionPayment,
  type SubscriptionPlan,
  type UserSubscription,
} from '@/lib/subscriptions';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Swal from 'sweetalert2';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function SubscriptionPaymentForm({
  clientSecret,
  planName,
  onSuccess,
}: {
  clientSecret: string;
  planName: string;
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      const { error: submitError, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      });

      if (submitError) {
        setError(submitError.message || 'Payment failed');
        return;
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        const token = localStorage.getItem('token');
        if (token) {
          await confirmSubscriptionPayment(paymentIntent.id, token);
        }
        onSuccess();
      }
    } catch (err) {
      setError('Failed to process payment');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Subscribe to {planName}</h3>
        <PaymentElement />
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={!stripe || loading}
          className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Subscribe Now'}
        </button>
      </div>
    </form>
  );
}

export default function PricingPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const plansData = await getSubscriptionPlans();
      setPlans(Array.isArray(plansData) ? plansData : []);

      const token = localStorage.getItem('token');
      if (token) {
        const subscription = await getUserSubscription(token);
        setUserSubscription(subscription);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      setPlans([]); // Ensure plans is always an array
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    const token = localStorage.getItem('token');
    if (!token) {
      await Swal.fire({
        icon: 'warning',
        title: 'Login Required',
        text: 'Please login to subscribe to a plan',
        confirmButtonText: 'Go to Login',
        confirmButtonColor: '#2563eb',
      });
      router.push('/login');
      return;
    }

    // Check if user is trying to subscribe to their current plan
    if (userSubscription && userSubscription.planId._id === plan._id) {
      await Swal.fire({
        icon: 'info',
        title: 'Already Subscribed',
        text: 'You are already subscribed to this plan!',
        confirmButtonColor: '#2563eb',
      });
      return;
    }

    // Confirm if user wants to upgrade/downgrade
    if (userSubscription && userSubscription.status === 'active') {
      const currentPlan = userSubscription.planId.name;
      const newPlan = plan.name;
      const currentDiscount = userSubscription.planId.discountPercentage;
      const newDiscount = plan.discountPercentage;
      
      const result = await Swal.fire({
        icon: 'question',
        title: 'Switch Plan?',
        html: `
          <div class="text-left">
            <p class="mb-2">You are currently on the <strong>${currentPlan}</strong> plan with <strong>${currentDiscount}%</strong> discount.</p>
            <p class="mb-3">Switch to <strong>${newPlan}</strong> plan with <strong>${newDiscount}%</strong> discount?</p>
            ${plan.price > 0 ? `<p class="text-sm text-gray-600">Price: <strong>$${plan.price}</strong> for ${plan.duration} days</p>` : ''}
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Yes, Switch Plan',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#2563eb',
        cancelButtonColor: '#6b7280',
      });
      
      if (!result.isConfirmed) {
        return;
      }
    }

    setSubscribing(true);
    try {
      const response = await subscribeToPlan(plan._id, token);

      if (plan.slug === 'free') {
        await Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Successfully subscribed to Free plan!',
          timer: 2000,
          showConfirmButton: false,
        });
        loadData();
      } else if (response.clientSecret) {
        setSelectedPlan(plan);
        setClientSecret(response.clientSecret);
      }
    } catch (error) {
      console.error('Subscription failed:', error);
      let errorMessage = 'Failed to subscribe. Please try again.';
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        }
      }
      
      await Swal.fire({
        icon: 'error',
        title: 'Subscription Failed',
        text: errorMessage,
        confirmButtonColor: '#2563eb',
      });
    } finally {
      setSubscribing(false);
    }
  };

  const handlePaymentSuccess = async () => {
    await Swal.fire({
      icon: 'success',
      title: 'Subscription Activated!',
      text: 'Your subscription has been activated successfully!',
      confirmButtonColor: '#2563eb',
      timer: 2000,
    });
    setClientSecret(null);
    setSelectedPlan(null);
    loadData();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading plans...</p>
        </div>
      </div>
    );
  }

  if (clientSecret && selectedPlan) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-md mx-auto">
          <button
            onClick={() => {
              setClientSecret(null);
              setSelectedPlan(null);
            }}
            className="mb-4 text-blue-600 hover:text-blue-700 flex items-center gap-2"
          >
            ← Back to plans
          </button>
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <SubscriptionPaymentForm
              clientSecret={clientSecret}
              planName={selectedPlan.name}
              onSuccess={handlePaymentSuccess}
            />
          </Elements>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-600">Get discounts on all events with our subscription plans</p>
        </div>

        {userSubscription && userSubscription.status === 'active' && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-center">
              You are currently subscribed to{' '}
              <span className="font-semibold">{userSubscription.planId.name}</span> plan
              {userSubscription.planId.discountPercentage > 0 && (
                <span> with {userSubscription.planId.discountPercentage}% discount on all events</span>
              )}
            </p>
            <p className="text-green-600 text-sm text-center mt-1">
              Valid until {new Date(userSubscription.endDate).toLocaleDateString()}
            </p>
          </div>
        )}

        {plans.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No subscription plans available at the moment.</p>
            <p className="text-gray-500 mt-2">Please check back later.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => {
              const isCurrentPlan = userSubscription?.planId._id === plan._id;
              const isPremium = plan.slug === 'premium';
              
              // Determine button text
              let buttonText = 'Subscribe';
              if (isCurrentPlan) {
                buttonText = 'Current Plan';
              } else if (subscribing) {
                buttonText = 'Processing...';
              } else if (userSubscription && userSubscription.status === 'active') {
                // User has a different active plan, show upgrade/downgrade
                const currentPlanPrice = userSubscription.planId.price;
                if (plan.price > currentPlanPrice) {
                  buttonText = 'Upgrade to ' + plan.name;
                } else if (plan.price < currentPlanPrice) {
                  buttonText = 'Switch to ' + plan.name;
                } else {
                  buttonText = 'Subscribe';
                }
              }

            return (
              <div
                key={plan._id}
                className={`bg-white rounded-lg shadow-lg overflow-hidden ${
                  isPremium ? 'ring-2 ring-blue-600 transform scale-105' : ''
                }`}
              >
                {isPremium && (
                  <div className="bg-blue-600 text-white text-center py-2 text-sm font-semibold">
                    MOST POPULAR
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.price === 0 ? 'Free' : `$${plan.price}`}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-gray-600">/{plan.duration} days</span>
                    )}
                  </div>

                  <div className="mb-6">
                    <p className="text-3xl font-bold text-blue-600 mb-2">
                      {plan.discountPercentage}% OFF
                    </p>
                    <p className="text-sm text-gray-600">on all events</p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <svg
                          className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSubscribe(plan)}
                    disabled={isCurrentPlan || subscribing}
                    className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                      isCurrentPlan
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : isPremium
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                  >
                    {buttonText}
                  </button>
                </div>
              </div>
            );
          })}
          </div>
        )}
      </div>
    </div>
  );
}
