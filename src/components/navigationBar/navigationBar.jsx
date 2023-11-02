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
    <div style={{ backgroundColor: "#1f306e", borderRadius: "10px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "0vh",
          padding: "3%",
        }}
      >
        <div style={{ marginLeft: "2vw" }}>
          <strong style={{ fontSize: "1.8rem", color: "white" }}>
            Residual Value Model
          </strong>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-around",
          }}
        >
          <a className="underLine2 hide_on_responsive" href="" onClick={home}>
            <Button style={{ color: "white" }}>Home</Button>
          </a>
          <a className="underLine2 hide_on_responsive" onClick={bulkUpload}>
            <Button style={{ color: "white" }}> Bulk-Upload</Button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default NavigationBar;
