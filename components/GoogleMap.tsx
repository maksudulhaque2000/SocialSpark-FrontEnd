'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface GoogleMapProps {
  address: string;
  className?: string;
  zoom?: number;
}

export default function GoogleMap({ address, className = '', zoom = 15 }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initMap = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        
        if (!apiKey) {
          setError('Google Maps API key not configured');
          setLoading(false);
          return;
        }

        const loader = new Loader({
          apiKey,
          version: 'weekly',
          libraries: ['places', 'geocoding'],
        });

        const google = await loader.load();
        const geocoder = new google.maps.Geocoder();

        // Geocode the address
        geocoder.geocode({ address }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            const location = results[0].geometry.location;

            // Create map
            if (mapRef.current) {
              const map = new google.maps.Map(mapRef.current, {
                center: location,
                zoom,
                mapTypeControl: true,
                streetViewControl: true,
                fullscreenControl: true,
              });

              // Add marker
              new google.maps.Marker({
                position: location,
                map,
                title: address,
                animation: google.maps.Animation.DROP,
              });

              // Add info window
              const infoWindow = new google.maps.InfoWindow({
                content: `<div style="padding: 8px; max-width: 200px;">
                  <h3 style="font-weight: bold; margin-bottom: 4px;">Event Location</h3>
                  <p style="color: #666; font-size: 14px;">${address}</p>
                </div>`,
              });

              // Show info window on marker click
              const marker = new google.maps.Marker({
                position: location,
                map,
                title: address,
              });

              marker.addListener('click', () => {
                infoWindow.open(map, marker);
              });

              setLoading(false);
            }
          } else {
            setError('Location not found. Please check the address.');
            setLoading(false);
          }
        });
      } catch (err) {
        console.error('Error loading Google Maps:', err);
        setError('Failed to load map. Please try again later.');
        setLoading(false);
      }
    };

    if (address) {
      initMap();
    }
  }, [address, zoom]);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}>
        <div className="text-center p-6">
          <svg
            className="w-12 h-12 text-gray-400 mx-auto mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600 text-sm">Loading map...</p>
          </div>
        </div>
      )}
      <div ref={mapRef} className={`rounded-lg ${className}`} style={{ minHeight: '300px' }} />
    </div>
  );
}
