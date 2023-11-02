import React, { useEffect, useState } from "react";
import "./detailCard.css";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

import Select from "react-select";
import { getApi, getUniqueCities, postApi } from "../../functions/functions";
import { APIAddress } from "../../constant";
import { toast } from "react-toastify";

const DetailCard = () => {
  const [result, setResult] = useState("");
  const [cityArray, setCityArray] = useState();
  const [brandArray, setBrandArray] = useState();
  const [modelArray, setModelArray] = useState();
  const [bodyTypeArray, setBodyTypeArray] = useState();
  const [selectedOption, setSelectedOption] = useState("newModel");
  const [formValues, setFormValues] = useState({
    city: "",
    Make: "",
    Model: "",
    body_type: "",
    odometer_reading: "",
    vehicle_age: "",
    ml_model: "newModel",
  });
  const [loading, setLoading] = useState(false);
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderBottom: "1px solid #000", // Specify the base border style
      border: "none", // Remove the other borders
      width: "200px",
      "&:focus": {
        // Customize the focus style
        borderColor: "none", // Remove the focus outline
        boxShadow: "none", // Remove the focus box-shadow
      },
    }),
  };

  useEffect(() => {
    postApi(APIAddress.DETAILCARDVALUES).then((res) => {
      // console.log(res);
      setBrandArray(getUniqueCities(res, "Make"));
      setCityArray(getUniqueCities(res, "city"));
      setModelArray(getUniqueCities(res, "Model"));
      setBodyTypeArray(getUniqueCities(res, "body_type"));
    });
  }, []);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };
  const submitHandler = (e) => {
    toast.info("Calculation in progress...");
    setLoading(true);
    e.preventDefault();
    // Access the form values from the formValues state object
    if (isFormValid(formValues)) {
      postApi(APIAddress.YSINGLE, JSON.stringify(formValues)).then((res) => {
        console.log(res);
        setResult([res.y_pred, res.scaled_y_pred]);

        setLoading(false);
        toast.success("Calculation Complete!");
      });
    } else {
      toast.error("Please enter all the values!");
    }
    // Now you have the form values as an object
  };

  const handleRadioChange = (event) => {
    setSelectedOption(event.target.value);
    setFormValues({ ...formValues, ["ml_model"]: event.target.value });
    setResult("");
  };

  function isFormValid(formValues) {
    if (selectedOption == "newModel") {
      delete formValues.Model;
    }
    if (selectedOption == "existingModel") {
      delete formValues.Make;
      delete formValues.body_type;
    }
    for (const key in formValues) {
      if (formValues.hasOwnProperty(key)) {
        const value = formValues[key];
        if (!value) {
          return false; // If any value is empty, return false
        }
      }
    }
    return true; // If all values are non-empty, return true
  }
  return (
    <div>
      <div className="container">
        <div className="screen">
          <div className="screen__content">
            <form className="login" style={{ width: "100%" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.5em",
                }}
              >
                <div style={{ paddingLeft: "12px" }}>
                  <label>
                    <input
                      type="radio"
                      value="newModel"
                      checked={selectedOption === "newModel"}
                      onChange={handleRadioChange}
                    />
                    New Model
                  </label>
                </div>
                <div style={{ paddingLeft: "12px" }}>
                  <label>
                    <input
                      type="radio"
                      value="existingModel"
                      checked={selectedOption === "existingModel"}
                      onChange={handleRadioChange}
                    />
                    Existing Model
                  </label>
                </div>
                <div className="login__field">
                  <i className="login__icon fas fa-user"></i>
                  <Select
                    styles={customStyles}
                    name="City"
                    closeMenuOnSelect={true}
                    options={cityArray}
                    placeholder="Select City..."
                    onChange={(selectedOption) => {
                      setFormValues({
                        ...formValues,
                        city: selectedOption["value"],
                      }); // Update the 'city' property
                    }}
                  ></Select>
                </div>
                {selectedOption == "newModel" ? (
                  <div>
                    <div className="login__field">
                      <i className="login__icon fas fa-user"></i>
                      <Select
                        styles={customStyles}
                        name="Make"
                        closeMenuOnSelect={true}
                        options={brandArray}
                        placeholder="Select Brand..."
                        onChange={(selectedOption) => {
                          setFormValues({
                            ...formValues,
                            Make: selectedOption["value"],
                          }); // Update the 'city' property
                        }}
                      ></Select>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="login__field">
                      <i className="login__icon fas fa-user"></i>
                      <Select
                        styles={customStyles}
                        name="City"
                        closeMenuOnSelect={true}
                        options={modelArray}
                        placeholder="Select Model..."
                        onChange={(selectedOption) => {
                          setFormValues({
                            ...formValues,
                            Model: selectedOption["value"],
                          }); // Update the 'city' property
                        }}
                      ></Select>
                    </div>
                  </div>
                )}
                {selectedOption == "newModel" ? (
                  <div>
                    {" "}
                    <div className="login__field">
                      <i className="login__icon fas fa-user"></i>
                      <Select
                        styles={customStyles}
                        name="body_type"
                        closeMenuOnSelect={true}
                        options={bodyTypeArray}
                        placeholder="Select Body Type..."
                        onChange={(selectedOption) => {
                          setFormValues({
                            ...formValues,
                            body_type: selectedOption["value"],
                          }); // Update the 'city' property
                        }}
                      ></Select>
                    </div>
                  </div>
                ) : null}

                <div style={{ paddingLeft: "12px" }} className="login__field">
                  <i className="login__icon fas fa-user"></i>
                  <div>
                    <input
                      style={{
                        height: "36px",
                        width: "13em",
                        border: "none",
                        outline: "none",
                        boxShadow: "none",
                      }}
                      type="number"
                      id="odometer_reading"
                      name="odometer_reading"
                      placeholder="Enter Odometer Reading"
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div style={{ paddingLeft: "12px" }} className="login__field">
                  <i className="login__icon fas fa-user"></i>
                  <div>
                    <input
                      style={{
                        height: "36px",
                        width: "14em",
                        border: "none",
                        outline: "none",
                        boxShadow: "none",
                      }}
                      type="number"
                      id="vehicle_age"
                      name="vehicle_age"
                      placeholder="Enter Lease Tenure (Years)"
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              <button className="button login__submit" onClick={submitHandler}>
                <span style={{ marginLeft: "auto" }} className="button__text">
                  {result === "" ? (
                    <div>Calculate</div>
                  ) : (
                    <div>
                      <div> Residual Value : {result[0]?.toFixed(2)}</div>
                      <div>Scaled Residual Value : {result[1]?.toFixed(2)}</div>
                    </div>
                  )}
                </span>
                <i className="button__icon fas fa-chevron-right"></i>
              </button>
            </form>
          </div>

          <div className="screen__background">
            <span className="screen__background__shape screen__background__shape4"></span>
            <span className="screen__background__shape screen__background__shape3"></span>
            <span className="screen__background__shape screen__background__shape2"></span>
            <span className="screen__background__shape screen__background__shape1"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailCard;
