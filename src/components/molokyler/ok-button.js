import React, {Component} from 'react';

import {
	constants as c
} from '../../domain/tide/state';

import {
	wrap
} from 'tide';

import BasicButton from './BasicButton';

const OkButton = () => {
	return (
		<div>

			<BasicButton className="center-block" bsStyle="primary">Ok</BasicButton>
		</div>
	);
};

export default wrap(OkButton);
