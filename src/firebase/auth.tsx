import {
    initializeApp,
    getApps,

} from 'firebase/app';
import {
    signInAnonymously,
    onAuthStateChanged,
    User,
    getAuth,
    signInWithPopup,
    FacebookAuthProvider,
    GoogleAuthProvider,
} from 'firebase/auth';
import { firebaseConfig } from './firebase-config';

let authUser: User | null = null;

export async function getAuthUser(): Promise<User | null> {
    if (!authUser) {
        await startAnonymousAuth();
    }
    return authUser;
}

export async function getUID(): Promise<string | undefined> {
    if (!authUser) {
        await getAuthUser();
    }
    return authUser?.uid;
}

export function init() {
    if (!getApps().length) {
        initializeApp(firebaseConfig);
    }
}

export default async function startAuth(): Promise<User> {
    return new Promise((resolve, reject) => {
        init();
        const provider = new GoogleAuthProvider();
        signInWithPopup(getAuth(), provider)
            .then((result) => {
                resolve(result.user);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

let observers: ((user: User | null) => void)[] = [];

export async function startAnonymousAuth(): Promise<User | null> {
    return new Promise((resolve, reject) => {
        init();
        signInAnonymously(getAuth())
            .catch((error) => {
                console.log("Error in signInAnonymously", error.code, error.message);
                throw error;
            });
        onAuthStateChanged(getAuth(), (user) => {
            if (user) {
                console.log("authStateChangedHandler, we now have a user", user);
                authUser = user;
                observers.forEach((observer) => observer(user));
                resolve(user);
            } else {
                authUser = null;
                console.log("no user returned from authStateChangedHandler!", user);
                resolve(authUser);
            }
        });
    });
}

export function addObserverOnLoginStatus(observer: (user: User | null) => void) {
    observers.push(observer);
}
