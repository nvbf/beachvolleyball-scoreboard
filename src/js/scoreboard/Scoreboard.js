import React from 'react';
import ReactDom from 'react-dom';
import { Button, Well, Alert } from 'react-bootstrap';
import { connect } from 'react-redux'

import { TEAM } from './../constants'

const NotificationAlerts = require('./NotificationAlerts');
import ScoreboardRow from './ScoreboardRow';
const ServeOrder = require('./ServeOrder');
const Timeout = require('./Timeout');
import TimeoutButtons from './TimeoutButtons';
const AlertInfo = require('./AlertInfo');

const Scoreboard = React.createClass({
    propTypes: {
      score: React.PropTypes.object.isRequired,
      events: React.PropTypes.array.isRequired,
    },

    renderEvents() {
      // let eventsComponent = [];
      // this.props.events.forEach((event, index) => {
      //   eventsComponent.push(<p key={index}>{event} </p>);
      // });

      return (
        <Alert bsStyle='info'>
          <h3>Match details</h3>
          {eventsComponent.reverse()}
        </Alert>
      )
    },

    render() {
      const { hometeam, awayteam } = this.props;

      return (
        <div>
          <div className="container scoreboard">
            <div className="switch-modal">
              <NotificationAlerts message="Switch"
                                  eventTrigger="switch-notification"
                                  />
            </div>
            <div className="set-finished-modal">
              <NotificationAlerts message="Set finished"
                                  eventTrigger="set-notification"
                                  />
            </div>
            <div className="game-finished-modal">
              <NotificationAlerts message="Match finished"
                                  eventTrigger="match-notification"
                                  />
            </div>
            <div className="timeout-alerts">
              <Timeout seconds={45} message="Timeout: "
                       eventTrigger="timeout-notification"
                       />
            </div>
            <div className="timeout-alerts">
              <Timeout seconds={45} message="Technical time-out: "
                       eventTrigger="tto-notification" />
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
                    </tr>
                  </thead>
                  <tbody>
                    <ScoreboardRow players={hometeam.get('players')} />
                    <ScoreboardRow players={awayteam.get('players')} />
                  </tbody>
                </table>
                <Button className="pull-right undo" bsStyle="warning" type="submit">
                  Undo last point
                </Button>
              </div>
              <div className="panel-footer">
                <TimeoutButtons />
              </div>
            </div>
            <ServeOrder />
            <section className="events">
              {/* {this.renderEvents()} */}
            </section>
            <Well>
              <Button bsStyle="primary"> 3 </Button> You can set the service order by clicking the "Set service order" button above. (Optional)
            </Well>
            <Well>
              <Button bsStyle="primary"> 4 </Button> Now you kan keep score with the blue buttons right under "Add Point"
            </Well>
            <h2>Notes for first time users</h2>
            <AlertInfo message='If you do a mistake, you can adjust the score by also using the buttons below "remove point" to get the score right' />
            <AlertInfo message="When you have set the service order, we will help you keep track of how is serving, It's almost magic." />
            <AlertInfo message='Want to start over or register a new match?  Click on the "new match button"!' />
            <AlertInfo message='You can not set the service order for a set after a points is given' />
            <AlertInfo message="For now it's not possible to change the score after a set or the match is finished."/>
            <AlertInfo message="If you need to use the remove points button the service order may be wrong afterwards! ."/>
          </div>
        </div>
      )
    }
  });


Scoreboard.contextTypes = {
  store: React.PropTypes.object
}

const mapStateToProps = (state) => {
  return {
    awayteam: state[TEAM].get("awayteam"),
    hometeam: state[TEAM].get("hometeam")
  }
}

const ScoreboardConnect = connect(
  mapStateToProps,
)(Scoreboard)

module.exports = ScoreboardConnect;
