import Home from './pages/Home.js';
import Cakes from './pages/Cakes.js';
import Purchase from './pages/Purchase.js';
import Login from './pages/Login.js';
import Admin from './pages/Admin.js';
import {BrowserRouter,Route,Routes} from "react-router-dom";

function App() {
  return(
    <BrowserRouter>
    <Routes>
      <Route index element={<Home />} />
      <Route path="/cakes" element={<Cakes />} />
      <Route path="/login" element={<Login />} />
      <Route path='/purchase' element={<Purchase />} />
      <Route path='/admin' element={<Admin />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App;
