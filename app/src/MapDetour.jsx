import React, { useState, useEffect, useMemo } from 'react'
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

const waypoints = [
  { location: "Kitsilano" },
]


function MapDetour() {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: apiKey,
      })
    
      const { state } = useLocation();

      const navigate = useNavigate();
      
      const handleNext = () => {
        navigate('/leaderboard')
      }
    
      const origin = state?.origin
      const destination = state?.destination

      const [_, setMap] = React.useState(null)
      const [directions, setDirections] = useState(null)
      const [travelTime, setTravelTime] = useState('')

      const onLoad = React.useCallback(function callback(map) {
        setMap(map)
      }, [])
    
      const onUnmount = React.useCallback(function callback() {
        setMap(null)
      }, [])

      useEffect(() => {
        if (!origin || !destination || !window || !isLoaded) return

        const directionsService = new window.google.maps.DirectionsService();
      
        directionsService.route(
            {
                origin,
                destination,
                waypoints,
                travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === "OK") {
                    setDirections(result);
                    const duration = result.routes[0].legs[0].duration.text
                    setTravelTime(duration)
                } else {
                    alert("Directions request failed due to " + status)
                }
              }
          );
        }, [origin, destination, isLoaded]);

    return isLoaded ? (
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
                  id="pickup-point"
                  className="maps-input"
                  value={waypoints[0].location}
                  readOnly></input>
  
              <input 
                  id="destination"
                  className="maps-input"
                  value={destination}
                  readOnly></input>
  
          </div>
  
          {travelTime && <div className="travel-time">Estimated Time: {travelTime}</div>}

          <button className="go-next" onClick={handleNext}>Go Next</button>
  
      </div>
      
    ) : (
      <></>
    )    
}

export default MapDetour

