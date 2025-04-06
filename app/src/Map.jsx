import React, { useState } from 'react'
import { GoogleMap, useJsApiLoader, DirectionsRenderer } from '@react-google-maps/api'
import { useNavigate } from 'react-router-dom'

const containerStyle = {
  width: '430px',
  height: '430px',
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

  const navigate = useNavigate();

  const onLoad = React.useCallback(function callback(map) {
    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback() {
    setMap(null)
  }, [])

  const handleSubmit = () => {
    if (!origin || !destination || !window) return

    navigate('/directions', {
      state: {
        origin,
        destination
      } 
    });
  }

  return isLoaded ? (
    <div className="map-page-container">
      <div className="map-container">
          <div className="map">
              <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={center}
                  zoom={16}
                  onLoad={onLoad}
                  onUnmount={onUnmount}
              >
              </GoogleMap>
          </div>

          <div className="map-button-container">
              <input  
                  type="text" 
                  className="maps-input"
                  placeholder='Current Location'
                  onChange={(e) => setOrigin(e.target.value)}></input>
              <hr></hr>

              <input 
                  type="text"
                  className="maps-input"
                  placeholder='Destination'
                  onChange={(e) => setDestination(e.target.value)}></input>

              <hr className="map-button-container-bottom"></hr>
          </div>
          <button className="maps-button" onClick={handleSubmit}>Get Directions</button>
          <p className="directions-text">Let's see how long it takes to get to your destination.</p>
      </div>
    </div>
  ) : (
    <></>
  )
}

export default React.memo(Map)