'use strict';
var React = require('react');

var AddTeam = React.createClass({
  displayName: function() {
    return 'AddTeam';
  },

  propTypes: {
    optionalArray: React.PropTypes.array
  },

  render: function() {
    return (
      <div className="panel panel-default" >
        <div className="panel-heading">
          <h2>Add Teams</h2>
        </div>
        <div className="panel-body">
          <form className="add-team-form" onSubmit={this.handleSubmit}>
            <div>
              <div className="form-group">
                <Input type="text" id='player1' className="form-control" placeholder="Player 1" />
              </div>
              <div className="form-group">
                <Input type="text" id='player2' className="form-control" placeholder="Player 2" />
              </div>
            </div>
            <Button type="submit" bsStyle="primary" className="pull-right">
              Add Teams
            </Button>
          </form>
        </div>
      </div>
    );
  }
});

module.exports = AddTeam;
