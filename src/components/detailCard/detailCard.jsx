import React, { useEffect, useState } from "react";
import "./detailCard.css";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

import Select from "react-select";
import { getApi, getUniqueCities, postApi } from "../../functions/functions";
import { APIAddress } from "../../constant";
import { toast } from "react-toastify";
import CreatableSelect from "react-select/creatable";

const DetailCard = () => {
  const [result, setResult] = useState("");
  const [cityArray, setCityArray] = useState();
  const [brandArray, setBrandArray] = useState();
  const [modelArray, setModelArray] = useState();
  const [bodyTypeArray, setBodyTypeArray] = useState();
  const [selectedOption, setSelectedOption] = useState("newModel");
  const [formValues, setFormValues] = useState({
    City: "",
    Make: "",
    Model: "",
    "Body Type": "",
    "Odometer Reading": "",
    Tenure: "",
    ml_model: "newModel",
    Retail: "",
  });
  const [loading, setLoading] = useState(false);
  const customStyles = {
    control: (provided, state) => ({
      ...provided,

      borderBottom: "1px solid #000", // Specify the base border style
      border: "none", // Remove the other borders
      width: "24em",
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
      setCityArray(getUniqueCities(res, "City"));
      setModelArray(getUniqueCities(res, "Model"));
      setBodyTypeArray(getUniqueCities(res, "Body Type"));
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
    console.log(formValues);

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
    console.log(event.target.checked);
    if (event.target.checked == false) {
      setSelectedOption("newModel");
      setFormValues({ ...formValues, ml_model: "newModel" });
      setResult("");
    } else {
      setSelectedOption("existingModel");
      setFormValues({ ...formValues, ml_model: "existingModel" });
      setResult("");
    }
  };

  function isFormValid(formValues) {
    if (selectedOption == "newModel") {
      delete formValues.Model;
    }
    if (selectedOption == "existingModel") {
      delete formValues.Make;
      delete formValues["Body Type"];
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
    <div className="container">
      <div className="screen">
        <div className="screen__content">
          <form className="login" style={{ width: "100%" }}>
            <div style={{ display: "grid", justifyContent: "center" }}>
              {/* <div style={{ paddingLeft: "12px" }}>
                <label>
                  <input
                    type="radio"
                    value="newModel"
                    checked={selectedOption === "newModel"}
                    onChange={handleRadioChange}
                  />
                  New Launches
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
                  For Existing Car Models
                </label>
              </div> */}
              <div class="Toggle" style={{ display: "flex" }}>
                <span style={{ marginTop: "14px", marginRight: "12px" }}>
                  New Launches
                </span>
                <input
                  id="Checkbox1"
                  name="checkbox1"
                  type="checkbox"
                  onChange={handleRadioChange}
                />
                <label for="Checkbox1"> For Existing Car Models</label>
              </div>
              <div className="login__field">
                <CreatableSelect
                  isClearable
                  styles={customStyles}
                  name="City"
                  closeMenuOnSelect={true}
                  options={cityArray}
                  placeholder="Select City"
                  onChange={(selectedOption) => {
                    setFormValues({
                      ...formValues,
                      City: selectedOption["value"],
                    });
                  }}
                ></CreatableSelect>
              </div>
              <div className="login__field">
                <Select
                  styles={customStyles}
                  name="Retail"
                  closeMenuOnSelect={true}
                  options={[
                    { value: "Retail", label: "Retail" },
                    { value: "Commercial", label: "Commercial" },
                  ]}
                  placeholder="Select Utility of Vehicle "
                  onChange={(selectedOption) => {
                    setFormValues({
                      ...formValues,
                      Retail: selectedOption["value"],
                    }); // Update the 'city' property
                  }}
                ></Select>
              </div>
              {selectedOption == "newModel" ? (
                <div>
                  <div className="login__field">
                    <Select
                      styles={customStyles}
                      name="Make"
                      closeMenuOnSelect={true}
                      options={brandArray}
                      placeholder="Select Make"
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
                    <Select
                      styles={customStyles}
                      name="City"
                      closeMenuOnSelect={true}
                      options={modelArray}
                      placeholder="Select Model"
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
                    <Select
                      styles={customStyles}
                      name="Body Type"
                      closeMenuOnSelect={true}
                      options={bodyTypeArray}
                      placeholder="Select Body Type"
                      onChange={(selectedOption) => {
                        setFormValues({
                          ...formValues,
                          "Body Type": selectedOption["value"],
                        }); // Update the 'city' property
                      }}
                    ></Select>
                  </div>
                </div>
              ) : null}

              <div style={{}} className="login__field">
                <div>
                  <input
                    style={{
                      height: "2.8em",
                      width: "28.8em",
                      border: "none",
                      outline: "none",
                      boxShadow: "none",
                      borderRadius: "5px",
                      padding: "2px",
                    }}
                    type="number"
                    id="Odometer Reading"
                    name="Odometer Reading"
                    className="homepage-input"
                    placeholder="   Enter Odometer Reading (Kms)"
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div style={{}} className="login__field">
                <div>
                  <input
                    style={{
                      height: "2.8em",
                      width: "28.8em",
                      border: "none",
                      outline: "none",
                      boxShadow: "none",
                      borderRadius: "5px",
                      padding: "2px",
                    }}
                    type="number"
                    className="homepage-input"
                    id="Tenure"
                    name="Tenure"
                    placeholder="   Enter Lease Tenure (Years)"
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {result === "" ? (
              <button
                className="button login__submit"
                style={{
                  width: "12em",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
                onClick={submitHandler}
              >
                <span style={{ marginLeft: "auto" }} className="button__text">
                  <div>Evaluate</div>
                </span>
                <i className="button__icon fas fa-chevron-right"></i>
              </button>
            ) : (
              <button
                className="button login__submit"
                style={{
                  width: "29em",
                  marginLeft: "auto",
                  marginRight: "auto",
                  background: "greenyellow",
                }}
                onClick={submitHandler}
              >
                <span style={{ width: "100%" }} className="button__text">
                  <div
                    style={{ display: "flex", justifyContent: "space-around" }}
                  >
                    <div>
                      {" "}
                      <div>Residual Value</div>{" "}
                      <div>{parseInt(result[0]?.toFixed(3) * 100)}%</div>
                    </div>
                    <div>
                      <div>Adjusted Residual Value </div>
                      <div>{parseInt(result[1]?.toFixed(3) * 100)}%</div>
                    </div>
                  </div>
                </span>
                <i className="button__icon fas fa-chevron-right"></i>
              </button>
            )}
          </form>
        </div>

        <div className="screen__background">
          <span className="screen__background__shape screen__background__shape4"></span>
          <span className="screen__background__shape screen__background__shape3"></span>
          <span className="screen__background__shape screen__background__shape2"></span>
        </div>
      </div>
    </div>
    // </div>
  );
};

export default DetailCard;
