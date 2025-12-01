'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  getSubscriptionPlans,
  getAllSubscriptions,
  upsertSubscriptionPlan,
  type SubscriptionPlan,
  type UserSubscription,
} from '@/lib/subscriptions';
import Swal from 'sweetalert2';

export default function AdminSubscriptionsPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [activeTab, setActiveTab] = useState<'plans' | 'subscriptions'>('plans');

  const [formData, setFormData] = useState({
    name: '',
    slug: 'free' as 'free' | 'pro' | 'premium',
    price: 0,
    duration: 30,
    discountPercentage: 0,
    features: [''],
    isActive: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const [plansData, subscriptionsData] = await Promise.all([
        getSubscriptionPlans(),
        getAllSubscriptions(token),
      ]);

      setPlans(Array.isArray(plansData) ? plansData : []);
      setSubscriptions(Array.isArray(subscriptionsData) ? subscriptionsData : []);
    } catch (error) {
      console.error('Failed to load data:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load subscription data',
        confirmButtonColor: '#2563eb',
      });
      setPlans([]);
      setSubscriptions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPlan = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      slug: plan.slug,
      price: plan.price,
      duration: plan.duration,
      discountPercentage: plan.discountPercentage,
      features: plan.features,
      isActive: plan.isActive,
    });
    setShowPlanForm(true);
  };

  const handleAddFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const handleRemoveFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await upsertSubscriptionPlan(
        {
          ...(editingPlan && { planId: editingPlan._id }),
          ...formData,
          features: formData.features.filter((f) => f.trim() !== ''),
        },
        token
      );

      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: editingPlan ? 'Plan updated successfully!' : 'Plan created successfully!',
        timer: 2000,
        showConfirmButton: false,
      });
      
      setShowPlanForm(false);
      setEditingPlan(null);
      setFormData({
        name: '',
        slug: 'free',
        price: 0,
        duration: 30,
        discountPercentage: 0,
        features: [''],
        isActive: true,
      });
      loadData();
    } catch (error) {
      console.error('Failed to save plan:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to save plan. Please try again.',
        confirmButtonColor: '#2563eb',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Subscription Management</h1>
          {activeTab === 'plans' && (
            <button
              onClick={() => setShowPlanForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              + Create New Plan
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('plans')}
              className={`pb-3 px-2 font-medium border-b-2 transition-colors ${
                activeTab === 'plans'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Subscription Plans ({plans.length})
            </button>
            <button
              onClick={() => setActiveTab('subscriptions')}
              className={`pb-3 px-2 font-medium border-b-2 transition-colors ${
                activeTab === 'subscriptions'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Active Subscriptions ({subscriptions.filter((s) => s.status === 'active').length})
            </button>
          </div>
        </div>

        {/* Plan Form Modal */}
        {showPlanForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <h2 className="text-2xl font-bold mb-4">
                {editingPlan ? 'Edit Plan' : 'Create New Plan'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Plan Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                  <select
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        slug: e.target.value as 'free' | 'pro' | 'premium',
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="free">Free</option>
                    <option value="pro">Pro</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: parseFloat(e.target.value) })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration (days)
                    </label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({ ...formData, duration: parseInt(e.target.value) })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Percentage (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discountPercentage}
                    onChange={(e) =>
                      setFormData({ ...formData, discountPercentage: parseInt(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Features</label>
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Feature description"
                      />
                      {formData.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(index)}
                          className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    + Add Feature
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                    Active Plan
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                  >
                    {editingPlan ? 'Update Plan' : 'Create Plan'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPlanForm(false);
                      setEditingPlan(null);
                    }}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Plans Tab */}
        {activeTab === 'plans' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div key={plan._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      plan.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {plan.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  ${plan.price}
                  <span className="text-lg text-gray-600">/{plan.duration}d</span>
                </p>
                <p className="text-lg text-blue-600 font-semibold mb-4">
                  {plan.discountPercentage}% discount
                </p>
                <ul className="space-y-2 mb-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleEditPlan(plan)}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Edit Plan
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Subscriptions Tab */}
        {activeTab === 'subscriptions' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    User Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    End Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subscriptions.map((sub) => (
                  <tr key={sub._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {typeof sub.userId === 'object' && sub.userId !== null && 'email' in sub.userId
                        ? (sub.userId as any).email
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {sub.planId.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          sub.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : sub.status === 'expired'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(sub.startDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(sub.endDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
