import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/Topbar/Topbar";
import Sidebar from "./scenes/Sidebar/Sidebar";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { Outlet } from "react-router-dom";
import DashBoard from "./scenes/Dashboard/Dashboard";
import User from "./scenes/User/User";
import Category from "./scenes/Category/Category";

function AdminPage() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app_admin" style={{ display: "flex" }}>
          <Sidebar isSidebar={isSidebar} />

          <main className="content_admin" style={{ width: "100%" }}>
            <Topbar setIsSidebar={setIsSidebar} />
            <Outlet />
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default AdminPage;
