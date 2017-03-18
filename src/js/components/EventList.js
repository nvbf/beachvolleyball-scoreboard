'use strict';

const React = require('react');

const EventList = React.createClass({

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
