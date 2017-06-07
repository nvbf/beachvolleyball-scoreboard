import firebase from 'firebase';
import debug from 'debug';
const Promise = require('bluebird')

const log = debug('auth')

//require("firebase/auth");

let authUser = null

export function getAuthUser() {
    log('authUser', authUser)
    return authUser;
}
// Initialize Firebase
var config = {
	apiKey: "AIzaSyAroBDj0Vw_4JdwKAWmB5Nq7ydjKq86mFM",
	authDomain: "beachvolleyball-scoreboard.firebaseapp.com",
	databaseURL: "https://beachvolleyball-scoreboard.firebaseio.com",
	projectId: "beachvolleyball-scoreboard",
	storageBucket: "beachvolleyball-scoreboard.appspot.com",
};


let hasInit = false
export function init() {
    if(!hasInit) {
        firebase.initializeApp(config);
        hasInit = true
    }
}

export default function startAuth() {
    init()
    var provider = new firebase.auth.FacebookAuthProvider();

    firebase.auth().signInWithPopup(provider).then(function(result) {
    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    // ...
    }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
    });
}

export  function startAnonymousAuth() {
    init()
    firebase.auth().signInAnonymously().catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        log('Error in signInAnonymously', errorCode, errorMessage);
        throw 'error';
    });    
    firebase.auth().onAuthStateChanged(authStateChangedHandler)
}

function authStateChangedHandler(user) {
    if ((user != null) || (typeof user !== 'undefined' )) {
        log('authStateChangedHandler, we now have a user', user)
        authUser = user;
    } else {
        log('no user returned from authStateChangedHandler!', user, '-')
    }
}