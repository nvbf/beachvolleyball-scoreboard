import React from "react";

import Link from "next/link";

import { getTournaments } from "../../firebase";
import {
  AWAYTEAM_TIMEOUT_TAKEN,
  DEFAULT_SET_LENGTH
} from "../../domain/tide/state";

import { List } from "material-ui";
import styled from "styled-components";
import index from "preact-compat";

const MainMenu = styled.div`
  z-index: 3;
  height: 56px;
  line-height: 56px;
  background-color: #09c; 
`;

const MenuLink = styled.a`
  color: white;
  text-decoration: none;
  font-size: 24px; 
  &:hover a {
      color: white; 
  }
`;

const TournamentList = styled.ul`
 list-style: none;
  padding: 0;
  margin: 0;
`;

const MenuElements = styled.ul`
 list-style: none;
    padding: 0;
    margin: 0;
    text-transform: uppercase;
    max-width: 960px;
    margin-left: auto;
    margin-righT: auto;
`;

const MainMenuElement = styled.ul`
    display: inline-block;
    padding-right: 5px;
    padding-left: 10px;
    border-right: 1px solid #0489b5;
    vertical-align: top; 
    &:hover {
         background-color: #555; 
    }

`;

class Header extends React.Component {
  render() {
    const { tournaments } = this.props;

    return (
      <MainMenu>
        <MenuElements>
          <MainMenuElement>Tournaments</MainMenuElement>
          {listTournaments(tournaments)}
          <MainMenuElement>
            <Link href="/create-tournament">
              <a>Create a new tournament</a>
            </Link>
          </MainMenuElement>
          <MainMenuElement>
            <Link href="/tournaments">
              <MenuLink>See live tournaments</MenuLink>
            </Link>
          </MainMenuElement>
        </MenuElements>
      </MainMenu>
    );
  }
}

Header.getInitialProps = async () => {
  const tournaments = await getTournaments();
  return { tournaments };
};

function listTournaments(tournaments = []) {
  const list = Object.keys(tournaments).map(tournamentKey => {
    const tournament = tournaments[tournamentKey];
    return (
      <li key={tournamentKey}>
        <Link
          href={`/tournament/?slug=${tournament.publicId}`}
          as={`/tournament/${tournament.publicId}`}
        >
          <a>{tournament.name}</a>
        </Link>
      </li>
    );
  });

  return (
    <TournamentList>
      {list}
    </TournamentList>
  );
}

export default Header;
