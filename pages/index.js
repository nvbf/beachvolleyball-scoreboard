import React from "react";
import Link from "next/link";

export default () => {
  return (
    <main>
      <h2>Beachvolleyball Scoreboard</h2>
      <ul>
        <li><Link href="/match"><a>Create a new match</a></Link></li>
        <li>
          <Link href="/create-tournament"><a>Create a new tournament</a></Link>
        </li>
        <li><Link href="/tournaments"><a>See live tournaments</a></Link></li>
      </ul>
    </main>
  );
};
