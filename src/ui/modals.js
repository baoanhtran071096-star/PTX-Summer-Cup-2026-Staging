// ============================================================
// STACK-AWARE MODAL MANAGER & ACCESSIBILITY (PRODUCT-001)
// ============================================================
const modalStack = [];
let isKeyboardListenerBound = false;

function getFocusableElements(container) {
    if (!container || typeof container.querySelectorAll !== 'function') return [];
    const selectors = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    try {
        const elements = Array.from(container.querySelectorAll(selectors));
        return elements.filter(el => el && typeof el.focus === 'function');
    } catch (e) {
        return [];
    }
}

function focusModalOrFirstChild(modalElement) {
    if (!modalElement) return;
    const focusables = getFocusableElements(modalElement);
    if (focusables.length > 0) {
        try { focusables[0].focus(); } catch (e) {}
    } else {
        // Zero-focusable fallback: focus modal container safely
        const hasTabindex = typeof modalElement.hasAttribute === 'function' ? modalElement.hasAttribute('tabindex') : (modalElement.getAttribute && modalElement.getAttribute('tabindex') !== null);
        if (!hasTabindex && typeof modalElement.setAttribute === 'function') {
            modalElement.setAttribute('tabindex', '-1');
        }
        if (typeof modalElement.focus === 'function') {
            try { modalElement.focus(); } catch (e) {}
        }
    }
}

function initSingleKeyboardOwner() {
    if (isKeyboardListenerBound || typeof window === 'undefined') return;
    isKeyboardListenerBound = true;

    window.addEventListener('keydown', (e) => {
        if (modalStack.length === 0) return;

        const topmost = modalStack[modalStack.length - 1];
        if (!topmost || !topmost.modal) return;

        // 1. ESC Key: Close Topmost Dismissible Modal
        if (e.key === 'Escape' || e.code === 'Escape' || e.keyCode === 27) {
            e.preventDefault();
            closeTopmostModal();
            return;
        }

        // 2. TAB / Shift+TAB Focus Trapping
        if (e.key === 'Tab' || e.code === 'Tab' || e.keyCode === 9) {
            const focusables = getFocusableElements(topmost.modal);
            if (focusables.length === 0) {
                e.preventDefault();
                focusModalOrFirstChild(topmost.modal);
                return;
            }

            const firstEl = focusables[0];
            const lastEl = focusables[focusables.length - 1];
            const activeEl = typeof document !== 'undefined' ? document.activeElement : null;

            if (e.shiftKey) { // Shift + Tab (backward)
                if (activeEl === firstEl || !topmost.modal.contains(activeEl)) {
                    e.preventDefault();
                    try { lastEl.focus(); } catch (err) {}
                }
            } else { // Tab (forward)
                if (activeEl === lastEl || !topmost.modal.contains(activeEl)) {
                    e.preventDefault();
                    try { firstEl.focus(); } catch (err) {}
                }
            }
        }
    });
}

export function registerOpenedModal(modalElement, hideFn = null, triggerElement = null) {
    if (!modalElement) return;
    const trigger = triggerElement || (typeof document !== 'undefined' ? document.activeElement : null);

    // Remove if already present to avoid duplicate stack entries
    const existingIdx = modalStack.findIndex(entry => entry.modal === modalElement);
    if (existingIdx !== -1) {
        modalStack.splice(existingIdx, 1);
    }

    modalStack.push({
        modal: modalElement,
        triggerElement: trigger,
        hideFn: hideFn || (() => {
            modalElement.style.display = 'none';
            modalElement.classList.remove('active');
        })
    });

    focusModalOrFirstChild(modalElement);
    initSingleKeyboardOwner();
}

export function unregisterClosedModal(modalElement) {
    if (!modalElement) return;
    const idx = modalStack.findIndex(entry => entry.modal === modalElement);
    if (idx !== -1) {
        const entry = modalStack.splice(idx, 1)[0];
        if (entry.triggerElement && typeof entry.triggerElement.focus === 'function') {
            try { entry.triggerElement.focus(); } catch (e) {}
        }
    }
}

export function closeTopmostModal() {
    if (modalStack.length === 0) return false;

    const topmost = modalStack[modalStack.length - 1];
    if (topmost && topmost.modal) {
        // Non-dismissible modal check
        const isNonDismissible = topmost.modal.getAttribute('data-no-esc') === 'true' ||
                                 topmost.modal.getAttribute('data-dismissible') === 'false';
        if (isNonDismissible) return false;
    }

    const entry = modalStack.pop();
    if (entry) {
        if (typeof entry.hideFn === 'function') {
            entry.hideFn();
        } else if (entry.modal) {
            entry.modal.style.display = 'none';
            entry.modal.classList.remove('active');
        }

        if (entry.triggerElement && typeof entry.triggerElement.focus === 'function') {
            try { entry.triggerElement.focus(); } catch (e) {}
        }
        return true;
    }
    return false;
}

