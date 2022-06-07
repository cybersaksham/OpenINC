import React, { useEffect, useState } from "react";
import Item from "./Item";

function Gallery({ title, ids, isCollection }) {
  const [items, setItems] = useState();

  const arrangeItems = () => {
    if (ids) {
      setItems(
        ids.map((nftID) => (
          <Item id={nftID} isCollection={isCollection} key={nftID.toText()} />
        ))
      );
    }
  };

  useEffect(() => {
    arrangeItems();
  }, [ids]);

  return (
    <div className="gallery-view">
      <h3 className="makeStyles-title-99 Typography-h3">{title}</h3>
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
