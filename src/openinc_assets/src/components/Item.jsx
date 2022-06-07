import React from "react";
import { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../../declarations/nft";
import { Principal } from "@dfinity/principal";

function Item({ id }) {
  const [name, setName] = useState("");
  const [owner, setOwner] = useState("");
  const [image, setImage] = useState(null);

  const host = "http://localhost:8080";
  const agent = new HttpAgent({ host });

  const loadNFT = async () => {
    const NFTActor = await Actor.createActor(idlFactory, {
      agent,
      canisterId: Principal.fromText(id),
    });

    setName(await NFTActor.getName());
    setOwner((await NFTActor.getOwner()).toText());

    const imageData = await NFTActor.getAsset();
    const imgContent = new Uint8Array(imageData);
    setImage(
      URL.createObjectURL(new Blob([imgContent.buffer], { type: "image/png" }))
    );
  };

  useEffect(() => {
    console.log(id);
    loadNFT();
  }, [id]);

  return (
    <div className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={image}
        />
        <div className="disCardContent-root">
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name}
            <span className="purple-text"></span>
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {owner}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Item;
