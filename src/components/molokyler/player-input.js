import React from 'react';
import { FormControl } from 'react-bootstrap'

export default () => (
	<div>
		<div className="form-group">
			<FormControl type="text" id="player1" className="form-control" placeholder="Player 1" />
		</div>
		<div className="form-group">
			<FormControl type="text" id="player2" className="form-control" placeholder="Player 2" />
		</div>
	</div>
);
