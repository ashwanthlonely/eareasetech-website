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

const defaultCoupons = [
  { id: 'cpn_10', code: 'EAREASE10', type: 'percent', discount: 10, description: '10% Off Instant Discount', active: true, docType: 'coupon' },
  { id: 'cpn_5k', code: 'EARLY5000', type: 'flat', discount: 5000, description: 'Flat ₹5,000 Off Early Bird', active: true, docType: 'coupon' },
  { id: 'cpn_20', code: 'NEXUS20', type: 'percent', discount: 20, description: '20% Off Special Promo', active: true, docType: 'coupon' }
];

const defaultCourses = [
  { id: 'course_ai_3m', title: 'AI & Machine Learning (3-Month Mentorship)', duration: '3-Month', badge: '🟢 LIVE ADMISSIONS OPEN', isLive: true, baseFee: 45999, description: 'Master Python, Math/Stats, Scikit-Learn, Supervised/Unsupervised ML, Deep Learning, and production model deployment.', docType: 'course' },
  { id: 'course_ai_30d', title: 'AI & Machine Learning (30-Day Express)', duration: '30-Day', badge: '🟢 LIVE ADMISSIONS OPEN', isLive: true, baseFee: 13000, description: '30 Live daily intensive sessions covering ML fundamentals, OpenCV, hands-on projects, and Streamlit app building.', docType: 'course' },
  { id: 'course_ai_tools', title: 'AI Tools for Working Professionals', duration: '30-Day', badge: '🟢 LIVE ADMISSIONS OPEN', isLive: true, baseFee: 13000, description: 'ChatGPT 4o, Claude 3.5, Gemini, GitHub Copilot, Midjourney, n8n workflow automation, and 10x workplace efficiency.', docType: 'course' },
  { id: 'course_ds_6m', title: 'Data Science & Advanced Analytics (6M)', duration: '6-Month', badge: '🟢 LIVE ADMISSIONS OPEN', isLive: true, baseFee: 25000, description: 'Data cleaning, EDA, SQL databases, statistical modeling, machine learning algorithms, and guaranteed enterprise internship.', docType: 'course' }
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
      }
    } catch (e) {
      console.warn("Firestore SDK coupon fetch notice:", e);
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
        if (fsCourses.length > 0) {
          localStorage.setItem('eet_courses', JSON.stringify(fsCourses));
          return;
        }
      }
    } catch (e) {
      console.warn("Firestore SDK course fetch notice:", e);
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
    await syncFirestoreCouponsToLocal();

    const url = force ? `${GLOBAL_CLOUD_BLOB_URL}?t=${Date.now()}` : GLOBAL_CLOUD_BLOB_URL;
    const res = await fetch(url);
    if (!res.ok) {
      if (res.status === 404) await pushCloudBlobState();
      return;
    }
    const data = await res.json();
    if (!data) return;

    if (data.coupons && Array.isArray(data.coupons) && data.coupons.length > 0) {
      const merged = [...defaultCoupons];
      data.coupons.forEach(cc => {
        const idx = merged.findIndex(m => m.code === cc.code || m.id === cc.id);
        if (idx >= 0) merged[idx] = cc;
        else merged.push(cc);
      });
      localStorage.setItem('eet_coupons', JSON.stringify(merged));
    }

    if (data.courses && Array.isArray(data.courses) && data.courses.length > 0) {
      const mergedCourses = [...defaultCourses];
      data.courses.forEach(cc => {
        const idx = mergedCourses.findIndex(m => m.id === cc.id);
        if (idx >= 0) mergedCourses[idx] = cc;
        else mergedCourses.push(cc);
      });
      localStorage.setItem('eet_courses', JSON.stringify(mergedCourses));
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
  if (saved) {
    try { return JSON.parse(saved); } catch(e){}
  }
  return defaultCourses;
}

async function saveCourse(courseData) {
  const courses = getSavedCourses();
  courseData.docType = 'course';

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

  return courses;
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
  const code = (couponIdOrCode || '').trim().toUpperCase();

  coupons = coupons.filter(c => c.id !== couponIdOrCode && c.code !== code);
  localStorage.setItem('eet_coupons', JSON.stringify(coupons));
  await pushCloudBlobState();

  // Direct REST API delete from Firestore database eareasetech-tech
  try {
    const delUrl = `https://firestore.googleapis.com/v1/projects/eareasetech-tech/databases/(default)/documents/coupons/${code || couponIdOrCode}?key=AIzaSyD8efty9voJ5IFO3GRPjcDqjouMLh0oBlw`;
    fetch(delUrl, { method: 'DELETE' });
  } catch (e) {
    console.warn("Firestore coupon REST delete notice:", e);
  }

  if (isFirebaseInitialized && db) {
    try {
      await db.collection('coupons').doc(code || couponIdOrCode).delete();
    } catch (e) {
      console.warn("Firestore coupon delete notice:", e);
    }
  }

  return coupons;
}

async function applyCouponCode(couponCode, programOrTierName) {
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
  let discountAmount = 0;

  if (coupon.type === 'percent') {
    discountAmount = Math.round((baseDetails.totalFee * coupon.discount) / 100);
  } else {
    discountAmount = Math.min(coupon.discount, baseDetails.totalFee - 100);
  }

  const finalTotal = Math.max(100, Math.round((baseDetails.totalFee - discountAmount) * 100) / 100);
  const finalAmountPaise = Math.round(finalTotal * 100);

  return {
    success: true,
    code: coupon.code,
    coupon: coupon,
    discountAmount: discountAmount,
    formattedDiscount: `₹${discountAmount.toLocaleString('en-IN')}`,
    originalTotal: baseDetails.formattedTotal,
    finalTotal: finalTotal,
    formattedFinalTotal: `₹${finalTotal.toLocaleString('en-IN')}`,
    finalAmountPaise: finalAmountPaise,
    breakupText: `${baseDetails.breakupText} — Promo Code '${coupon.code}' (-₹${discountAmount.toLocaleString('en-IN')})`
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
    const isPaid = (payload.paymentStatus || '').toLowerCase().includes('paid');
    const txId = payload.transactionId || 'Awaiting Payment';

    // Send FormSubmit payload to hr@eareasetech.com, and CC candidate email for direct delivery
    const formData = new FormData();
    formData.append('_subject', isPaid 
      ? `✓ CONFIRMED & PAID: Tax Invoice - EarEase Nexus (${payload.candidateId})` 
      : `APPLICATION REGISTERED: EarEase Nexus (${payload.candidateId})`
    );
    formData.append('_replyto', 'hr@eareasetech.com');
    if (payload.email) {
      formData.append('_cc', payload.email);
    }
    formData.append('_template', 'table');
    formData.append('_captcha', 'false');

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

    await fetch('https://formsubmit.co/ajax/hr@eareasetech.com', {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    });

  } catch (err) {
    console.warn("EarEase-Tech: Email dispatch notice", err);
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

  const candidateId = leadData.candidateId || 'EET-NEX-' + Math.floor(100000 + Math.random() * 900000);

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
