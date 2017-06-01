import React from 'react';
import { storiesOf, action, linkTo } from '@storybook/react';
import Button from './Button';
import Welcome from './Welcome';
import Sidenav from './../src/components/organims/sidenav';
import SecondCounter from './../src/components/molokyler/second-counter';


storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

storiesOf('Button', module)
  .add('with text', () => <Button onClick={action('clicked')}>Hello Button</Button>)
  .add('with some emoji', () => <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>);


storiesOf('Sidenav', module)
  .add('basic', () => <Sidenav>Test</Sidenav>)

storiesOf('counter', module)
  .add('count upwards', () => <SecondCounter />)
