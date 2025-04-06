import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import {useLocation, useNavigate} from 'react-router-dom'
import { useEffect } from 'react'
import Map from './Map'
import MapDirections from './MapDirections'
import MapDetour from './MapDetour'
import SignIn from './SignIn'
import Leaderboard from './Leaderboard'
import './App.css'

function AppRoutes() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname !== "/") {
      navigate("/", { replace: true });
    }
  }, []);

  return(
      <Routes>
        <Route path="/" element={<SignIn/>}/>
        <Route path="/map" element={<Map/>}/>
        <Route path="/directions" element={<MapDirections/>}/>
        <Route path="/detour-directions" element={<MapDetour/>}/>
        <Route path="/leaderboard" element={<Leaderboard/>}/>
      </Routes>
  );
}

export default AppRoutes