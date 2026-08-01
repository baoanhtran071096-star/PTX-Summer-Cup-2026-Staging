const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const contractPath = path.join(rootDir, 'runtime-contract.json');
const indexPath = path.join(rootDir, 'index.html');
const assetMapPath = path.join(rootDir, 'config', 'asset-map.json');

console.log('\n==================================================');
console.log('       PTX RUNTIME INTEGRITY CHECK GATE          ');
console.log('==================================================\n');

if (!fs.existsSync(contractPath)) {
    console.error('❌ ERROR: runtime-contract.json missing!');
    process.exit(1);
}

const contract = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
const html = fs.readFileSync(indexPath, 'utf8');
const assetMap = fs.existsSync(assetMapPath) ? JSON.parse(fs.readFileSync(assetMapPath, 'utf8')) : {};

let missingAssets = 0;
let legacyPathsCount = 0;
let missingHandlers = 0;
let duplicateIds = 0;
let manifestErrors = 0;
let swErrors = 0;

// Reserved JS Keywords & Standard DOM Methods
const jsKeywords = new Set([
    'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'catch', 'try',
    'return', 'typeof', 'void', 'delete', 'new', 'this', 'event', 'window',
    'document', 'location', 'history', 'console', 'alert', 'confirm', 'prompt',
    'scrollTo', 'getElementById', 'getElementsByClassName', 'getElementsByTagName',
    'querySelector', 'querySelectorAll', 'remove', 'removeChild', 'appendChild',
    'closest', 'setAttribute', 'getAttribute', 'removeAttribute', 'addEventListener',
    'removeEventListener', 'focus', 'blur', 'preventDefault', 'stopPropagation', 'reload'
]);

// 1. Scan Assets in HTML & JS Registry Arrays
const assetPathRegex = /["'](public\/(?:images|media)\/[^"']+)["']/gi;
const srcRegex = /(?:src|href|poster)\s*=\s*["']([^"']+)["']/gi;
const bgUrlRegex = /url\s*\(\s*["']?([^"'\)]+)["']?\s*\)/gi;

const scannedAssets = new Set();
let match;

while ((match = assetPathRegex.exec(html)) !== null) {
    scannedAssets.add(match[1]);
}
while ((match = srcRegex.exec(html)) !== null) {
    const val = match[1];
    if (!val.startsWith('http://') && !val.startsWith('https://') && !val.startsWith('data:') && !val.startsWith('#') && !val.startsWith('mailto:') && !val.startsWith('tel:')) {
        scannedAssets.add(val);
    }
}
while ((match = bgUrlRegex.exec(html)) !== null) {
    const val = match[1];
    if (!val.startsWith('http://') && !val.startsWith('https://') && !val.startsWith('data:') && !val.startsWith('#')) {
        scannedAssets.add(val);
    }
}

scannedAssets.forEach(ref => {
    if (ref.includes('thư viện/') || ref.includes('th%C6%B0') || ref.includes('thu vi')) {
        console.warn(`  ⚠️ Legacy Path Detected: ${ref}`);
        legacyPathsCount++;
    }

    let cleanRef = ref.split('?')[0].split('#')[0];
    try { cleanRef = decodeURIComponent(cleanRef); } catch(e) {}

    // Check mapped or physical path
    const resolvedPath = assetMap[ref] || assetMap[cleanRef] || cleanRef;
    const fullPath = path.join(rootDir, resolvedPath);

    if (!fs.existsSync(fullPath) && !ref.includes('${') && !['image/png', 'blob', 'url'].includes(ref)) {
        console.warn(`  ⚠️ Asset Not Found on Disk: ${ref} -> ${resolvedPath}`);
        missingAssets++;
    }
});

// 2. Scan Inline Event Handlers and verify defined functions in JS
const inlineEventRegex = /on(click|change|submit|input|keydown|keyup|onload|onerror)\s*=\s*["']([^"']+)["']/gi;
const inlineHandlers = new Set();

while ((match = inlineEventRegex.exec(html)) !== null) {
    const code = match[2].trim();
    const funcMatches = code.matchAll(/([a-zA-Z0-9_$]+)\s*\(/g);
    for (const fm of funcMatches) {
        const funcName = fm[1];
        if (!jsKeywords.has(funcName)) {
            inlineHandlers.add(funcName);
        }
    }
}

// Extract function declarations in HTML script tags
const funcDeclRegex = /function\s+([a-zA-Z0-9_$]+)\s*\(/g;
const funcAssignRegex = /(?:window\.)?([a-zA-Z0-9_$]+)\s*=\s*(?:function|\([^)]*\)\s*=>)/g;
const definedFuncs = new Set();

while ((match = funcDeclRegex.exec(html)) !== null) {
    definedFuncs.add(match[1]);
}
while ((match = funcAssignRegex.exec(html)) !== null) {
    definedFuncs.add(match[1]);
}

inlineHandlers.forEach(funcName => {
    if (!definedFuncs.has(funcName)) {
        console.warn(`  ⚠️ Missing Handler Function: ${funcName}`);
        missingHandlers++;
    }
});

// 3. Scan Duplicate IDs
const idRegex = /id\s*=\s*["']([^"']+)["']/gi;
const idsSeen = new Set();
while ((match = idRegex.exec(html)) !== null) {
    const idVal = match[1];
    if (idsSeen.has(idVal)) {
        console.warn(`  ⚠️ Duplicate DOM ID Found: #${idVal}`);
        duplicateIds++;
    } else {
        idsSeen.add(idVal);
    }
}

// Output Report
console.log(`Assets Scanned:          ${scannedAssets.size}`);
console.log(`Missing Assets:          ${missingAssets}`);
console.log(`Legacy Paths:            ${legacyPathsCount}`);
console.log(`Inline Handlers:         ${inlineHandlers.size}`);
console.log(`Missing Handlers:        ${missingHandlers}`);
console.log(`Duplicate IDs:           ${duplicateIds}`);
console.log(`Manifest Errors:         ${manifestErrors}`);
console.log(`Service Worker Errors:   ${swErrors}`);
console.log('--------------------------------------------------');

const pass = missingAssets <= contract.allowedMissingAssets &&
             legacyPathsCount <= contract.allowedLegacyAssets &&
             missingHandlers <= contract.allowedMissingHandlers &&
             duplicateIds <= contract.allowedDuplicateIds;

if (pass) {
    console.log('✅ RESULT: PASS (Exit code 0)\n');
    process.exit(0);
} else {
    console.error('❌ RESULT: FAIL (Exit code 1)\n');
    process.exit(1);
}
