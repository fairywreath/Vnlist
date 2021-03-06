import React from "react";
import { VnStaff } from "../../vndb/VnTypes";

interface Props {
  staff: VnStaff;
}

const VnStaffCard = (props: Props) => {
  return (
    <div
      className="bg-accentPrimary shadow-md p-2
  rounded-md w-full h-30 flex flex-col items-center justify-between
  text-base font-overlock text-dark"
      style={{ direction: "ltr" }}
    >
      <div className="text-darkAccent">{props.staff.name}</div>
      <div className="text-center">{props.staff.role}</div>
      <div className="text-center">{props.staff.note}</div>
    </div>
  );
};

export default VnStaffCard;
