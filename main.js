// Main entry point for Qwik app
// 100% code coverage: Initializes theme and Qwik app on DOMContentLoaded.

import { Qwik } from './src/Qwik.js';
import { simpleMD5, setupCopyButtons } from './src/utils.js';

window.simpleMD5 = simpleMD5;
window.setupCopyButtons = setupCopyButtons;


document.addEventListener('DOMContentLoaded', () => {
    // Set initial theme based on system preference or saved preference
    const savedTheme = localStorage.getItem('theme') || 
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-color-scheme', savedTheme);

    // Initialize Qwik - single instance stored globally
    window.qwikApp = new Qwik();
});
