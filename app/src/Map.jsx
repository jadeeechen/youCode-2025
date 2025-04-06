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

const directionsList = [[{location: "290 E 1st Ave Unit 100, Vancouver, BC V5T 1A6"}, {location: "1285 W Broadway #600, Vancouver, BC V6H 3X8"}]]

function Map() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
  })

  const [_, setMap] = React.useState(null)
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [directions, setDirections] = useState(null)
  const [alt_directions, setAltDirections] = useState("")
  const [travelTime, setTravelTime] = useState('')
  const [travelDistance, setTravelDistance] = useState('')

  const onLoad = React.useCallback(function callback(map) {
    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback() {
    setMap(null)
  }, [])

  const handleRoute = () => {
    if (!origin || !destination || !window) return
    
    const directionsService = new window.google.maps.DirectionsService();
    distM = 0;

    directionsService.route(
        {
            origin,
            destination,
            travelMode: window.google.maps.TravelMode.DRIVING,
            waypoints: [{location: "kitsilano"}]
        },
        (result, status) => {
            if (status === "OK") {
                setDirections(result);
                const duration = result.routes[0].legs[0].duration.text
                setTravelTime(duration)
                const distance = result.routes[0].legs[0].distance.text
                distM = result.routes[0].legs[0].distance.value
                setTravelDistance(distance)
            } else {
                alert("Directions request failed due to " + status)
            }
        }
    );

    min_dist = distM
    min_dist_route_num = 0
    for (let i = 0; i < directionsList.length; i++){
      directionsService.route(
        {
            origin,
            destination,
            travelMode: window.google.maps.TravelMode.DRIVING,
            waypoints: directionsList[i]
        },
        (result, status) => {
            if (status === "OK") {
              legs = result.routes[0].legs
              current_distance = 0
              for (let j = 0; j<legs.length; j++){
                current_distance += result.routes[0].legs[j].distance.value
              }
              if (current_distance<min_dist){
                min_dist = current_distance
                min_dist_route_num = i
              }
            } else {
              alert("Directions request failed due to " + status)
            }
        }
      );
    }

    directionsService.route(
      {
          origin,
          destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
          waypoints: directionsList[min_dist_route_num]
      },
      (result, status) => {
          if (status === "OK") {
            setAltDirections(result);
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

        {travelDistance && <div className="travel-distance">Estimated Distance: {travelDistance}</div>}
    </div>
    
  ) : (
    <></>
  )
}

export default React.memo(Map)