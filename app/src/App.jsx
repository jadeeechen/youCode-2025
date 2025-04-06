import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Map from './Map'
import SignIn from './SignIn'
import './App.css'

function App() {
  return(
    <Router>
      <Routes>
        <Route path="/map" element={<Map/>}/>
        <Route path="/" element={<SignIn/>}/>
      </Routes>
    </Router>
  );
}

export default App
