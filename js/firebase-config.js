/**
 * EarEase-Tech Firebase Integration & 360 CRM Data Dispatch Helper
 * Real Leads Only — Zero Dummy Data.
 * Supports Firebase Firestore with fallback to LocalStorage for offline/zero-config setups.
 * Features full Lead CRUD: Create, Read, Update Status, Add Call Notes, Delete Lead, Clear All.
 */

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
    console.warn("EarEase-Tech: Email dispatch notice", err);
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
    id: leadData.id || 'lead_' + Date.now(),
    name: leadData.name || 'Website Inquiry',
    email: leadData.email || '',
    phone: leadData.phone || '',
    service: leadData.service || 'General Inquiry',
    estimateAmount: leadData.estimateAmount || '',
    currency: leadData.currency || 'USD',
    selectedOptions: leadData.selectedOptions || [],
    message: leadData.message || '',
    priority: leadData.priority || (leadData.estimateAmount ? 'Hot' : 'Warm'),
    stage: leadData.stage || 'New Lead',
    assignedTo: leadData.assignedTo || 'Unassigned',
    notes: leadData.notes || [],
    createdAt: leadData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    source: leadData.source || window.location.href
  };

  // 1. Save locally for instant CRM reflection & backup
  saveLocalLead(payload);

  // 2. Dispatch email alert to hr@eareasetech.com
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
 * Saves lead to local storage array for fallback and instant CRM view
 */
function saveLocalLead(payload) {
  try {
    const existing = JSON.parse(localStorage.getItem('eet_leads') || '[]');
    const index = existing.findIndex(l => l.id === payload.id);
    if (index >= 0) {
      existing[index] = { ...existing[index], ...payload };
    } else {
      existing.unshift(payload);
    }
    localStorage.setItem('eet_leads', JSON.stringify(existing));
  } catch (e) {
    console.error("LocalStorage save error:", e);
  }
}

/**
 * Fetches real leads only from Firestore / LocalStorage (Zero dummy data)
 */
async function fetchAllLeads() {
  let leads = [];
  if (isFirebaseInitialized && db) {
    try {
      const snapshot = await db.collection('leads').orderBy('createdAt', 'desc').get();
      snapshot.forEach(doc => leads.push({ id: doc.id, ...doc.data() }));
    } catch (err) {
      console.warn("Could not fetch Firestore leads, returning local leads", err);
    }
  }

  if (leads.length === 0) {
    leads = JSON.parse(localStorage.getItem('eet_leads') || '[]');
  }

  return leads;
}

/**
 * Updates a lead's stage, priority, notes, or assigned sales rep
 */
async function updateLeadDetails(leadId, updates) {
  const leads = JSON.parse(localStorage.getItem('eet_leads') || '[]');
  const index = leads.findIndex(l => l.id === leadId);
  if (index >= 0) {
    leads[index] = {
      ...leads[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem('eet_leads', JSON.stringify(leads));

    if (isFirebaseInitialized && db) {
      try {
        await db.collection('leads').doc(leadId).update(updates);
      } catch (e) {
        console.warn("Firestore lead update notice", e);
      }
    }
    return { success: true, lead: leads[index] };
  }
  return { success: false, error: 'Lead not found' };
}

/**
 * Deletes a single lead by ID (Admin Action)
 */
async function deleteSingleLead(leadId) {
  try {
    let leads = JSON.parse(localStorage.getItem('eet_leads') || '[]');
    leads = leads.filter(l => l.id !== leadId);
    localStorage.setItem('eet_leads', JSON.stringify(leads));

    if (isFirebaseInitialized && db) {
      try {
        await db.collection('leads').doc(leadId).delete();
      } catch (e) {
        console.warn("Firestore lead delete notice", e);
      }
    }
    return { success: true };
  } catch (err) {
    console.error("Delete lead error:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Clears all local storage leads
 */
function clearAllLocalLeads() {
  localStorage.removeItem('eet_leads');
  return [];
}

// Make globally accessible
window.submitLeadToFirebase = submitLeadToFirebase;
window.updateLeadDetails = updateLeadDetails;
window.deleteSingleLead = deleteSingleLead;
window.clearAllLocalLeads = clearAllLocalLeads;
window.EarEaseFirebase = {
  submitLead: submitLeadToFirebase,
  getLeads: fetchAllLeads,
  updateLead: updateLeadDetails,
  deleteLead: deleteSingleLead,
  clearLeads: clearAllLocalLeads
};
