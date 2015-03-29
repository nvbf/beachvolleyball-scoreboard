const React = require('react');
const ButtonToolbar = require('react-bootstrap/ButtonToolbar');
const Button = require('react-bootstrap/Button');
const Alert = require('react-bootstrap/Alert');
const OverlayMixin = require('react-bootstrap/OverlayMixin');
const Modal = require('react-bootstrap/Modal');
const ModalBodyList = require('./ModalBodyList');
const ServingOrder = require('./../domain/ServingOrder');

var ServeOrder = React.createClass({
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
    this.props.match.getCurrentSet().setStartServing('awayteam');
    this.setState({
      startToServe: 'awayteam'
    })
  },

  homeTeamStarts: function() {
    this.props.match.getCurrentSet().setStartServing('hometeam');
    this.setState({
      startToServe: 'hometeam'
    })
  },

  componentDidMount: function() {
    this.props.match.notification.on('switch-server', function() {
      var servingOrder = this.state.servingOrder;
      if (servingOrder) {
        servingOrder.nextServer();
        this.setState({
          servingOrder: servingOrder
        })
      }
    }.bind(this));

    this.props.match.notification.on('set-notification', function() {
      this.replaceState(this.getInitialState());
    }.bind(this));
  },

  render: function() {
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
    return (
      <section>
        <Alert bsStyle='warning'>
          <ButtonToolbar>
            <Button onClick={this.handleToggle} disabled={setHasStarted}>Set serve order</Button>
          </ButtonToolbar>
        </Alert>
      </section>
    );
  },

  chosenPlayer: function(names) {
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
      }

      this.setState(state);
    }.bind(this)
  },

  renderOverlay: function() {
    var modalBodyList;
    var awayTeam = this.props.match.awayTeam();
    var homeTeam = this.props.match.homeTeam();

    if (!this.state.isModalOpen) {
      return <span/>;
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
        <Modal title="Service Order"
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
