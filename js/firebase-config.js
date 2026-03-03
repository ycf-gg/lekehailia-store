/* ================================================
   FIREBASE CONFIG & INITIALIZATION
   ================================================ */

const FirebaseApp = (() => {
    // ========== YOUR FIREBASE PROJECT CONFIG ==========
    // 🔴 REPLACE these values with your own Firebase project config
    // Go to: Firebase Console > Project Settings > General > Your apps > Web app
    const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_PROJECT.firebaseapp.com",
        databaseURL: "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
        projectId: "YOUR_PROJECT",
        storageBucket: "YOUR_PROJECT.appspot.com",
        messagingSenderId: "YOUR_SENDER_ID",
        appId: "YOUR_APP_ID"
    };

    let _app = null;
    let _db = null;
    let _auth = null;
    let _currentUser = null;
    let _isReady = false;
    let _readyCallbacks = [];

    /* ---------- INIT ---------- */
    function init() {
        try {
            _app = firebase.initializeApp(firebaseConfig);
            _db = firebase.database();
            _auth = firebase.auth();

            // Sign in anonymously so each device gets a UID
            _auth.onAuthStateChanged((user) => {
                if (user) {
                    _currentUser = user;
                    _isReady = true;
                    console.log('🔥 Firebase ready | UID:', user.uid, user.isAnonymous ? '(anonymous)' : '(admin)');
                    _readyCallbacks.forEach(cb => cb(user));
                    _readyCallbacks = [];
                } else {
                    // No user — sign in anonymously
                    _auth.signInAnonymously().catch(err => {
                        console.error('Firebase anonymous auth failed:', err);
                        // Fallback: still mark as ready so the app works offline
                        _isReady = true;
                        _readyCallbacks.forEach(cb => cb(null));
                        _readyCallbacks = [];
                    });
                }
            });
        } catch (err) {
            console.error('Firebase init error:', err);
            _isReady = true;
            _readyCallbacks.forEach(cb => cb(null));
            _readyCallbacks = [];
        }
    }

    /* ---------- READY GATE ---------- */
    function onReady(callback) {
        if (_isReady) {
            callback(_currentUser);
        } else {
            _readyCallbacks.push(callback);
        }
    }

    /* ---------- DATABASE HELPERS ---------- */
    function db() { return _db; }
    function auth() { return _auth; }
    function uid() { return _currentUser ? _currentUser.uid : null; }
    function isAnonymous() { return _currentUser ? _currentUser.isAnonymous : true; }

    /** Read a path once, returns a Promise<value|null> */
    function readOnce(path) {
        if (!_db) return Promise.resolve(null);
        return _db.ref(path).once('value').then(snap => snap.val());
    }

    /** Write data to a path, returns a Promise */
    function write(path, data) {
        if (!_db) return Promise.resolve();
        return _db.ref(path).set(data);
    }

    /** Update (merge) data at a path */
    function update(path, data) {
        if (!_db) return Promise.resolve();
        return _db.ref(path).update(data);
    }

    /** Push a new child to a path, returns the new key */
    function push(path, data) {
        if (!_db) return Promise.resolve(null);
        const ref = _db.ref(path).push();
        return ref.set(data).then(() => ref.key);
    }

    /** Listen to a path for real-time updates */
    function listen(path, callback) {
        if (!_db) return () => { };
        const ref = _db.ref(path);
        ref.on('value', snap => callback(snap.val()));
        return () => ref.off('value');
    }

    /* ---------- ADMIN AUTH ---------- */
    // Admin uses email/password auth
    // Default admin: admin@elkahailia.com / Admin123!
    const ADMIN_EMAIL = 'admin@elkahailia.com';

    function adminLogin(password) {
        if (!_auth) return Promise.resolve(false);
        return _auth.signInWithEmailAndPassword(ADMIN_EMAIL, password)
            .then(cred => {
                _currentUser = cred.user;
                return true;
            })
            .catch(err => {
                console.warn('Admin login failed:', err.message);
                return false;
            });
    }

    function adminLogout() {
        if (!_auth) return Promise.resolve();
        return _auth.signOut().then(() => {
            // Re-sign in anonymously
            return _auth.signInAnonymously();
        });
    }

    function isAdmin() {
        if (!_currentUser) return false;
        return !_currentUser.isAnonymous;
    }

    return {
        init, onReady, db, auth, uid, isAnonymous,
        readOnce, write, update, push, listen,
        adminLogin, adminLogout, isAdmin,
        ADMIN_EMAIL
    };
})();

// Initialize Firebase immediately
FirebaseApp.init();
