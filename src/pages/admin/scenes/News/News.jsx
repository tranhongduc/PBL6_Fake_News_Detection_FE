import "./News.css";
import {
  Box,
  useTheme,
  Button,
  MenuItem,
  Pagination,
  Select,
  List,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import Header from "../../components/Header";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AuthUser from "../../../../utils/AuthUser";
import Swal from "sweetalert2";
import { Modal } from "antd";
import Draggable from "react-draggable";

const News = () => {
  const { http } = AuthUser();
  const navigate = useNavigate();
  const theme = useTheme();
  const [news, setNews] = useState([]);
  const [pageNew, setPageNew] = React.useState(1);
  const [pageNewSize, setPageNewSize] = React.useState(20);
  const [pageNewTotal, setPageNewTotal] = React.useState();
  const [openModals, setOpenModals] = useState(false);
  const [idToD, setIdToD] = useState();
  const colors = tokens(theme.palette.mode);
  const columns = [
    {
      field: "ids",
      headerName: "ID",
    },
    {
      field: "title",
      headerName: "Title",
      flex: 1,
    },
    {
      field: "category",
      headerName: "Category",
      flex: 0.25,
    },
    {
      field: "created_at",
      headerName: "Created day",
      flex: 0.25,
      valueGetter: (params) => {
        const createdDate = new Date(params.row.created_at);
        const day = createdDate.getDate();
        const month = createdDate.getMonth();
        const year = createdDate.getFullYear();
        const time = day + "-" + month + "-" + year;
        return time;
      },
    },
    {
      field: "label",
      headerName: "Label",
      renderCell: ({ row: { label } }) => {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              width: "100%",
            }}
          >
            {label === "real" ? (
              <CheckIcon
                style={{
                  color: colors.greenAccent[300],
                }}
              />
            ) : (
              <ClearIcon
                style={{
                  color: colors.redAccent[300],
                }}
              />
            )}
          </div>
        );
      },
    },
    {
      field: "deleteButton",
      headerName: "Delete",
      flex: 0.1,
      renderCell: ({ row }) => {
        const handleDeleteClick = () => {
          // Viết logic xử lý khi nút "xoá" được click, có thể gọi hàm onDelete hoặc một hàm tương tự
          console.log("Delete clicked for row with ID:", row.ids);
          setOpenModals(true);
          setIdToD(row.ids);
        };

        return (
          <div style={{ textAlign: "center" }}>
            <Button
              onClick={handleDeleteClick}
              variant="contained"
              color="error"
            >
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  const handleDoubleClickCell = async (params) => {
    const { row } = params;
    console.log(row);
    navigate("/admin/view_news", { state: row });
  };

  //delete
  const handleNo = () => {
    setOpenModals(false);
  };
  const handleYes = () => {
    http
      .delete(`comment/delete/${idToD}`)
      .then(() => {
        Swal.fire(
          "Update!",
          "You have successfully Delete News",
          "success"
        ).then(() => {
          navigate(0);
        });
      })
      .catch((reject) => {
        console.log(reject);
      });

    setOpenModals(false);
  };

  //
  // Handle click out boundary of modal
  const handleOk = () => {
    setOpenModals(false);
  };

  // Handle click button "X" of modal
  const handleCancel = () => {
    setOpenModals(false);
  };

  // ---------------------------      Modal Draggable      ---------------------------
  const draggleRef = useRef(null);
  const [disabled] = useState(false);
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });

  const onStart = (_event, uiData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();
    if (!targetRect) {
      return;
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    });
  };

  //news

  const handlePageChange = (event, newPage) => {
    fetchDataNew(newPage, pageNewSize);
    setPageNew(newPage);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageNewSize(newPageSize);
    setPageNew(1);
    fetchDataNew(1, newPageSize);
  };
  const fetchDataNew = async (page, pageSize) => {
    await http
      .get(`/admin/news_list/${pageSize}/${page}`)
      .then((resolve) => {
        console.log("news:", resolve);
        const News_with_id = resolve.data.news.map((item, index) => ({
          ids: index + 1 + (page - 1) * pageSize,
          ...item,
        }));
        setPageNewTotal(resolve.data.total_pages);
        setNews(News_with_id);
      })
      .catch((reject) => {
        console.log(reject);
      });
  };

  const CustomPagination = () => (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Pagination
        count={pageNewTotal}
        page={pageNew}
        onChange={handlePageChange}
        showFirstButton
        showLastButton
        boundaryCount={2}
        siblingCount={2}
        style={{ marginRight: "20px" }}
      />
      <Select
        value={pageNewSize}
        onChange={(e) => handlePageSizeChange(e.target.value)}
        style={{ marginRight: "20px" }}
      >
        <MenuItem value={20}>20</MenuItem>
        <MenuItem value={50}>50</MenuItem>
        <MenuItem value={100}>100</MenuItem>
      </Select>
    </div>
  );

  useEffect(() => {
    const fetchData = async () => {
      await http
        .get(`/admin/news_list/${pageNewSize}/${pageNew}`)
        .then((resolve) => {
          console.log("news:", resolve);
          const News_with_id = resolve.data.news.map((item, index) => ({
            ids: index + 1 + (pageNew - 1) * pageNewSize,
            ...item,
          }));
          setPageNewTotal(resolve.data.total_pages);
          setNews(News_with_id);
        })
        .catch((reject) => {
          console.log(reject);
        });
    };
    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box m="20px">
      <Header title="NEWS" subtitle="Managing news" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-root": { fontSize: "1.5rem" },
        }}
      >
        <DataGrid
          rows={news}
          columns={columns}
          pagination
          disableRowSelectionOnClick={true}
          pageSize={pageNewSize}
          rowCount={news.length}
          paginationMode="client"
          page={pageNew}
          onPageChange={handlePageChange}
          onRowDoubleClick={handleDoubleClickCell}
          onPageSizeChange={(newPageSize) => handlePageSizeChange(newPageSize)}
          slots={{
            pagination: CustomPagination,
          }}
        />
      </Box>

      <Modal
        open={openModals}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        modalRender={(modal) => (
          <Draggable
            disabled={disabled}
            bounds={bounds}
            onStart={(event, uiData) => onStart(event, uiData)}
          >
            <div ref={draggleRef}>{modal}</div>
          </Draggable>
        )}
      >
        <h2>Do you want to select this?</h2>
        <div style={{ textAlign: "right" }}>
          <Button onClick={handleNo} style={{ marginRight: 8 }}>
            No
          </Button>

          <Button onClick={handleYes} variant="contained" color="error">
            Yes
          </Button>
        </div>
      </Modal>
    </Box>
  );
};

export default News;
