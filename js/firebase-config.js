/**
 * EarEase-Tech Firebase Integration & 360 CRM Data Dispatch Helper
 * Supports Corporate Services & EarEase Nexus AI Admissions Engine.
 * Configured for Official Candidate Tax Invoices & Unique Registration IDs.
 */

const firebaseConfig = {
  apiKey: "AIzaSyD8efty9voJ5IFO3GRPjcDqjouMLh0oBlw",
  authDomain: "eareasetech-tech.firebaseapp.com",
  projectId: "eareasetech-tech",
  storageBucket: "eareasetech-tech.firebasestorage.app",
  messagingSenderId: "928159030663",
  appId: "1:928159030663:web:7856e79b9b56f8f533f8da"
};

let isFirebaseInitialized = false;
let db = null;

try {
  if (typeof firebase !== 'undefined') {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    db = firebase.firestore();
    isFirebaseInitialized = true;
  }
} catch (e) {
  console.warn("Firebase SDK Init Notice:", e);
}

const razorpayNexusConfig = {
  // Official Razorpay Merchant Payment Handle for EAREASE TECH PRIVATE LIMITED
  basePaymentLink: "https://razorpay.me/@eareasetechprivatelimited",
  
  // Custom Payment Links for each tier created on Razorpay Dashboard
  tierLinks: {
    '30-Day': "https://razorpay.me/@eareasetechprivatelimited",
    '3-Month': "https://razorpay.me/@eareasetechprivatelimited",
    '6-Month': "https://razorpay.me/@eareasetechprivatelimited"
  },
  
  // Active Live API Credentials from Razorpay Dashboard
  keyId: "rzp_live_TItFWP8XvFG2Xu", 
  keySecret: "E8zY4LAWrN47kRoTCbkTuJZd",
  
  monthlySeatCap: 50,

  // Live Production Mode (1 INR testing complete)
  enable1INRTesting: false
};

const defaultFeeStructure = {
  '30-Day': {
    tierName: '30-Day Express AI ML Bootcamp / AI Tools',
    baseFee: 13000,
    gst: 2338.82,
    totalFee: 15338.82,
    amountPaise: 1533882,
    formattedTotal: '₹15,338.82',
    breakupText: '₹13,000 Base + ₹2,338.82 GST (18%)'
  },
  '3-Month': {
    tierName: '3-Month AI & ML Industry Mentorship',
    baseFee: 45999,
    gst: 8279.82,
    totalFee: 54278.82,
    amountPaise: 5427882,
    formattedTotal: '₹54,278.82',
    breakupText: '₹45,999 Base + ₹8,279.82 GST (18%)'
  },
  '6-Month': {
    tierName: '6-Month Data Science Mentorship + Guaranteed Internship',
    baseFee: 25000,
    gst: 4500,
    totalFee: 29500,
    amountPaise: 2950000,
    formattedTotal: '₹29,500.00',
    breakupText: '₹25,000 Advance Seat Reserve Deposit + ₹4,500 GST'
  }
};

const defaultCoupons = [];
const defaultCourses = [
  { id: 'course_ai_3m', title: 'AI & Machine Learning (3-Month Mentorship)', duration: '3-Month', badge: '🟢 LIVE ADMISSIONS OPEN', isLive: true, baseFee: 45999, brochurePath: 'assets/Courses/p8.png', regDeadline: '2026-08-10', batchStart: '2026-08-15', description: 'Master Python, Math/Stats, Scikit-Learn, Supervised/Unsupervised ML, Deep Learning, and production model deployment.', docType: 'course' },
  { id: 'course_ai_30d', title: 'AI & Machine Learning (30-Day Express)', duration: '30-Day', badge: '🟢 LIVE ADMISSIONS OPEN', isLive: true, baseFee: 13000, brochurePath: 'assets/Courses/30 days ai ml.jpeg', regDeadline: '2026-08-05', batchStart: '2026-08-07', description: '30 Live daily intensive sessions covering ML fundamentals, OpenCV, hands-on projects, and Streamlit app building.', docType: 'course' },
  { id: 'course_ai_tools', title: 'AI Tools for Working Professionals', duration: '30-Day', badge: '🟢 LIVE ADMISSIONS OPEN', isLive: true, baseFee: 13000, brochurePath: 'assets/Courses/30 days ai ml.jpeg', regDeadline: '2026-08-05', batchStart: '2026-08-07', description: 'ChatGPT 4o, Claude 3.5, Gemini, GitHub Copilot, Midjourney, n8n workflow automation, and 10x workplace efficiency.', docType: 'course' },
  { id: 'course_ds_assessment_workshop', title: 'Data Science Career Assessment & AI Tools Workshop', duration: '3-Hour', badge: '⚡ LIVE WORKSHOP', isLive: true, baseFee: 83.90, brochurePath: 'assets/Courses/p2.png', regDeadline: 'Weekly Batches', batchStart: 'Weekly Saturdays', description: 'Interactive 3-hour live workshop covering ChatGPT prompts, Claude projects, n8n automations, and Cursor coding. Includes a 1-on-1 career readiness score and learning roadmap.', docType: 'course' }
];


/**
 * Dynamic Program Fee Manager
 */
let GLOBAL_CLOUD_BLOB_URL = "https://jsonblob.com/api/jsonBlob/019fb34e-32ae-71f6-9d8f-1b2c82af36a3";

let isCloudSynced = false;

