import React, { useState } from 'react'
import { GoogleMap, useJsApiLoader, DirectionsRenderer } from '@react-google-maps/api'


const containerStyle = {
  width: '400px',
  height: '400px',
}

const center = {
  lat: 49.2606,
  lng: -123.2460,
}

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

function Map() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
  })

  const [_, setMap] = React.useState(null)
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [directions, setDirections] = useState(null)
  const [travelTime, setTravelTime] = useState('')

  const onLoad = React.useCallback(function callback(map) {
    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback() {
    setMap(null)
  }, [])

  const handleRoute = () => {
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
                setTravelTime(duration)
            } else {
                alert("Directions request failed due to " + status)
            }
        }
    );
  }

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
                type="text" 
                className="maps-input"
                placeholder='Current Location'
                onChange={(e) => setOrigin(e.target.value)}></input>

            <input 
                type="text"
                className="maps-input"
                placeholder='Destination'
                onChange={(e) => setDestination(e.target.value)}></input>

            <button className="maps-button" onClick={handleRoute}>Get Directions</button>
        </div>

        {travelTime && <div className="travel-time">Estimated Time: {travelTime}</div>}

    </div>
    
  ) : (
    <></>
  )
}

export default React.memo(Map)