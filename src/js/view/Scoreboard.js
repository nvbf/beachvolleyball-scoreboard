/** @jsx React.DOM  */
'use strict';
var React = require('react'),
  NotificationModal = require('./NotificationModal'),
  Button = require('react-bootstrap').Button,
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
  },

  handleHide: function() {
    this.refs.changeSideDialog.hidden();
  }.bind(this),

  getInitialState: function() {
    return this.props.match.state;
  },

  pointToHomeTeam: function(event) {
    event.preventDefault();
    this.props.match.getCurrentSet().addPointHomeTeam();
    this.setState(this.props.match.state);
  },

  pointToAwayTeam: function(event) {
    event.preventDefault();
    this.props.match.getCurrentSet().addPointAwayTeam();
    this.setState(this.props.match.state);
  },

  render: function() {
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
                  <tr>
                    <td>
                      <span className='names'>
                      {this.props.match.homeTeam().player1} - {this.props.match.homeTeam().player2}
                      </span>
                    </td>
                    <td className='set'>
                    {this.state.sets[0].score[0]}
                    </td>
                    <td className='set'>
                    {this.state.sets[1].score[0]}
                    </td>
                    <td className='set'>
                    {this.state.sets[2].score[0]}
                    </td>
                    <td>
                      <Button className='points btn-primary' type="submit" onClick={this.pointToHomeTeam}>
                        <span className="glyphicon glyphicon-plus-sign" aria-hidden="true"/>
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className='names'>
                      {this.props.match.awayTeam().player1} - {this.props.match.awayTeam().player2}
                      </span>
                    </td>
                    <td className='set'>
                    {this.state.sets[0].score[1]}
                    </td>
                    <td className='set'>
                    {this.state.sets[1].score[1]}
                    </td>
                    <td className='set'>
                    {this.state.sets[2].score[1]}
                    </td>
                    <td>
                      <Button className="points btn-primary" type="submit" onClick={this.pointToAwayTeam}>
                        <span className="glyphicon glyphicon-plus-sign" aria-hidden="true"></span>
                      </Button>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
})
;

module.exports = Scoreboard;
