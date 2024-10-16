import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Box, useTheme } from "@mui/material";
import { DataGrid, viVN } from "@mui/x-data-grid";
import Header from "components/Header";
import DataGridCustomToolbar from "components/DataGridCustomToolbar";
import { useGetOverviewQuery } from "state/api";

const Transactions = () => {
  const theme = useTheme();
  const location = useLocation();

  // values to be sent to the backend
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState({}); // Always search in "time" column
  const [searchInput, setSearchInput] = useState("");

  const { data, isLoading, refetch } = useGetOverviewQuery({
    page: page + 1,
    pageSize,
    sort: JSON.stringify(sort),
    search: JSON.stringify(search),
  });
  useEffect(() => {
    refetch();
  }, [location, refetch]);

  // console.log(data);
  // Define columns
  const columns = [
    { field: "MaCamBien", headerName: "ID", flex: 1 },
    {
      field: "NewCamBien",
      headerName: "Cảm biến",
      flex: 1,
    },
    {
      field: "NhietDo",
      headerName: "Nhiệt độ",
      flex: 1,
    },
    {
      field: "DoAm",
      headerName: "Độ ẩm",
      flex: 1,
    },
    {
      field: "AnhSang",
      headerName: "Ánh sáng",
      flex: 1,
    },
    {
      field: "ThoiGian",
      headerName: "Thời điểm",
      flex: 1,
      renderCell: (params) => {
        // Loại bỏ ký tự T và Z
        const formattedTime = params.value
          .split(".")[0]
          .replace("T", " ")
          .replace("Z", "");
        return <span>{formattedTime}</span>;
      },
    },
  ];

  // Custom locale text for DataGrid
  const customLocaleText = {
    ...viVN.components.MuiDataGrid.defaultProps.localeText,
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="LỊCH SỬ" subtitle="Lịch sử thao tác thiết bị của bạn" />
      <Box
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.neutral[0],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.primary.light,
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.neutral[10],
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${theme.palette.neutral[10]} !important`,
          },
        }}
      >
        <DataGrid
          loading={isLoading || !data}
          getRowId={(row) => row.MaCamBien}
          rows={(data && data.cambien) || []}
          columns={columns}
          rowCount={(data && data.total) || 0}
          rowsPerPageOptions={[20, 50, 100]}
          pagination
          page={page}
          pageSize={pageSize}
          paginationMode="server"
          sortingMode="server"
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          onSortModelChange={(newSortModel) => setSort(...newSortModel)}
          components={{ Toolbar: DataGridCustomToolbar }}
          componentsProps={{
            toolbar: {
              searchInput,
              setSearchInput,
              setSearch: (input) => setSearch({ input, column: search.column }), // Updated to handle column search
              columns,
              searchcolumn: "all",
              selectedColumn: search.column,
              setSelectedColumn: (column) => {
                setSearch((prev) => ({ ...prev, column })); // Update the selected column
                setPage(0); // Reset page to 0 when changing column
              },
            },
          }}
          localeText={customLocaleText}
        />
      </Box>
    </Box>
  );
};

export default Transactions;
