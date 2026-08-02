/**
 * FIFA Card 3D Hologram Tilt Effect Module for PTX Summer Cup 2026.
 * Attaches mouse interactive 3D perspective tilt & specular hologram sheen.
 */

export function initFifa3DTilt() {
    if (typeof document === 'undefined') return;
    document.querySelectorAll('.player-card-fifa').forEach(card => {
        if (!card || !card.dataset || card.dataset.tiltInitialized) return;
        card.dataset.tiltInitialized = 'true';
        let hologram = card.querySelector('.fifa-hologram');
        if (!hologram) {
            hologram = document.createElement('div');
            hologram.className = 'fifa-hologram';
            card.appendChild(hologram);
        }
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -12;
            const rotateY = ((x - centerX) / centerX) * 12;
            const sheenX = Math.round((x / rect.width) * 100);
            const sheenY = Math.round((y / rect.height) * 100);
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04, 1.04, 1.04)`;
            hologram.style.background = `radial-gradient(circle at ${sheenX}% ${sheenY}%, rgba(255,255,255,0.45) 0%, rgba(251,191,36,0.25) 35%, transparent 70%)`;
            hologram.style.opacity = '1';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            hologram.style.opacity = '0';
        });
    });
}
