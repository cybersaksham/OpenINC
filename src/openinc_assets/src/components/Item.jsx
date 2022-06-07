import React from "react";
import { useEffect, useState } from "react";
import { Actor, HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { idlFactory } from "../../../declarations/nft";
import { idlFactory as tokenIdl } from "../../../declarations/token";
import { openinc } from "../../../declarations/openinc";
import CURRENT_USER_ID from "../index";
import Button from "./Button";
import Loader from "./Loader";
import PriceLabel from "./PriceLabel";

function Item({ id, isCollection }) {
  const [name, setName] = useState("");
  const [owner, setOwner] = useState("");
  const [image, setImage] = useState(null);
  const [blur, setBlur] = useState();
  const [button, setButton] = useState();
  const [priceInput, setPriceInput] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [shouldDisplay, setShouldDisplay] = useState(true);
  const [sellStatus, setSellStatus] = useState();
  const [priceLabel, setPriceLabel] = useState();

  const fetchPrice = async () => {
    const priceFetched = await openinc.getPrice(id);
    setPriceLabel(<PriceLabel price={String(priceFetched)} key={id} />);
  };

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
    setOwner((await NFTActor.getOwner()).toText());

    const imageData = await NFTActor.getAsset();
    const imgContent = new Uint8Array(imageData);
    setImage(
      URL.createObjectURL(new Blob([imgContent.buffer], { type: "image/png" }))
    );

    const isListed = await openinc.isListed(id);

    if (isCollection) {
      if (isListed) {
        setOwner("OpenINC");
        setBlur({ filter: "blur(5px)" });
        setSellStatus("Listed");
      } else {
        setButton(<Button handleClick={handleSell} text="Sell" />);
      }
    } else {
      const originalOwner = await openinc.getOriginalOwner(id);
      if (originalOwner.toText() != CURRENT_USER_ID.toText()) {
        setButton(<Button handleClick={handleBuy} text="Buy" />);
      }
    }
  };

  const handleBuy = async () => {
    setIsLoading(true);

    const tokenActor = await Actor.createActor(tokenIdl, {
      agent,
      canisterId: Principal.fromText("rno2w-sqaaa-aaaaa-aaacq-cai"),
    });

    const sellerId = await openinc.getOriginalOwner(id);
    const itemPrice = await openinc.getPrice(id);

    const transferResult = await tokenActor.transfer(itemPrice, sellerId);

    if (transferResult == "Success") {
      const purchaseResult = await openinc.completePurchase(
        id,
        CURRENT_USER_ID
      );
      setIsLoading(false);
      setShouldDisplay(false);
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
    if (result == "Success") {
      const OpenINCID = await openinc.getCanisterID();
      const transferResult = await NFTActor.transfer(OpenINCID);
      setPriceInput();
      setButton();
      setIsLoading(false);
      setPriceLabel(<PriceLabel price={price} key={id} />);
      setOwner("OpenINC");
      setSellStatus("Listed");
    }
  };

  useEffect(() => {
    if (id) {
      loadNFT();
      fetchPrice();
    }
  }, [id]);

  return (
    <div
      style={{ display: shouldDisplay ? "inline" : "none" }}
      className="disGrid-item"
    >
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={image}
          style={blur}
        />
        <div className="disCardContent-root">
          {priceLabel}
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
