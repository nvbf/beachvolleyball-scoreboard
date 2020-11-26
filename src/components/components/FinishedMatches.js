import React from "react";
import FinishedMatch from "./FinishedMatch";

export default function({ matches = [] }) {
  if (!matches.length === 0) {
    return null;
  }
  return (
    <section>
      <h2 className="md-title">Results</h2>
      <div className="older-games">
        <table className="matches-table" cellSpacing="0">
          <thead>
            <tr>
              <th>MatchId</th>
              <th>Teams</th>
              <th>Sets</th>
              <th className="sets">
                <span>1</span> <span>2</span> <span>3</span>{" "}
              </th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match, i) => <FinishedMatch key={i} {...match} />)}
          </tbody>
        </table>
      </div>
    </section>
  );
}
