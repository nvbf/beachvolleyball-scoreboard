import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUID } from "../firebase/auth";
import { getAuth } from "firebase/auth";
import { Grid, Typography, TextField, Button, Alert } from "@mui/material";
import AppBarMain from "../components/appbar";

const ClaimAccess = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [tournamentId, setTournamentId] = useState(0);
  const [emailValid, setEmailValid] = useState(false);
  const [tournamentIdValid, setTournamentIdValid] = useState(false);
  const [error, setError] = useState('');

  const tournamentSlug: string = params.tournamentSlug ? params.tournamentSlug : ""

  function handleEmail(value: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValid(emailRegex.test(value));
    setEmail(value);
  }

  function handleTournamentId(value: string) {
    const isNumber = /^\d+$/.test(value);
    setTournamentIdValid(isNumber);
    setTournamentId(isNumber ? parseInt(value, 10) : 0); // Converts the string to an integer if valid
  }

  const handleSubmit = async () => {
    if (!emailValid || !tournamentIdValid) {
      setError('Please fill out the form correctly.');
      return;
    }
    claimAccess();
  };

  const claimAccess = async () => {
    try {
      const uid = await getUID()
      console.log('Logged in with uid', uid)

      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        throw new Error('User is not authenticated');
      }

      const idToken = await user.getIdToken(); // Retrieve the Firebase ID token

      console.log('Logged in with uid', user.uid);

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/v1/claim`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`, // Include the ID token in the Authorization header
          'Content-Type': 'application/json', // Set Content-Type header to application/json
        },
        body: JSON.stringify({
          slug: tournamentSlug,
          tournamentID: tournamentId,
          email: email
        }),
      });

      if (response.status === 403) {
        throw new Error('Forbidden: Access is denied');
      }

      if (response.redirected) {
        setError('');
        console.log('Redirected to:', response.url);
        navigate(response.url); // Use navigate to handle the redirection
        return;
      }

      if (!response.ok) {
        if (response.status === 400) {
          setError('Tournament ID was not correct.');
          return
        }
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setError('');
      console.log(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <AppBarMain />
      <Grid container spacing={5} justifyContent="center" sx={{ marginTop: '50px' }}>
        <Grid item xs={12}>
          <Typography variant="h5">Request access for {params.tournamentSlug}</Typography>
        </Grid>
        {error && (
          <Grid item xs={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}
        <Grid item md={6} xs={12}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            error={!emailValid && email !== ''}
            helperText={!emailValid && email !== '' ? "Invalid email address" : ''}
            value={email}
            onChange={(e) => handleEmail(e.target.value)}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <TextField
            fullWidth
            label="TournamentID"
            error={!tournamentIdValid && tournamentId !== 0}
            helperText={!tournamentIdValid && tournamentId !== 0 ? "Invalid tournament ID (must be a digit)" : ''}
            value={tournamentId}
            onChange={(e) => handleTournamentId(e.target.value)}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <Button
            fullWidth
            variant="contained"
            disabled={!emailValid || !tournamentIdValid}
            onClick={handleSubmit}
          >
            Request access
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default ClaimAccess;
