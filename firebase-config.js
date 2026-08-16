// Firebase configuration for RuangTryout.
// Firebase web API keys are public identifiers; access control must live in Firestore Rules/App Check.
const firebaseConfig = {
  apiKey: "AIzaSyBIJLmC0ms1gU_xXSL8N1WpyHOdyTesnYE",
  authDomain: "ruang-tryout-b6624.firebaseapp.com",
  projectId: "ruang-tryout-b6624",
  storageBucket: "ruang-tryout-b6624.firebasestorage.app",
  messagingSenderId: "234029396431",
  appId: "1:234029396431:web:902bf1b7a06b1fc3f9a2ba",
  measurementId: "G-LQ0LF0HPRK"
};

if (typeof firebase !== 'undefined' && !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = typeof firebase !== 'undefined' ? firebase.auth() : null;
const db = typeof firebase !== 'undefined' ? firebase.firestore() : null;
const googleProvider = typeof firebase !== 'undefined' ? new firebase.auth.GoogleAuthProvider() : null;

async function loginWithGoogle() {
  if (!auth || !googleProvider) throw new Error('Firebase Auth belum tersedia.');
  try {
    return await auth.signInWithPopup(googleProvider);
  } catch (error) {
    if (error.code === 'auth/popup-blocked') {
      alert('Pop-up login diblokir browser. Izinkan pop-up untuk ruangtryout.my.id lalu coba lagi.');
    } else if (error.code !== 'auth/popup-closed-by-user') {
      console.error('Login gagal:', error);
      alert('Login belum berhasil. Silakan coba lagi.');
    }
    throw error;
  }
}

async function logoutUser() {
  if (auth) await auth.signOut();
}
