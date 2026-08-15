// firebase-config.js - Konfigurasi & Autentikasi Firebase Ruang Tryout

const firebaseConfig = {
  apiKey: "AIzaSyC_9XPLuFNoxRtPd8nrtbqHML9wd9TwmhE",
  authDomain: "ruang-tryout-b6624.firebaseapp.com",
  projectId: "ruang-tryout-b6624",
  storageBucket: "ruang-tryout-b6624.firebasestorage.app",
  messagingSenderId: "234029396431",
  appId: "1:234029396431:web:902bf1b7a06b1fc3f9a2ba",
  measurementId: "G-LQ0LF0HPRK"
};

// Inisialisasi Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();
const googleProvider = new firebase.auth.GoogleAuthProvider();

// Fungsi Login Google
function loginWithGoogle() {
    auth.signInWithPopup(googleProvider)
        .then((result) => {
            console.log("Login Berhasil:", result.user.displayName);
            window.location.reload();
        })
        .catch((error) => {
            alert("Gagal Login: " + error.message);
        });
}

// Fungsi Logout
function logoutUser() {
    auth.signOut().then(() => {
        window.location.reload();
    });
}
