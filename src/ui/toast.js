/**
 * Pure UI Toast Notification Manager for PTX Summer Cup 2026.
 * Manages toast element creation, animation classes, and auto-dismissal.
 */

/**
 * Ensures toast container element exists in DOM.
 * 
 * @returns {HTMLElement} Toast container DOM element
 */
export function getToastContainer() {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        document.body.appendChild(container);
    }
    return container;
}

/**
 * Displays a UI toast notification message.
 * Preserves 100% legacy HTML structure and timing.
 * 
 * @param {string} message Toast message content
 * @param {string} type Notification type ('info', 'success', 'warning', 'error')
 */
export function showToast(message, type = 'info') {
    const container = getToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast-item ${type}`;

    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };

    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || 'ℹ️'}</span>
        <span>${message}</span>
        <button class="toast-close" onclick="if(this.parentElement.remove)this.parentElement.remove();else if(this.parentElement.parentNode)this.parentElement.parentNode.removeChild(this.parentElement);">✕</button>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.4s ease forwards';
        setTimeout(() => {
            if (toast.remove) {
                toast.remove();
            } else if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 500);
    }, 4000);
}
