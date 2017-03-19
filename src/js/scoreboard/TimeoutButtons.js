const React = require('react');
const Button = require('react-bootstrap').Button;
const ButtonToolbar = require('react-bootstrap').ButtonToolbar;
const Label = require('react-bootstrap').Label;

const TimeoutButtons = React.createClass({
  propTypes: {
    homeTeamTimeout: React.PropTypes.number.isRequired,
    awayTeamTimeout: React.PropTypes.number.isRequired,
    updateState: React.PropTypes.func.isRequired
  },

  restart() {
      location.reload();
  },

  showTimeout() {

  },

  onTimeoutHomeTeam(e) {
    e.preventDefault();
  },

  onTimeoutAwayTeam(e) {
    e.preventDefault();
  },

  render: function() {
    return (
      <div>
        <Label>Timeout</Label>
        <ButtonToolbar>
          <Button type="submit"
                  className={(this.props.homeTeamTimeout != 0 ? 'disabled' : '')}
                  onClick={this.onTimeoutHomeTeam}>
                  Bortelag
          </Button>
          <Button type="submit"
                  className={(this.props.awayTeamTimeout != 0 ? 'disabled' : '')}
                  onClick={this.onTimeoutAwayTeam}>
                  Hjemmelag
          </Button>
          <Button bsStyle="danger" type="submit" className="pull-right" onClick={this.restart}>
            New Match
          </Button>
        </ButtonToolbar>
      </div>
    )
  }
});

export default TimeoutButtons;