export function getModalStackDepth() {
    return modalStack.length;
}

export function getKeyboardOwnerCount() {
    return isKeyboardListenerBound ? 1 : 0;
}

// 1. Login Modal Primitives
export function showLoginModal(trigger = null) {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.add('active');
        registerOpenedModal(modal, hideLoginModal, trigger);
    }
}

export function hideLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.remove('active');
        unregisterClosedModal(modal);
    }
}

// 2. AI Growth Modal Primitives
export function showAiGrowthModal(trigger = null) {
    const modal = document.getElementById('aiGrowthModal');
    if (modal) {
        modal.style.display = 'flex';
        registerOpenedModal(modal, hideAiGrowthModal, trigger);
    }
}

export function hideAiGrowthModal() {
    const modal = document.getElementById('aiGrowthModal');
    if (modal) {
        modal.style.display = 'none';
        unregisterClosedModal(modal);
    }
}

// 3. VIP Ticket Modal Primitives
export function showVipTicketModal(trigger = null) {
    const modal = document.getElementById('vipTicketModal');
    if (modal) {
        modal.style.display = 'flex';
        registerOpenedModal(modal, hideVipTicketModal, trigger);
    }
}

export function hideVipTicketModal() {
    const modal = document.getElementById('vipTicketModal');
    if (modal) {
        modal.style.display = 'none';
        unregisterClosedModal(modal);
    }
}

// 4. Compare Players Modal Primitives
export function showComparePlayersModal(trigger = null) {
    const modal = document.getElementById('comparePlayersModal');
    if (modal) {
        modal.style.display = 'flex';
        registerOpenedModal(modal, hideComparePlayersModal, trigger);
    }
}

export function hideComparePlayersModal() {
    const modal = document.getElementById('comparePlayersModal');
    if (modal) {
        modal.style.display = 'none';
        unregisterClosedModal(modal);
    }
}

// 5. Infographic Modal Primitives
export function showInfographicModal(trigger = null) {
    const modal = document.getElementById('infographicModal');
    if (modal) {
        modal.style.display = 'flex';
        registerOpenedModal(modal, hideInfographicModal, trigger);
    }
}

export function hideInfographicModal() {
    const modal = document.getElementById('infographicModal');
    if (modal) {
        modal.style.display = 'none';
        unregisterClosedModal(modal);
    }
}

// 6. LiveStream Hub Modal Primitives
export function showLiveStreamHubModal(trigger = null) {
    const modal = document.getElementById('liveStreamHubModal');
    if (modal) {
        modal.style.display = 'flex';
        registerOpenedModal(modal, hideLiveStreamHubModal, trigger);
    }
}

export function hideLiveStreamHubModal() {
    const modal = document.getElementById('liveStreamHubModal');
    if (modal) {
        modal.style.display = 'none';
        unregisterClosedModal(modal);
    }
}

// 7. AI Press Release Modal Primitives
export function showAiPressReleaseModal(trigger = null) {
    const modal = document.getElementById('aiPressReleaseModal');
    if (modal) {
        modal.style.display = 'flex';
        registerOpenedModal(modal, hideAiPressReleaseModal, trigger);
    }
}

export function hideAiPressReleaseModal() {
    const modal = document.getElementById('aiPressReleaseModal');
    if (modal) {
        modal.style.display = 'none';
        unregisterClosedModal(modal);
    }
}

// 8. Stadium DJ Modal Primitives
export function showStadiumDJModal(trigger = null) {
    const modal = document.getElementById('stadiumDjModal');
    if (modal) {
        modal.style.display = 'flex';
        registerOpenedModal(modal, hideStadiumDJModal, trigger);
    }
}

export function hideStadiumDJModal() {
    const modal = document.getElementById('stadiumDjModal');
    if (modal) {
        modal.style.display = 'none';
        unregisterClosedModal(modal);
    }
}

// 9. Tactical Visualizer Modal Primitives
export function showTacticalVisualizerModal(trigger = null) {
    const modal = document.getElementById('tacticalVisualizerModal');
    if (modal) {
        modal.style.display = 'flex';
        registerOpenedModal(modal, hideTacticalVisualizerModal, trigger);
    }
}

export function hideTacticalVisualizerModal() {
    const modal = document.getElementById('tacticalVisualizerModal');
    if (modal) {
        modal.style.display = 'none';
        unregisterClosedModal(modal);
    }
}

