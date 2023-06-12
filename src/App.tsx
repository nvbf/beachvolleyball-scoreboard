import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import StartPage from "./pages/StartPage";
import Match from "./pages/Match";
import CreateMatch from "./pages/CreateMatch";
import CreateTournament from "./pages/CreateTournament";
import Tournaments from "./pages/Tournaments";
import TournamentAdmin from "./pages/TournamentAdmin";
import TournamentOverlay from "./pages/TournamentOverlay";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/match" element={<CreateMatch />} />
        <Route path="/match/:matchId" element={<Match />} />
        <Route path="/create-tournament" element={<CreateTournament />} />
        <Route path="/tournaments" element={<Tournaments />} />
        <Route
          path="/tournamentadmin/:tournamentSlug"
          element={<TournamentAdmin />}
        />
        <Route path="/tournamentoverlay" element={<TournamentOverlay />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
