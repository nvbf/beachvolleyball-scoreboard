import React from 'react';
import Toggle from 'react-toggle';
import styled from 'styled-components';

const dt = function DetailsToggle({showDetails, handleDetailsToogle}) {
	return (
		<label>
			<Toggle
				defaultChecked={showDetails}
				onChange={handleDetailsToogle}
				/>
			<span> Details </span>
		</label>
	);
};

const styledDetailToggle = styled(dt)`
    margin-left: 1rem;
`;

export default styledDetailToggle;
