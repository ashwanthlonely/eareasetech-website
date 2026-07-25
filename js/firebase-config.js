/**
 * EarEase-Tech Firebase Integration & Lead Submission Helper
 * Supports Firebase Firestore with fallback to LocalStorage for offline/zero-config setups.
 */

// Placeholder configuration - update with your Firebase project credentials when ready
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "eareasetech-leads.firebaseapp.com",
  projectId: "eareasetech-leads",
  storageBucket: "eareasetech-leads.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

let db = null;
let isFirebaseInitialized = false;

// Attempt Firebase initialization if SDK is present
if (typeof firebase !== 'undefined' && firebase.initializeApp) {
  try {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    db = firebase.firestore();
    isFirebaseInitialized = true;
    console.log("EarEase-Tech: Firebase SDK Initialized");
  } catch (e) {
    console.warn("EarEase-Tech: Firebase init fallback mode - using LocalStorage", e);
  }
}

/**
 * Submits a lead payload (Contact form, Project Estimator, Inquiry)
 * @param {Object} leadData 
 * @returns {Promise<Object>}
 */
async function submitLeadToFirebase(leadData) {
  const payload = {
    ...leadData,
    createdAt: new Date().toISOString(),
    status: 'New',
    source: leadData.source || 'Website Form'
  };

  if (isFirebaseInitialized && db) {
    try {
      const docRef = await db.collection('leads').add(payload);
      console.log("Lead stored in Firebase Firestore with ID:", docRef.id);
      saveLocalLead(payload); // Also keep local copy
      return { success: true, id: docRef.id, mode: 'firebase' };
    } catch (err) {
      console.error("Firestore submit error, saving locally:", err);
      saveLocalLead(payload);
      return { success: true, mode: 'local', warning: 'Saved locally' };
    }
  } else {
    saveLocalLead(payload);
    return { success: true, mode: 'local' };
  }
}

/**
 * Saves lead to local storage array for fallback and instant admin review
 */
function saveLocalLead(payload) {
  try {
    const existing = JSON.parse(localStorage.getItem('eet_leads') || '[]');
    existing.unshift({ id: 'loc_' + Date.now(), ...payload });
    localStorage.setItem('eet_leads', JSON.stringify(existing));
  } catch (e) {
    console.error("LocalStorage save error:", e);
  }
}

/**
 * Fetches all leads for CRM / Admin view
 */
async function fetchAllLeads() {
  if (isFirebaseInitialized && db) {
    try {
      const snapshot = await db.collection('leads').orderBy('createdAt', 'desc').get();
      const firebaseLeads = [];
      snapshot.forEach(doc => firebaseLeads.push({ id: doc.id, ...doc.data() }));
      if (firebaseLeads.length > 0) return firebaseLeads;
    } catch (err) {
      console.warn("Could not fetch Firestore leads, returning local leads", err);
    }
  }
  return JSON.parse(localStorage.getItem('eet_leads') || '[]');
}

// Make globally accessible
window.EarEaseFirebase = {
  submitLead: submitLeadToFirebase,
  getLeads: fetchAllLeads
};
