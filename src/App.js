import './App.scss';
import Login from './Components/Login/Login';
import Home from './Components/Home/Home'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from './Components/Dashboard/Dashboard';


function App() {
  return (
   <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/dashboard" element={<Dashboard/>} />
        <Route exact path="/masters" element={<Home/>} />
        <Route exact path="/hierarchy" element={<Home/>} />
        <Route exact path="/license-type" element={<Home/>} />
       
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;
