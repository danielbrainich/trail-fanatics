import React, { useEffect, useState } from "react";
import useGoogleMaps from "../hooks/useGoogleMaps";

function MapComponent({ trail, index }) {
  const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const isGoogleMapsLoaded = useGoogleMaps();

  useEffect(() => {
    if (!scriptLoaded && isGoogleMapsLoaded) {
      setScriptLoaded(true);
    }
  }, [isGoogleMapsLoaded, scriptLoaded]);

  useEffect(() => {
    if (scriptLoaded) {
      createMapAndMarker();
    }
  }, [trail, index, scriptLoaded]);

  const createMapAndMarker = () => {
    const map = new window.google.maps.Map(document.getElementById(`map-${index}`), {
      center: { lat: trail.coordinates[0].lat, lng: trail.coordinates[0].lng },
      zoom: 12,
      options: {
        mapTypeId: 'roadmap',
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      }
    });

    new window.google.maps.Marker({
      position: { lat: trail.coordinates[0].lat, lng: trail.coordinates[0].lng },
      map: map,
      title: trail.name,
    });
  };

  return <div className="mb-3" id={`map-${index}`} style={{ width: "300px", height: "300px" }}></div>;
}

export default MapComponent;
