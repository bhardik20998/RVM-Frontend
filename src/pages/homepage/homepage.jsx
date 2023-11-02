import React from "react";
import NavigationBar from "../../components/navigationBar/navigationBar";
import "./homepage.css";
import { useNavigate } from "react-router-dom";
import DetailCard from "../../components/detailCard/detailCard";

const Homepage = () => {
  const navigate = useNavigate();
  const clickHandler = (e) => {
    localStorage.setItem("model", e.target.value);
    navigate("/upload-file");
  };
  return (
    <div>
      <NavigationBar></NavigationBar>
      <div>
        <div className="center-container" style={{}}>
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
    </div>
  );
};
export default Homepage;
