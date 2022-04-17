import { Outlet } from "@remix-run/react";
import * as React from "react";

export default function BasePage() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
