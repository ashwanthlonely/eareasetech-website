const fs = require('fs');
const path = require('path');

const replacements = {
  '₹': '₹',
  '·': '·',
  'â€”': '—',
  '🧠': '🧠',
  '📊': '📊',
  '📱': '📱',
  '⚡': '⚡',
  '📦': '📦',
  'â• ': '═',
  'â”€': '─',
  'â€™': '’',
  'â€œ': '“',
  'â€ ': '”'
};

const dir = process.cwd();
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') || f.endsWith('.md'));

let modifiedCount = 0;
files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  
  for (const [bad, good] of Object.entries(replacements)) {
    content = content.split(bad).join(good);
  }
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed encoding in:', file);
    modifiedCount++;
  }
});
console.log('Total files fixed:', modifiedCount);
