import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { openinc } from "../../../declarations/openinc";
import Item from "./Item";
import Loader from "./Loader";

function Minter() {
  const [nftID, setNftID] = useState("");
  const [isMinting, setIsMinting] = useState(false);

  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    setIsMinting(true);
    const {
      name,
      image: [image, ,],
    } = data;

    const imageByteData = [...new Uint8Array(await image.arrayBuffer())];

    const newNFTId = await openinc.mint(name, imageByteData);
    setNftID(newNFTId);
    setIsMinting(false);
  };

  if (nftID == "") {
    return (
      <div className="minter-container">
        <h3 className="makeStyles-title-99 Typography-h3 form-Typography-gutterBottom">
          Create NFT
        </h3>
        <h6 className="form-Typography-root makeStyles-subhead-102 form-Typography-subtitle1 form-Typography-gutterBottom">
          Upload Image
        </h6>
        <form className="makeStyles-form-109" noValidate="" autoComplete="off">
          <div className="upload-container">
            <input
              {...register("image", { required: true })}
              className="upload"
              type="file"
              accept="image/x-png,image/jpeg,image/gif,image/svg+xml,image/webp"
            />
          </div>
          <h6 className="form-Typography-root makeStyles-subhead-102 form-Typography-subtitle1 form-Typography-gutterBottom">
            Collection Name
          </h6>
          <div className="form-FormControl-root form-TextField-root form-FormControl-marginNormal form-FormControl-fullWidth">
            <div className="form-InputBase-root form-OutlinedInput-root form-InputBase-fullWidth form-InputBase-formControl">
              <input
                {...register("name", { required: true })}
                placeholder="e.g. CryptoDunks"
                type="text"
                className="form-InputBase-input form-OutlinedInput-input"
              />
              <fieldset className="PrivateNotchedOutline-root-60 form-OutlinedInput-notchedOutline"></fieldset>
            </div>
          </div>
          {isMinting ? (
            <Loader />
          ) : (
            <div className="form-ButtonBase-root form-Chip-root makeStyles-chipBlue-108 form-Chip-clickable">
              <span
                onClick={isMinting ? () => {} : handleSubmit(onSubmit)}
                className="form-Chip-label"
              >
                Mint NFT
              </span>
            </div>
          )}
        </form>
      </div>
    );
  } else {
    return (
      <div className="minter-container">
        <h3 className="Typography-root makeStyles-title-99 Typography-h3 form-Typography-gutterBottom">
          Minted!
        </h3>
        <div className="horizontal-center">
          <Item id={nftID} />
        </div>
      </div>
    );
  }
}

export default Minter;
