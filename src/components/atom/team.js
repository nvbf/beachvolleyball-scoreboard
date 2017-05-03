import Label from './team-color-label';

function Team({color, player1, player2}) {
    return(
        <span>
            <Label color={color} /> {player1} - {player2}
        </span>
    )
}

export default Team;