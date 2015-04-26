'use strict';

const React = require('react');
const Button = require('react-bootstrap').Button;
const ButtonToolbar = require('react-bootstrap').ButtonToolbar;
const Label = require('react-bootstrap').Label;

const TimeoutMenu = React.createClass({

  displayName: function() {
    return 'TimeoutMenu';
  },

  propTypes: {
    match: React.PropTypes.object,
    homeTeamTimeout: React.PropTypes.number.isRequired,
    awayTeamTimeout: React.PropTypes.number.isRequired,
    updateState: React.PropTypes.func.isRequired
  },

  showTimeout() {
    this.props.match.notification.emit('timeout-notification');
  },

  onTimeoutHomeTeam(e) {
    e.preventDefault();
    this.props.match.homeTeamTakesTimeout();
    this.props.updateState(this.props.match.state);
    this.showTimeout();
  },

  onTimeoutAwayTeam(e) {
    e.preventDefault();
    this.props.match.awayTeamTakesTimeout();
    this.props.updateState(this.props.match.state);
    this.showTimeout(this.props.match.state.awayteam.display());
  },

  render: function() {
    return (
      <div>
        <Label>Timeout</Label>
        <ButtonToolbar>
          <Button type="submit"
                  className={(this.props.homeTeamTimeout != 0 ? 'disabled' : '')}
                  onClick={this.onTimeoutHomeTeam}>
            {this.props.match.state.hometeam.display()}
          </Button>
          <Button type="submit"
                  className={(this.props.awayTeamTimeout != 0 ? 'disabled' : '')}
                  onClick={this.onTimeoutAwayTeam}>
            {this.props.match.state.awayteam.display()}
          </Button>
          <Button className="pull-right" bsStyle="warning">
            Undo
          </Button>
        </ButtonToolbar>
      </div>
    )
  }
});

module.exports = TimeoutMenu;
