import firebase from "firebase";
import debug from "debug";

const Promise = require("bluebird");
const log = debug("auth");

let authUser = null;

export async function getAuthUser() {
  if (!authUser) {
    return new Promise((resolve, reject) => {
      function onLogin(user) {
        resolve(user);
      }
      addObserverOnLoginStatus(onLogin);
      startAnonymousAuth()
        .then(console.log.bind(console))
        .catch(console.log.bind(console));
    });
  } else {
    return authUser;
  }
}

export async function getUID() {
  return (await getAuthUser()).uid;
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

export default async function startAuth() {
  return new Promise((resolve, reject) => {
    init();
    var provider = new firebase.auth.FacebookAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function(result) {
        var token = result.credential.accessToken;
        var user = result.user;
        resolve(user);
      })
      .catch(function(err) {
        var errorCode = err.code;
        var errorMessage = err.message;
        var email = err.email;
        var credential = err.credential;
        reject(err);
      });
  });
}

let obsersvers = [];

export async function startAnonymousAuth() {
  return new Promise((resolve, reject) => {
    init();
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
    firebase.auth().onAuthStateChanged((user, err) => {
      if (err) {
        log("Error on login");
        reject(err);
      }
      if (user != null && typeof user !== "undefined") {
        log("authStateChangedHandler, we now have a user", user);
        authUser = user;
        obsersvers.forEach(observer => observer(user));
        resolve(user);
      } else {
        authUser = null;
        log("no user returned from authStateChangedHandler!", user);
        resolve(authUser);
      }
    });
  });
}

/**
 *  Observer is a function that takes inn a user object
 *
 */
export function addObserverOnLoginStatus(observer) {
  obsersvers.push(observer);
}
