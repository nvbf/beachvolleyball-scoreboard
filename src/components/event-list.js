import React from "react";
import PropTypes from "prop-types";

class EventList extends React.Component {
  render() {
    return (
      <section>
        <Label>Match events</Label>
        <Alert bsStyle="info">{this.props.eventList}</Alert>
      </section>
    );
  }
}

EventList.propTypes = {
  eventList: PropTypes.string.isRequired
};

module.exports = EventList;
