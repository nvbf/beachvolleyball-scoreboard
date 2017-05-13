import React, {Component} from 'react';
import styled from 'styled-components';
import hexToRGBA from './utils/rgba';

import {ListGroup} from 'react-bootstrap';
import {ListGroupItem} from 'react-bootstrap';
import {Modal} from 'react-bootstrap';

const ModalBodyList = props => {
	const {
		firstColor,
		secondColor,
		chosenFirstItem,
		chosenSecondItem,
		firstItemText,
		secondItemText,
		footerText,
		showNumber = false
	} = props;

	const FirstColoredLGI = styleLGI(firstColor, chosenFirstItem, firstItemText, showNumber ? 1 : 0);
	const SecondColoredLGI = styleLGI(secondColor, chosenSecondItem, secondItemText, showNumber ? 2 : 0);

	return (
		<div>
			<Modal.Header closeButton>
				<Modal.Title>Service Order</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<ListGroup>
					{FirstColoredLGI}
					{SecondColoredLGI}
				</ListGroup>
				<div className="modal-footer">
					<p>{footerText}</p>
				</div>
			</Modal.Body>
		</div>
	);
};

function styleLGI(color, onClickHandler, text, number) {
	const rgba = hexToRGBA(color);
	console.log(rgba);
	const StyleLGI = styled(ListGroupItem)`
		background-color: ${rgba};
	`;

	if (number) {
		return (
			<StyleLGI onClick={onClickHandler}> <span>{number}</span> {text} </StyleLGI>
		);
	}

	return <StyleLGI onClick={onClickHandler}> {text} </StyleLGI>;
}

ModalBodyList.propTypes = {
	chosenFirstItem: React.PropTypes.func.isRequired,
	chosenSecondItem: React.PropTypes.func.isRequired,
	firstItemText: React.PropTypes.string.isRequired,
	secondItemText: React.PropTypes.string.isRequired,
	footerText: React.PropTypes.string,
	firstDisabled: React.PropTypes.bool,
	secondDisabled: React.PropTypes.bool,
	firstColor: React.PropTypes.string.isRequired,
	secondColor: React.PropTypes.string.isRequired,
	showNumber: React.PropTypes.bool
};

export default ModalBodyList;
