const fs = require("fs");
const path = "public/data/products.json";

let raw = fs.readFileSync(path, "utf8");

// ---- STRIP THE BOM (if present) ----
raw = raw.replace(/^\uFEFF/, "");
// ------------------------------------

const before = raw;




// Order matters — longest mojibake first, so prefixes don't break longer matches
const replacements = [
  ["â€“", "–"],   // en-dash
  ["â€”", "—"],   // em-dash
  ["â€™", "’"],   // right single quote (apostrophe)
  ["â€œ", "“"],   // left double quote
  ["â€", "”"],    // right double quote
  ["Ã©", "é"],    // é
  ["Ã¨", "è"],
  ["Ã ", "à"],
  ["Â ", " "],    // non-breaking space
  ["Â", ""],      // stray Â
  ["â€", ""],     // stray â€ (catch-all, after the specific ones above)
];

let fixed = raw;
let total = 0;
for (const [from, to] of replacements) {
  const count = fixed.split(from).length - 1;
  if (count > 0) {
    console.log(`  Replacing "${from}" → "${to}"  (${count}×)`);
    fixed = fixed.split(from).join(to);
    total += count;
  }
}

fs.writeFileSync(path, fixed, "utf8");

console.log(`\n✅ ${total} replacements across ${replacements.length} patterns.`);

// Verify: re-read and check for any remaining mojibake
const check = fs.readFileSync(path, "utf8");
const stillBad = ["â€“", "â€”", "â€™", "â€œ", "â€", "Ã©", "Â"].filter(s => check.includes(s));

if (stillBad.length === 0) {
  console.log("✅ File is CLEAN — no mojibake remaining.");
} else {
  console.log("⚠️  STILL PRESENT:", stillBad);
  console.log("   → paste this output and I'll target the exact bytes.");
}

// Show the exact line for product ID 2
const json = JSON.parse(check);
const p2 = json.products.find(p => p.id === 2);
if (p2) console.log("\nProduct 2 name:", JSON.stringify(p2.name));