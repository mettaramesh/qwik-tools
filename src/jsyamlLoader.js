// Qwik-tools: js-yaml loader for browser
// This file loads js-yaml from local public/js-yaml.min.js and attaches it to window.jsyaml

export function loadJsyaml(callback) {
    if (window.jsyaml) return callback && callback(window.jsyaml);
    const script = document.createElement('script');
    script.src = '/public/js-yaml.min.js';
    script.onload = () => callback && callback(window.jsyaml);
    document.head.appendChild(script);
}
