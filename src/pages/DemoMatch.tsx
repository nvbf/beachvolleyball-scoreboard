import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/store';
import {
    addHomeTeam,
    addAwayTeam,
    setId,
    setMatchId,
    setTournamentId,
    setTeamColor,
    persistUser,
    resetMatch,
} from '../store/match/reducer';
import { TeamType } from '../components/types';
import { v4 } from 'uuid';

function DemoMatch() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const demoId = 'demo_' + v4();

        dispatch(resetMatch());
        dispatch(addHomeTeam({ player1Name: 'Alice', player2Name: 'Bob' }));
        dispatch(addAwayTeam({ player1Name: 'Charlie', player2Name: 'Dave' }));
        dispatch(setTeamColor({ team: TeamType.Home, color: '#0057A8' }));
        dispatch(setTeamColor({ team: TeamType.Away, color: '#E63946' }));
        // Use non-"null" values so the scoreboard doesn't show the Loading screen
        dispatch(setMatchId('demo'));
        dispatch(setTournamentId('demo'));
        dispatch(setId(demoId));
        // Pre-set a fake userId so the auth check in Match.tsx is satisfied
        dispatch(persistUser('demo'));

        navigate('/match/' + demoId);
    }, []);

    return null;
}

export default DemoMatch;
