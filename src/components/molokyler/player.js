import React from 'react';
import Label from '../src/components/atom/team-color-label';

export default ({number, name}) => (
        <div>
            <Label color="#ff00ff" number={2} /> {name}
        </div>
)