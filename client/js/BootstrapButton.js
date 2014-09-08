/** @jsx React.DOM */
var React = require('react');


exports = module.exports = React.createClass({
    render: function() {
        // transferPropsTo() is smart enough to merge classes provided
        // to this component.
        return this.transferPropsTo(
            <a href="javascript:;" role="button" className="btn">
        {this.props.children}
            </a>
        );
    }
});
