/** @jsx React.DOM  */
'use strict';
var React = require('react');
var BootstrapButton = require('./BootstrapButton.js');
var Head = require('./Head.js');

React.renderComponent(<BootstrapButton>Fungerer ikke, her jeg stoppet</BootstrapButton>, document.body);
React.renderComponent(<Head/>, document.head);