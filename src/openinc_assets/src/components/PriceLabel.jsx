import React, { useEffect, useState } from "react";
import { openinc } from "../../../declarations/openinc";

const PriceLabel = ({ price }) => {
  return (
    <div className="disButtonBase-root disChip-root makeStyles-price-23 disChip-outlined">
      <span className="disChip-label">{price} INC</span>
    </div>
  );
};

export default PriceLabel;
