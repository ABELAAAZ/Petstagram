import React, { useRef, useEffect } from 'react';

import './Map.css';

const Map = props => {
  const mapRef = useRef();
  
  const { center, zoom } = props;
  console.log('center is ',center)
  console.log('zoom is ',zoom)
  useEffect(() => {
    const map = new window.google.maps.Map(mapRef.current, {
      center: center,
      zoom: zoom
    });
    console.log(map)
    new window.google.maps.Marker({ position: center, map: map });
  }, [center, zoom]);  

  return (
    <div
      ref={mapRef}
      className={`map ${props.className}`}
      style={props.style}
    ></div>
  );
};
 
export default Map;
