/**
 * EarEase-Tech Firebase Integration & Lead Dispatch Helper
 * Automatically dispatches incoming client inquiries and scope estimates to hr@eareasetech.com
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
 * Dispatches lead payload via HTTP POST to hr@eareasetech.com
 * @param {Object} payload 
 */
async function dispatchEmailAlert(payload) {
  try {
    const formData = new FormData();
    formData.append('_subject', `NEW CLIENT ENQUIRY: ${payload.name || payload.service || 'Website Lead'}`);
    formData.append('_replyto', payload.email || 'hr@eareasetech.com');
    formData.append('_template', 'table');
    formData.append('_captcha', 'false');
    
    formData.append('Client Name', payload.name || 'Not Provided');
    formData.append('Client Email', payload.email || 'Not Provided');
    formData.append('Client Phone', payload.phone || 'Not Provided');
    formData.append('Service Category', payload.service || 'General Inquiry');
    if (payload.estimateAmount) {
      formData.append('Scope Estimate', `${payload.currency || 'USD'} ${payload.estimateAmount}`);
    }
    if (payload.selectedOptions) {
      formData.append('Selected Options', Array.isArray(payload.selectedOptions) ? payload.selectedOptions.join(', ') : payload.selectedOptions);
    }
    formData.append('Project Brief / Message', payload.message || 'No additional message provided.');
    formData.append('Source Page', payload.source || window.location.href);
    formData.append('Submission Time', payload.createdAt || new Date().toLocaleString());

    await fetch('https://formsubmit.co/ajax/hr@eareasetech.com', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });
    console.log("EarEase-Tech: Email dispatch sent to hr@eareasetech.com");
  } catch (err) {
    console.warn("EarEase-Tech: Email dispatch API notice", err);
  }
}

/**
 * Submits a lead payload (Contact form, Project Estimator, Inquiry)
 * Stores in Firestore/LocalStorage AND dispatches email to hr@eareasetech.com
 * @param {Object} leadData 
 * @returns {Promise<Object>}
 */
async function submitLeadToFirebase(leadData) {
  const payload = {
    ...leadData,
    createdAt: new Date().toISOString(),
    status: 'New',
    source: leadData.source || window.location.href
  };

  // 1. Save locally for instant backup & CRM
  saveLocalLead(payload);

  // 2. Dispatch email to hr@eareasetech.com
  dispatchEmailAlert(payload);

  // 3. Save to Firebase Firestore if connected
  if (isFirebaseInitialized && db) {
    try {
      const docRef = await db.collection('leads').add(payload);
      console.log("Lead stored in Firebase Firestore with ID:", docRef.id);
      return { success: true, id: docRef.id, mode: 'firebase' };
    } catch (err) {
      console.error("Firestore submit error:", err);
      return { success: true, mode: 'local' };
    }
  }

  return { success: true, mode: 'local' };
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
window.submitLeadToFirebase = submitLeadToFirebase;
window.EarEaseFirebase = {
  submitLead: submitLeadToFirebase,
  getLeads: fetchAllLeads
};
