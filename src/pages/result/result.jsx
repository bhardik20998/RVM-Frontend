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
    postApi(APIAddress.RESULT, localStorage.getItem("model")).then((res) => {
      console.log(res);
      setRowData(res);

      setColumnNames(Object.keys(res[0]));
    });
  }, []);

  return (
    <div>
      <NavigationBar />
      <div style={{ width: "100%" }}>
        <button
          style={{ marginLeft: "46%", marginRight: "auto" }}
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
      {rowData ? (
        <div
          className="ag-theme-alpine"
          style={{ height: "700px", width: "100%", padding: "2em 4em" }}
        >
          <h2 style={{ textAlign: "center", width: "100%" }}>Preview</h2>

          <AgGridReact
            columnDefs={columnNames?.map((res) => ({ field: res }))}
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
      ) : null}
    </div>
  );
};
export default Result;
