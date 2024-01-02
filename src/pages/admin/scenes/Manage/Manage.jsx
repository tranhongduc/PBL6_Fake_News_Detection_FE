import "./Manage.css";
import { Box, Typography, useTheme, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataTeam } from "../../data/mockData";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import Header from "../../components/Header";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthUser from "../../../../utils/AuthUser";

const Manage = () => {
  const { http } = AuthUser();
  const navigate = useNavigate();
  const theme = useTheme();
  const [adminList, setAdminList] = useState([]);
  const colors = tokens(theme.palette.mode);
  const [status, setStatus] = useState(true);

  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "adminname",
      headerName: "Admin Name",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      renderCell: ({ row: { status } }) => {
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
            {status === "active" ? (
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
    // {
    //   field: "status",
    //   headerName: "Status",
    //   width: 200,
    //   renderCell: (params) => {
    //     const { status } = params.row;

    //     const handleEditClick = () => {
    //       if (status === "active") {
    //         // Thực hiện hành động khi status là "active"
    //         console.log("Change to inactive");
    //       } else {
    //         // Thực hiện hành động khi status không phải là "active"
    //         console.log("Change to active");
    //       }
    //     };

    //     return (
    //       <Box display="flex" borderRadius="4px">
    //         <Button
    //           startIcon={status === "active" ? <CheckIcon /> : <ClearIcon />}
    //           onClick={handleEditClick}
    //         >
    //           {"Change Status"}
    //         </Button>
    //       </Box>
    //     );
    //   },
    // },
  ];

  useEffect(() => {
    const fetchData = async () => {
      await http
        .get(`/admin/list-admin/`)
        .then((resolve) => {
          // console.log(resolve);
          const dataWithIds = resolve.data.admins.map((item, index) => ({
            id: index + 1,
            ...item,
          }));
          setAdminList(dataWithIds);
        })
        .catch((reject) => {
          console.log(reject);
        });
    };
    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDoubleClickCell = async (params) => {
    const { row } = params;
    console.log("go to  info", row);
  };

  return (
    <Box m="20px">
      <Header title="ADMIN" subtitle="Managing the Admin Members" />
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
          rows={adminList}
          columns={columns}
          onRowDoubleClick={handleDoubleClickCell}
          hideFooterSelectedRowCount={true}
        />
      </Box>
    </Box>
  );
};

export default Manage;
