import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { openinc } from "../../../declarations/openinc";
import CURRENT_USER_ID from "../index";
import homeImage from "../../assets/home-img.png";
import Minter from "./Minter";
import Gallery from "./Gallery";

function App() {
  const [galleryComp, setGalleryComp] = useState();
  const [discoverComp, setDiscoverComp] = useState();

  const fetchIDs = async () => {
    const ids = await openinc.getNFTByOwner(CURRENT_USER_ID);
    setGalleryComp(
      <Gallery title="My NFTs" key="collection" ids={ids} isCollection={true} />
    );

    const listedIds = await openinc.getListedNFTs();
    setDiscoverComp(
      <Gallery
        title="Discover"
        key="discover"
        ids={listedIds}
        isCollection={false}
      />
    );
  };

  useEffect(() => {
    fetchIDs();
  }, []);

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
          <Route exact path="/discover" element={discoverComp} />
          <Route exact path="/minter" element={<Minter />} />
          <Route exact path="/collection" element={galleryComp} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
