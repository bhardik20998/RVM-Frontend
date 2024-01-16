import React, { useEffect, useState } from "react";
import "./detailCard.css";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

import Select from "react-select";
import {
  containsOnlyNumbers,
  createObjectWithArray,
  getApi,
  getUniqueCities,
  postApi,
} from "../../functions/functions";
import { APIAddress } from "../../constant";
import { toast } from "react-toastify";
import CreatableSelect from "react-select/creatable";
import { Popover, Whisper } from "rsuite";

const DetailCard = () => {
  const [result, setResult] = useState("");
  const [cityArray, setCityArray] = useState();
  const [brandArray, setBrandArray] = useState();
  const [modelArray, setModelArray] = useState();
  const [bodyTypeArray, setBodyTypeArray] = useState();
  const [fuel, setFuel] = useState();
  const [transmissionTypeArray, setTransmissionTypeArray] = useState();
  const [totalKMS, setTotalKMS] = useState();
  const [selectedOption, setSelectedOption] = useState("newModel");
  const [disabled, setDisabled] = useState({ peryear: false, total: false });
  const [perYear, setPerYear] = useState("");

  const [formValues, setFormValues] = useState({
    City: "",
    Make: "",
    Model: "",
    "Body Type": "",
    "Odometer Reading": "",
    Tenure: "",
    ml_model: "newModel",
    Retail: "",
    Colour: "",
    fuel_type_catalog: "",
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
      setBrandArray(getUniqueCities(res, "Make"));
      setCityArray(getUniqueCities(res, "City"));
      setModelArray(getUniqueCities(res, "Model"));
      setBodyTypeArray(getUniqueCities(res, "Body Type"));
      setTransmissionTypeArray(
        createObjectWithArray([
          "Automatic",
          "Manual",
          "IMT (Intelligent Manual Transmission)",
        ])
      );
      setFuel(
        createObjectWithArray(["Petrol", "Diesel", "CNG", "Hybrid", "EV"])
      );
    });
  }, []);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name == "Odometer Reading Total") {
      setDisabled({ peryear: true, total: false });
    }
    if (name == "Odometer Reading") {
      setDisabled({ peryear: false, total: true });
      setTotalKMS(parseFloat(formValues.Tenure) * parseFloat(value));
      setFormValues({
        ...formValues,
        [name]:
          parseFloat(formValues.Tenure) * parseFloat(value.replace(/\,/g, "")),
      });
    } else {
      setFormValues({ ...formValues, [name]: value });
    }
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
      setFormValues({
        City: "",
        Make: "",
        Model: "",
        "Body Type": "",
        "Odometer Reading": "",
        Tenure: "",
        ml_model: "newModel",
        Retail: "",
        Colour: "",
        fuel_type_catalog: "",
      });
      setResult("");
      setPerYear("");
      setDisabled({ peryear: false, total: false });
    } else {
      setSelectedOption("existingModel");
      setFormValues({
        City: "",
        Make: "",
        Model: "",
        "Body Type": "",
        "Odometer Reading": "",
        Tenure: "",
        ml_model: "existingModel",
        Retail: "",
        Colour: "",
        fuel_type_catalog: "",
      });
      setPerYear("");
      setResult("");
      setDisabled({ peryear: false, total: false });
    }
  };
  function checkCity(city) {
    const array = [...city];
    for (let x = 0; x < array.length; x++) {
      if (!isNaN(parseInt(array[x]))) {
        return false;
      }
    }
    return true;
  }

  function isFormValid(formValues) {
    if (selectedOption == "newModel") {
      delete formValues.Model;
    }
    if (selectedOption == "existingModel") {
      delete formValues.Make;
      delete formValues["Body Type"];
    }
    const flag = checkCity(formValues.City);
    if (formValues.City)
      for (const key in formValues) {
        if (formValues.hasOwnProperty(key)) {
          const value = formValues[key];
          if (!value) {
            return false && flag; // If any value is empty, return false
          }
        }
      }
    return true && flag; // If all values are non-empty, return true
  }

  return (
    <div className="container">
      <div className="screen">
        <div className="screen__content">
          <form className="login" style={{ width: "100%" }}>
            <div style={{ display: "grid", justifyContent: "center" }}>
              <div className="Toggle" style={{ display: "flex" }}>
                <span
                  style={{
                    marginTop: "14px",
                    marginRight: "12px",
                    fontWeight: "bolder",
                  }}
                >
                  New Launches
                </span>
                <input
                  id="Checkbox1"
                  name="checkbox1"
                  type="checkbox"
                  onChange={handleRadioChange}
                />
                <label htmlFor="Checkbox1" style={{ fontWeight: "bolder" }}>
                  {" "}
                  Existing Car Models
                </label>
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
                    { value: "Commercial", label: "Commercial" },
                    { value: "Retail", label: "Retail" },
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
                  <div>
                    <div className="login__field">
                      <Select
                        key="b"
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
                  <div>
                    {" "}
                    <div className="login__field">
                      <Select
                        key="c"
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
                </div>
              ) : (
                <div>
                  <div className="login__field">
                    <Select
                      key="a"
                      styles={customStyles}
                      name="Model"
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
                  <div className="login__field">
                    <Select
                      key="d"
                      styles={customStyles}
                      name="Fuel"
                      closeMenuOnSelect={true}
                      options={fuel}
                      placeholder="Select Fuel Type"
                      onChange={(selectedOption) => {
                        setFormValues({
                          ...formValues,
                          fuel_type_catalog: selectedOption["value"],
                        }); // Update the 'city' property
                      }}
                    ></Select>
                  </div>
                  <div className="login__field">
                    <Select
                      key="e"
                      styles={customStyles}
                      name="Transmission"
                      closeMenuOnSelect={true}
                      options={transmissionTypeArray}
                      placeholder="Select Transmission Type"
                      onChange={(selectedOption) => {
                        setFormValues({
                          ...formValues,
                          transmission_type: selectedOption["value"],
                        }); // Update the 'city' property
                      }}
                    ></Select>
                  </div>
                  <div>
                    <div className="login__field">
                      <CreatableSelect
                        key="f"
                        isClearable
                        styles={customStyles}
                        name="Colour"
                        closeMenuOnSelect={true}
                        placeholder="Select Colour"
                        onChange={(selectedOption) => {
                          setFormValues({
                            ...formValues,
                            Colour: selectedOption["value"],
                          });
                        }}
                      ></CreatableSelect>
                    </div>
                  </div>
                  <div style={{}} className="login__field">
                    <div>
                      <input
                        key="g"
                        style={{
                          height: "2.8em",
                          width: "28.8em",
                          border: "none",
                          outline: "none",
                          boxShadow: "none",
                          borderRadius: "5px",
                          paddingLeft: "15px",
                        }}
                        type="number"
                        className="homepage-input"
                        id="Tenure"
                        name="Tenure"
                        placeholder="Enter Lease Tenure (Years)"
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="login__field">
                    <Select
                      key="h"
                      styles={customStyles}
                      name="Fuel"
                      closeMenuOnSelect={true}
                      options={fuel}
                      placeholder="Select Fuel Type"
                      onChange={(selectedOption) => {
                        setFormValues({
                          ...formValues,
                          fuel_type_catalog: selectedOption["value"],
                        }); // Update the 'city' property
                      }}
                    ></Select>
                  </div>
                  <div className="login__field">
                    <Select
                      key="i"
                      styles={customStyles}
                      name="Transmission"
                      closeMenuOnSelect={true}
                      options={transmissionTypeArray}
                      placeholder="Select Transmission Type"
                      onChange={(selectedOption) => {
                        setFormValues({
                          ...formValues,
                          transmission_type: selectedOption["value"],
                        }); // Update the 'city' property
                      }}
                    ></Select>
                  </div>
                  <div>
                    <div className="login__field">
                      <CreatableSelect
                        key="j"
                        isClearable
                        styles={customStyles}
                        name="Colour"
                        closeMenuOnSelect={true}
                        placeholder="Select Colour"
                        onChange={(selectedOption) => {
                          setFormValues({
                            ...formValues,
                            Colour: selectedOption["value"],
                          });
                        }}
                      ></CreatableSelect>
                    </div>
                  </div>
                  <div style={{}} className="login__field">
                    <div>
                      <input
                        key="k"
                        style={{
                          height: "2.8em",
                          width: "28.8em",
                          border: "none",
                          outline: "none",
                          boxShadow: "none",
                          borderRadius: "5px",
                          paddingLeft: "15px",
                        }}
                        type="number"
                        className="homepage-input"
                        id="Tenure"
                        name="Tenure"
                        placeholder="Enter Lease Tenure (Years)"
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div style={{}} className="login__field">
                <div>
                  <input
                    type="text"
                    style={{
                      height: "2.8em",
                      width: "28.8em",
                      border: "none",
                      outline: "none",
                      boxShadow: "none",
                      borderRadius: "5px",
                      paddingLeft: "15px",
                    }}
                    id="Odometer Reading"
                    name="Odometer Reading"
                    className="homepage-input"
                    placeholder="Kms Driven per year"
                    disabled={disabled.peryear}
                    onChange={(e) => {
                      handleInputChange(e);
                      const val = e.target.value;
                      if (containsOnlyNumbers(val) || val === "")
                        setPerYear(val.replace(/\,/g, ""));
                    }}
                    value={
                      perYear && !isNaN(Number(perYear))
                        ? Number(perYear)?.toLocaleString("en-IN")
                        : ""
                    }
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
                      paddingLeft: "15px",
                    }}
                    disabled={disabled.total}
                    type="text"
                    id="Odometer Reading Total"
                    name="Odometer Reading Total"
                    className="homepage-input"
                    placeholder="Odometer Reading"
                    onChange={(e) => {
                      handleInputChange(e);
                      const val = e.target.value.replace(/\,/g, "");
                      setFormValues({
                        ...formValues,
                        "Odometer Reading": val,
                      });
                      setPerYear(
                        parseInt(parseInt(val) / parseInt(formValues.Tenure))
                      );
                    }}
                    value={
                      formValues["Odometer Reading"] &&
                      !isNaN(Number(formValues["Odometer Reading"]))
                        ? Number(
                            formValues["Odometer Reading"]
                          )?.toLocaleString("en-IN")
                        : ""
                    }
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
                  background: "azure",
                }}
                onClick={submitHandler}
              >
                <span style={{ width: "100%" }} className="button__text">
                  <div
                    style={{ display: "flex", justifyContent: "space-around" }}
                  >
                    <div>
                      {" "}
                      <div>Residual Value</div> {console.log(result[0])}
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
