import React, {Component} from 'react';
import {wrap} from 'tide'

// import ServiceOrder from '../src/components/molokyler/service-order';

import {
        SHOW_COMPONENT
} from '../src/domain/tide/state';

import createTide from './../src/domain/tide/tide';

const Test = ({ LAST_SET_LENGTH }) => {
        return <h1>{LAST_SET_LENGTH}</h1>
}

import {Component as TideComponent} from 'tide'

export default class TestMain  extends Component {

        // componentDidMount() {
        //         const tideI = new createTide();
        //         this.setState({ "tideI": tideI})
        // }

        render() {
                const tide = createTide()
                return (
                        <TideComponent tide={tide}>
                                {(props) => <Test {...props} />}
                        </TideComponent>
                )
        }
}
