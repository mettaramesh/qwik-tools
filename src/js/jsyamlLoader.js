// Qwik-tools: js-yaml loader for browser
// This file loads js-yaml from local js-yaml.min.js and attaches it to window.jsyaml

export function loadJsyaml(callback) {
    if (window.jsyaml) return callback && callback(window.jsyaml);
    const script = document.createElement('script');
    script.src = '/js-yaml.min.js';
    script.onload = () => callback && callback(window.jsyaml);
    script.onerror = () => {
        console.error('Failed to load js-yaml.min.js');
        callback && callback(null);
    };
    document.head.appendChild(script);
}
