'use strict';

const React = require('react');
const ReactDom = require('react-dom');
const PublicBoard = require('./public-board');
const Main = require('./main');

const Router = React.createClass({
	splitUpKeyValue(param) {
		return param.split('=');
	},

	areKeyId(keyValue) {
		return (keyValue[0] === 'match');
	},

	render() {
		let matchId;
		const getParams = document.location.search.substring(1).split('&');
		const idArgument =
      getParams
        .map(this.splitUpKeyValue)
        .filter(this.areKeyId);

		if (idArgument[0]) {
			matchId = idArgument[0][1];
		}

		if (matchId) {
			return <PublicBoard matchId={matchId} />;
		}
		return <Main />;
	}
});

window.React = React;
ReactDom.render(<Router />, document.getElementById('app'));
