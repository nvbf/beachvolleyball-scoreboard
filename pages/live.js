import React from 'react'
import Head from 'next/head';

export default class LivePage extends React.Component {

  componentDidMount() {
    startSocket();
  }

  render() {
    return (
      <div>
      <Head>
        <script src="/socket.io/socket.io.js"></script>
        <script src="http://code.jquery.com/jquery-1.11.1.js"></script>
      </Head>

    <h1>Live Score All Matches - Nevza Oslo 2016 </h1>

    <h3> Matches </h3>

    <table className="table" id="matches">
      <thead>
        <tr>
          <th>Teams</th>
          <th>Set 1</th>
          <th>Set 2</th>
          <th>Set 3</th>
        </tr>
      </thead>
    </table>


    <p>* This is a real-time list of changes since you connected. the scores will appear as soon as there are changes in any matches</p>
    </div>
    )
  }
}

function formatMatch(match) {
  var team = match.homeTeam.player1 + '/' + match.homeTeam.player2 + ' - ' + match.awayTeam.player1 + '/' + match.awayTeam.player2;
  var score = '<td>' + match.sets[0][0] + '-' + match.sets[0][1] + '</td><td>' +
              match.sets[1][0] + '-' + match.sets[1][1] +'</td><td>'  +
              match.sets[2][0] + '-' + match.sets[2][1] + '</td>'
  var newMatchNode = '<tr id="match-' + match.id +'"><td>' + team + '</td>' + score
  var matchNode = $('#match-' + match.id);
  if(matchNode.length > 0) {
    matchNode.replaceWith(newMatchNode);
  } else {
    $('#matches').prepend(newMatchNode);
  }
}

 function startSocket(timeout = 2) {
    
    if(window.io) {
      window.socket = io();  
      socket.on('match-update', function(match){
          console.log('id: ', match.id)
          formatMatch(match)
      });
    } else {
      window.setTimeout(startSocket.bind(null, timeout*3), timeout);
    }

  }