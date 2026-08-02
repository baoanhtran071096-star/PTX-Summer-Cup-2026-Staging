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

async function runUiTests() {
    console.log('Testing src/ui/toast.js (showToast)...');
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

    console.log('\nTesting src/ui/modals.js (16 Modal Open/Close functions)...');
    const modalsModule = await import('../src/ui/modals.js');

    const modalCases = [
        { name: 'Login Modal', open: modalsModule.openLogin, close: modalsModule.closeLogin, id: 'loginModal', type: 'class', val: 'active' },
        { name: 'AI Growth Modal', open: modalsModule.openAiGrowthModal, close: modalsModule.closeAiGrowthModal, id: 'aiGrowthModal', type: 'style', openVal: 'flex', closeVal: 'none' },
        { name: 'VIP Ticket Modal', open: () => modalsModule.openVipTicketModal('Test Player'), close: modalsModule.closeVipTicketModal, id: 'vipTicketModal', type: 'style', openVal: 'flex', closeVal: 'none' },
        { name: 'Compare Players Modal', open: () => modalsModule.openComparePlayersModal(), close: modalsModule.closeComparePlayersModal, id: 'comparePlayersModal', type: 'style', openVal: 'flex', closeVal: 'none' },
        { name: 'Infographic Modal', open: modalsModule.openInfographicModal, close: modalsModule.closeInfographicModal, id: 'infographicModal', type: 'style', openVal: 'flex', closeVal: 'none' },
        { name: 'LiveStream Hub Modal', open: modalsModule.openLiveStreamHubModal, close: modalsModule.closeLiveStreamHubModal, id: 'liveStreamHubModal', type: 'style', openVal: 'flex', closeVal: 'none' },
        { name: 'AI Press Release Modal', open: modalsModule.openAiPressReleaseModal, close: modalsModule.closeAiPressReleaseModal, id: 'aiPressReleaseModal', type: 'style', openVal: 'flex', closeVal: 'none' },
        { name: 'Stadium DJ Modal', open: modalsModule.openStadiumDJModal, close: modalsModule.closeStadiumDJModal, id: 'stadiumDjModal', type: 'style', openVal: 'flex', closeVal: 'none' }
    ];

    modalCases.forEach(tc => {
        // Ensure static HTML contains this modal element ID
        if (!html.includes(`id="${tc.id}"`) && !html.includes(`id='${tc.id}'`)) {
            console.error(`  ❌ [FAIL] Modal element #${tc.id} missing in index.html`);
            failedUiTests++;
            return;
        }

        const el = global.document.getElementById(tc.id);

        // Test Open
        tc.open();
        let isOpen = tc.type === 'class' ? el.classList.contains(tc.val) : el.style.display === tc.openVal;
        if (!isOpen) {
            console.error(`  ❌ [FAIL] ${tc.name} failed to open (display: ${el.style.display})`);
            failedUiTests++;
            return;
        }

        // Test Close
        tc.close();
        let isClosed = tc.type === 'class' ? !el.classList.contains(tc.val) : el.style.display === tc.closeVal;
        if (!isClosed) {
            console.error(`  ❌ [FAIL] ${tc.name} failed to close (display: ${el.style.display})`);
            failedUiTests++;
            return;
        }

        console.log(`  ✅ [PASS] ${tc.name} - Open/Close state toggled successfully`);
        passedUiTests++;
    });

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
