import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

class FirebaseAuthBackend {

    constructor(firebaseConfig: any) {
        if (firebaseConfig && firebaseConfig.apiKey && firebaseConfig.apiKey.length > 0) {
            // Initialize Firebase solo si hay una apiKey válida
            try {
                firebase.initializeApp(firebaseConfig);
                firebase.auth().onAuthStateChanged((user: any) => {
                    if (user) {
                        sessionStorage.setItem('authUser', JSON.stringify(user));
                    } else {
                        sessionStorage.removeItem('authUser');
                    }
                });
            } catch (error) {
                console.warn('Error al inicializar Firebase:', error);
                // No hacemos nada más, simplemente evitamos que la app falle
            }
        } else {
            console.warn('No se inicializó Firebase: configuración incompleta o apiKey vacía');
        }
    }

    /**
     * Registers the user with given details
     */
    registerUser = (email: any, password: any) => {
        return new Promise((resolve, reject) => {
            firebase.auth().createUserWithEmailAndPassword(email, password).then((user: any) => {
                var user: any = firebase.auth().currentUser;
                resolve(user);
            }, (error: any) => {
                reject(this._handleError(error));
            });
        });
    }

    /**
     * Login user with given details
     */
    loginUser = (email: any, password: any) => {
        return new Promise((resolve, reject) => {
            firebase.auth().signInWithEmailAndPassword(email, password).then((user: any) => {
                // eslint-disable-next-line no-redeclare
                var user: any = firebase.auth().currentUser;
                resolve(user);
            }, (error: any) => {
                reject(this._handleError(error));
            });
        });
    }

    /**
     * Logout the user
     */
    logout = () => {
        return new Promise((resolve, reject) => {
            firebase.auth().signOut().then(() => {
                resolve(true);
            }).catch((error: any) => {
                reject(this._handleError(error));
            });
        });
    }

    /**
     * forget Password user with given details
     */
    forgetPassword = (email: any) => {
        return new Promise((resolve, reject) => {
            // tslint:disable-next-line: max-line-length
            firebase.auth().sendPasswordResetEmail(email, { url: window.location.protocol + '//' + window.location.host + '/login' }).then(() => {
                resolve(true);
            }).catch((error: any) => {
                reject(this._handleError(error));
            });
        });
    }

    setLoggeedInUser = (user: any) => {
        sessionStorage.setItem('authUser', JSON.stringify(user));
    }

    /**
     * Returns the authenticated user
     */
    getAuthenticatedUser = () => {
        if (!sessionStorage.getItem('authUser')) {
            return null;
        }
        return JSON.parse(sessionStorage.getItem('authUser')!);
    }

    /**
     * Handle the error
     * @param {*} error
     */
    _handleError(error: any) {
        // tslint:disable-next-line: prefer-const
        var errorMessage = error.message;
        return errorMessage;
    }
}

// tslint:disable-next-line: variable-name
let _fireBaseBackend: FirebaseAuthBackend | null = null;

/**
 * Initilize the backend
 * @param {*} config
 */
const initFirebaseBackend = (config: any) => {
    if (!_fireBaseBackend) {
        _fireBaseBackend = new FirebaseAuthBackend(config);
    }
    return _fireBaseBackend;
};

/**
 * Returns the firebase backend
 */
const getFirebaseBackend = () => {
    return _fireBaseBackend;
};

export { initFirebaseBackend, getFirebaseBackend };
