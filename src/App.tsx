import "./App.css";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import StartPage from "./pages/StartPage";
import Match from "./pages/Match";
import CreateMatch from "./pages/CreateMatch";
import CreateTournament from "./pages/CreateTournament";
import Tournaments from "./pages/Tournaments";
import TournamentAdmin from "./pages/TournamentAdmin";
import TournamentView from "./pages/TournamentView";
import GrantAdminAccess from "./pages/GrantAdminAccess";
import ClaimAccess from "./pages/ClaimAccess";
import TournamentOverlayPage from "./pages/TournamentOverlayPage";
import TestTournamentOverlay from "./pages/TestTournamentOverlay";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/match" element={<CreateMatch />} />
        <Route path="/match/:matchId" element={<Match />} />
        <Route path="/create-tournament" element={<CreateTournament />} />
        <Route path="/tournaments" element={<Tournaments />} />
        <Route
          path="/tournament/:tournamentSlug"
          element={<TournamentView />}
        />
        <Route path="/tournament/" element={<TournamentView />} />
        <Route
          path="/tournamentadmin/:tournamentSlug"
          element={<TournamentAdmin />}
        />
        <Route
          path="/testtournamentoverlay"
          element={<TestTournamentOverlay />}
        />
        <Route path="/tournamentoverlay" element={<TournamentOverlayPage />} />
        <Route path="/get-access/:accessCode" element={<GrantAdminAccess />} />
        <Route path="/claim-access/:tournamentSlug" element={<ClaimAccess />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
