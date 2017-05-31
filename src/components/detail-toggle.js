import React from 'react';
import styled from 'styled-components';

class DetailsAndClock extends React.Component {
	constructor(props) {
		super(props)
		this.state = {date: new Date()}
	}

	componentDidMount() {
		// this.interval = setInterval(this.updateClock, 1000)
	}

	updateClock = () => {
		this.setState({date: new Date()})
	}

	componentWillUnmount() {
		console.log('unmount')
		clearInterval(this.interval)
	}

	render() {
		const {	date } = this.state;
		return (
			<label>
				<span> Details {formatTime(date)}</span>
			</label>
		);
	}	
};


function formatTime(date) {
	const hour = date.getHours();
	const min = date.getMinutes();
	const sec = date.getSeconds();
	return `${hour}:${min}:${sec}`;
}

export default DetailsAndClock;
