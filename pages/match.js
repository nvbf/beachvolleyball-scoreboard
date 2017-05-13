import React from 'react';
import Head from 'next/head';
import Main from './main';

import {Component as TideComponent} from 'tide'
import createTide from './../src/domain/tide/tide';

export default class Match extends React.Component {
    render() {
        const tide = createTide()

        return <div>
                <Head>
                    <title>Scorecard for the Lazy Volleyball Referee</title>
                    <link rel="stylesheet" href="/static/css/bootstrap-3.3.1.css" />
                    <link rel="stylesheet" href="/static/css/app.css" type="text/css"/>
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <script src="/static/js/es5-shim.min.js"></script>
                    <script src="/static/js/es6-shim.min.js"></script>
                    {/* TODO: fix sockets! */}
                    {/*<script src="/socket.io/socket.io.js"></script>*/}
                    <script>
                        {/*window.socket = io();*/}
                    </script>
                </Head>
                <div>
                    <TideComponent tide={tide}>
                        {(props) => <Main {...props} />}
                    </TideComponent>
                </div>
            </div>
    }
}