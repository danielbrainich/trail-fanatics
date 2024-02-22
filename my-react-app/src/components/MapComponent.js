import React, { useEffect } from "react";

function MapComponent({ trail, index }) {
  useEffect(() => {
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
  }, [trail, index]);

  return <div className="mb-3" id={`map-${index}`} style={{ width: "300px", height: "300px" }}></div>;
}

export default MapComponent;
