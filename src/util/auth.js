import firebase from "firebase";
import debug from "debug";

const Promise = require("bluebird");
const log = debug("auth");

let authUser = null;

export function getAuthUser() {
  log("authUser", authUser);
  return authUser;
}

export function getUID() {
  if (authUser) {
    return authUser.uid;
  }
  return null;
}

// Initia|ze Firebase
var config = {
  apiKey: "AIzaSyAroBDj0Vw_4JdwKAWmB5Nq7ydjKq86mFM",
  authDomain: "beachvolleyball-scoreboard.firebaseapp.com",
  databaseURL: "https://beachvolleyball-scoreboard.firebaseio.com",
  projectId: "beachvolleyball-scoreboard",
  storageBucket: "beachvolleyball-scoreboard.appspot.com"
};

export function init() {
  if (!firebase.apps.length) {
    firebase.initializeApp(config);
  }
}

export default function startAuth() {
  init();
  var provider = new firebase.auth.FacebookAuthProvider();

  firebase
    .auth()
    .signInWithPopup(provider)
    .then(function(result) {
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      console.log(result.user);
      // ...
    })
    .catch(function(err) {
      // Handle Errors here.
      var errorCode = err.code;
      var errorMessage = err.message;
      // The email of the user's account used.
      var email = err.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = err.credential;
      // ...
    });
}

export function startAnonymousAuth() {
  init();
  if (authUser) {
    console.log("authUser exist", authUser);
    return;
  }
  firebase
    .auth()
    .signInAnonymously()
    .then(() => console.log("signed in."))
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      log("Error in signInAnonymously", errorCode, errorMessage);
      throw "error";
    });
  firebase.auth().onAuthStateChanged(authStateChangedHandler);
}

let obsersvers = [];

function authStateChangedHandler(user) {
  if (user != null || typeof user !== "undefined") {
    log("authStateChangedHandler, we now have a user", user);
    authUser = user;
    obsersvers.forEach(observer => observer(user));
  } else {
    authUser = null;
    log("no user returned from authStateChangedHandler!", user);
  }
}

/**
 *  Observer is a function that takes inn a user object
 * 
 */
export function addObserverOnLoginStatus(observer) {
  obsersvers.push(observer);
}
