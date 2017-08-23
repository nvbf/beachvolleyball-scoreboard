import React from "react";
import LiveMatch from "./LiveMatch";

export default function({ matches = [] }) {
  if (matches.length === 0) {
    return null;
  }
  return (
    <section>
      <h2 className="md-title">Live</h2>
      {matches.map((match, i) => <LiveMatch key={i} {...match} />)}
    </section>
  );
}
