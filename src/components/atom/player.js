import React from 'react';
import Label from '../atom/team-color-label';

export default ({number, name, color}) => (
        <div>
            <Label color={color} number={number} /> {name}
        </div>
)