'use strict';

const React = require('react');
const NotificationAlerts = require('./NotificationAlerts');
const ScoreboardRow = require('./ScoreboardRow');
const ServeOrder = require('./ServeOrder');
const Timeout = require('./Timeout');


var Scoreboard = React.createClass({
  displayName() {
    return 'Scoreboard';
  },

  propTypes: {
    match: React.PropTypes.object.isRequired
  },

  componentDidMount() {
    this.props.match.notification.on('match-notification', function() {
      this.props.match.state.finished = true;
      this.setState(this.props.match.state);
    }.bind(this));
  },

  getInitialState() {
    return this.props.match.state;
  },

  pointToHomeTeam(event) {
    return function(event) {
      event.preventDefault();
      this.props.match.getCurrentSet().addPointHomeTeam();
      this.setState(this.props.match.state);
    }.bind(this)
  },

  pointToAwayTeam(event) {
    return function(event) {
      event.preventDefault();
      this.props.match.getCurrentSet().addPointAwayTeam();
      this.setState(this.props.match.state);
    }.bind(this)
  },

  render() {

    var scoreAwayTeam = [
        this.state.sets[0].score[1],
        this.state.sets[1].score[1],
        this.state.sets[2].score[1]
      ];

    var  scoreHomeTeam = [
        this.state.sets[0].score[0],
        this.state.sets[1].score[0],
        this.state.sets[2].score[0]
      ];

    return (
      <div>
        <div className="container scoreboard">
          <div className="switch-modal">
            <NotificationAlerts message="Switch"
                                eventTrigger="switch-notification"
                                notification={this.props.match.notification} />
          </div>
          <div className="set-finished-modal">
            <NotificationAlerts message="Set finished"
                                eventTrigger="set-notification"
                                notification={this.props.match.notification} />
          </div>
          <div className="game-finished-modal">
            <NotificationAlerts message="Match finished"
                                eventTrigger="match-notification"
                                notification={this.props.match.notification} />
          </div>
          <div className="timeout-alerts">
            <Timeout seconds={30} message="Timeout: "
                     eventTrigger="timeout-notification"
                     notification={this.props.match.notification} />
          </div>
          <div className="timeout-alerts">
            <Timeout seconds={60} message="Technical time-out: "
                     eventTrigger="tto-notification" notification={this.props.match.notification} />
          </div>
          <div className="panel panel-default" >
            <div className="panel-heading">
              <h2 className="panel-title">Match standing</h2>
            </div>
            <div className="panel-body">
              <table className="table table-striped">
                <ScoreboardRow
                  pointsToTeam={this.pointToHomeTeam()}
                  scoreForThisTeam={scoreHomeTeam}
                  team={this.props.match.homeTeam()}
                  match={this.props.match} />
                <ScoreboardRow
                  pointsToTeam={this.pointToAwayTeam()}
                  scoreForThisTeam={scoreAwayTeam}
                  team={this.props.match.awayTeam()}
                  match={this.props.match} />
              </table>
            </div>
          </div>
          <ServeOrder  match={this.props.match} />
        </div>
      </div>
    )
  }
});

module.exports = Scoreboard;
