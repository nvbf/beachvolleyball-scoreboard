import React from "react";
import Head from "next/head";
import Main from "./main";

import {startAnonymousAuth, getAuthUser, addObserverOnLoginStatus} from "../src/util/auth";

import { Component as TideComponent } from "tide";
import createTide from "./../src/domain/tide/tide";

export default class Match extends React.Component {
  constructor(props) {
    super(props);
    this.tide = createTide();
    this.state = {
      authenticating: true,
    }
  }
  componentDidMount() {
    const self = this;
    startAnonymousAuth()
    addObserverOnLoginStatus((user) => {
      if (user) {
        self.setState(
          {
            authenticating: false,
            authFailed: false
          })
      }
    })
  }

  render() {
    const { authenticating} = this.state;

    if (authenticating) {
      console.log('Match: Authenticating')
      return <div>Authenticating</div>
    };

    return (
      <div>
        <Head>
          <title>Scorecard for the Lazy Volleyball Referee</title>
          <link rel="stylesheet" href="/static/css/bootstrap-3.3.1.css" />
          <link rel="stylesheet" href="/static/css/app.css" type="text/css" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <script src="/static/js/es5-shim.min.js" />
          <script src="/static/js/es6-shim.min.js" />
        </Head>
        <div>
          <TideComponent tide={this.tide}>
            {props => <Main {...props} />}
          </TideComponent>
        </div>
      </div>
    );
  }
}
