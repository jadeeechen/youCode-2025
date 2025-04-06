import React, { useState } from 'react'
import { GoogleMap, useJsApiLoader, DirectionsRenderer } from '@react-google-maps/api'
import { useNavigate } from 'react-router-dom'

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

  const navigate = useNavigate();
  const [waypoint1, setWaypoint1] = useState("")
  const [waypoint2, setWaypoint2] = useState("")
  const [directions, setDirections] = useState([])
  const [travelTime1, setTravelTime1] = useState('')
  const [travelDistance1, setTravelDistance1] = useState('')
  const [travelTime2, setTravelTime2] = useState('')
  const [travelDistance2, setTravelDistance2] = useState('')

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

    directionsService.route(
        {
            origin,
            destination,
            travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
            if (status === "OK") {
                const duration = result.routes[0].legs[0].duration.text
                setTravelTime1(duration)
                const distance = result.routes[0].legs[0].distance.text
                setTravelDistance1(distance)
                result.routes[0].overview_path = result.routes[0].overview_path;
                setDirections(prev => [
                  ...prev,
                  {
                    directions: result,
                    polylineOptions: {
                      strokeColor: "#0000FF",
                      strokeOpacity: 0.8,
                      strokeWeight: 4,
                    }
                  }
                ]);
            } else {
                alert("Directions request failed due to " + status)
            }
        }
    );

    directionsService.route(
        {
            origin,
            destination,
            travelMode: window.google.maps.TravelMode.DRIVING,
            waypoints: [
              {
                location: waypoint1,
                stopover: true
              },
              {
                location: waypoint2,
                stopover: true
              }
            ]
        },
        (result, status) => {
            if (status === "OK") {
                let totalDuration = 0; 
                let totalDistance = 0;
                result.routes[0].legs.forEach((leg) => {
                  totalDuration += leg.duration.value;
                  totalDistance += leg.distance.value; 
                })
                
                const hours = Math.floor(totalDuration / 3600);
                const minutes = Math.floor((totalDuration % 3600) / 60);
                const seconds = totalDuration % 60;
                const formattedDuration = `${hours}h ${minutes}m ${seconds}s`;
        
                setTravelTime2(formattedDuration);
                setTravelDistance2((totalDistance / 1000).toFixed(2) + " km");
                result.routes[0].overview_path = result.routes[0].overview_path;
                setDirections(prev => [
                  ...prev,
                  {
                    directions: result,
                    polylineOptions: {
                      strokeColor: "#FF0000",
                      strokeOpacity: 0.8,
                      strokeWeight: 4,
                    }
                  }
                ]);
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
              {directions.map((direction, index) => (
                <DirectionsRenderer key={index} directions={direction.directions} options={{polylineOptions: direction.polylineOptions}}/>
                ))}
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
                

            <input  
                type="text" 
                className="maps-input"
                placeholder='Waypoint 1'
                onChange={(e) => setWaypoint1(e.target.value)}
              />

            <input 
                type="text"
                className="maps-input"
                placeholder='Waypoint 2'
                onChange={(e) => setWaypoint2(e.target.value)}
              />

            <button className="maps-button" onClick={handleSubmit}>Get Directions</button>
        </div>

        {travelTime1 && <div className="travel-time">Route 1 - Estimated Time: {travelTime1}</div>}
        {travelDistance1 && <div className="travel-distance">Route 1 - Estimated Distance: {travelDistance1}</div>}

        {travelTime2 && <div className="travel-time">Route 2 - Estimated Time: {travelTime2}</div>}
        {travelDistance2 && <div className="travel-distance">Route 2 - Estimated Distance: {travelDistance2}</div>}
    </div>
    
  ) : (
    <></>
  )
}

export default React.memo(Map)