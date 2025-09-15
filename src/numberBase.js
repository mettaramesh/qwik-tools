// Number Base Converter Tool
// Exports a render function for SPA tool loader compatibility

export function render(container) {
  loadNumberBaseTool(container);
}
export const load = render;
export default render;

function loadNumberBaseTool(container) {
    container.innerHTML = `
        <div class="tool-header">
            <h2>Number Base Converter</h2>
            <p>Type in any box. The rest update instantly. Supports bases 2–36 with BigInt precision.</p>
        </div>
        <div class="tool-interface">
            <div class="tool-controls">
                <div class="group">
                    <label for="signedToggle" class="signed-label">
                        <input id="signedToggle" type="checkbox" checked class="signed-checkbox">
                        Signed
                    </label>
                </div>
                <div class="group">
                    <label for="groupSize">Grouping</label>
                    <select id="groupSize" class="base-select">
                        <option value="0">Off</option>
                        <option value="4">Every 4</option>
                        <option value="3" selected>Every 3</option>
                        <option value="8">Every 8</option>
                    </select>
                </div>
                <div class="group">
                    <label for="prefixes">Prefixes</label>
                    <select id="prefixes" class="base-select">
                        <option value="none" selected>None</option>
                        <option value="std">Standard (0b/0o/0x)</option>
                    </select>
                </div>
                <div class="group">
                    <button id="clearAll" class="btn btn--outline" title="Clear all inputs">Clear</button>
                </div>
            </div>
            <div class="io-container grid-base">
                <div>
                    <div class="row">
                        <label>Binary</label>
                        <div class="inp"><input id="bin" type="text" placeholder="e.g. 1010" autocomplete="off" spellcheck="false"></div>
                        <button class="btn btn--sm" data-copy="bin">Copy</button>
                    </div>
                    <div id="binMsg" class="hint">Digits: 0–1</div>
                </div>
                <div>
                    <div class="row">
                        <label>Octal</label>
                        <div class="inp"><input id="oct" type="text" placeholder="e.g. 12" autocomplete="off" spellcheck="false"></div>
                        <button class="btn btn--sm" data-copy="oct">Copy</button>
                    </div>
                    <div id="octMsg" class="hint">Digits: 0–7</div>
                </div>
                <div>
                    <div class="row">
                        <label>Decimal</label>
                        <div class="inp"><input id="dec" type="text" placeholder="e.g. 10" autocomplete="off" spellcheck="false"></div>
                        <button class="btn btn--sm" data-copy="dec">Copy</button>
                    </div>
                    <div id="decMsg" class="hint">Digits: 0–9</div>
                </div>
                <div>
                    <div class="row">
                        <label>Hex</label>
                        <div class="inp"><input id="hex" type="text" placeholder="e.g. a" autocomplete="off" spellcheck="false"></div>
                        <button class="btn btn--sm" data-copy="hex">Copy</button>
                    </div>
                    <div id="hexMsg" class="hint">Digits: 0–9 a–z</div>
                </div>
                <div class="number-base-fullwidth">
                    <div class="row">
                        <label>Custom</label>
                        <select id="customBase" class="base-select" title="Choose a base from 2 to 36"></select>
                        <div class="inp"><input id="custom" type="text" placeholder="Enter number in chosen base" autocomplete="off" spellcheck="false"></div>
                        <button class="btn btn--sm" data-copy="custom">Copy</button>
                    </div>
                    <div id="customMsg" class="hint">Base 2–36</div>
                </div>
            </div>
            <div class="footer">Tips: Use <code>-</code> for negatives (when Signed is on). Copy adds prefixes when enabled.</div>
        </div>
    `;
    setupNumberBaseTool();
}

// Only one export per name and one default export
// Remove duplicate export for load and default

// Update: Use absolute paths for script loading in cronParser.js
// If you have a similar dynamic loader in other tools, update those as well.
// Example for cronParser.js:
// await loadScript('/src/lib/cron-js-parser.min.js');
// await loadScript('/src/lib/cronstrue.min.js');
// Make sure the files exist at src/lib/ in your project root.
