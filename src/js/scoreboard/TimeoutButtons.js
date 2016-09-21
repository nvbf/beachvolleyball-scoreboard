import React from 'react';
import { Label, Button, ButtonToolbar } from 'react-bootstrap';

const TimeoutMenu = React.createClass({

  restart() {
      location.reload();
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
          <Button bsStyle="danger" type="submit" className="pull-right" onClick={this.restart}>
            New Match
          </Button>
        </ButtonToolbar>
      </div>
    )
  }
});

module.exports = TimeoutMenu;
