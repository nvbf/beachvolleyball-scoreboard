/** @jsx React.DOM  */
'use strict';

var React = require('react'),
  PublicBoard;

PublicBoard = React.createClass({
  displayName: function() {
    return 'PublicBoard';
  },

  propTypes: {
    match: React.PropTypes.object.isRequired
  },
  
getDefaultProps: function() {
    return {
        hometeam: 'Sindre Svendby - Håkon Tveitan',
        awayteam: 'Geir Eithun - Iver Horrem',
        score: [
          [0,0],
          [0,0],
          [0,0],
        ]
    };
  },  

  render: function() {
    return (
      <div className="publicboard-container">
      <div className="publicboard">
        <div className="container scoreboard">
          <div className="panel panel-default" >
            <div className="panel-heading">
              <h2 className="panel-title">Match standing</h2>
            </div>
            <div className="panel-body">
              <table className="table table-striped">
                  <tr>
                    <td>
                        {this.props.hometeam}
                    </td>
                    <td className='set'>
                      {this.props.score[0][0]}
                    </td>
                    <td className='set'>
                      {this.props.score[0][1]}
                    </td>
                    <td className='set'>
                      {this.props.score[0][2]}
                    </td>
                  </tr>
                  <tr>
                    <td>
                        {this.props.awayteam}
                    </td>
                    <td className='set'>
                      {this.props.score[1][0]}
                    </td>
                    <td className='set'>
                      {this.props.score[1][1]}
                    </td>
                    <td className='set'>
                      {this.props.score[1][2]}
                    </td>
                  </tr>      
              </table>
            </div>
          </div>
        </div>
      </div>
      </div>
    );
  }
});

module.exports = PublicBoard;
