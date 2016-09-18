'use strict';

import React from 'react';

const EventList = React.createClass({
  displayName() {
    return 'EventList';
  },

  propTypes: {
    eventList: React.PropTypes.string.isRequired,
  },

  render() {
    return (
      <section>
        <Label>Match events</Label>
        <Alert bsStyle='info'>
          {this.props.eventList}
        </Alert>
      </section >
    )
  }
});

module.exports = EventList;
