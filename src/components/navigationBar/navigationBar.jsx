import React from "react";
import "./navigationBar.css";
import { Button } from "@mui/material";
import { getApi, postApi } from "../../functions/functions";

import { useNavigate } from "react-router-dom";
import { backendaddress } from "../../constant";

const NavigationBar = () => {
  const navigate = useNavigate();

  const bulkUpload = () => {
    navigate("/upload-file");
  };

  const home = () => {
    navigate("/");
  };

  return (
    <div
      className="navigation-bar"
      style={{
        borderRadius: "10px",
        height: "6em",
        backgroundColor: "azure",
        position: "fixed",
        width: "100%",
        top: "0",
        zIndex: "99",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "0vh",
        }}
      >
        <div style={{ marginLeft: "3em" }}>
          <img
            style={{ width: "10em", height: "3.4em", marginTop: "16px" }}
            src="src/assets/logo-finance.png"
          ></img>
        </div>

        <div>
          <img
            style={{ width: "23em" }}
            src="src/assets/logo_transparent.png"
          ></img>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            marginTop: "1.3em",
            marginRight: "4em",
            width: "13em",
          }}
        >
          <a className="underLine2 hide_on_responsive" href="" onClick={home}>
            <Button style={{ color: "black" }}>Home</Button>
          </a>
          <a className="underLine2 hide_on_responsive" onClick={bulkUpload}>
            <Button style={{ color: "black" }}> Bulk-Upload</Button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default NavigationBar;
