import React, { useEffect, useRef } from 'react';
import GoogleMapsScript from './GoogleMapsScript';

const GoogleMap = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    const initMap = () => {
      if (!window.google) return;

      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 51.7606, lng: -1.2622 }, // Coordinates for 46 Woodstock Road
        zoom: 15,
        scrollwheel: false,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      new window.google.maps.Marker({
        position: { lat: 51.7606, lng: -1.2622 },
        map: map,
        title: 'Oxford Science Enterprises',
      });
    };

    // Check if Google Maps is loaded
    if (window.google) {
      initMap();
    } else {
      // If not loaded yet, wait for it
      window.initMap = initMap;
    }
  }, []);

  return (
    <>
      <GoogleMapsScript />
      <div 
        ref={mapRef} 
        style={{ 
          width: '100%', 
          height: '300px',
          marginTop: '2rem',
          marginBottom: '2rem'
        }} 
      />
    </>
  );
};

export default GoogleMap; 