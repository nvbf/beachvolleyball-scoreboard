/** @jsx React.DOM  */
'use strict';
var React = require('react'),
  NotificationModal = require('./NotificationModal'),
  Button = require('react-bootstrap').Button,
  ScoreboardRow = require('./ScoreboardRow'),
  Scoreboard;

Scoreboard = React.createClass({
  displayName: function() {
    return 'Scoreboard';
  },

  componentWillMount: function() {
    var sets = this.props.match.state.sets;
    sets[0].notification = this.props.notification;
    sets[1].notification = this.props.notification;
    sets[2].notification = this.props.notification;

    this.props.notification.on('match-notification', function() {
      this.props.match.state.finished = true;
      this.setState(this.props.match.state);
    }.bind(this));
  },

  handleHide: function() {
    this.refs.changeSideDialog.hidden();
  }.bind(this),

  getInitialState: function() {
    return this.props.match.state;
  },

  pointToHomeTeam: function(event) {
    return function(event) {
      event.preventDefault();
      this.props.match.getCurrentSet().addPointHomeTeam();
      this.setState(this.props.match.state);
    }.bind(this)
  },

  pointToAwayTeam: function(event) {
    return function(event) {
      event.preventDefault();
      this.props.match.getCurrentSet().addPointAwayTeam();
      this.setState(this.props.match.state);
    }.bind(this)
  },

  render: function() {

    var scoreAwayTeam = [
        this.state.sets[0].score[1],
        this.state.sets[1].score[1],
        this.state.sets[2].score[1]
      ],

      scoreHomeTeam = [
        this.state.sets[0].score[0],
        this.state.sets[1].score[0],
        this.state.sets[2].score[0]
      ];

    return (
      <div>
        <div className="switch-modal">
          <NotificationModal message="Sidebytte" eventTrigger="switch-notification" notification={this.props.notification} />
        </div>
        <div className="set-finished-modal">
          <NotificationModal message="Settet er ferdig" eventTrigger="set-notification" notification={this.props.notification} />
        </div>
        <div className="game-finished-modal">
          <NotificationModal message="Kampen er ferdig" eventTrigger="match-notification" notification={this.props.notification} />
        </div>
        <div className="container scoreboard">
          <div className="row">
            <div>
              <div className="row">
                <table>
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
          </div>
        </div>
      </div>
    )
  }
});

module.exports = Scoreboard;
