import React from 'react';
const ButtonToolbar = require('react-bootstrap').ButtonToolbar;
const Button = require('react-bootstrap').Button;
const Alert = require('react-bootstrap').Alert;
const Modal = require('react-bootstrap').Modal;
const ModalBodyList = require('./ModalBodyList');
const ServingOrder = require('./../domain/ServingOrder');

var ServeOrder = React.createClass({

  handleToggle() {
    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  },

  getInitialState() {
    return {
      isModalOpen: false,
      order: []
    };
  },

  awayTeamStarts() {
  },

  homeTeamStarts() {
  },

  componentDidMount() {
  },

  render() {
    return null;

    if (this.state.order.length === 4) {
      return (
        <section>
          <Alert bsStyle='warning'>
            <p>Player to serve: {this.state.servingOrder.toServe()} </p>
          </Alert>
        </section>
      )
    }

    var setHasStarted = this.props.match.getCurrentSet().hasStarted();
    const modal = this.renderOverlay();
    return (
      <section>
        <Alert bsStyle='warning'>
          <ButtonToolbar>
            <Button onClick={this.handleToggle} disabled={setHasStarted}>Set service order</Button>
          </ButtonToolbar>
        </Alert>
        {modal}
      </section>

    );
  },

  chosenPlayer(names) {
    return function() {
      var order = this.state.order;
      var state = {};
      state.order = order;

      if (order.length === 2) {
        order.splice(1, 0, names[0]);
        order.push(names[1]);

      } else {
        order.push(names[0]);
        order.push(names[1]);
      }
      if (order.length === 4) {
        state.isModalOpen = false;
        state.servingOrder = new ServingOrder(order);

        let orderOfServer = state.servingOrder.getServiceOrder().slice();
        orderOfServer.reverse().forEach((server, i) => {
          this.props.match.addEvent(4 -i +'. ' + server);
        })
        this.props.match.addEvent('Service Order')
      }

      this.setState(state);
    }.bind(this)
  },

  renderOverlay() {
    var modalBodyList;
    var awayTeam = this.props.match.awayTeam();
    var homeTeam = this.props.match.homeTeam();

    if (!this.state.isModalOpen) {
      return null;
    }
    if ((this.state.startToServe == 'hometeam' && this.state.order.length === 0)
      || (this.state.startToServe == 'awayteam' && this.state.order.length === 2)) {
      modalBodyList = getPlayerModalBodyList(
        homeTeam,
        this.chosenPlayer([homeTeam.player1, homeTeam.player2]),
        this.chosenPlayer([homeTeam.player2, homeTeam.player1])
      );
    } else if ((this.state.startToServe == 'awayteam' && this.state.order.length === 0)
      || (this.state.startToServe == 'hometeam' && this.state.order.length === 2)) {
      modalBodyList = getPlayerModalBodyList(
        awayTeam,
        this.chosenPlayer([awayTeam.player1, awayTeam.player2]),
        this.chosenPlayer([awayTeam.player2, awayTeam.player1])
      );
    } else {
      modalBodyList = getTeamModalBodyList(this.props.match, this.homeTeamStarts, this.awayTeamStarts);
    }
    return (

      <div className="static-modal">
        <Modal
               show={this.state.isModalOpen}
               onHide={this.handleToggle}>
          {modalBodyList}
        </Modal>
      </div>
    );
  }
});

function getTeamModalBodyList(match, homeTeamStarts, awayTeamStarts) {

  var homeTeam = match.homeTeam();
  var awayTeam = match.awayTeam();
  var homeTeamText = homeTeam.player1 + '-' + homeTeam.player2;
  var awayTeamText = awayTeam.player1 + '-' + awayTeam.player2;

  return (
    <ModalBodyList
      chosenFirstItem={homeTeamStarts}
      chosenSecondItem={awayTeamStarts}
      firstItemText={homeTeamText}
      secondItemText={awayTeamText}
      footerText="Choose the team that will start serving"
      />
  )
}

function getPlayerModalBodyList(team, chosenFirstItem, chosenSecondItem) {
  return (
    <ModalBodyList
      chosenFirstItem={chosenFirstItem}
      chosenSecondItem={chosenSecondItem}
      firstItemText={team.player1}
      secondItemText={team.player2}
      footerText="Choose the player that will start serving"
      />
  )
}

module.exports = ServeOrder;
