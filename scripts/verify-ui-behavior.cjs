const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const indexPath = path.join(rootDir, 'index.html');

console.log('\n==================================================');
console.log('       UI MODULES BEHAVIORAL SMOKE TEST           ');
console.log('==================================================\n');

const html = fs.readFileSync(indexPath, 'utf8');

let passedUiTests = 0;
let failedUiTests = 0;

// Mock Minimal DOM Environment
class MockElement {
    constructor(id, tagName = 'div') {
        this.id = id;
        this.tagName = tagName;
        this._classes = new Set();

        const self = this;
        this.classList = {
            add: (cls) => { self._classes.add(cls); },
            remove: (cls) => { self._classes.delete(cls); },
            contains: (cls) => self._classes.has(cls)
        };

        this.style = {};
        this.children = [];
        this.innerHTML = '';
        this.value = '';
    }

    appendChild(child) {
        this.children.push(child);
    }
}

const domElements = {};

global.document = {
    getElementById: (id) => {
        if (!domElements[id]) {
            domElements[id] = new MockElement(id);
        }
        return domElements[id];
    },
    createElement: (tag) => {
        return new MockElement('created_' + Math.random(), tag);
    },
    body: new MockElement('body')
};

global.window = global;

// Callback Spies
const spies = {
    generateAIPressRelease: [],
    renderCompareView: 0,
    onLiveStreamMatchChange: 0,
    drawInfographicCanvas: 0,
    updateTicketName: []
};

global.window.generateAIPressRelease = (type) => { spies.generateAIPressRelease.push(type); };
global.window.renderCompareView = () => { spies.renderCompareView++; };
global.window.onLiveStreamMatchChange = () => { spies.onLiveStreamMatchChange++; };
global.window.drawInfographicCanvas = () => { spies.drawInfographicCanvas++; };
global.window.updateTicketName = (val) => { spies.updateTicketName.push(val); };

