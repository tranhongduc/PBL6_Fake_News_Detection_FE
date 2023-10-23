import React from "react";
import { TbSwitch, TbEdit } from "react-icons/tb";
import Header from "../../components/Header";
import { useLocation } from "react-router-dom";

const ViewUser = (params) => {
  const location = useLocation();
  const { state } = location;

  console.log(params);
  return (
    <div>
      <div>
        <Header title="STAFF INFO" subtitle="Staff infomation" />
        {state?.name}
      </div>
    </div>
  );
};

export default ViewUser;