const FIRESTORE_COUPONS_URL = "https://firestore.googleapis.com/v1/projects/eareasetech-tech/databases/(default)/documents/coupons?key=AIzaSyD8efty9voJ5IFO3GRPjcDqjouMLh0oBlw";
const FIRESTORE_COURSES_URL = "https://firestore.googleapis.com/v1/projects/eareasetech-tech/databases/(default)/documents/courses?key=AIzaSyD8efty9voJ5IFO3GRPjcDqjouMLh0oBlw";

function firestoreFieldsToObject(fields) {
  if (!fields) return {};
  const obj = {};
  for (const [key, val] of Object.entries(fields)) {
    if (val.stringValue !== undefined) obj[key] = val.stringValue;
    else if (val.integerValue !== undefined) obj[key] = parseInt(val.integerValue, 10);
    else if (val.doubleValue !== undefined) obj[key] = parseFloat(val.doubleValue);
    else if (val.booleanValue !== undefined) obj[key] = val.booleanValue;
  }
  return obj;
}

function objectToFirestoreFields(obj) {
  const fields = {};
  for (const [key, val] of Object.entries(obj)) {
    if (typeof val === 'boolean') fields[key] = { booleanValue: val };
    else if (typeof val === 'number') fields[key] = Number.isInteger(val) ? { integerValue: val.toString() } : { doubleValue: val };
    else if (typeof val === 'string') fields[key] = { stringValue: val };
  }
  return { fields };
}
async function syncFirestoreCouponsToLocal() {
  if (isFirebaseInitialized && db) {
    try {
      const snap = await db.collection('coupons').get();
      if (snap && !snap.empty) {
        const fsCoupons = [];
        snap.forEach(doc => {
          const data = doc.data();
          if (data && data.code) {
            fsCoupons.push({ ...data, id: doc.id });
          }
        });
        if (fsCoupons.length > 0) {
          localStorage.setItem('eet_coupons', JSON.stringify(fsCoupons));
          return;
        }
      } else {
        // Seed Firestore coupons collection
        for (const coupon of defaultCoupons) {
          await db.collection('coupons').doc(coupon.id).set(coupon);
        }
        localStorage.setItem('eet_coupons', JSON.stringify(defaultCoupons));
        return;
      }
    } catch (e) {
      console.warn("Firestore SDK coupon fetch/seed notice:", e);
    }
  }

  try {
    const res = await fetch(`${FIRESTORE_COUPONS_URL}&t=${Date.now()}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.documents && Array.isArray(data.documents) && data.documents.length > 0) {
        const fsCoupons = data.documents.map(d => firestoreFieldsToObject(d.fields)).filter(c => c && c.code);
        if (fsCoupons.length > 0) {
          localStorage.setItem('eet_coupons', JSON.stringify(fsCoupons));
          return;
        }
      }
    }
  } catch (e) {
    console.warn("Firestore coupons pull notice:", e);
  }

  const currentSaved = JSON.parse(localStorage.getItem('eet_coupons') || '[]');
  if (currentSaved.length === 0) {
    localStorage.setItem('eet_coupons', JSON.stringify(defaultCoupons));
  }
}

async function syncFirestoreCoursesToLocal() {
  if (isFirebaseInitialized && db) {
    try {
      const snap = await db.collection('courses').get();
      if (snap && !snap.empty) {
        const fsCourses = [];
        snap.forEach(doc => {
          const data = doc.data();
          if (data && data.id) {
            fsCourses.push({ ...data, id: doc.id });
          }
        });

        // Self-healing: seed missing default courses to Firestore dynamically
        let updated = false;
        for (const defC of defaultCourses) {
          if (!fsCourses.some(c => c.id === defC.id)) {
            try {
              await db.collection('courses').doc(defC.id).set(defC);
              fsCourses.push(defC);
              updated = true;
            } catch (err) {
              console.warn(`Failed to auto-seed course: ${defC.id}`, err);
            }
          }
        }

        if (fsCourses.length > 0) {
          localStorage.setItem('eet_courses', JSON.stringify(fsCourses));
          return;
        }
      } else {
        // Seed Firestore courses collection
        for (const course of defaultCourses) {
          await db.collection('courses').doc(course.id).set(course);
        }
        localStorage.setItem('eet_courses', JSON.stringify(defaultCourses));
        return;
      }
    } catch (e) {
      console.warn("Firestore SDK course fetch/seed notice:", e);
    }
  }

  try {
    const res = await fetch(`${FIRESTORE_COURSES_URL}&t=${Date.now()}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.documents && Array.isArray(data.documents) && data.documents.length > 0) {
        const fsCourses = data.documents.map(d => firestoreFieldsToObject(d.fields)).filter(c => c && c.id);
        if (fsCourses.length > 0) {
          localStorage.setItem('eet_courses', JSON.stringify(fsCourses));
          return;
        }
      }
    }
  } catch (e) {
    console.warn("Firestore courses pull notice:", e);
  }

  const currentSaved = JSON.parse(localStorage.getItem('eet_courses') || '[]');
  if (currentSaved.length === 0) {
    localStorage.setItem('eet_courses', JSON.stringify(defaultCourses));
  }
}

