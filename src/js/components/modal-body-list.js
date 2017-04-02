import  React from 'react';
import styled from 'styled-components';
import hexToRGBA from './utils/rgba'

const ListGroup = require('react-bootstrap').ListGroup;
const ListGroupItem = require('react-bootstrap').ListGroupItem;
const Modal = require('react-bootstrap').Modal;


const ModalBodyList = React.createClass({

	propTypes: {
		chosenFirstItem: React.PropTypes.func.isRequired,
		chosenSecondItem: React.PropTypes.func.isRequired,
		firstItemText: React.PropTypes.string.isRequired,
		secondItemText: React.PropTypes.string.isRequired,
		footerText: React.PropTypes.string,
		firstDisabled: React.PropTypes.bool,
		secondDisabled: React.PropTypes.bool,
		firstColor: React.PropTypes.string.isRequired,
		secondColor: React.PropTypes.string.isRequired
	},

	render() {
		const {
			firstColor,
			secondColor,
			chosenFirstItem,
			chosenSecondItem,
			firstItemText,
			secondItemText,
			footerText
		} = this.props;

		const homeColoredLGI = styleLGI(); // ListGroupItem;  // styleLGI(firstColor);
		const awayColoredLGI = styleLGI(); //ListGroupItem;  // styleLGI(secondColor);
		

		return (
			<div>
				<Modal.Header closeButton>
					<Modal.Title>Service Order</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<ListGroup>
						<ListGroupItem onClick={chosenFirstItem}> {firstItemText} </ListGroupItem>
						<ListGroupItem onClick={chosenSecondItem}> {secondItemText} </ListGroupItem>
					</ListGroup>
					<div className="modal-footer">
						<p>{footerText}</p>
					</div>
				</Modal.Body>
			</div>
		);
	}
});


function styleLGI(color) {
	const rgba = hexToRGBA(color);
	return styled(ListGroupItem)`
		background-color: ${rgba}
	`;
}

module.exports = ModalBodyList;
