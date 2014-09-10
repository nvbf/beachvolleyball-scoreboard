/** @jsx React.DOM  */
'use strict';
var React = require('react');
var BootstrapButton = require('./BootstrapButton.js');
var Head = require('./Head.js');

var App = React.createClass({
  render: function() {    
    return <div class="container">
          <script type="text/javascript" src="js/thirdparty/jquery.min.js" ></script>
          <script type="text/javascript" src="js/thirdparty/bootstrap.min.js"></script>
          <script type="text/javascript" src="js/thirdparty/es5-shim.min.js"></script>
          <script type="text/javascript" src="js/thirdparty/es5-sham.min.js"></script>
          <script type="text/javascript" src="js/thirdparty/console-polyfill.js"></script>

          <div class="row">
              <div className=".col-md-3">
              venstre
              </div>

              <div className=".col-md-6">
                  <div className="input-group input-group-lg">
                      <span className="input-group-addon">@</span>
                      <input type="text" className="form-control" placeholder="Username" />
                  </div>
                  <div>
                      <BootstrapButton className="btn-primary">Lag A</BootstrapButton>
                  </div>
              </div>

              <div className=".col-md-3">
                høyre
              </div>

          </div>

      </div>

  }
});

React.renderComponent(<Head/>, document.head);
React.renderComponent(<App/>, document.body);