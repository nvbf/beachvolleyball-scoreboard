import React, { Component } from "react";
import { Panel, Button } from "react-bootstrap";

import UndoButton from "../molokyler/undo-button";

const ServiceOrderDialog = ({ children, heading = "Service Order" }) => {
  return (
    <div>
      <Panel bsStyle="primary">
        <Panel.Heading>{heading}</Panel.Heading>
        <Panel.Body>{children}</Panel.Body>
        <Panel.Footer>
          <UndoButton />
        </Panel.Footer>
      </Panel>
    </div>
  );
};

export default ServiceOrderDialog;
