import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Topbar from "./scenes/Topbar/Topbar";
import Sidebar from "./scenes/Sidebar/Sidebar";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { Outlet } from "react-router-dom";

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
            {/* side bar */}

            <Outlet />
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default AdminPage;
