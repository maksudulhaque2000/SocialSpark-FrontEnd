'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiUpload, FiCalendar, FiMapPin, FiUsers, FiDollarSign } from 'react-icons/fi';
import Swal from 'sweetalert2';
import { eventService } from '@/lib/events';
import { authService } from '@/lib/auth';
import { EVENT_CATEGORIES } from '@/types';

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Concerts',
    location: '',
    date: '',
    time: '',
    maxParticipants: 10,
    price: 0,
    isPaid: false,
    bannerImage: null as File | null,
  });

  useEffect(() => {
    const user = authService.getSavedUser();
    if (!user || user.role !== 'Host') {
      Swal.fire({
        icon: 'error',
        title: 'Access Denied',
        text: 'Only hosts can create events',
      }).then(() => {
        router.push('/');
      });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else if (type === 'number') {
      setFormData({ ...formData, [name]: parseFloat(value) || 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire('Error', 'Image size should be less than 5MB', 'error');
        return;
      }
      setFormData({ ...formData, bannerImage: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    if (formData.title.length < 5) {
      Swal.fire('Error', 'Title must be at least 5 characters', 'error');
      return false;
    }
    if (formData.description.length < 20) {
      Swal.fire('Error', 'Description must be at least 20 characters', 'error');
      return false;
    }
    if (!formData.date) {
      Swal.fire('Error', 'Please select a date', 'error');
      return false;
    }
    if (!formData.time) {
      Swal.fire('Error', 'Please select a time', 'error');
      return false;
    }
    if (formData.maxParticipants < 2) {
      Swal.fire('Error', 'Minimum 2 participants required', 'error');
      return false;
    }
    if (formData.isPaid && formData.price <= 0) {
      Swal.fire('Error', 'Please set a valid price for paid events', 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('date', formData.date);
      formDataToSend.append('time', formData.time);
      formDataToSend.append('maxParticipants', formData.maxParticipants.toString());
      formDataToSend.append('price', formData.price.toString());
      formDataToSend.append('isPaid', formData.isPaid.toString());
      
      if (formData.bannerImage) {
        formDataToSend.append('bannerImage', formData.bannerImage);
      }

      const response = await eventService.createEvent(formDataToSend);

      if (response.success && response.data) {
        await Swal.fire({
          icon: 'success',
          title: 'Event Created!',
          text: 'Your event has been created successfully',
          timer: 2000,
        });
        router.push(`/events/${response.data.event._id}`);
      }
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to Create Event',
        text: error.response?.data?.message || 'Something went wrong',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Event</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Banner Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Banner Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-64 mx-auto rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview('');
                        setFormData({ ...formData, bannerImage: null });
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-lg text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <FiUpload className="mx-auto text-gray-400 text-4xl mb-2" />
                    <p className="text-gray-600 mb-2">Click to upload banner image</p>
                    <p className="text-gray-400 text-sm">PNG, JPG up to 5MB</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="banner-upload"
                />
                <label
                  htmlFor="banner-upload"
                  className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition"
                >
                  Choose Image
                </label>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                placeholder="e.g., Summer Music Festival 2024"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                placeholder="Describe your event in detail..."
              />
            </div>

            {/* Category & Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  {EVENT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiMapPin className="inline mr-1" />
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="e.g., Central Park, New York"
                />
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiCalendar className="inline mr-1" />
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time *
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>
            </div>

            {/* Max Participants */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiUsers className="inline mr-1" />
                Maximum Participants *
              </label>
              <input
                type="number"
                name="maxParticipants"
                value={formData.maxParticipants}
                onChange={handleChange}
                required
                min="2"
                max="1000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>

            {/* Paid Event */}
            <div className="border border-gray-300 rounded-lg p-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="isPaid"
                  checked={formData.isPaid}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                />
                <span className="font-medium text-gray-700">This is a paid event</span>
              </label>

              {formData.isPaid && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiDollarSign className="inline mr-1" />
                    Price per Participant (USD) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required={formData.isPaid}
                    min="1"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                    placeholder="0.00"
                  />
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Event...' : 'Create Event'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 border border-gray-600 rounded-lg font-semibold hover:bg-gray-200 transition text-gray-800"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
