import React, { useEffect, useState } from "react";
import NavigationBar from "../../components/navigationBar/navigationBar";
import { getApi, postApi } from "../../functions/functions";
import { APIAddress } from "../../constant";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";

import "ag-grid-community/styles/ag-theme-alpine.css";
import { CSVLink } from "react-csv";

const Result = () => {
  const [columnNames, setColumnNames] = useState();
  const [rowData, setRowData] = useState();
  useEffect(() => {
    postApi(APIAddress.RESULT, localStorage.getItem("Model")).then((res) => {
      console.log(res);
      setRowData(res);

      setColumnNames(Object.keys(res[0]));
    });
  }, []);

  return (
    <div style={{ background: "white" }}>
      <NavigationBar />

      {rowData ? (
        <div
          className="ag-theme-alpine"
          style={{ width: "100%", padding: "2em 4em" }}
        >
          <h2 style={{ textAlign: "center", width: "100%" }}>
            Estimated Residual Values
          </h2>
          <div style={{ marginTop: "2em" }}>
            <AgGridReact
              columnDefs={columnNames?.map((res) => ({
                field: res,
              }))}
              rowData={rowData}
              gridOptions={{
                // Enable the export feature
                domLayout: "autoHeight",
                enableCharts: true, // Optional, enables charting features
                enableRangeSelection: true, // Optional, enables range selection
                enableBrowserTooltips: true, // Optional, enables browser tooltips
                suppressCsvExport: true, // Optional, suppress CSV export if needed
              }}
            ></AgGridReact>
          </div>

          <div style={{ width: "100%", marginTop: "2em" }}>
            <button
              style={{ marginLeft: "44%", marginRight: "auto" }}
              className="button-33"
              role="button"
            >
              {rowData && (
                <CSVLink data={rowData} filename="RVM values.csv">
                  {" "}
                  Export to Excel
                </CSVLink>
              )}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
export default Result;