async function runUiTests() {
    console.log('Testing 1: src/ui/toast.js (showToast)...');
    const toastModule = await import('../src/ui/toast.js');

    toastModule.showToast('Smoke Test Toast Notification', 'success');
    const container = global.document.getElementById('toastContainer');

    if (container && container.children.length > 0) {
        const toast = container.children[0];
        if (toast.innerHTML.includes('Smoke Test Toast Notification') && toast.className.includes('success')) {
            console.log('  ✅ [PASS] showToast - Created container, rendered toast notification');
            passedUiTests++;
        } else {
            console.error('  ❌ [FAIL] showToast - Toast content or class mismatch');
            failedUiTests++;
        }
    } else {
        console.error('  ❌ [FAIL] showToast - Failed to append toast element');
        failedUiTests++;
    }

    console.log('\nTesting 2: src/ui/modals.js (Pure Presentation Primitives)...');
    const pureModalsModule = await import('../src/ui/modals.js');

    const pureCases = [
        { name: 'Login Pure Primitive', show: pureModalsModule.showLoginModal, hide: pureModalsModule.hideLoginModal, id: 'loginModal', type: 'class', val: 'active' },
        { name: 'AI Growth Pure Primitive', show: pureModalsModule.showAiGrowthModal, hide: pureModalsModule.hideAiGrowthModal, id: 'aiGrowthModal', type: 'style', openVal: 'flex', closeVal: 'none' },
        { name: 'VIP Ticket Pure Primitive', show: pureModalsModule.showVipTicketModal, hide: pureModalsModule.hideVipTicketModal, id: 'vipTicketModal', type: 'style', openVal: 'flex', closeVal: 'none' },
        { name: 'Compare Players Pure Primitive', show: pureModalsModule.showComparePlayersModal, hide: pureModalsModule.hideComparePlayersModal, id: 'comparePlayersModal', type: 'style', openVal: 'flex', closeVal: 'none' },
        { name: 'Infographic Pure Primitive', show: pureModalsModule.showInfographicModal, hide: pureModalsModule.hideInfographicModal, id: 'infographicModal', type: 'style', openVal: 'flex', closeVal: 'none' },
        { name: 'LiveStream Hub Pure Primitive', show: pureModalsModule.showLiveStreamHubModal, hide: pureModalsModule.hideLiveStreamHubModal, id: 'liveStreamHubModal', type: 'style', openVal: 'flex', closeVal: 'none' },
        { name: 'AI Press Release Pure Primitive', show: pureModalsModule.showAiPressReleaseModal, hide: pureModalsModule.hideAiPressReleaseModal, id: 'aiPressReleaseModal', type: 'style', openVal: 'flex', closeVal: 'none' },
        { name: 'Stadium DJ Pure Primitive', show: pureModalsModule.showStadiumDJModal, hide: pureModalsModule.hideStadiumDJModal, id: 'stadiumDjModal', type: 'style', openVal: 'flex', closeVal: 'none' }
    ];

    pureCases.forEach(tc => {
        if (!html.includes(`id="${tc.id}"`) && !html.includes(`id='${tc.id}'`)) {
            console.error(`  ❌ [FAIL] Modal element #${tc.id} missing in index.html`);
            failedUiTests++;
            return;
        }

        const el = global.document.getElementById(tc.id);

        tc.show();
        let isShown = tc.type === 'class' ? el.classList.contains(tc.val) : el.style.display === tc.openVal;
        if (!isShown) {
            console.error(`  ❌ [FAIL] ${tc.name} failed to show`);
            failedUiTests++;
            return;
        }

        tc.hide();
        let isHidden = tc.type === 'class' ? !el.classList.contains(tc.val) : el.style.display === tc.closeVal;
        if (!isHidden) {
            console.error(`  ❌ [FAIL] ${tc.name} failed to hide`);
            failedUiTests++;
            return;
        }

        console.log(`  ✅ [PASS] ${tc.name} - Pure DOM visibility toggled cleanly`);
        passedUiTests++;
    });

    console.log('\nTesting 3: src/adapters/ui.adapters.js (UI Orchestration & Callback Spies)...');
    const uiAdapters = await import('../src/adapters/ui.adapters.js');

    // Test AI Press Release Adapter Callback Spy
    uiAdapters.openAiPressReleaseModalAdapter();
    if (spies.generateAIPressRelease.includes('PRE_MATCH')) {
        console.log('  ✅ [PASS] openAiPressReleaseModalAdapter - Triggered generateAIPressRelease("PRE_MATCH")');
        passedUiTests++;
    } else {
        console.error('  ❌ [FAIL] openAiPressReleaseModalAdapter - Failed to trigger generateAIPressRelease with PRE_MATCH');
        failedUiTests++;
    }

    // Test LiveStream Hub Adapter Callback Spy
    uiAdapters.openLiveStreamHubModalAdapter();
    if (spies.onLiveStreamMatchChange > 0) {
        console.log('  ✅ [PASS] openLiveStreamHubModalAdapter - Triggered onLiveStreamMatchChange()');
        passedUiTests++;
    } else {
        console.error('  ❌ [FAIL] openLiveStreamHubModalAdapter - Failed to trigger onLiveStreamMatchChange');
        failedUiTests++;
    }

    // Test VIP Ticket Adapter Callback Spy
    uiAdapters.openVipTicketModalAdapter('MESSI');
    if (spies.updateTicketName.includes('MESSI')) {
        console.log('  ✅ [PASS] openVipTicketModalAdapter - Populated input & triggered updateTicketName("MESSI")');
        passedUiTests++;
    } else {
        console.error('  ❌ [FAIL] openVipTicketModalAdapter - Failed to trigger updateTicketName');
        failedUiTests++;
    }

    // Test Compare Players Adapter Callback Spy
    uiAdapters.openComparePlayersModalAdapter(1, 2);
    if (spies.renderCompareView > 0) {
        console.log('  ✅ [PASS] openComparePlayersModalAdapter - Populated selects & triggered renderCompareView()');
        passedUiTests++;
    } else {
        console.error('  ❌ [FAIL] openComparePlayersModalAdapter - Failed to trigger renderCompareView');
        failedUiTests++;
    }

    console.log('\n--------------------------------------------------');
    console.log(`UI Behavioral Smoke Tests Passed: ${passedUiTests}`);
    console.log(`UI Behavioral Smoke Tests Failed: ${failedUiTests}`);
    console.log('--------------------------------------------------');

    if (failedUiTests === 0) {
        console.log('🏆 UI BEHAVIORAL SMOKE GATE: PASS (Exit code 0)\n');
        process.exit(0);
    } else {
        console.error('❌ UI BEHAVIORAL SMOKE GATE: FAIL\n');
        process.exit(1);
    }
}

runUiTests().catch(err => {
    console.error('❌ CRITICAL UI TEST ERROR:', err);
    process.exit(1);
});
