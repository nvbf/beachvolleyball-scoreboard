'use strict';

const React = require('react');
const ReactDom = require('react-dom');
const NotificationAlerts = require('./NotificationAlerts');
const ScoreboardRow = require('./ScoreboardRow');
const ServeOrder = require('./ServeOrder');
const Timeout = require('./Timeout');
const TimeoutButtons = require('./TimeoutButtons');
const Button = require('react-bootstrap').Button;
const Well = require('react-bootstrap').Well;
const Alert = require('react-bootstrap').Alert;
const AlertInfo = require('./AlertInfo');

var Scoreboard = React.createClass({
    propTypes: {
      match: React.PropTypes.object.isRequired
    },

    componentDidMount() {
      this.props.match.notification.on('match-notification', function() {
        this.props.match.state.finished = true;
        this.setState(this.props.match.state);
      }.bind(this));

      this.props.match.notification.on('set-notification', function() {
        let state = this.props.match.state;
        state.homeTeamTimeout = 0;
        state.awayTeamTimeout = 0;
        this.setState(state);
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

    removePointHomeTeam(event) {
      return function(event) {
        event.preventDefault();
        this.props.match.getCurrentSet().removePointHomeTeam();
        this.setState(this.props.match.state);
      }.bind(this)
    },

    pointToHomeTeam(event) {
      return function(event) {
        event.preventDefault();
        this.props.match.getCurrentSet().addPointHomeTeam();
        this.setState(this.props.match.state);
      }.bind(this)
    },

    removePointAwayTeam(event) {
      return function(event) {
        event.preventDefault();
        this.props.match.getCurrentSet().removePointAwayTeam();
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

    updateState() {
      return function(state) {
        this.setState(state);
      }.bind(this);
    },

    renderEvents() {
      let eventsComponent = [];
      this.state.events.forEach((event, index) => {
        eventsComponent.push(<p key={index}>{event} </p>);
      });

      return (
        <Alert bsStyle='info'>
          <h3>Match details</h3>
          {eventsComponent.reverse()}
        </Alert>
      )
    },

    render() {

      var scoreAwayTeam = [
        this.state.sets[0].score[1],
        this.state.sets[1].score[1],
        this.state.sets[2].score[1]
      ];

      var scoreHomeTeam = [
        this.state.sets[0].score[0],
        this.state.sets[1].score[0],
        this.state.sets[2].score[0]
      ];

      window.socket.emit('match-update', getScoreAndTeam(this.props.match.state));

      return (
        <div>
          <div className="container scoreboard">
            <div className="switch-modal">
              <NotificationAlerts message="Switch"
                                  eventTrigger="switch-notification"
                                  notification={this.props.match.notification}/>
            </div>
            <div className="set-finished-modal">
              <NotificationAlerts message="Set finished"
                                  eventTrigger="set-notification"
                                  notification={this.props.match.notification}/>
            </div>
            <div className="game-finished-modal">
              <NotificationAlerts message="Match finished"
                                  eventTrigger="match-notification"
                                  notification={this.props.match.notification}/>
            </div>
            <div className="timeout-alerts">
              <Timeout seconds={45} message="Timeout: "
                       eventTrigger="timeout-notification"
                       notification={this.props.match.notification}/>
            </div>
            <div className="timeout-alerts">
              <Timeout seconds={45} message="Technical time-out: "
                       eventTrigger="tto-notification" notification={this.props.match.notification}/>
            </div>
            <div className="panel panel-default">
              <div className="panel-heading">
                <h2 className="panel-title">Match standing</h2>
              </div>
              <div className="panel-body">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <td>Teams</td>
                      <td>Set 1</td>
                      <td>Set 2</td>
                      <td>Set 3</td>
                      <td>Add Point</td>
                      <td>Remove Point</td>
                    </tr>
                  </thead>
                  <tbody>
                    <ScoreboardRow
                      pointsToTeam={this.pointToHomeTeam()}
                      removePoint={this.removePointHomeTeam()}
                      scoreForThisTeam={scoreHomeTeam}
                      team={this.props.match.homeTeam()}
                      match={this.props.match}/>
                    <ScoreboardRow
                      pointsToTeam={this.pointToAwayTeam()}
                      removePoint={this.removePointAwayTeam()}
                      scoreForThisTeam={scoreAwayTeam}
                      team={this.props.match.awayTeam()}
                      match={this.props.match}/>
                  </tbody>
                </table>
              </div>
              <div className="panel-footer">
                <TimeoutButtons
                  homeTeamTimeout={this.state.homeTeamTimeout}
                  awayTeamTimeout={this.state.awayTeamTimeout}
                  match={this.props.match}
                  updateState={this.updateState()}
                  />
              </div>
            </div>
            <ServeOrder match={this.props.match}/>
            <section className="events">
              {this.renderEvents()}
            </section>
            <Well>
              <Button bsStyle="primary"> 3 </Button> You can set the service order by clicking the "Set service order" button above. (Optional)
            </Well>
            <Well>
              <Button bsStyle="primary"> 4 </Button> Now you kan keep score with the blue buttons right under "Add Point"
            </Well>
            <h2>Notes for first time users</h2>
            <AlertInfo message='If you do a mistake, you can adjust the score by also using the buttons below "remove point" to get the score right.' />
            <AlertInfo message="When you have set the service order, we will help you keep track of how is serving, It's almost magic." />
            <AlertInfo message='Want to start over or register a new match?  Click on the "new match button"!' />
            <AlertInfo message='You can not set the service order for a set after a points is given' />
            <AlertInfo message="For now it's not possible to change the score after a set or the match is finished."/>
          </div>
        </div>
      )
    }
  })
  ;

function getScoreAndTeam(state) {
  return {
    id: hashCode(state.hometeam.state.player1 + state.hometeam.state.player2 +
      state.awayteam.state.player1 + state.awayteam.state.player2),
    homeTeam: state.hometeam.state,
    awayTeam: state.awayteam.state,
    sets: [state.sets[0].score, state.sets[1].score, state.sets[2].score]
  }
}

function hashCode(hashString) {
  var hash = 0;
  var i;
  var chr;
  var len;
  if (hashString.length === 0) {
    return hash;
  }
  for (i = 0, len = hashString.length; i < len; i++) {
    chr   = hashString.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

module.exports = Scoreboard;
