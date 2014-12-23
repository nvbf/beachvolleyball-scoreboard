/** @jsx React.DOM  */
'use strict';

var React = require('react');
var RB = require('react-bootstrap');
var OverlayMixin = RB.OverlayMixin;
var Button = RB.Button;
var Modal = RB.Modal;

var NotificationModal = React.createClass({
    mixins: [OverlayMixin],

    propTypes: {
        eventTrigger: React.PropTypes.string.isRequired,
        match: React.PropTypes.object.isRequired,
        message: React.PropTypes.string.isRequired
    },

    componentDidMount: function () {
        this.props.match.on(this.props.eventTrigger, function () {
            this.handleToggle();
        }.bind(this));
    },

    getInitialState: function () {
        return {
            isModalOpen: false
        };
    },

    handleToggle: function () {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    },

    render: function () {
        return (<span />)

    },

    renderOverlay: function () {
        if (!this.state.isModalOpen) {
            return <span/>;
        }

        return (
            <Modal onRequestHide={this.handleToggle}>
                <div className="modal-body">
                    {this.props.message}
                </div>
                <div className="modal-footer">
                    <Button bsStyle="primary" className="pull-right" onClick={this.handleToggle}>OK</Button>
                </div>
            </Modal>
        );
    }
});


module.exports = NotificationModal;