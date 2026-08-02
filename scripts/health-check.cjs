const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const contractPath = path.join(rootDir, 'runtime-contract.json');
const indexPath = path.join(rootDir, 'index.html');
const assetMapPath = path.join(rootDir, 'config', 'asset-map.json');
const manifestPath = path.join(rootDir, 'manifest.json');
const swPath = path.join(rootDir, 'sw.js');
const srcDir = path.join(rootDir, 'src');

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
let missingDomAnchors = 0;

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

// Helper to recursively collect all JS files in src/
function getAllJsFiles(dir, fileList = []) {
    if (!fs.existsSync(dir)) return fileList;
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            getAllJsFiles(filePath, fileList);
        } else if (file.endsWith('.js') || file.endsWith('.cjs')) {
            fileList.push(filePath);
        }
    });
    return fileList;
}

const srcJsFiles = getAllJsFiles(srcDir);
let fullCodeBase = html;

srcJsFiles.forEach(file => {
    fullCodeBase += '\n' + fs.readFileSync(file, 'utf8');
});

// 1. Scan Assets in HTML & JS Source Graph
const assetPathRegex = /["'](public\/(?:images|media)\/[^"']+)["']/gi;
const srcRegex = /(?:src|href|poster)\s*=\s*["']([^"']+)["']/gi;
const bgUrlRegex = /url\s*\(\s*["']?([^"'\)]+)["']?\s*\)/gi;

const scannedAssets = new Set();
let match;

while ((match = assetPathRegex.exec(fullCodeBase)) !== null) {
    scannedAssets.add(match[1]);
}
while ((match = srcRegex.exec(fullCodeBase)) !== null) {
    const val = match[1];
    if (!val.startsWith('http://') && !val.startsWith('https://') && !val.startsWith('data:') && !val.startsWith('#') && !val.startsWith('mailto:') && !val.startsWith('tel:')) {
        scannedAssets.add(val);
    }
}
while ((match = bgUrlRegex.exec(fullCodeBase)) !== null) {
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

    const resolvedPath = assetMap[ref] || assetMap[cleanRef] || cleanRef;
    const fullPath = path.join(rootDir, resolvedPath);

    if (!fs.existsSync(fullPath) && !ref.includes('${') && !['image/png', 'blob', 'url'].includes(ref) && !ref.endsWith('.css') && !ref.endsWith('.js')) {
        console.warn(`  ⚠️ Asset Not Found on Disk: ${ref} -> ${resolvedPath}`);
        missingAssets++;
    }
});

// 2. Scan Inline Event Handlers and verify defined functions across FULL MODULE GRAPH
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

// Extract function declarations across index.html AND src/**/*.js
const funcDeclRegex = /function\s+([a-zA-Z0-9_$]+)\s*\(/g;
const funcAssignRegex = /(?:window\.)?([a-zA-Z0-9_$]+)\s*=\s*(?:function|\([^)]*\)\s*=>)/g;
const exportFuncRegex = /export\s+function\s+([a-zA-Z0-9_$]+)\s*\(/g;
const definedFuncs = new Set();

while ((match = funcDeclRegex.exec(fullCodeBase)) !== null) {
    definedFuncs.add(match[1]);
}
while ((match = funcAssignRegex.exec(fullCodeBase)) !== null) {
    definedFuncs.add(match[1]);
}
while ((match = exportFuncRegex.exec(fullCodeBase)) !== null) {
    definedFuncs.add(match[1]);
}

inlineHandlers.forEach(funcName => {
    if (!definedFuncs.has(funcName)) {
        console.warn(`  ⚠️ Missing Handler Function: ${funcName}`);
        missingHandlers++;
    }
});

// 3. Scan Duplicate DOM IDs
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

// 4. REAL VALIDATION: PWA Manifest Check
if (!fs.existsSync(manifestPath)) {
    console.warn(`  ⚠️ Manifest File Missing: manifest.json`);
    manifestErrors++;
} else {
    try {
        const manifestContent = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        if (!manifestContent.name || !manifestContent.short_name) {
            console.warn(`  ⚠️ Manifest Missing Required Fields (name/short_name)`);
            manifestErrors++;
        }
        if (Array.isArray(manifestContent.icons)) {
            manifestContent.icons.forEach(icon => {
                const iconPath = path.join(rootDir, icon.src.replace(/^\//, ''));
                if (!fs.existsSync(iconPath)) {
                    console.warn(`  ⚠️ Manifest Icon Not Found on Disk: ${icon.src}`);
                    manifestErrors++;
                }
            });
        }
    } catch (err) {
        console.warn(`  ⚠️ Manifest Syntax JSON Error: ${err.message}`);
        manifestErrors++;
    }
}

// 5. REAL VALIDATION: Service Worker Check
if (!fs.existsSync(swPath)) {
    console.warn(`  ⚠️ Service Worker File Missing: sw.js`);
    swErrors++;
} else {
    const swContent = fs.readFileSync(swPath, 'utf8');
    if (!swContent.includes('install') || !swContent.includes('fetch')) {
        console.warn(`  ⚠️ Service Worker Missing Event Listeners (install/fetch)`);
        swErrors++;
    }
}

// 6. REAL VALIDATION: Static Contract Anchors & Route Anchors Check
if (contract.requiredDomAnchors && Array.isArray(contract.requiredDomAnchors)) {
    contract.requiredDomAnchors.forEach(anchor => {
        if (!html.includes(`id="${anchor}"`) && !html.includes(`id='${anchor}'`)) {
            console.warn(`  ⚠️ Required DOM Anchor Missing: #${anchor}`);
            missingDomAnchors++;
        }
    });
}

// Output Comprehensive Gate Report
console.log(`Source Modules Scanned:  ${srcJsFiles.length + 1} files (index.html + src/**/*.js)`);
console.log(`Assets Scanned:          ${scannedAssets.size}`);
console.log(`Missing Assets:          ${missingAssets}`);
console.log(`Legacy Paths:            ${legacyPathsCount}`);
console.log(`Unique Inline Handlers:  ${inlineHandlers.size}`);
console.log(`Missing Handlers:        ${missingHandlers}`);
console.log(`Duplicate IDs:           ${duplicateIds}`);
console.log(`Manifest Validation:     ${manifestErrors === 0 ? 'VALIDATED (0 errors)' : manifestErrors + ' errors'}`);
console.log(`Service Worker Check:    ${swErrors === 0 ? 'VALIDATED (0 errors)' : swErrors + ' errors'}`);
console.log(`Static DOM Anchors:      ${missingDomAnchors === 0 ? 'VALIDATED (0 missing)' : missingDomAnchors + ' missing'}`);
console.log('--------------------------------------------------');
console.log(`ℹ️ NOTE: Runtime console errors & network 404s require [BROWSER GATE] verification.`);
console.log('--------------------------------------------------');

const pass = missingAssets <= contract.allowedMissingAssets &&
             legacyPathsCount <= contract.allowedLegacyAssets &&
             missingHandlers <= contract.allowedMissingHandlers &&
             duplicateIds <= contract.allowedDuplicateIds &&
             manifestErrors === 0 &&
             swErrors === 0 &&
             missingDomAnchors === 0;

if (pass) {
    console.log('✅ RESULT: PASS (Exit code 0)\n');
    process.exit(0);
} else {
    console.error('❌ RESULT: FAIL (Exit code 1)\n');
    process.exit(1);
}
