'use strict';

const React = require('react');

var PublicBoard = React.createClass({
  displayName: function() {
    return 'PublicBoard';
  },

  propTypes: {
    hometeam: React.PropTypes.string.isRequired,
    awayteam: React.PropTypes.string.isRequired,
    score: React.PropTypes.array.isRequired
  },

  getDefaultProps: function() {
    return {
      hometeam: '',
      awayteam: '',
      score: [
        [0, 0],
        [0, 0],
        [0, 0],
      ]
    };
  },

  render: function() {
    return (
      <div className="publicboard-container">
        <div className="publicboard">
          <div className="container scoreboard">
            <div className="panel panel-default">
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
                      {this.props.score[0]}
                    </td>
                    <td className='set'>
                      {this.props.score[2]}
                    </td>
                    <td className='set'>
                      {this.props.score[4]}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {this.props.awayteam}
                    </td>
                    <td className='set'>
                      {this.props.score[1]}
                    </td>
                    <td className='set'>
                      {this.props.score[3]}
                    </td>
                    <td className='set'>
                      {this.props.score[5]}
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
