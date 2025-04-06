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

const directionsList = [[{location: "290 E 1st Ave Unit 100, Vancouver, BC V5T 1A6"}, {location: "1285 W Broadway #600, Vancouver, BC V6H 3X8"}], [{location: "290 E 1st Ave Unit 100, Vancouver, BC V5T 1A6"}, {location: "kitsilano"}]]

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
    const initialTravelTime = state?.travelTimeNumeric

    const [_, setMap] = React.useState(null)
    const [directions, setDirections] = useState(null)
    const [travelTime, setTravelTime] = useState('')
    let minTravelTime = travelTime;
    let minTravelIndex = 0;

    const onLoad = React.useCallback(function callback(map) {
      setMap(map)
    }, [])
  
    const onUnmount = React.useCallback(function callback() {
      setMap(null)
    }, [])

    useEffect (() => {

      if (!origin || !destination || !window ) return

      const directionsService = new window.google.maps.DirectionsService();
      //Routing nonsense

      minTravelTime = initialTravelTime + 900;
      let values_checked = 1;
      for (let i = 0; i < directionsList.length; i++){
        console.info("AT start of loop")
        console.info(i)
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
                let current_duration = 0
                for (let j = 0; j<legs.length; j++){
                  current_duration += result.routes[0].legs[j].duration.value
                }
                console.info(current_duration)
                console.info(minTravelTime)
                if (current_duration<minTravelTime){
                  console.info("here")
                  minTravelTime = current_duration
                  minTravelIndex = i
                  console.info(minTravelIndex)
                }
              } else {
                alert("Directions request failed due to " + status)
              }
              values_checked++;
          }
        );
      }

      //return the right path

      if (minTravelIndex != -1){
        directionsService.route(
          {
              origin,
              destination,
              travelMode: window.google.maps.TravelMode.DRIVING,
              waypoints: directionsList[minTravelIndex]
          },
          (result, status) => {
            console.log(result)
              if (status === "OK" && result != null) {
                setDirections(result)
                setTravelTime(minTravelTime/60)
                return
              } else {
                  alert("Directions request failed due to " + status)
              }
          }
        );
      } else{
        directionsService.route(
          {
              origin,
              destination,
              travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            console.log(result)
              if (status === "OK") {
                  const duration_local = result.routes[0].legs[0].duration.text
                  setDirections(result)
                  setTravelTime(duration_local/60)
                  return
              } else {
                  alert("Directions request failed due to " + status)
              }
            }
        );
      }
      
      
      console.log("returned null")
      setDirections(null)
      setTravelTime('')
    }, []);
    
    console.info(directionsList[minTravelIndex][0].location)

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
                  id="pickup-point"
                  className="maps-input"
                  value={directionsList[minTravelIndex][0] ? directionsList[minTravelIndex][0].location : 'no value'  }
                  readOnly></input>
              
              <input 
                  id="dropoff-point"
                  className="maps-input"
                  value={directionsList[minTravelIndex][0] ? directionsList[minTravelIndex][1].location : 'no value'}
                  readOnly></input>
  
              <input 
                  id="destination"
                  className="maps-input"
                  value={destination}
                  readOnly></input>
              
              <button className="maps-button" onClick={handleRoute}>Start route!</button>
  
          </div>
  
          {travelTime && <div className="travel-time">Estimated Time: {travelTime} min</div>}

          <button className="go-next" onClick={handleNext}>Go Next</button>
  
      </div>
      
    ) : (
      <></>
    )    
}

export default MapDetour

