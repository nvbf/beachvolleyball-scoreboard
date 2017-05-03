import React, { Component } from 'react';
import Comp  from '../src/components/molokyler/home-team';

import {Component as TideComponent} from 'tide'
import createTide from './../src/domain/tide/tide';

import {
        constants as c
} from '../src/domain/tide/state'
 
export default class TestMain  extends Component {
        constructor(props) {
                super(props)
                this.tide = createTide();
        }
        
        render() {
                return (
                        <TideComponent tide={this.tide}>
                        {(props) => <Comp {...props} />}
                        </TideComponent>
                )
        }
}
