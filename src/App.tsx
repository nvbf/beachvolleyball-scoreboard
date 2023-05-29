import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import StartPage from './pages/StartPage';
import Match from './pages/Match';
import CreateTournament from './pages/CreateTournament';
import Tournaments from './pages/Tournaments';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/match" element={<Match />} />
        <Route path="/create-tournament" element={<CreateTournament />} />
        <Route path="/tournements" element={<Tournaments />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
