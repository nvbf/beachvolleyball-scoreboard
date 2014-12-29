/** @jsx React.DOM  */
'use strict';

var React = require('react'),
  ButtonToolbar = require('react-bootstrap/ButtonToolbar'),
  Button = require('react-bootstrap/Button'),
  Alert = require('react-bootstrap/Alert'),
  OverlayMixin = require('react-bootstrap/OverlayMixin'),
  Modal = require('react-bootstrap/Modal'),
  ModalBodyList = require('./ModalBodyList'),
  ServeOrder;

ServeOrder = React.createClass({
  displayName: function() {
    return 'ServeOrder';
  },

  mixins: [OverlayMixin],

  handleToggle: function() {
    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  },

  getInitialState: function() {
    return {
      isModalOpen: false,
      order: []
    };
  },

  propTypes: {
    match: React.PropTypes.object.isRequired
  },

  awayTeamStarts: function() {
    this.setState({
      startToServe: 'awayteam'
    })
  },

  homeTeamStarts: function() {

    this.setState({
      startToServe: 'hometeam'
    })
  },

  render: function() {
    if (this.state.order.length === 4) {
      return (
        <section>
          <Alert bsStyle='warning'>
            <p>Player to serve: {this.state.order[0]} </p>
          </Alert>
        </section>
      )
    }

    var setHasStarted = this.props.match.getCurrentSet().hasStarted();
    return (
      <section>
        <Alert bsStyle='warning'>
          <ButtonToolbar>
            <Button   onClick={this.handleToggle} disabled={setHasStarted}>Set serve order</Button>
          </ButtonToolbar>
        </Alert>
      </section>
    );
  },

  chosenPlayer: function(names) {
    return function() {
      var order = this.state.order,
        state = {};
      state.order = order;

      order.push(names[0]);
      order.push(names[1]);

      if (order.length === 4) {
        state.isModalOpen = false
      }

      this.setState(state);
    }.bind(this)
  },

  renderOverlay: function() {
    var modalBodyList,
      awayTeam = this.props.match.awayTeam(),
      homeTeam = this.props.match.homeTeam();

    if (!this.state.isModalOpen) {
      return <span/>;
    }
    if ((this.state.startToServe == 'hometeam' && this.state.order.length === 0)
      || (this.state.startToServe == 'awayteam' && this.state.order.length === 2)) {
      modalBodyList = getPlayerModalBodyList(
        homeTeam,
        this.chosenPlayer([homeTeam.player1, awayTeam.player2]),
        this.chosenPlayer([homeTeam.player2, awayTeam.player1])
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
        <Modal title="Serve Order"
          backdrop={false}
          animation={false}
          onRequestHide={this.handleToggle}>
          {modalBodyList}
        </Modal>
      </div>
    );
  }
});

function getTeamModalBodyList(match, homeTeamStarts, awayTeamStarts) {

  var homeTeam = match.homeTeam(),
    awayTeam = match.awayTeam(),
    homeTeamText = homeTeam.player1 + '-' + homeTeam.player2,
    awayTeamText = awayTeam.player1 + '-' + awayTeam.player2;

  return (
    <ModalBodyList
      chosenFirstItem= {homeTeamStarts}
      chosenSecondItem = {awayTeamStarts}
      firstItemText =  {homeTeamText}
      secondItemText = {awayTeamText}
      footerText = "Choose the team that will start serving"
    />
  )
}

function getPlayerModalBodyList(team, chosenFirstItem, chosenSecondItem) {
  return (
    <ModalBodyList
      chosenFirstItem= {chosenFirstItem}
      chosenSecondItem = {chosenSecondItem}
      firstItemText =  {team.player1}
      secondItemText = {team.player2}
      footerText = "Choose the player that will start serving"
    />
  )
}

module.exports = ServeOrder;