async function syncAllCloudData(force = false) {
  try {
    // Prioritize Firestore Sync if online
    if (isFirebaseInitialized && db) {
      await syncFirestoreCouponsToLocal();
      await syncFirestoreCoursesToLocal();
      return;
    }

    const url = force ? `${GLOBAL_CLOUD_BLOB_URL}?t=${Date.now()}` : GLOBAL_CLOUD_BLOB_URL;
    const res = await fetch(url);
    if (!res.ok) {
      if (res.status === 404) await pushCloudBlobState();
      return;
    }
    const data = await res.json();
    if (!data) return;
    if (data.coupons && Array.isArray(data.coupons)) {
      localStorage.setItem('eet_coupons', JSON.stringify(data.coupons));
    }

    if (data.courses && Array.isArray(data.courses)) {
      localStorage.setItem('eet_courses', JSON.stringify(data.courses));
    }
    if (data.fees && typeof data.fees === 'object') {
      const mergedFees = { ...defaultFeeStructure, ...data.fees };
      localStorage.setItem('eet_program_fees', JSON.stringify(mergedFees));
    }

    if (data.leads && Array.isArray(data.leads) && data.leads.length > 0) {
      const localLeads = JSON.parse(localStorage.getItem('eet_leads') || '[]');
      data.leads.forEach(cl => {
        const idx = localLeads.findIndex(ll => ll.id === cl.id || (cl.candidateId && ll.candidateId === cl.candidateId));
        if (idx >= 0) {
          localLeads[idx] = { ...localLeads[idx], ...cl };
        } else {
          localLeads.push(cl);
        }
      });
      localStorage.setItem('eet_leads', JSON.stringify(localLeads));
    }

    isCloudSynced = true;
  } catch (e) {
    console.warn("EarEase-Tech Cloud Sync notice:", e);
  }
}

async function pushCloudBlobState() {
  try {
    const fullState = {
      coupons: JSON.parse(localStorage.getItem('eet_coupons') || '[]'),
      courses: JSON.parse(localStorage.getItem('eet_courses') || '[]'),
      fees: JSON.parse(localStorage.getItem('eet_program_fees') || '{}'),
      leads: JSON.parse(localStorage.getItem('eet_leads') || '[]'),
      updatedAt: new Date().toISOString()
    };

    const res = await fetch(GLOBAL_CLOUD_BLOB_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fullState)
    });

    if (res.status === 404) {
      // Re-create master blob if expired
      const createRes = await fetch('https://jsonblob.com/api/jsonBlob', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullState)
      });
      const loc = createRes.headers.get('location');
      if (loc) {
        GLOBAL_CLOUD_BLOB_URL = loc.startsWith('http') ? loc : 'https://jsonblob.com' + loc;
      }
    }
  } catch (e) {
    console.warn("Cloud push notice:", e);
  }
}

// Initial Sync Call
syncAllCloudData();

function getSavedProgramFees() {
  syncAllCloudData();
  const saved = localStorage.getItem('eet_program_fees');
  if (saved) {
    try { return { ...defaultFeeStructure, ...JSON.parse(saved) }; } catch(e){}
  }
  return defaultFeeStructure;
}

async function saveProgramFee(tierKey, baseFee, gstPercent = 18) {
  const base = parseFloat(baseFee);
  if (isNaN(base) || base <= 0) return { success: false, error: 'Invalid base fee amount' };

  const gst = Math.round(((base * gstPercent) / 100) * 100) / 100;
  const total = Math.round((base + gst) * 100) / 100;
  const paise = Math.round(total * 100);

  const customFees = getSavedProgramFees();
  const feePayload = {
    docType: 'program_fee',
    tierKey: tierKey,
    tierName: (customFees[tierKey] || defaultFeeStructure[tierKey] || {}).tierName || tierKey,
    baseFee: base,
    gst: gst,
    totalFee: total,
    amountPaise: paise,
    formattedTotal: `₹${total.toLocaleString('en-IN')}`,
    breakupText: `₹${base.toLocaleString('en-IN')} Base + ₹${gst.toLocaleString('en-IN')} GST (${gstPercent}%)`
  };
  customFees[tierKey] = feePayload;

  localStorage.setItem('eet_program_fees', JSON.stringify(customFees));
  await pushCloudBlobState();

  if (isFirebaseInitialized && db) {
    try {
      await db.collection('program_fees').doc(tierKey).set(feePayload);
    } catch (e) {
      console.warn("Firestore fee save notice:", e);
    }
  }

  return { success: true, fees: customFees[tierKey] };
}
function getSavedCourses() {
  syncAllCloudData();
  const saved = localStorage.getItem('eet_courses');
  let coursesList = defaultCourses;
  if (saved) {
    try { coursesList = JSON.parse(saved); } catch(e){}
  }
  return coursesList.filter(c => c && c.duration !== '6-Month' && c.id !== 'course_ds_6m');
}
async function saveCourse(courseData) {
  const courses = getSavedCourses();
  courseData.docType = 'course';

  // Prevent duplicate course titles in catalog
  const cleanTitle = (courseData.title || '').trim().toLowerCase();
  const isDuplicate = courses.some(c => 
    c.id !== courseData.id && 
    (c.title || '').trim().toLowerCase() === cleanTitle
  );
  if (isDuplicate) {
    return { success: false, error: `A course track with the title "${courseData.title}" already exists in the catalog.` };
  }

  if (courseData.id) {
    const idx = courses.findIndex(c => c.id === courseData.id);
    if (idx >= 0) courses[idx] = { ...courses[idx], ...courseData };
    else courses.push(courseData);
  } else {
    courseData.id = 'course_' + Date.now();
    courses.push(courseData);
  }

  localStorage.setItem('eet_courses', JSON.stringify(courses));
  await pushCloudBlobState();

  if (isFirebaseInitialized && db) {
    try {
      await db.collection('courses').doc(courseData.id).set(courseData);
    } catch (e) {
      console.warn("Firestore course save notice:", e);
    }
  }

  return { success: true, courses: courses };
}

