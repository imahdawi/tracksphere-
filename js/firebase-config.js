// ================================================================
//  🔥 FIREBASE CONFIG - tracksphere2
// ================================================================

const firebaseConfig = {
    apiKey: "AIzaSyBb3PM-PTCDX5kOacQ-uPtt0-bXv0i_GLI",
    authDomain: "tracksphere2.firebaseapp.com",
    projectId: "tracksphere2",
    storageBucket: "tracksphere2.firebasestorage.app",
    messagingSenderId: "472620290057",
    appId: "1:472620290057:web:2570818b253dd40eeca8d8",
    measurementId: "G-2X85TGPQX0"
};

// ✅ تهيئة Firebase
firebase.initializeApp(firebaseConfig);

// ✅ جاهزية Auth و Firestore
const auth = firebase.auth();
const db = firebase.firestore();

console.log('🔥 Firebase initialized!');
console.log('📁 Project:', firebaseConfig.projectId);