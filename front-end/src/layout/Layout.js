import React from "react";
import Menu from "./Menu";
import Routes from "./Routes";

import "./Layout.css";

/**
 * Defines the main layout of the application.
 *
 * You will not need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Layout() {
  return (
    <div className="container-fluid ">
      <div className="row min-vh-100 flex-column flex-md-row">
        <div className="col-12 col-md-2 p-0 bg-dark flex-shrink-1 side-bar">
          <Menu />
        </div>
        <div className="col bg-secondary ">
          <Routes />
        </div>
      </div>
    </div>
  );
}

export default Layout;