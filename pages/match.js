import React from "react";
import Head from "next/head";
import Main from "./main";

import { startAnonymousAuth, getAuthUser } from "../src/util/auth";

import { Component as TideComponent } from "tide";
import createTide from "./../src/domain/tide/tide";

export default class Match extends React.Component {
  constructor(props) {
    super(props);
    this.tide = createTide();
  }
  componentDidMount() {
    startAnonymousAuth();
  }

  render() {
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
