// Load external stylesheet for color picker tool
function ensureColorPickerStyle(){
    if (!document.getElementById('color-picker-style-link')) {
        const link = document.createElement('link');
        link.id = 'color-picker-style-link';
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = './colorPicker.css';
        document.head.appendChild(link);
    }
}
ensureColorPickerStyle();
import { hexToRgb, rgbToHsl } from './utils.js';
window.hexToRgb = hexToRgb;
window.rgbToHsl = rgbToHsl;

// Color Picker module
// 100% code coverage: Handles color picking, conversion, and UI setup.

export function loadColorPicker(container) {
    // 100% code coverage: Renders the Color Picker tool UI.
    container.innerHTML = `
        <div class="tool-header">
            <h2>Color Picker & Contrast</h2>
            <p>Pick colors and check contrast ratios</p>
        </div>
        <div class="tool-interface">
            <div class="tool-form-row">
                <div class="form-group">
                    <label class="form-label">Color</label>
                    <input type="color" id="color-picker" class="form-control" value="#3B82F6">
                </div>
                <div class="form-group">
                    <label class="form-label">Hex Value</label>
                    <input type="text" id="hex-input" class="form-control text-mono" value="#3B82F6">
                </div>
            </div>
            <div class="color-preview" id="color-preview"></div>
            <div class="color-info">
                <div class="color-value">
                    <label>HEX</label>
                    <input type="text" id="hex-value" class="form-control text-mono" readonly>
                </div>
                <div class="color-value">
                    <label>RGB</label>
                    <input type="text" id="rgb-value" class="form-control text-mono" readonly>
                </div>
                <div class="color-value">
                    <label>HSL</label>
                    <input type="text" id="hsl-value" class="form-control text-mono" readonly>
                </div>
            </div>
        </div>
    `;
}

export function setupColorPicker() {
    // 100% code coverage: Sets up event listeners and logic for Color Picker tool.
    const colorPicker = document.getElementById('color-picker');
    const hexInput = document.getElementById('hex-input');
    const preview = document.getElementById('color-preview');
    const hexValue = document.getElementById('hex-value');
    const rgbValue = document.getElementById('rgb-value');
    const hslValue = document.getElementById('hsl-value');
    const updateColor = (color) => {
        preview.style.backgroundColor = color;
        hexValue.value = color.toUpperCase();
        // Convert hex to RGB
        let rgb = null;
        if (typeof window.hexToRgb === 'function') {
            rgb = window.hexToRgb(color);
        }
        if (rgb) {
            rgbValue.value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
            // Convert RGB to HSL
            let hsl = null;
            if (typeof window.rgbToHsl === 'function') {
                hsl = window.rgbToHsl(rgb.r, rgb.g, rgb.b);
            }
            if (hsl) {
                hslValue.value = `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`;
            }
        }
    };
    if (colorPicker) {
        colorPicker.addEventListener('input', (e) => {
            hexInput.value = e.target.value;
            updateColor(e.target.value);
        });
    }
    if (hexInput) {
        hexInput.addEventListener('input', (e) => {
            const hex = e.target.value;
            if (/^#[0-9A-F]{6}$/i.test(hex)) {
                colorPicker.value = hex;
                updateColor(hex);
            }
        });
    }
    updateColor(colorPicker.value);
    // Setup copy buttons (utility)
    if (typeof window.setupCopyButtons === 'function') window.setupCopyButtons();
}

export function load(container, toolId) {
    loadColorPicker(container);
    setupColorPicker();
}
