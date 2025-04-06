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

const directionsList = [[{location: "290 E 1st Ave Unit 100, Vancouver, BC V5T 1A6"}, {location: "1285 W Broadway #600, Vancouver, BC V6H 3X8"}], [{location: "290 E 1st Ave Unit 100, Vancouver, BC V5T 1A6"}, {location: "kitsilano"}]]

function Map() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
  })

  const [_, setMap] = React.useState(null)
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [travelDistanceInM, setTravelDistanceInM] = useState(0)
  const [minAltRouteDist, setMinDistance] = useState(0)
  const [minAltRouteNum, setMinNum] = useState(-1)
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
                const distance = result.routes[0].legs[0].distance.text
                const distM = result.routes[0].legs[0].distance.value
                setTravelDistanceInM(distM)
                setMinDistance(distM*3)
                setMinNum(-1)
                setTravelDistance(distance)
            } else {
                alert("Directions request failed due to " + status)
            }
        }
    );

    console.info(minAltRouteDist)

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
              var legs = result.routes[0].legs
              let current_distance = 0
              for (let j = 0; j<legs.length; j++){
                current_distance += result.routes[0].legs[j].distance.value
              }
              console.info(current_distance)
              if (current_distance<minAltRouteDist){
                console.info("here")
                setMinDistance(current_distance)
                setMinNum(i)
                console.info(minAltRouteNum)
                console.info(minAltRouteDist)
              }
            } else {
              alert("Directions request failed due to " + status)
            }
        }
      );
    }

    console.info(minAltRouteNum)

    if (minAltRouteNum != -1){
      directionsService.route(
        {
            origin,
            destination,
            travelMode: window.google.maps.TravelMode.DRIVING,
            waypoints: directionsList[minAltRouteNum]
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