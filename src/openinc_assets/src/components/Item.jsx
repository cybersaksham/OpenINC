import React from "react";
import { useEffect, useState } from "react";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../../declarations/nft";
import { openinc } from "../../../declarations/openinc";
import Button from "./Button";
import Loader from "./Loader";

function Item({ id }) {
  const [name, setName] = useState("");
  const [owner, setOwner] = useState("");
  const [image, setImage] = useState(null);
  const [blur, setBlur] = useState();
  const [button, setButton] = useState();
  const [priceInput, setPriceInput] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [sellStatus, setSellStatus] = useState();

  const host = "http://localhost:8080";
  const agent = new HttpAgent({ host });
  //TODO: When deploying, remove the following line
  agent.fetchRootKey();

  let NFTActor;

  const loadNFT = async () => {
    NFTActor = await Actor.createActor(idlFactory, {
      agent,
      canisterId: id,
    });

    setName(await NFTActor.getName());

    const imageData = await NFTActor.getAsset();
    const imgContent = new Uint8Array(imageData);
    setImage(
      URL.createObjectURL(new Blob([imgContent.buffer], { type: "image/png" }))
    );

    const isListed = await openinc.isListed(id);

    if (isListed) {
      setOwner("OpenINC");
      setBlur({ filter: "blur(5px)" });
      setSellStatus("Listed");
    } else {
      setOwner((await NFTActor.getOwner()).toText());
      setButton(<Button handleClick={handleSell} text="Sell" />);
    }
  };

  let price;
  const handleSell = () => {
    setPriceInput(
      <input
        placeholder="Price in INC"
        type="number"
        className="price-input"
        value={price}
        onChange={(e) => (price = e.target.value)}
      />
    );
    setButton(<Button handleClick={sellItem} text="Confirm" />);
  };

  const sellItem = async () => {
    setBlur({ filter: "blur(5px)" });
    setIsLoading(true);
    let result = await openinc.listItem(id, Number(price));
    console.log("Listing: " + result);
    if (result == "Success") {
      const OpenINCID = await openinc.getCanisterID();
      const transferResult = await NFTActor.transfer(OpenINCID);
      console.log("Transfer: " + transferResult);
      setPriceInput();
      setButton();
      setIsLoading(false);
      setOwner("OpenINC");
      setSellStatus("Listed");
    }
  };

  useEffect(() => {
    if (id) {
      loadNFT();
    }
  }, [id]);

  return (
    <div className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={image}
          style={blur}
        />
        <div className="disCardContent-root">
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name}
            <span className="purple-text">{sellStatus}</span>
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {owner}
          </p>

          {isLoading ? (
            <Loader />
          ) : (
            <>
              {priceInput}
              {button}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Item;
