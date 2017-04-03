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

		const HomeColoredLGI = styleLGI(firstColor, chosenFirstItem, firstItemText);
		const AwayColoredLGI = styleLGI(secondColor, chosenSecondItem, secondItemText);
		
		return (
			<div>
				<Modal.Header closeButton>
					<Modal.Title>Service Order</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<ListGroup>
						{HomeColoredLGI}
						{AwayColoredLGI}
					</ListGroup>
					<div className="modal-footer">
						<p>{footerText}</p>
					</div>
				</Modal.Body>
			</div>
		);
	}
});


function styleLGI(color, onClickHandler, text) {
	const rgba = hexToRGBA(color);
	console.log(rgba)
	const StyleLGI = styled(ListGroupItem)`
		background-color: ${rgba};
	`;

	return <StyleLGI onClick={onClickHandler}> {text} </StyleLGI>
}

module.exports = ModalBodyList;
