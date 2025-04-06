import React, { useState, useEffect } from 'react'
import { GoogleMap, useJsApiLoader, DirectionsRenderer } from '@react-google-maps/api'
import { useLocation, useNavigate } from 'react-router-dom'


const containerStyle = {
  width: '400px',
  height: '400px',
}

const center = {
  lat: 49.2606,
  lng: -123.2460,
}

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

function MapDirections() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
  })

  const { state } = useLocation();
  const navigate = useNavigate();

  const origin = state?.origin
  const destination = state?.destination

  const [_, setMap] = React.useState(null)
  const [directions, setDirections] = useState(null)
  const [travelTime, setTravelTime] = useState('')
  const [travelTimeNumeric, setTravelTimeNumeric] = useState('')

  const onLoad = React.useCallback(function callback(map) {
    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback() {
    setMap(null)
  }, [])

  useEffect(() => {
    if (!origin || !destination || !window) return
    
    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
        {
            origin,
            destination,
            travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
            if (status === "OK") {
                setDirections(result);
                const duration = result.routes[0].legs[0].duration.text
                const durationNumeric = result.routes[0].legs[0].duration.value
                setTravelTime(duration)
                setTravelTimeNumeric(durationNumeric)
            } else {
                alert("Directions request failed due to " + status)
            }
        }
    );
  }, [origin, destination]);

  const handleRoute = () => {
    if (!origin || !destination || !window) return

    navigate('/detour-directions', {
      state: {
        origin,
        destination, 
        travelTimeNumeric
      } 
    });
  }

  return isLoaded && directions != null ? (
    <div className="map-button=container">
        <div className="map">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={16}
                onLoad={onLoad}
                onUnmount={onUnmount}
            >
                <DirectionsRenderer directions={directions}/>
            </GoogleMap>
        </div>

        <div className="button-container">
            <input  
                id="current-location" 
                className="maps-input"
                value={origin}
                readOnly></input>

            <input 
                id="destination"
                className="maps-input"
                value={destination}
                readOnly></input>

            <button className="maps-button" onClick={handleRoute}>Find a food-saving route!</button>
            <p className="find-text">We'll see if there's a food rescue match along your way.</p>
        </div>

        {travelTime && <div className="travel-time">Estimated Time: {travelTime}</div>}

    </div>
    
  ) : (
    <></>
  )
}

export default MapDirections