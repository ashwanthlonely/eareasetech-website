const fs = require('fs');
const path = require('path');

// Bad strings are what the buffer thinks the UTF-8 bytes are when re-encoded as UTF-8
// Example: '₹' is E2 82 B9. Decoded as Windows-1252 it's '₹'. Encoded back to UTF-8 it's C3A2 E2809A C2B9.
// So the file literally contains C3A2 E2809A C2B9.

const fixes = [
  { bad: Buffer.from([0xC3, 0xA2, 0xE2, 0x80, 0x9A, 0xC2, 0xB9]), good: Buffer.from([0xE2, 0x82, 0xB9]) },       // ₹ -> ₹
  { bad: Buffer.from([0xC3, 0x82, 0xC2, 0xB7]), good: Buffer.from([0xC2, 0xB7]) },                               // · -> ·
  { bad: Buffer.from([0xC3, 0xA2, 0xE2, 0x80, 0x94]), good: Buffer.from([0xE2, 0x80, 0x94]) },                   // â€” -> —
  { bad: Buffer.from([0xC3, 0xB0, 0xC5, 0xB8, 0xC2, 0xA7, 0xC2, 0xA0]), good: Buffer.from([0xF0, 0x9F, 0xA7, 0xA0]) }, // 🧠 -> 🧠
  { bad: Buffer.from([0xC3, 0xB0, 0xC5, 0xB8, 0xE2, 0x80, 0x9C, 0xC5, 0xA0]), good: Buffer.from([0xF0, 0x9F, 0x93, 0x8A]) }, // 📊 -> 📊
  { bad: Buffer.from([0xC3, 0xB0, 0xC5, 0xB8, 0xE2, 0x80, 0x9C, 0xC2, 0xB1]), good: Buffer.from([0xF0, 0x9F, 0x93, 0xB1]) }, // 📱 -> 📱
  { bad: Buffer.from([0xC3, 0xA2, 0xC5, 0xA1, 0xC2, 0xA1]), good: Buffer.from([0xE2, 0x9A, 0xA1]) },             // ⚡ -> ⚡
  { bad: Buffer.from([0xC3, 0xB0, 0xC5, 0xB8, 0xE2, 0x80, 0x9C, 0xC2, 0xA6]), good: Buffer.from([0xF0, 0x9F, 0x93, 0xA6]) }, // 📦 -> 📦
  { bad: Buffer.from([0xC3, 0xB0, 0xC5, 0xB8, 0xE2, 0x80, 0x99, 0xC2, 0xB0]), good: Buffer.from([0xF0, 0x9F, 0x92, 0xB0]) }, // 💰 -> 💰
];

function fixBuffer(buf) {
  let changed = false;
  let newBuf = buf;
  for (const { bad, good } of fixes) {
    let idx;
    while ((idx = newBuf.indexOf(bad)) !== -1) {
      newBuf = Buffer.concat([newBuf.slice(0, idx), good, newBuf.slice(idx + bad.length)]);
      changed = true;
    }
  }
  return { newBuf, changed };
}

const dir = process.cwd();
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') || f.endsWith('.md') || f.endsWith('.js'));

let count = 0;
files.forEach(f => {
  const p = path.join(dir, f);
  const buf = fs.readFileSync(p);
  const { newBuf, changed } = fixBuffer(buf);
  if (changed) {
    fs.writeFileSync(p, newBuf);
    console.log('Fixed file:', f);
    count++;
  }
});
console.log('Fixed', count, 'files on disk.');

// Now fix Firestore Data
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, updateDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyC93dMM_xNhb4_9xlhbgpQ5GWUId2I0_QY",
  authDomain: "earease-tech.firebaseapp.com",
  projectId: "earease-tech",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Simple string replacement using the encoded bad strings mapped to their correct char
const strFixes = {
  '₹': '₹',
  '·': '·',
  'â€”': '—',
  'ðŸ§ ': '🧠',
  '📊': '📊',
  '📱': '📱',
  '⚡': '⚡',
  '📦': '📦',
  '💰': '💰'
};

function fixString(s) {
  if (typeof s !== 'string') return s;
  let out = s;
  for (const [bad, good] of Object.entries(strFixes)) {
    out = out.split(bad).join(good);
  }
  return out;
}

async function fixFirestore() {
  console.log('Fetching courses from Firestore...');
  const snap = await getDocs(collection(db, 'courses'));
  let updated = 0;
  for (const d of snap.docs) {
    const data = d.data();
    let changed = false;
    const newData = {};
    
    for (const key of Object.keys(data)) {
      if (typeof data[key] === 'string') {
        const fixed = fixString(data[key]);
        if (fixed !== data[key]) {
          newData[key] = fixed;
          changed = true;
        }
      } else if (typeof data[key] === 'object' && data[key] !== null) { // Fix nested objects like prices
        const nested = {};
        let nestedChanged = false;
        for (const k of Object.keys(data[key])) {
          const newK = fixString(k);
          if (newK !== k) { nested[newK] = data[key][k]; nestedChanged = true; changed = true; }
          else { nested[k] = data[key][k]; }
        }
        if (nestedChanged) newData[key] = nested;
      }
    }
    
    if (changed) {
      await updateDoc(doc(db, 'courses', d.id), newData);
      console.log('Updated course:', d.id, newData.name || '');
      updated++;
    }
  }
  console.log('Fixed', updated, 'documents in Firestore. You can press Ctrl+C to exit.');
  process.exit(0);
}

fixFirestore().catch(e => { console.error(e); process.exit(1); });
