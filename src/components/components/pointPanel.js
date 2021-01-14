import React, { Component } from "react";
import { wrap } from "tide";

import AwayTeam from "../molokyler/away-team";
import HomeTeam from "../molokyler/home-team";

import PropTypes from 'prop-types';

import {
    Button
} from "react-bootstrap";

import {
    MATCH,
    MATCH_IS_FINISED,
    constants as c
} from "../../domain/tide/state";

export default class PointPanel extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const {
            addPointTeam,
            advanced
        } = this.props;

        console.log("rendering pointpanel");
        if(advanced) {
            return (
                <div>
                    <Button style={{ width: '50%', height: '100%' }} bsStyle="primary" className="points" type="submit" onClick={addPointTeam} >
                        Block <span className="glyphicon glyphicon-plus-sign" aria-hidden="true" />
                    </Button>
                    <Button style={{ width: '50%', height: '100%' }} bsStyle="primary" className="points" type="submit" onClick={addPointTeam} >
                        Angrep <span className="glyphicon glyphicon-plus-sign" aria-hidden="true" />
                    </Button>
                    <Button style={{ width: '50%', height: '100%' }} bsStyle="primary" className="points" type="submit" onClick={addPointTeam} >
                        Serve <span className="glyphicon glyphicon-plus-sign" aria-hidden="true" />
                    </Button>
                </div>
            );
        } else {
            return (
                <div>
                    <Button style={{ width: '100%', height: '100%' }} bsStyle="primary" className="points" type="submit" onClick={addPointTeam} >
                        Poeng <span className="glyphicon glyphicon-plus-sign" aria-hidden="true" />
                    </Button>
                    
                </div>
            );
        }
        
    }
}

PointPanel.propTypes = {
    addPointTeam: PropTypes.bool.isRequired,
    advanced: PropTypes.bool.isRequired
};
