import React, { useState, useEffect } from "react";
import { Box, useTheme } from "@mui/material";
import { DataGrid, viVN } from "@mui/x-data-grid";
import { useGetDataQuery } from "state/api";
import Header from "components/Header";
import DataGridCustomToolbar from "components/DataGridCustomToolbar";

const Transactions = () => {
  const theme = useTheme();

  // values to be sent to the backend
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const { data, isLoading } = useGetDataQuery({
    page,
    pageSize,
    sort: JSON.stringify(sort),
    search,
  });
  // console.log(data);
  // console.log(isLoading);

  const columns = [
    {
      field: "temper",
      headerName: "Nhiệt độ (°C)",
      flex: 1,
    },
    {
      field: "humid",
      headerName: "Độ ẩm (%)",
      flex: 1,
    },
    {
      field: "light",
      headerName: "Ánh sáng (cd)",
      flex: 1,
      //renderCell: (params) => `$${Number(params.value).toFixed(2)}`,
    },
    {
      field: "time",
      headerName: "Thời điểm",
      flex: 1,
    },
  ];
  const customLocaleText = {
    ...viVN.components.MuiDataGrid.defaultProps.localeText,
    toolbarQuickFilterPlaceholder: "Tìm kiếm",
    toolbarDensity: "Mật độ",
    toolbarColumns: "Cột",
    toolbarExport: "Xuất",
    filterPanelOperator: "Toán tử",
    columnsPanelTextFieldLabel: "Tìm cột",
    columnsPanelShowAllButton: "Hiển thị tất cả",
    columnsPanelHideAllButton: "Ẩn tất cả",
    filterPanelColumns: "Cột",
    filterPanelInputLabel: "Giá trị",
    filterPanelInputPlaceholder: "Lọc giá trị",
    footerTotalRows: "Tổng số hàng",
    footerRowSelected: (count) => `${count.toLocaleString()} hàng đã chọn`,
    noRowsLabel: "Không có dữ liệu",
    noResultsOverlayLabel: "Không tìm thấy kết quả",
    densityComfortable: "Thoải mái",
    densityCompact: "Chật",
    densityStandard: "Tiêu chuẩn",
    columnsPanelTextFieldPlaceholder: "Tên cột",
    filterPanelDeleteIconLabel: "Xóa",
    columnsPanelHide: "Ẩn",
    columnsPanelShow: "Hiển thị",
    footerRowCount: (rowCount, totalRowCount) =>
      `${rowCount.toLocaleString()} của ${totalRowCount.toLocaleString()}`,
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="DỮ LIỆU"
        subtitle="Dữ liệu được ghi lại bởi các cảm biến của bạn"
      />
      <Box
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
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
          getRowId={(row) => row._id}
          rows={(data && data.transactions) || []}
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
            toolbar: { searchInput, setSearchInput, setSearch },
          }}
          localeText={customLocaleText}
        />
      </Box>
    </Box>
  );
};

export default Transactions;
