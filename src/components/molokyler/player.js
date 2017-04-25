import React from 'react';
import Label from '../atom/team-color-label';

export default ({number, name, color = "#ff00ff"}) => (
        <div>
            <Label color={color} number={number} /> {name}
        </div>
)