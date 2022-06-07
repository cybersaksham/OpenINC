import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import homeImage from "../../assets/home-img.png";
import Item from "./Item";
import Minter from "./Minter";

function App() {
  return (
    <div className="App">
      <Header />
      {/* <Item id="rkp4c-7iaaa-aaaaa-aaaca-cai" /> */}
      {/* <Item id="rno2w-sqaaa-aaaaa-aaacq-cai" /> */}
      <Minter />
      {/* <img className="bottom-space" src={homeImage} /> */}
      <Footer />
    </div>
  );
}

export default App;
