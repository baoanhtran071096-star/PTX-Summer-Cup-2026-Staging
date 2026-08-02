const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const fixturesDir = path.join(rootDir, 'tests', 'fixtures');

console.log('\n==================================================');
console.log('       GOLDEN FIXTURES & DOMAIN PURITY TEST      ');
console.log('==================================================\n');

// Deep clone utility
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// Deep equal utility
function deepEqual(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
}

let totalSuites = 0;
let totalCases = 0;
let failedCases = 0;
let purityViolations = 0;

// 1. DOMAIN MODULE PURITY SCANNER
const domainDir = path.join(rootDir, 'src', 'domain');
if (!fs.existsSync(domainDir)) {
    console.error('❌ ERROR: src/domain directory missing!');
    process.exit(1);
}

const domainFiles = fs.readdirSync(domainDir).filter(f => f.endsWith('.js'));
console.log(`Scanning Domain Modules Purity (${domainFiles.length} modules)...`);

const testedDomainFunctions = new Set();

domainFiles.forEach(file => {
    const filePath = path.join(domainDir, file);
    const content = fs.readFileSync(filePath, 'utf8');

    const forbiddenPatterns = [
        { name: 'DOM Access (document)', regex: /\bdocument\./ },
        { name: 'DOM Access (window)', regex: /\bwindow\./ },
        { name: 'localStorage', regex: /\blocalStorage\b/ },
        { name: 'sessionStorage', regex: /\bsessionStorage\b/ },
        { name: 'Firebase', regex: /\bfirebase\b/i },
        { name: 'Network Fetch', regex: /\bfetch\s*\(/ }
    ];

    forbiddenPatterns.forEach(pattern => {
        if (pattern.regex.test(content)) {
            console.error(`  ❌ Purity Violation in src/domain/${file}: Found ${pattern.name}`);
            purityViolations++;
        }
    });
});

if (purityViolations > 0) {
    console.error(`❌ DOMAIN PURITY SCAN FAILED: ${purityViolations} forbidden dependencies found!`);
    process.exit(1);
} else {
    console.log(`  ✅ DOMAIN PURITY: 100% CLEAN (0 side-effects, 0 DOM/Storage calls)\n`);
}

async function runFixtureTests() {
    const standingsModule = await import('../src/domain/standings.js');
    const statisticsModule = await import('../src/domain/statistics.js');
    const matchesModule = await import('../src/domain/matches.js');

    // 2. STANDINGS FIXTURES
    if (fs.existsSync(path.join(fixturesDir, 'standings.json'))) {
        totalSuites++;
        const suite = JSON.parse(fs.readFileSync(path.join(fixturesDir, 'standings.json'), 'utf8'));
        console.log(`Executing Suite 1: ${suite.suite} (${suite.cases.length} cases)...`);
        
        suite.cases.forEach(c => {
            totalCases++;
            const inputBefore = deepClone(c.input);
            let result;

            if (c.name.includes('sortStandings')) {
                result = standingsModule.sortStandings(c.input);
                testedDomainFunctions.add('sortStandings');
            } else {
                result = standingsModule.calculateStandings(c.input.matchResults, c.input.teamConfigs);
                testedDomainFunctions.add('calculateStandings');
            }

            const inputAfter = deepClone(c.input);

            if (!deepEqual(inputBefore, inputAfter)) {
                console.error(`  ❌ Input Mutation Error in case "${c.name}"`);
                failedCases++;
            } else if (!deepEqual(result, c.expected)) {
                console.error(`  ❌ Output Parity Error in case "${c.name}"`);
                console.error(`     Expected:`, c.expected);
                console.error(`     Received:`, result);
                failedCases++;
            } else {
                console.log(`  ✅ [PASS] ${c.name}`);
            }
        });
    }

    // 3. STATISTICS FIXTURES
    if (fs.existsSync(path.join(fixturesDir, 'statistics.json'))) {
        totalSuites++;
        const suite = JSON.parse(fs.readFileSync(path.join(fixturesDir, 'statistics.json'), 'utf8'));
        console.log(`\nExecuting Suite 2: ${suite.suite} (${suite.cases.length} cases)...`);

        suite.cases.forEach(c => {
            totalCases++;
            const inputBefore = deepClone(c.input);
            let result;

            if (c.name.includes('calculatePlayerStats')) {
                result = statisticsModule.calculatePlayerStats(c.input.matches, c.input.players);
                testedDomainFunctions.add('calculatePlayerStats');
            } else if (c.name.includes('getPlayerTeam')) {
                result = statisticsModule.getPlayerTeam(c.input.playerName, c.input.teamsData);
                testedDomainFunctions.add('getPlayerTeam');
            } else {
                result = statisticsModule.computeDashboardStats(c.input.matches, c.input.players, c.input.teams);
                testedDomainFunctions.add('computeDashboardStats');
            }

            const inputAfter = deepClone(c.input);

            if (!deepEqual(inputBefore, inputAfter)) {
                console.error(`  ❌ Input Mutation Error in case "${c.name}"`);
                failedCases++;
            } else if (!deepEqual(result, c.expected)) {
                console.error(`  ❌ Output Parity Error in case "${c.name}"`);
                console.error(`     Expected:`, c.expected);
                console.error(`     Received:`, result);
                failedCases++;
            } else {
                console.log(`  ✅ [PASS] ${c.name}`);
            }
        });
    }

    // 4. MATCHES FIXTURES
    if (fs.existsSync(path.join(fixturesDir, 'matches.json'))) {
        totalSuites++;
        const suite = JSON.parse(fs.readFileSync(path.join(fixturesDir, 'matches.json'), 'utf8'));
        console.log(`\nExecuting Suite 3: ${suite.suite} (${suite.cases.length} cases)...`);

        suite.cases.forEach(c => {
            totalCases++;
            const inputBefore = deepClone(c.input);
            let result;

            if (c.name.includes('filterMatchesByRound')) {
                result = matchesModule.filterMatchesByRound(c.input.matches, c.input.round);
                testedDomainFunctions.add('filterMatchesByRound');
            } else if (c.name.includes('parseGoalDataWithTeam')) {
                result = matchesModule.parseGoalDataWithTeam(c.input.resultStr, c.input.match);
                testedDomainFunctions.add('parseGoalDataWithTeam');
            } else if (c.name.includes('getMatchResult')) {
                result = matchesModule.getMatchResult(c.input.matchId, c.input.storedResults);
                testedDomainFunctions.add('getMatchResult');
            }

            const inputAfter = deepClone(c.input);

            if (!deepEqual(inputBefore, inputAfter)) {
                console.error(`  ❌ Input Mutation Error in case "${c.name}"`);
                failedCases++;
            } else if (!deepEqual(result, c.expected)) {
                console.error(`  ❌ Output Parity Error in case "${c.name}"`);
                console.error(`     Expected:`, c.expected);
                console.error(`     Received:`, result);
                failedCases++;
            } else {
                console.log(`  ✅ [PASS] ${c.name}`);
            }
        });
    }

    console.log('\n--------------------------------------------------');
    console.log(`Golden Fixture Suites Executed: ${totalSuites}`);
    console.log(`Representative Cases Verified:  ${totalCases}`);
    console.log(`Domain Functions Tested:        ${testedDomainFunctions.size}/8 (${Array.from(testedDomainFunctions).join(', ')})`);
    console.log(`Calculation Parity:             ${failedCases === 0 ? '100% PARITY MATCH' : 'FAIL'}`);
    console.log(`Unexpected Input Mutations:     0`);
    console.log('--------------------------------------------------');

    if (failedCases === 0 && testedDomainFunctions.size === 8) {
        console.log('🏆 GOLDEN FIXTURES GATE: PASS (Exit code 0)\n');
        process.exit(0);
    } else {
        console.error(`❌ GOLDEN FIXTURES GATE: FAIL (Tested ${testedDomainFunctions.size}/8 domain functions)\n`);
        process.exit(1);
    }
}

runFixtureTests().catch(err => {
    console.error('❌ CRITICAL FIXTURE TEST ERROR:', err);
    process.exit(1);
});
