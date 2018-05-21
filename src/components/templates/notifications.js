import React, { Component } from "react";
import { Panel, Button } from "react-bootstrap";

import OkButton from "../molokyler/ok-button";

const NotificationsDialog = ({ children, heading = "Notification" }) => {
  return (
    <div>
      <Panel bsStyle="primary">
        <Panel.Heading>{heading}</Panel.Heading>
        <Panel.Body>{children}</Panel.Body>
        <Panel.Footer>
          <OkButton />
        </Panel.Footer>
      </Panel>
    </div>
  );
};

export default NotificationsDialog;
