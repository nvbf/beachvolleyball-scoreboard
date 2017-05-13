import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import Team from '../src/components/atom/team';

storiesOf('team', module)
  .add('basic team', () => (
    <Team player1="Sindre" player2="Per" color="#ff00ff" />
  ))