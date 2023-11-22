import React, { useEffect, useState } from "react";
import NavigationBar from "../../components/navigationBar/navigationBar";
import FileUpload from "react-material-file-upload";
import { OutTable, ExcelRenderer } from "react-excel-renderer";
import { postApi } from "../../functions/functions";
import "./upload.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { APIAddress } from "../../constant";

const UploadFile = () => {
  const [files, setFiles] = useState([]);
  const [selectedOption, setSelectedOption] = useState("newModel");
  const [rows, setRows] = useState([]);
  const [sheetData, setSheetDate] = useState(null);
  const [preview, setPreview] = useState([
    "City",
    "Make",
    "Body Type",
    "Odometer Reading",
    "Tenure",
    "Retail",
    "Transmission Type",
    "Fuel Type",
    "Colour",
  ]);
  console.log(files);
  const navigate = useNavigate();

  function arraysHaveSameElements(arr1, arr2) {
    const set1 = new Set(arr1.map((element) => element.toLowerCase().trim()));
    const set2 = new Set(arr2.map((element) => element.toLowerCase().trim()));

    // Check if the sets have the same size
    if (set1.size !== set2.size) {
      return false;
    }

    // Check if set1 contains all elements from set2
    for (const element of set2) {
      if (!set1.has(element)) {
        return false;
      }
    }

    // If we've reached this point, the arrays have the same elements
    return true;
  }

  useEffect(() => {
    setSheetDate({
      columnNames: [
        "City",
        "Make",
        "Body Type",
        "Odometer Reading",
        "Tenure",
        "Usage",
        "Transmission Type",
        "Fuel Type",
        "Colour",
      ],
    });
    setRows([
      [
        "City",
        "Make",
        "Body Type",
        "Odometer Reading",
        "Tenure",
        "Usage",
        "Transmission Type",
        "Fuel Type",
        "Colour",
      ],
      [
        "Bangalore",
        "Toyota",
        "SUV",
        "120000",
        13,
        "Commercial",
        "Manual",
        "Petrol",
        "Crimson Red",
      ],
    ]);
    postApi(APIAddress.DELETEMASTERDATA);
  }, []);
  useEffect(() => {
    if (files.length != 0) {
      ExcelRenderer(files[0], (err, resp) => {
        if (err) {
          console.log(err);
        } else {
          // console.log(resp);
          console.log(resp.rows);

          setRows(resp.rows);
        }
      });
    } else {
    }
  }, [files]);

  useEffect(() => {
    const jsonData = {
      columnNames: rows[0],
      dataRows: rows.slice(1).filter((row) => row.length > 0),
    };
    setSheetDate(jsonData);
  }, [rows]);
  const handleSubmit = async () => {
    if (files.length === 0) {
      alert("Please upload an Excel file first.");
      return;
    }

    // Convert rows data to JSON format
    const jsonData = {
      columnNames: rows[0],
      dataRows: rows.slice(1).filter((row) => row.length > 0),
    };
    localStorage.setItem("Model", selectedOption);
    if (selectedOption == "existingModel") {
      if (
        arraysHaveSameElements(
          [
            "City",
            "Model",
            "Odometer Reading",
            "Tenure",
            "Usage",
            "Transmission Type",
            "Fuel Type",
            "Colour",
          ],
          jsonData.columnNames
        )
      ) {
        postApi(APIAddress.SAVE, JSON.stringify(jsonData))
          .then((response) => {
            toast.success(response.message);
            // Add any additional logic or state updates as needed
            navigate("/result");
          })
          .catch((error) => {
            toast.error(error);
          });
      } else {
        toast.error("Columns in excel are not correct.");
      }
    } else if (selectedOption == "newModel") {
      if (
        arraysHaveSameElements(
          [
            "City",
            "Make",
            "Body Type",
            "Odometer Reading",
            "Tenure",
            "Usage",
            "Transmission Type",
            "Fuel Type",
            "Colour",
          ],
          jsonData.columnNames
        )
      ) {
        postApi(APIAddress.SAVE, JSON.stringify(jsonData))
          .then((response) => {
            toast.success(response.message);
            // Add any additional logic or state updates as needed
            navigate("/result");
          })
          .catch((error) => {
            toast.error(error);
          });
      } else {
        toast.error("Columns in excel are not correct.");
      }
    } else {
      toast.error("Columns in excel are not correct.");
    }
  };

  const handleRadioChange = (event) => {
    if (event.target.value == "existingModel") {
      setRows([
        [
          "City",
          "Model",
          "Odometer Reading",
          "Tenure",
          "Usage",
          "Transmission Type",
          "Fuel Type",
          "Colour",
        ],
        [
          "Bangalore",
          "Innova Crysta",
          "1,20,000",
          13,
          "Commercial",
          "Manual",
          "Petrol",
          "Red",
        ],
      ]);
      setSheetDate({
        columnNames: [
          "City",
          "Model",
          "Odometer Reading",
          "Tenure",
          "Usage",
          "Transmission Type",
          "Fuel Type",
          "Colour",
        ],
      });
    } else {
      setRows([
        [
          "City",
          "Make",
          "Body Type",
          "Odometer Reading",
          "Tenure",
          "Usage",
          "Transmission Type",
          "Fuel Type",
          "Colour",
        ],
        [
          "Bangalore",
          "Toyota",
          "SUV",
          120000,
          13,
          "Commercial",
          "Manual",
          "Petrol",
          "Red",
        ],
      ]);
      setSheetDate({
        columnNames: [
          "City",
          "Make",
          "Body Type",
          "Odometer Reading",
          "Tenure",
          "Usage",
          "Transmission Type",
          "Fuel Type",
          "Colour",
        ],
      });
    }
    localStorage.setItem("model", event.target.value);
    setSelectedOption(event.target.value);

    console.log(event.target.value);
  };

  return (
    <div
      style={{
        background: "white",
        height: "100%",
      }}
    >
      <div className="navbar-main-div">
        <NavigationBar></NavigationBar>
      </div>

      <div
        className="Homepage-Upload-div"
        style={{ display: "block", marginTop: "2em" }}
      >
        <h2 style={{ textAlign: "center" }}>Upload Excel/CSV File here.</h2>
        <FileUpload
          value={files}
          onChange={setFiles}
          multiFile={false}
          leftLabel="or"
          rightLabel="to select files"
          buttonLabel="click here"
          buttonRemoveLabel="Remove all"
          maxFileSize={10}
          maxUploadFiles={1}
          bannerProps={{ elevation: 0, variant: "outlined" }}
          containerProps={{ elevation: 0, variant: "outlined" }}
        />
      </div>
      <div
        className="Homepage-Submit-Button"
        style={{
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
          padding: "2em",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-around",
          }}
        >
          <div style={{}}>
            <label>
              <input
                type="radio"
                value="newModel"
                checked={selectedOption === "newModel"}
                onChange={handleRadioChange}
              />
              For New Launches
            </label>
          </div>
          <div style={{}}>
            <label>
              <input
                type="radio"
                value="existingModel"
                checked={selectedOption === "existingModel"}
                onChange={handleRadioChange}
              />
              For Existing Car Models
            </label>
          </div>
        </div>
      </div>
      <div style={{ width: "100%" }}>
        <button
          style={{ marginLeft: "46%", marginRight: "auto" }}
          className="button-33"
          role="button"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
      <div
        className="ag-theme-alpine"
        style={{ height: "700px", width: "100%", padding: "2em 4em" }}
      >
        {sheetData ? (
          <>
            {files.length ? (
              <h2 style={{ textAlign: "center", width: "100%" }}>Preview</h2>
            ) : (
              <h2 style={{ textAlign: "center", width: "100%" }}>
                Sample Input Columns
              </h2>
            )}

            <AgGridReact
              columnDefs={sheetData?.columnNames?.map((colName) => ({
                field: colName,
              }))}
              rowData={sheetData?.dataRows?.map((rowData) => {
                const modifiedData = {};
                sheetData?.columnNames?.forEach((colName, index) => {
                  modifiedData[colName] = rowData[index];
                });
                return modifiedData;
              })}
            ></AgGridReact>
          </>
        ) : null}
      </div>
    </div>
  );
};
export default UploadFile;