async function deleteCourse(courseId) {
  let courses = getSavedCourses();
  courses = courses.filter(c => c.id !== courseId);
  localStorage.setItem('eet_courses', JSON.stringify(courses));
  await pushCloudBlobState();

  if (isFirebaseInitialized && db) {
    try {
      await db.collection('courses').doc(courseId).delete();
    } catch (e) {
      console.warn("Firestore course delete notice:", e);
    }
  }

  return courses;
}

function getSavedCoupons() {
  syncAllCloudData();
  const saved = localStorage.getItem('eet_coupons');
  if (saved) {
    try { return JSON.parse(saved); } catch(e){}
  }
  return defaultCoupons;
}

async function saveCoupon(couponData) {
  const coupons = getSavedCoupons();
  couponData.code = (couponData.code || '').trim().toUpperCase();
  if (!couponData.code) return { success: false, error: 'Coupon code is required' };

  // Prevent duplicate coupon promo codes
  const cleanCode = couponData.code;
  const isDuplicate = coupons.some(c => 
    c.id !== couponData.id && 
    (c.code || '').trim().toUpperCase() === cleanCode
  );
  if (isDuplicate) {
    return { success: false, error: `A coupon with the promo code "${couponData.code}" already exists.` };
  }

  couponData.docType = 'coupon';
  couponData.active = true;

  if (couponData.id) {
    const idx = coupons.findIndex(c => c.id === couponData.id || c.code === couponData.code);
    if (idx >= 0) coupons[idx] = { ...coupons[idx], ...couponData };
    else coupons.push(couponData);
  } else {
    couponData.id = 'cpn_' + Date.now();
    coupons.push(couponData);
  }

  localStorage.setItem('eet_coupons', JSON.stringify(coupons));
  await pushCloudBlobState();

  // Direct REST API save to Firestore database eareasetech-tech
  try {
    const docId = couponData.id || couponData.code;
    const patchUrl = `https://firestore.googleapis.com/v1/projects/eareasetech-tech/databases/(default)/documents/coupons/${docId}?key=AIzaSyD8efty9voJ5IFO3GRPjcDqjouMLh0oBlw`;
    const body = objectToFirestoreFields(couponData);
    fetch(patchUrl, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
  } catch (e) {
    console.warn("Firestore coupon REST save notice:", e);
  }

  if (isFirebaseInitialized && db) {
    try {
      await db.collection('coupons').doc(couponData.id || couponData.code).set(couponData);
    } catch (e) {
      console.warn("Firestore coupon save notice:", e);
    }
  }

  return { success: true, coupons: coupons };
}

async function deleteCoupon(couponIdOrCode) {
  let coupons = getSavedCoupons();
  const inputClean = (couponIdOrCode || '').trim().toUpperCase();

  const targetCoupon = coupons.find(c => c.id === couponIdOrCode || (c.code || '').trim().toUpperCase() === inputClean);

  const docIdToDelete = targetCoupon ? targetCoupon.id : couponIdOrCode;
  const codeToDelete = targetCoupon ? (targetCoupon.code || '').trim().toUpperCase() : inputClean;

  coupons = coupons.filter(c => c.id !== docIdToDelete && (c.code || '').trim().toUpperCase() !== codeToDelete);
  localStorage.setItem('eet_coupons', JSON.stringify(coupons));
  await pushCloudBlobState();

  if (isFirebaseInitialized && db) {
    try {
      if (docIdToDelete) await db.collection('coupons').doc(docIdToDelete).delete();
      if (codeToDelete && codeToDelete !== docIdToDelete) await db.collection('coupons').doc(codeToDelete).delete();
    } catch (e) {
      console.warn("Firestore SDK coupon delete notice:", e);
    }
  }

  try {
    if (docIdToDelete) {
      const delUrl = `https://firestore.googleapis.com/v1/projects/eareasetech-tech/databases/(default)/documents/coupons/${docIdToDelete}?key=AIzaSyD8efty9voJ5IFO3GRPjcDqjouMLh0oBlw`;
      await fetch(delUrl, { method: 'DELETE' });
    }
    if (codeToDelete && codeToDelete !== docIdToDelete) {
      const delUrlCode = `https://firestore.googleapis.com/v1/projects/eareasetech-tech/databases/(default)/documents/coupons/${codeToDelete}?key=AIzaSyD8efty9voJ5IFO3GRPjcDqjouMLh0oBlw`;
      await fetch(delUrlCode, { method: 'DELETE' });
    }
  } catch (e) {
    console.warn("Firestore REST coupon delete notice:", e);
  }

  return coupons;
}

async function applyCouponCode(couponCode, programOrTierName, customTotalOverride) {
  const code = (couponCode || '').trim().toUpperCase();
  
  // Force fresh bidirectional sync from Firestore and Cloud Relay
  await syncFirestoreCouponsToLocal();
  await syncAllCloudData(true);

  let coupons = getSavedCoupons();
  let coupon = coupons.find(c => (c.code || '').trim().toUpperCase() === code && c.active !== false);

  if (!coupon) {
    return { success: false, message: 'Invalid or expired coupon code.' };
  }

  const baseDetails = getProgramPaymentDetails(programOrTierName);
  const totalToDiscount = customTotalOverride || baseDetails.totalFee;
  let discountAmount = 0;

  if (coupon.type === 'percent') {
    discountAmount = Math.round((totalToDiscount * coupon.discount) / 100);
  } else {
    discountAmount = Math.min(coupon.discount, totalToDiscount - 100);
  }

  const finalTotal = Math.max(100, Math.round((totalToDiscount - discountAmount) * 100) / 100);
  const finalAmountPaise = Math.round(finalTotal * 100);

  const formattedOriginalTotal = customTotalOverride 
    ? `₹${customTotalOverride.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}` 
    : baseDetails.formattedTotal;

  const originalBreakup = customTotalOverride 
    ? `₹${(customTotalOverride / 1.18).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})} Base + ₹${(customTotalOverride - (customTotalOverride / 1.18)).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})} GST (18%)` 
    : baseDetails.breakupText;

  return {
    success: true,
    code: coupon.code,
    coupon: coupon,
    discountAmount: discountAmount,
    formattedDiscount: `₹${discountAmount.toLocaleString('en-IN')}`,
    originalTotal: formattedOriginalTotal,
    finalTotal: finalTotal,
    formattedFinalTotal: `₹${finalTotal.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
    finalAmountPaise: finalAmountPaise,
    breakupText: `${originalBreakup} — Promo Code '${coupon.code}' (-₹${discountAmount.toLocaleString('en-IN')})`
  };
}

/**
 * Returns exact payment details for a given program or tier (incorporating custom fee overrides)
 */
function getProgramPaymentDetails(programOrTierName) {
  const is1INRTest = razorpayNexusConfig.enable1INRTesting;
  const str = (programOrTierName || '').toString().toLowerCase();

  const fees = getSavedProgramFees();

  let details = fees['30-Day'] || defaultFeeStructure['30-Day'];
  if (str.includes('3-month') || str.includes('3m') || str.includes('45,999') || str.includes('54,278')) {
    details = fees['3-Month'] || defaultFeeStructure['3-Month'];
  } else if (str.includes('6-month') || str.includes('6m') || str.includes('internship') || str.includes('29,500') || str.includes('data science')) {
    details = fees['6-Month'] || defaultFeeStructure['6-Month'];
  }

  if (is1INRTest) {
    return {
      ...details,
      amountPaise: 100,
      formattedTotal: '₹1.00',
      breakupText: `₹1.00 Live Test Charge (${details.tierName})`
    };
  }

  return details;
}

/**
 * Clean Razorpay Checkout Launcher
 */
function launchRazorpayCheckout(studentDetails, programNameOrDetails, onPaymentSuccess, customPaymentDetails) {
  let paymentDetails = null;

  if (customPaymentDetails && (customPaymentDetails.formattedTotal || customPaymentDetails.amountPaise)) {
    const finalVal = parseFloat((customPaymentDetails.formattedTotal || '0').replace(/[^0-9.]/g, ''));
    paymentDetails = {
      tierName: typeof programNameOrDetails === 'string' ? programNameOrDetails : 'EarEase Nexus Program',
      formattedTotal: customPaymentDetails.formattedTotal,
      totalFee: finalVal,
      amountPaise: customPaymentDetails.finalAmountPaise || customPaymentDetails.amountPaise || Math.round(finalVal * 100),
      breakupText: customPaymentDetails.breakupText || 'Discounted Admission Fee'
    };
  } else if (typeof programNameOrDetails === 'object' && programNameOrDetails !== null) {
    const finalVal = parseFloat((programNameOrDetails.formattedFinalTotal || programNameOrDetails.formattedTotal || '0').replace(/[^0-9.]/g, ''));
    paymentDetails = {
      tierName: programNameOrDetails.tierName || 'EarEase Nexus Program',
      formattedTotal: programNameOrDetails.formattedFinalTotal || programNameOrDetails.formattedTotal,
      totalFee: finalVal,
      amountPaise: programNameOrDetails.finalAmountPaise || programNameOrDetails.amountPaise || Math.round(finalVal * 100),
      breakupText: programNameOrDetails.breakupText || 'Discounted Admission Fee'
    };
  } else {
    paymentDetails = getProgramPaymentDetails(programNameOrDetails);
  }

  const key = razorpayNexusConfig.keyId || '';
  if (!key.startsWith('rzp_live_') && !key.startsWith('rzp_test_')) {
    window.open(razorpayNexusConfig.basePaymentLink, '_blank');
    return;
  }

  if (typeof Razorpay === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => executeCheckoutModal(studentDetails, paymentDetails, onPaymentSuccess);
    script.onerror = () => window.open(razorpayNexusConfig.basePaymentLink, '_blank');
    document.body.appendChild(script);
  } else {
    executeCheckoutModal(studentDetails, paymentDetails, onPaymentSuccess);
  }
}

function executeCheckoutModal(studentDetails, paymentDetails, onPaymentSuccess) {
  const is1INRTest = razorpayNexusConfig.enable1INRTesting;
  
  let chargePaise = paymentDetails.finalAmountPaise || paymentDetails.amountPaise;
  if (!chargePaise && paymentDetails.formattedTotal) {
    const num = parseFloat(paymentDetails.formattedTotal.replace(/[^0-9.]/g, ''));
    chargePaise = Math.round((isNaN(num) ? 15338.82 : num) * 100);
  }
  if (is1INRTest) {
    chargePaise = 100;
  }

  const options = {
    key: razorpayNexusConfig.keyId,
    amount: chargePaise,
    currency: "INR",
    name: "EarEase Tech Private Limited",
    description: is1INRTest 
      ? `Live QR Test Admission Fee - ₹1.00 (${paymentDetails.tierName || 'Program'})` 
      : `Admissions Fee - ${paymentDetails.tierName || 'Program'} (${paymentDetails.formattedTotal || ''})`,
    image: "assets/logo.png",
    handler: function (response) {
      console.log("Razorpay Payment Success:", response);
      if (onPaymentSuccess) onPaymentSuccess(response, paymentDetails);
    },
    prefill: {
      name: studentDetails.name || "",
      email: studentDetails.email || "",
      contact: studentDetails.phone || ""
    },
    notes: {
      program: paymentDetails.tierName || "EarEase Nexus",
      feeDetails: paymentDetails.breakupText || "Standard Rate",
      discountedAmount: paymentDetails.formattedTotal || "Standard Rate",
      source: "EarEase Nexus Portal",
      testMode: is1INRTest ? "1 INR Live Testing" : "Production"
    },
    theme: {
      color: "#D89B1F"
    }
  };

  try {
    const rzp = new Razorpay(options);
    rzp.open();
  } catch (e) {
    console.warn("Razorpay notice, opening merchant handle:", e);
    window.open(razorpayNexusConfig.basePaymentLink, '_blank');
  }
}

/**
 * Dispatches automated Tax Invoice & Confirmation Email to Candidate & HR Desk
 */
async function dispatchEmailAlert(payload) {
  try {
    const isNexus = (payload.source || '').includes('Nexus') || (payload.service || '').includes('Nexus') || (payload.govtId && payload.govtId !== 'B2B Corporate Client' && payload.govtId !== 'Aadhaar / Govt ID');

    const formData = new FormData();
    formData.append('_replyto', 'hr@eareasetech.com');
    if (payload.email) {
      formData.append('_cc', payload.email);
    }
    formData.append('_template', 'table');
    formData.append('_captcha', 'false');

    if (isNexus) {
      // -------------------------------------------------------------
      // EAR EASE NEXUS STUDENT REGISTRATION RECEIPT & TAX INVOICE
      // -------------------------------------------------------------
      const isPaid = (payload.paymentStatus || '').toLowerCase().includes('paid');
      const txId = payload.transactionId || 'Awaiting Payment';

      formData.append('_subject', isPaid 
        ? `✓ CONFIRMED & PAID: Tax Invoice - EarEase Nexus (${payload.candidateId})` 
        : `APPLICATION REGISTERED: EarEase Nexus (${payload.candidateId})`
      );

      formData.append('COMPANY NAME', 'EarEase Tech Private Limited');
      formData.append('COMPANY GSTIN', '29AAJCE2794F1ZA');
      formData.append('ADDRESS', 'Unit 101, Oxford Towers, 139, HAL Old Airport Rd, Kodihalli, Bengaluru, Karnataka 560008');
      formData.append('SUPPORT PHONE', '+91 78936 91717');
      formData.append('SUPPORT EMAIL', 'hr@eareasetech.com');
      formData.append('INVOICE NUMBER', `INV-${payload.candidateId || '001'}`);
      formData.append('REGISTRATION ID', payload.candidateId || 'EET-NEXUS-REG');
      formData.append('CANDIDATE NAME (AADHAAR)', payload.name || 'Candidate');
      formData.append('CANDIDATE EMAIL', payload.email || 'N/A');
      formData.append('PHONE / WHATSAPP', payload.phone || 'N/A');
      formData.append('GOVT ID DETAILS', payload.govtId || 'N/A');
      formData.append('CITY & STATE', `${payload.city || 'N/A'}, ${payload.state || 'N/A'}`);
      formData.append('REFERRAL NAME', payload.referral || 'Direct Applicant');
      formData.append('PROGRAM TRACK', payload.service || 'AI & Machine Learning Track');
      formData.append('BATCH COHORT', payload.cohort || 'Active Cohort');
      formData.append('TOTAL INVOICE AMOUNT', payload.estimateAmount || 'N/A');
      formData.append('FEE BREAKUP', payload.feeBreakup || 'Includes 18% GST');
      formData.append('PAYMENT STATUS', isPaid ? '✓ PAID via Razorpay' : 'Awaiting Payment');
      formData.append('RAZORPAY TRANSACTION ID', txId);
      formData.append('NEXT STEPS', 'The EarEase Team will call you within the next 24 hours or next working day to confirm your slot.');
    } else {
      // -------------------------------------------------------------
      // EAR EASE TECH B2B / WEBSITE GENERAL INQUIRY EMAIL
      // -------------------------------------------------------------
      const isB2B = (payload.service || '').includes('B2B Solutions') || (payload.source || '').includes('solutions.html');
      const isContact = (payload.source || '').includes('contact-us') || (payload.source || '').includes('Contact');
      const isCalculator = (payload.source || '').includes('lead-calculator') || (payload.source || '').includes('Calculator');

      let subjectPrefix = '[WEBSITE INQUIRY]';
      let inquiryType = 'General Proposal Request';

      if (isB2B) {
        subjectPrefix = '[B2B SOLUTIONS INQUIRY]';
        inquiryType = 'B2B Solutions Assessment Request';
      } else if (isContact) {
        subjectPrefix = '[CONTACT SALES INQUIRY]';
        inquiryType = 'Contact Us Sales Inquiry';
      } else if (isCalculator) {
        subjectPrefix = '[ESTIMATE / QUOTE REQUEST]';
        inquiryType = 'Sourcing Cost Estimate Request';
      }

      formData.append('_subject', `${subjectPrefix} ${payload.name || 'Client'} - ${payload.service || 'General'}`);

      formData.append('INQUIRY TYPE', inquiryType);
      formData.append('CONTACT NAME', payload.name || 'N/A');
      formData.append('CONTACT EMAIL', payload.email || 'N/A');
      formData.append('PHONE / WHATSAPP', payload.phone || 'N/A');
      formData.append('SERVICE OF INTEREST', payload.service || 'N/A');
      formData.append('MESSAGE / INQUIRY DETAILS', payload.message || 'No additional details provided.');
      formData.append('INQUIRY SOURCE', payload.source || 'Website Form');
      formData.append('SUBMISSION TIME', payload.createdAt || new Date().toISOString());
      formData.append('NEXT STEPS', 'A sales executive from EarEase Tech will review the requirement details and contact the client via email/phone.');
    }

    await fetch('https://formsubmit.co/ajax/hr@eareasetech.com', {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    });

  } catch (err) {
    console.warn("EarEase-Tech: Email dispatch notice error", err);
  }
}

/**
 * Dispatches 100% Full Refund Notice & Receipt to Candidate & HR Desk
 */
async function dispatchRefundEmailAlert(payload) {
  try {
    const refundFormData = new FormData();
    refundFormData.append('_subject', `↩ 100% Full Refund Notice - EarEase Nexus (${payload.candidateId})`);
    refundFormData.append('_replyto', 'hr@eareasetech.com');
    if (payload.email) {
      refundFormData.append('_cc', payload.email);
    }
    refundFormData.append('_template', 'table');
    refundFormData.append('_captcha', 'false');
    
    refundFormData.append('COMPANY NAME', 'EarEase Tech Private Limited');
    refundFormData.append('COMPANY GSTIN', '29AAJCE2794F1ZA');
    refundFormData.append('REGISTRATION ID', payload.candidateId || 'EET-NEXUS-REG');
    refundFormData.append('CANDIDATE NAME', payload.name || 'Candidate');
    refundFormData.append('CANDIDATE EMAIL', payload.email || 'N/A');
    refundFormData.append('REFUND TRANSACTION ID', payload.refundId || `rfd_${Date.now()}`);
    refundFormData.append('REFUNDED AMOUNT', payload.estimateAmount || 'N/A');
    refundFormData.append('REFUND STATUS', '100% Full Refund Initiated via Razorpay');
    refundFormData.append('REASON', payload.declineReason || 'Application Declined by Admissions Desk / Candidate Request');
    refundFormData.append('SETTLEMENT TIME', 'Refund credited to original payment method within 3-5 business days.');
    refundFormData.append('SUPPORT EMAIL', 'hr@eareasetech.com');

    await fetch('https://formsubmit.co/ajax/hr@eareasetech.com', {
      method: 'POST',
      body: refundFormData,
      headers: { 'Accept': 'application/json' }
    });
  } catch (err) {
    console.warn("EarEase-Tech: Refund email dispatch notice", err);
  }
}

async function submitLeadToFirebase(leadData) {
  const isNexus = (leadData.source || '').includes('Nexus') || (leadData.service || '').includes('Nexus');
  
  const paymentDetails = getProgramPaymentDetails(leadData.service || leadData.message || leadData.estimateAmount);

  let cohort = leadData.cohort || 'Active Cohort';
  let seatNumber = leadData.seatNumber || null;

  if (isNexus) {
    const seatStatus = getNexusSeatStatus();
    if (seatStatus.activeSeatsCount < razorpayNexusConfig.monthlySeatCap) {
      cohort = `${seatStatus.currentMonthName} Active Cohort (Seats 1-50)`;
      seatNumber = seatStatus.activeSeatsCount + 1;
    } else {
      cohort = `${seatStatus.nextMonthName} Next Cohort (Rollover Waitlist)`;
      seatNumber = seatStatus.rolloverSeatsCount + 1;
    }
  }

  const isAssessmentOrWorkshop = (leadData.service || '').includes('Assessment') || (leadData.message || '').includes('Assessment') ||
                                  (leadData.service || '').includes('Workshop') || (leadData.message || '').includes('Workshop');
  const prefix = isAssessmentOrWorkshop ? 'EET-DSC-' : 'EET-NEX-';
  const candidateId = leadData.candidateId || prefix + Math.floor(100000 + Math.random() * 900000);

  const payload = {
    docType: 'lead',
    id: leadData.id || 'lead_' + Date.now(),
    candidateId: candidateId,
    name: leadData.name || 'Website Candidate',
    govtId: leadData.govtId || 'Aadhaar / Govt ID',
    email: leadData.email || '',
    phone: leadData.phone || '',
    city: leadData.city || '',
    state: leadData.state || '',
    referral: leadData.referral || 'Direct Applicant',
    appliedCouponCode: leadData.appliedCouponCode || (leadData.appliedCoupon ? leadData.appliedCoupon.code : 'None'),
    discountAmount: leadData.discountAmount || (leadData.appliedCoupon ? leadData.appliedCoupon.formattedDiscount : '₹0'),
    service: leadData.service || 'AI & Machine Learning Track',
    estimateAmount: leadData.estimateAmount || paymentDetails.formattedTotal,
    feeBreakup: leadData.feeBreakup || paymentDetails.breakupText,
    paymentDetails: paymentDetails,
    transactionId: leadData.transactionId || leadData.razorpayPaymentId || null,
    currency: leadData.currency || 'INR',
    message: leadData.message || '',
    priority: leadData.priority || 'Hot',
    stage: leadData.stage || 'New Lead',
    assignedTo: leadData.assignedTo || 'Admissions Team',
    cohort: cohort,
    seatNumber: seatNumber,
    isNexus: isNexus,
    paymentStatus: leadData.paymentStatus || 'Registered & Confirmed',
    razorpayLink: razorpayNexusConfig.basePaymentLink,
    notes: leadData.notes || [],
    createdAt: leadData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    source: leadData.source || window.location.href
  };

  saveLocalLead(payload);
  dispatchEmailAlert(payload);
  pushCloudBlobState();

  if (isFirebaseInitialized && db) {
    try {
      const docRef = await db.collection('leads').add(payload);
      return { success: true, id: docRef.id, payload: payload, paymentDetails: paymentDetails, mode: 'firebase' };
    } catch (err) {
      console.error("Firestore submit error:", err);
      return { success: true, payload: payload, paymentDetails: paymentDetails, mode: 'local' };
    }
  }

  return { success: true, payload: payload, paymentDetails: paymentDetails, mode: 'local' };
}

function getNexusSeatStatus() {
  const leads = JSON.parse(localStorage.getItem('eet_leads') || '[]');
  const now = new Date();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentMonthName = monthNames[now.getMonth()];
  const nextMonthName = monthNames[(now.getMonth() + 1) % 12];

  const nexusAdmissions = leads.filter(l => l.isNexus || (l.service || '').includes('Nexus') || (l.service || '').includes('30-Day'));

  const activeSeats = nexusAdmissions.filter(l => (l.cohort || '').includes(currentMonthName) || !(l.cohort || '').includes(nextMonthName));
  const rolloverSeats = nexusAdmissions.filter(l => (l.cohort || '').includes(nextMonthName));

  const activeCount = activeSeats.length;
  const remainingSeats = Math.max(0, razorpayNexusConfig.monthlySeatCap - activeCount);
  const isCapped = activeCount >= razorpayNexusConfig.monthlySeatCap;

  return {
    monthlyCap: razorpayNexusConfig.monthlySeatCap,
    activeSeatsCount: activeCount,
    remainingSeats: remainingSeats,
    rolloverSeatsCount: rolloverSeats.length,
    isCapped: isCapped,
    currentMonthName: currentMonthName,
    nextMonthName: nextMonthName,
    basePaymentLink: razorpayNexusConfig.basePaymentLink
  };
}

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
    pushCloudBlobState();
  } catch (e) {
    console.error("LocalStorage save error:", e);
  }
}

async function fetchAllLeads() {
  await syncAllCloudData();
  let leads = JSON.parse(localStorage.getItem('eet_leads') || '[]');
  return leads;
}

async function updateLeadDetails(leadId, updates) {
  const leads = JSON.parse(localStorage.getItem('eet_leads') || '[]');
  const index = leads.findIndex(l => l.id === leadId || l.candidateId === leadId);
  if (index >= 0) {
    leads[index] = {
      ...leads[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem('eet_leads', JSON.stringify(leads));
    await pushCloudBlobState();

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

async function deleteSingleLead(leadId) {
  try {
    let leads = JSON.parse(localStorage.getItem('eet_leads') || '[]');
    leads = leads.filter(l => l.id !== leadId && l.candidateId !== leadId);
    localStorage.setItem('eet_leads', JSON.stringify(leads));
    await pushCloudBlobState();

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

function clearAllLocalLeads() {
  localStorage.removeItem('eet_leads');
  return [];
}

// Make globally accessible
window.razorpayNexusConfig = razorpayNexusConfig;
window.defaultFeeStructure = defaultFeeStructure;
window.getSavedProgramFees = getSavedProgramFees;
window.saveProgramFee = saveProgramFee;
window.getSavedCourses = getSavedCourses;
window.saveCourse = saveCourse;
window.deleteCourse = deleteCourse;
window.getSavedCoupons = getSavedCoupons;
window.saveCoupon = saveCoupon;
window.deleteCoupon = deleteCoupon;
window.applyCouponCode = applyCouponCode;
window.syncFirestoreCouponsToLocal = syncFirestoreCouponsToLocal;
window.syncFirestoreCoursesToLocal = syncFirestoreCoursesToLocal;
window.getProgramPaymentDetails = getProgramPaymentDetails;
window.launchRazorpayCheckout = launchRazorpayCheckout;
window.submitLeadToFirebase = submitLeadToFirebase;
window.dispatchRefundEmailAlert = dispatchRefundEmailAlert;
window.updateLeadDetails = updateLeadDetails;
window.deleteSingleLead = deleteSingleLead;
window.clearAllLocalLeads = clearAllLocalLeads;
window.getNexusSeatStatus = getNexusSeatStatus;

window.EarEaseFirebase = {
  submitLead: submitLeadToFirebase,
  dispatchRefundEmail: dispatchRefundEmailAlert,
  getLeads: fetchAllLeads,
  updateLead: updateLeadDetails,
  deleteLead: deleteSingleLead,
  clearLeads: clearAllLocalLeads,
  getSeatStatus: getNexusSeatStatus,
  getPaymentDetails: getProgramPaymentDetails,
  launchCheckout: launchRazorpayCheckout,
  razorpayConfig: razorpayNexusConfig,
  getFees: getSavedProgramFees,
  saveFee: saveProgramFee,
  getCourses: getSavedCourses,
  saveCourse: saveCourse,
  deleteCourse: deleteCourse,
  getCoupons: getSavedCoupons,
  saveCoupon: saveCoupon,
  deleteCoupon: deleteCoupon,
  applyCoupon: applyCouponCode
};
