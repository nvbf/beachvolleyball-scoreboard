import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import AppBarMain from "../components/appbar";
import { getUID } from "../firebase/auth";
import { getAuth } from "firebase/auth";

const ClaimAccess = () => {
  const params = useParams();

  const tournamentSlug: string = params.tournamentSlug ? params.tournamentSlug : ""
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

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/v1/claim`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${idToken}`, // Include the ID token in the Authorization header
            'Content-Type': 'application/json', // Set Content-Type header to application/json
          },
          body: JSON.stringify({
            slug: tournamentSlug,
            tournamentID: "",
            email: ""
          }),
        });

        if (response.status === 403) {
          throw new Error('Forbidden: Access is denied');
        }

        if (response.redirected) {
          console.log('Redirected to:', response.url);
          navigate(response.url); // Use navigate to handle the redirection
          return;
        }

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, [tournamentSlug]); // Dependency array ensures this effect runs when accessCode changes

  return (
    <div>

      {/* <ThemeProvider> */}
      <div>
        <AppBarMain />
        <div>
          <ul>
          </ul>
          <p>
            {" "}Mail sent!{" "}
          </p>
        </div>
      </div>
      {/* </ThemeProvider> */}
    </div>
  );
}
export default ClaimAccess;
