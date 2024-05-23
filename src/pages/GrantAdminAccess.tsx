import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./../store/store"; // update the path to your store file
import MatchView from "../components/tournamentAdmin/matchView";
import { Box, Button, Grid } from "@mui/material";
import { useParams } from "react-router-dom";
import { Sort } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import { getMatchState, getStatusColor, parseAdminMatch } from "../components/tournamentAdmin/adminMatchFunctions";
import { AdminMatch, MatchState } from "../components/tournamentAdmin/types";
import { dateStringToString } from "../util/time";
import { chooseCourt, chooseDay, fetchMatchesRequest, updateMatch } from "../store/tournamentAdmin/reducer";
import AppBarMain from "../components/appbar";
import { getUID } from "../firebase/auth";
import { getAuth } from "firebase/auth";

const GrantAdminAccess = () => {
  const params = useParams();

  const accessCode: string = params.accessCode ? params.accessCode : ""
  const navigate = useNavigate(); // Initialize navigate function
  useEffect(() => {
    const fetchData = async () => {
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

        const response = await fetch(`https://tournament-sync.herokuapp.com/admin/v1/access/${accessCode}`, {
          redirect: 'follow', // Ensure redirects are followed
          headers: {
            'Authorization': `Bearer ${idToken}`, // Include the ID token in the Authorization header
          },
        });

        if (response.status === 403) {
          throw new Error('Forbidden: Access is denied');
        }

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();

        if (data.slug) {
          window.location.href = `/tournamentadmin/${data.slug}`; // Use navigate to handle the redirection
        } else {
          console.error('Error: No slug returned in the response');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, [accessCode]); // Dependency array ensures this effect runs when accessCode changes

  return (
    <div>

      {/* <ThemeProvider> */}
      <div>
        <AppBarMain />
        <div>
          <ul>
            <li>You tried something you are not allowed to do! </li>
            <li>Go away!</li>
            <li>
              If not you will get a bad sun burn!
            </li>
          </ul>
          <p>
            {" "}Enjoy the beach!{" "}
          </p>
        </div>
      </div>
      {/* </ThemeProvider> */}
    </div>
  );
}
export default GrantAdminAccess;
