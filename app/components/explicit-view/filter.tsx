import { Box } from "@chakra-ui/react";
import * as React from "react";
import FilterBase from "../view/filter-base";

function Filter() {
  return (
    <div>
      <Box mb="3" textColor="gray.400">
        In this view, show records
      </Box>
      <FilterBase />
    </div>
  );
}

export default Filter;
