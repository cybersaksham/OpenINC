import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import homeImage from "../../assets/home-img.png";
import Minter from "./Minter";
import Gallery from "./Gallery";

function App() {
  return (
    <BrowserRouter forceRefresh={true}>
      <div className="App">
        <Header />
        <Routes>
          <Route
            exact
            path="/"
            element={<img className="bottom-space" src={homeImage} />}
          />
          <Route
            exact
            path="/discover"
            element={<img className="bottom-space" src={homeImage} />}
          />
          <Route exact path="/minter" element={<Minter />} />
          <Route exact path="/collection" element={<Gallery />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
