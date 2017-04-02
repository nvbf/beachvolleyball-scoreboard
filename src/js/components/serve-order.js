const React = require('react');
const ButtonToolbar = require('react-bootstrap').ButtonToolbar;
const Button = require('react-bootstrap').Button;
const Alert = require('react-bootstrap').Alert;
const Modal = require('react-bootstrap').Modal;
const ModalBodyList = require('./modal-body-list');
const ServingOrder = require('./../domain/serving-order');

const ServeOrder = React.createClass({

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

	propTypes: {
		match: React.PropTypes.object.isRequired
	},

	awayTeamStarts() {
		this.props.match.getCurrentSet().setStartServing('awayteam');
		this.setState({
			startToServe: 'awayteam'
		});
	},

	homeTeamStarts() {
		this.props.match.getCurrentSet().setStartServing('hometeam');
		this.setState({
			startToServe: 'hometeam'
		});
	},

	componentDidMount() {
		this.props.match.notification.on('switch-server', () => {
			const servingOrder = this.state.servingOrder;
			if (servingOrder) {
				servingOrder.nextServer();
				this.setState({
					servingOrder
				});
			}
		});

		this.props.match.notification.on('set-notification', () => {
			this.replaceState(this.getInitialState());
		});
	},

	render() {
		if (this.state.order.length === 4) {
			return (
				<section>
					<Alert bsStyle="warning">
						<p>Player to serve: {this.state.servingOrder.toServe()} </p>
					</Alert>
				</section>
			);
		}

		const setHasStarted = this.props.match.getCurrentSet().hasStarted();
		const modal = this.renderOverlay();
		return (
			<section>
				<Alert bsStyle="warning">
					<ButtonToolbar>
						<Button onClick={this.handleToggle} disabled={setHasStarted}>Set service order</Button>
					</ButtonToolbar>
				</Alert>
				{modal}
			</section>

		);
	},

	chosenPlayer(names) {
		return function () {
			const order = this.state.order;
			const state = {};
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

				const orderOfServer = state.servingOrder.getServiceOrder().slice();
				orderOfServer.reverse().forEach((server, i) => {
					this.props.match.addEvent(4 - i + '. ' + server);
				});
				this.props.match.addEvent('Service Order');
			}

			this.setState(state);
		}.bind(this);
	},

	renderOverlay() {
		let modalBodyList;
		const awayTeam = this.props.match.awayTeam();
		const homeTeam = this.props.match.homeTeam();

		if (!this.state.isModalOpen) {
			return null;
		}
		if ((this.state.startToServe === 'hometeam' && this.state.order.length === 0) ||
      (this.state.startToServe === 'awayteam' && this.state.order.length === 2)) {
			modalBodyList = getPlayerModalBodyList(
				homeTeam,
				this.chosenPlayer([homeTeam.player1, homeTeam.player2]),
				this.chosenPlayer([homeTeam.player2, homeTeam.player1])
      );
		} else if ((this.state.startToServe === 'awayteam' && this.state.order.length === 0) ||
      (this.state.startToServe === 'hometeam' && this.state.order.length === 2)) {
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
				<Modal show={this.state.isModalOpen} onHide={this.handleToggle} >
					{modalBodyList}
				</Modal>
			</div>
		);
	}
});

function getTeamModalBodyList(match, homeTeamStarts, awayTeamStarts) {
	const homeTeam = match.homeTeam();
	const awayTeam = match.awayTeam();
	const homeTeamText = homeTeam.player1 + '-' + homeTeam.player2;
	const awayTeamText = awayTeam.player1 + '-' + awayTeam.player2;

	return (
		<ModalBodyList 
			chosenFirstItem={homeTeamStarts}
			chosenSecondItem={awayTeamStarts} 
			firstItemText={homeTeamText}
			secondItemText={awayTeamText} 
			firstColor={match.homeTeamColor()}
			secondColor={match.awayTeamColor()}
			footerText="Choose the team that will start serving" 

		/>
	);
}

function getPlayerModalBodyList(team, chosenFirstItem, chosenSecondItem) {
	return (<ModalBodyList
		chosenFirstItem={chosenFirstItem}
		chosenSecondItem={chosenSecondItem}
		firstItemText={team.player1}
		secondItemText={team.player2}
		footerText="Choose the player that will start serving"/>);
}

module.exports = ServeOrder;
