import React from "react";
import NavigationBar from "../../components/navigationBar/navigationBar";
import "./homepage.css";
import { useNavigate } from "react-router-dom";
import DetailCard from "../../components/detailCard/detailCard";
import NumberInput from "../../components/inputCommaSeperator/inputBox";

const Homepage = () => {
  const navigate = useNavigate();
  const clickHandler = (e) => {
    localStorage.setItem("model", e.target.value);
    navigate("/upload-file");
  };
  return (
    <div className="homepage-div" style={{ backgroundColor: "floralwhite" }}>
      <NavigationBar></NavigationBar>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <div>
          <img
            style={{
              width: "45em",

              marginTop: "4em",
            }}
            src="src/assets/car-sign.png"
          ></img>
        </div>
        <div className="center-container">
          <div className="card-homepage">
            <DetailCard></DetailCard>
          </div>

          {/* <button
            className="button-33"
            role="button"
            value="existingModel"
            onClick={clickHandler}
          >
            Existing Car Models
          </button>

          <button
            className="button-33"
            role="button"
            value="newModel"
            onClick={clickHandler}
          >
            New Model Launches
          </button> */}
        </div>
      </div>
      {/* <div style={{ display: "flex", marginLeft: "1em" }}>
        <span style={{ marginBottom: "3px" }}>powered by </span>
        <img
          style={{ width: "6em", marginLeft: "4px" }}
          src="src/assets/logo-dhurin.png"
        ></img>
      </div> */}
    </div>
  );
};
export default Homepage;
