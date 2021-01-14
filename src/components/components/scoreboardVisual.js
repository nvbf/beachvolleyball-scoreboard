import React, { Component } from "react";
import { wrap } from "tide";

import AwayTeam from "../molokyler/away-team";
import HomeTeam from "../molokyler/home-team";

import PropTypes from 'prop-types';

import PointPanel from "./pointPanel"

import {
    Button
  } from "react-bootstrap";

import {
    MATCH,
    MATCH_IS_FINISED,
    constants as c
} from "../../domain/tide/state";

  export default class ScoreboardVisual extends Component {
    constructor(props) {
        super(props)
  }

  render() {
    const {
        MATCH_IS_FINISED,
        addPointHome,
        addPointAway,
        advanced
      } = this.props;

  console.log("rendering scoreboard visual");
  return (
    <div>
        <span style={{opacity: '1.0', position: 'absolute', bottom:'33%',right: '65%', width: '20%', height: '40%'}}>
            <HomeTeam/>
            <PointPanel
                addPointTeam={addPointHome} advanced={advanced} />
        </span>

        <span style={{opacity: '1.0', position: 'absolute', bottom:'33%',left: '60%', width: '20%', height: '40%'}}>
            <AwayTeam/>
            <PointPanel
                addPointTeam={addPointAway} advanced={advanced}/>
        </span>  
    </div>
  );}
}

ScoreboardVisual.propTypes = {
    addPointHome: PropTypes.bool.isRequired,
    addPointAway: PropTypes.bool.isRequired,
    matchFinished: PropTypes.bool.isRequired,
    advanced: PropTypes.bool.isRequired
};