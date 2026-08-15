// firebase-config.js - Konfigurasi & Autentikasi Firebase Ruang Tryout

const firebaseConfig = {
  apiKey: "AIzaSyBIJLmC0ms1gU_xXSL8N1WpyHOdyTesnYE",
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

// Tangani hasil redirect jika ada
auth.getRedirectResult().then((result) => {
    if (result && result.user) {
        console.log("Login Redirect Berhasil:", result.user.displayName);
        window.location.reload();
    }
}).catch((error) => {
    console.error("Error Redirect:", error);
});

// Fungsi Login Google (Pop-up Aman & Stabil)
function loginWithGoogle() {
    auth.signInWithPopup(googleProvider)
        .then((result) => {
            console.log("Login Berhasil:", result.user.displayName);
            window.location.reload();
        })
        .catch((error) => {
            if (error.code === 'auth/popup-blocked') {
                alert("Pop-up diblokir browser! Silakan klik 'Options' di bagian atas Firefox lalu pilih 'Allow pop-ups for www.ruangtryout.my.id'.");
            } else if (error.code !== 'auth/popup-closed-by-user') {
                alert("Gagal Login: " + error.message);
            }
        });
}

// Fungsi Logout
function logoutUser() {
    auth.signOut().then(() => {
        window.location.reload();
    });
}
