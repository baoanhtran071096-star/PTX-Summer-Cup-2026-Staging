/**
 * PTX Summer Cup 2026 - Centralized Event Bootstrap Manager (Phase 2E)
 * Guarantees 100% Idempotent Event Binding (Calling initEvents multiple times is safe).
 */

import { initNavigationEvents } from './navigation.events.js';
import { initModalEvents } from './modal.events.js';

let eventsBootstrapInitialized = false;

export function initEvents() {
    if (eventsBootstrapInitialized) {
        return false; // Idempotent guard: already initialized
    }
    eventsBootstrapInitialized = true;

    // Initialize Wave 2E.1 Event Modules
    initNavigationEvents();
    initModalEvents();

    return true;
}
