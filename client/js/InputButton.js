/** @jsx React.DOM */
var React = require('react');


exports = module.exports = React.createClass({
    render: function() {
        return this.transferPropsTo(
            <input>
        {this.props.children}
            </input>
        );
    }
});


