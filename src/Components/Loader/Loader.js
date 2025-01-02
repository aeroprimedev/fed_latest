import React from "react";
import "./Loader.css";

const Loader = ({hideLoader}) => {
  return (
    <div className="loader">
      {!hideLoader &&<div className="plane">
        <img
          src="https://zupimages.net/up/19/34/4820.gif"
          className="plane-img"
          alt=""
        />
      </div>}
      <div className="earth-wrapper">
        <div className="earth"></div>
      </div>
    </div>
  );
};

export default Loader;
