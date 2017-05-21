import React from 'react';
import styled from 'styled-components';

const dt = function DetailsToggle({showDetails, handleDetailsToogle}) {
	return (
		<label>
			<span> Details </span>
		</label>
	);
};

const styledDetailToggle = styled(dt)`
    margin-left: 1rem;
`;

export default styledDetailToggle;
