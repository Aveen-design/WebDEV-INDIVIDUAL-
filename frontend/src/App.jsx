import { BrowserRouter, Routes, Route} from "react-router-dom";
import About from "./pages/About";
import contact from "./pages/Contact";
import home from "./pages/Contact";
import Errorfound from "./pages/Errorfound";
import Contact from "./pages/Contact";
import Home from "./pages/Contact";
import Navbar from "./component/NavBar";


function App(){
  return(
    <BrowserRouter>
    <Navbar />
    <Routes>
      <Route
        path="/about"
        element={
          <>
          <About /> <Navbar />
          </>
        }
        />      
      <Route path="/contact" element={<Contact />} />
      <Route path="/home" element={<Home/>} />
      <Route path="/Errorfound" element={<Errorfound/>}/>
    </Routes>
    </BrowserRouter>
  );
}

export default App;