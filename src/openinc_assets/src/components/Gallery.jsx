import React, { useEffect, useState } from "react";
import Item from "./Item";
import { openinc } from "../../../declarations/openinc";
import CURRENT_USER_ID from "../index";

function Gallery() {
  const [items, setItems] = useState();
  const [ids, setIds] = useState();

  const fetchIDs = async () => {
    const ids = await openinc.getNFTByOwner(CURRENT_USER_ID);
    setIds(ids);
  };

  const arrangeItems = () => {
    if (ids) {
      setItems(ids.map((nftID) => <Item id={nftID} key={nftID.toText()} />));
    }
  };

  useEffect(() => {
    fetchIDs();
  }, []);

  useEffect(() => {
    arrangeItems();
  }, [ids]);

  return (
    <div className="gallery-view">
      <h3 className="makeStyles-title-99 Typography-h3">My NFTs</h3>
      <div className="disGrid-root disGrid-container disGrid-spacing-xs-2">
        <div className="disGrid-root disGrid-item disGrid-grid-xs-12">
          <div className="disGrid-root disGrid-container disGrid-spacing-xs-5 disGrid-justify-content-xs-center">
            {items}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Gallery;
