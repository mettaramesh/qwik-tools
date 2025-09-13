// JSON ↔ XML Converter Tool
// UI and error styling matches other tools. Validation before transform.

import { showStatus, setupCopyButtons } from './utils.js';

function parseJSONSafe(str) {
    try {
        return [JSON.parse(str), null];
    } catch (e) {
        return [null, e.message];
    }
}

function parseXMLSafe(str) {
    try {
        const parser = new DOMParser();
        const xml = parser.parseFromString(str, 'application/xml');
        if (xml.getElementsByTagName('parsererror').length) {
            return [null, xml.getElementsByTagName('parsererror')[0].textContent];
        }
        return [xml, null];
    } catch (e) {
        return [null, e.message];
    }
}

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function jsonToXml(obj, nodeName) {
  if (obj === null || obj === undefined) return `<${nodeName}/>`;
  if (typeof obj !== 'object') return `<${nodeName}>${escapeXml(obj)}</${nodeName}>`;

  let attrs = '';
  let children = '';
  let hasChildElements = false;

  for (const key in obj) {
    if (key.startsWith('@')) {
      attrs += ` ${key.substring(1)}="${escapeXml(obj[key])}"`;
    } else if (key === '#text') {
      children += escapeXml(obj[key]);
    } else if (key === '#mixed') {
      obj[key].forEach(part => {
        if (typeof part === 'string') {
          children += escapeXml(part);
        } else {
          const childName = Object.keys(part)[0];
          children += jsonToXml(part[childName], childName);
        }
      });
      hasChildElements = true;
    } else if (Array.isArray(obj[key])) {
      obj[key].forEach(item => {
        // Preserve empty objects as self-closing tags
        if (typeof item === 'object' && item !== null && Object.keys(item).length === 0) {
          children += `<${key}/>`;
        } else {
          children += jsonToXml(item, key);
        }
      });
      hasChildElements = true;
    } else if (typeof obj[key] === 'object') {
      children += jsonToXml(obj[key], key);
      hasChildElements = true;
    } else {
      children += `<${key}>${escapeXml(obj[key])}</${key}>`;
      hasChildElements = true;
    }
  }

  if (!hasChildElements && !children) {
    return `<${nodeName}${attrs}/>`;
  }
  return `<${nodeName}${attrs}>${children}</${nodeName}>`;
}

function convertJsonToXml(json) {
  const keys = Object.keys(json);
  if (keys.length !== 1) throw new Error('JSON must have a single root element');
  const rootName = keys[0];
  return jsonToXml(json[rootName], rootName);
}

function unescapeXml(str) {
  return String(str)
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&');
}

function xmlToJson(xmlNode) {
  const obj = {};

  // Attributes
  if (xmlNode.attributes && xmlNode.attributes.length > 0) {
    for (let attr of xmlNode.attributes) {
      obj[`@${attr.name}`] = unescapeXml(attr.value);
    }
  }

  const elementChildren = [];
  let textContent = '';

  for (let node of xmlNode.childNodes) {
    if (node.nodeType === 3) { // Text node
      const text = node.nodeValue.trim();
      if (text) textContent += (textContent ? ' ' : '') + unescapeXml(text);
    } else if (node.nodeType === 1) { // Element node
      const childObj = xmlToJson(node);
      const childName = Object.keys(childObj)[0];
      const childValue = childObj[childName];

      if (obj[childName]) {
        if (!Array.isArray(obj[childName])) {
          obj[childName] = [obj[childName]];
        }
        obj[childName].push(childValue);
      } else {
        obj[childName] = childValue;
      }
      elementChildren.push({ [childName]: childValue });
    }
  }

  // Decide between #text and #mixed
  if (textContent && elementChildren.length > 0) {
    obj['#mixed'] = [];
    if (textContent) obj['#mixed'].push(textContent);
    obj['#mixed'].push(...elementChildren);
  } else if (textContent && elementChildren.length === 0) {
    // If there are no attributes, return plain text instead of {"#text": "..."} 
    if (Object.keys(obj).length === 0) {
      return { [xmlNode.nodeName]: textContent };
    } else {
      obj['#text'] = textContent;
    }
  }

  return { [xmlNode.nodeName]: obj };
}

function convertXmlToJson(xmlStr) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlStr, 'application/xml');
  if (xmlDoc.getElementsByTagName('parsererror').length) {
    throw new Error('Invalid XML');
  }
  return xmlToJson(xmlDoc.documentElement);
}

// Strict XML↔JSON round-trip converter per user rules and examples
function xmlToJsonOld(xml, arrayFields = [], flattenText = true, isRoot = true) {
    // 1. Root element: preserve name and namespaces
    if (isRoot && xml.nodeType === 1) {
        const obj = {};
        obj[xml.nodeName] = xmlToJson(xml, arrayFields, flattenText, false);
        return obj;
    }
    if (xml.nodeType === 3) return xml.nodeValue; // preserve whitespace for mixed content
    if (xml.nodeType !== 1) return null;
    const obj = {};
    // 2. Attributes (including namespaces)
    if (xml.attributes && xml.attributes.length > 0) {
        for (let attr of xml.attributes) {
            obj[`@${attr.name}`] = attr.value;
        }
    }
    // 3. Mixed content: preserve order using #mixed
    let hasElementChild = false;
    let mixed = [];
    for (let child of xml.childNodes) {
        if (child.nodeType === 1) {
            hasElementChild = true;
            mixed.push({ [child.nodeName]: xmlToJson(child, arrayFields, flattenText, false) });
        } else if (child.nodeType === 3 && child.nodeValue) {
            mixed.push(child.nodeValue);
        }
    }
    if (hasElementChild && mixed.length > 0) {
        obj['#mixed'] = mixed.filter(x => (typeof x === 'string' ? x.length > 0 : true));
        return obj;
    }
    // 4. Only text node(s)
    if (!hasElementChild && mixed.length > 0) {
        const text = mixed.join('');
        if (!text.trim()) return {};
        if (Object.keys(obj).length === 0 && flattenText) return text;
        obj['#text'] = text;
        return obj;
    }
    // 5. Group repeated children under their parent as arrays
    const childMap = {};
    for (let child of xml.childNodes) {
        if (child.nodeType !== 1) continue;
        const key = child.nodeName;
        const value = xmlToJson(child, arrayFields, flattenText, false);
        if (!childMap[key]) childMap[key] = [];
        childMap[key].push(value);
    }
    for (const [key, arr] of Object.entries(childMap)) {
        if (arr.length > 1) {
            // Group as array under parent
            obj[key] = arr;
        } else if (arr.length === 1) {
            obj[key] = arr[0];
        }
    }
    // 6. Empty element: {} for singletons, [] for true empty lists
    if (Object.keys(obj).length === 0) return {};
    return obj;
}

// Post-process JSON to rename _text to a more human-friendly field for specific tags
function renameTextFields(obj, parentKey = '') {
    if (Array.isArray(obj)) {
        return obj.map(item => renameTextFields(item, parentKey));
    } else if (typeof obj === 'object' && obj !== null) {
        const newObj = {};
        for (const [key, value] of Object.entries(obj)) {
            if (key === '_text') {
                // Customize renaming for specific parent tags
                if (parentKey === 'own:Owner') {
                    newObj['notes'] = value;
                } else {
                    newObj['description'] = value;
                }
            } else {
                newObj[key] = renameTextFields(value, key);
            }
        }
        return newObj;
    }
    return obj;
}

// Post-process JSON to replace empty strings in arrays for known array fields with {}
function fixEmptyArrayObjects(obj, arrayFields = []) {
    if (Array.isArray(obj)) {
        return obj.map(item => {
            if (item === '') return {}; // Replace empty string with empty object
            return fixEmptyArrayObjects(item, arrayFields);
        });
    } else if (typeof obj === 'object' && obj !== null) {
        const newObj = {};
        for (const [key, value] of Object.entries(obj)) {
            if (Array.isArray(value) && arrayFields.includes(key)) {
                newObj[key] = value.map(item => {
                    if (item === '') return {};
                    return fixEmptyArrayObjects(item, arrayFields);
                });
            } else {
                newObj[key] = fixEmptyArrayObjects(value, arrayFields);
            }
        }
        return newObj;
    }
    return obj;
}

// Post-process JSON to normalize empty arrays and nested empty arrays to empty objects
function normalizeEmptyArrays(obj, arrayFields = []) {
    if (Array.isArray(obj)) {
        // Replace [] or [[]] with {}
        if (obj.length === 0) return obj; // true empty list
        return obj.map(item => {
            if (Array.isArray(item) && item.length === 0) return {}; // [] → {}
            if (Array.isArray(item) && item.length === 1 && Array.isArray(item[0]) && item[0].length === 0) return {}; // [[]] → {}
            return normalizeEmptyArrays(item, arrayFields);
        });
    } else if (typeof obj === 'object' && obj !== null) {
        // If this is an empty array field, convert to {}
        for (const key of Object.keys(obj)) {
            if (Array.isArray(obj[key]) && obj[key].length === 0 && arrayFields.includes(key)) {
                obj[key] = [];
            } else {
                obj[key] = normalizeEmptyArrays(obj[key], arrayFields);
            }
        }
        return obj;
    }
    return obj;
}

// Normalize empty containers: always use {} for empty objects, [{}] for empty array items, never [] for empty containers
function normalizeEmptyContainers(obj, arrayFields = []) {
    if (Array.isArray(obj)) {
        if (obj.length === 0) return [{}]; // true empty list becomes [{}] for type stability
        return obj.map(item => {
            if (Array.isArray(item) && item.length === 0) return {}; // [] → {}
            if (Array.isArray(item) && item.length === 1 && Array.isArray(item[0]) && item[0].length === 0) return {}; // [[]] → {}
            if (item === undefined || item === null) return {};
            return normalizeEmptyContainers(item, arrayFields);
        });
    } else if (typeof obj === 'object' && obj !== null) {
        const newObj = {};
        for (const [key, value] of Object.entries(obj)) {
            if (Array.isArray(value) && arrayFields.includes(key)) {
                // If array is empty, always use [{}] for type stability
                if (value.length === 0) {
                    newObj[key] = [{}];
                } else {
                    // If any item is empty, ensure it's [{}]
                    newObj[key] = value.map(item => {
                        if (item === undefined || item === null || (typeof item === 'object' && Object.keys(item).length === 0)) return {};
                        return normalizeEmptyContainers(item, arrayFields);
                    });
                }
            } else if (typeof value === 'object' && value !== null && Object.keys(value).length === 0) {
                newObj[key] = {};
            } else {
                newObj[key] = normalizeEmptyContainers(value, arrayFields);
            }
        }
        return newObj;
    }
    return obj;
}

// Preprocess JSON for library/book edge cases before XML conversion
function preprocessLibraryJson(obj) {
    if (Array.isArray(obj)) {
        // Recursively process array items, filter out empty objects
        return obj
            .map(preprocessLibraryJson)
            .filter(item => !(typeof item === 'object' && item !== null && Object.keys(item).length === 0));
    } else if (typeof obj === 'object' && obj !== null) {
        const newObj = {};
        for (const [key, value] of Object.entries(obj)) {
            // Remove empty <lib:Note/>
            if (key === 'lib:Note' && (value === '' || (typeof value === 'object' && Object.keys(value).length === 0))) {
                continue;
            }
            // Handle <bk:Author> missing <bk:Name>
            if (key === 'bk:Author') {
                let author = preprocessLibraryJson(value);
                if (typeof author === 'object' && author !== null && !('bk:Name' in author)) {
                    author['bk:Name'] = 'Unknown Author';
                }
                newObj[key] = author;
                continue;
            }
            // Handle <bk:Tags>
            if (key === 'bk:Tags') {
                let tags = preprocessLibraryJson(value);
                if (Array.isArray(tags) && tags.length === 0) {
                    // Add <bk:Tag>Uncategorized</bk:Tag>
                    tags = [{ 'bk:Tag': 'Uncategorized' }];
                }
                newObj[key] = tags;
                continue;
            }
            // Recursively process children
            const processed = preprocessLibraryJson(value);
            // Remove empty elements (no attributes, no text, no children)
            if (
                (processed === '' || (typeof processed === 'object' && processed !== null && Object.keys(processed).length === 0)) &&
                !key.startsWith('@')
            ) {
                continue;
            }
            newObj[key] = processed;
        }
        return newObj;
    }
    // For required elements with no value, insert placeholder
    if (obj === '' || obj === null || obj === undefined) {
        return 'Unknown';
    }
    return obj;
}

// Enhanced preprocess for XML→JSON: preserve order, #mixed, and only add placeholders if missing entirely
function preprocessLibraryJsonForXmlToJson(obj, parentKey = '') {
    if (Array.isArray(obj)) {
        // Recursively process array items, filter out empty objects (unless required placeholder)
        return obj
            .map(item => preprocessLibraryJsonForXmlToJson(item, parentKey))
            .filter(item => {
                if (typeof item === 'object' && item !== null && Object.keys(item).length === 0) return false;
                if (typeof item === 'string' && item.trim() === '') return false; // Optionally strip pure whitespace
                return true;
            });
    } else if (typeof obj === 'object' && obj !== null) {
        // If #mixed, process its array and check for missing required fields
        if (Array.isArray(obj['#mixed'])) {
            obj['#mixed'] = obj['#mixed']
                .map(item => preprocessLibraryJsonForXmlToJson(item, parentKey))
                .filter(item => {
                    if (typeof item === 'object' && item !== null && Object.keys(item).length === 0) return false;
                    if (typeof item === 'string' && item.trim() === '') return false;
                    return true;
                });
            // Only add placeholder if required field is missing entirely from #mixed
            if (parentKey === 'bk:Author' && !obj['#mixed'].some(e => typeof e === 'object' && e['bk:Name'])) {
                obj['#mixed'].push({ 'bk:Name': 'Unknown Author' });
            }
            return obj;
        }
        const newObj = {};
        for (const [key, value] of Object.entries(obj)) {
            // Remove empty <lib:Note/>
            if (key === 'lib:Note' && (value === '' || (typeof value === 'object' && Object.keys(value).length === 0))) {
                continue;
            }
            // Handle <bk:Author> missing <bk:Name> (not present at all)
            if (key === 'bk:Author') {
                let author = preprocessLibraryJsonForXmlToJson(value, key);
                // If #mixed, check inside it
                if (typeof author === 'object' && author !== null && Array.isArray(author['#mixed'])) {
                    if (!author['#mixed'].some(e => typeof e === 'object' && e['bk:Name'])) {
                        author['#mixed'].push({ 'bk:Name': 'Unknown Author' });
                    }
                } else if (typeof author === 'object' && author !== null && !('bk:Name' in author)) {
                    author['bk:Name'] = 'Unknown Author';
                }
                newObj[key] = author;
                continue;
            }
            // Handle <bk:Tags>
            if (key === 'bk:Tags') {
                let tags = preprocessLibraryJsonForXmlToJson(value, key);
                if (Array.isArray(tags) && tags.length === 0) {
                    tags = [{ 'bk:Tag': 'Uncategorized' }];
                }
                newObj[key] = tags;
                continue;
            }
            // Recursively process children
            const processed = preprocessLibraryJsonForXmlToJson(value, key);
            // Remove empty objects unless required placeholder
            if (
                (processed === '' || (typeof processed === 'object' && processed !== null && Object.keys(processed).length === 0)) &&
                !key.startsWith('@')
            ) {
                continue;
            }
            newObj[key] = processed;
        }
        return newObj;
    }
    // For required elements with no value, insert placeholder
    if (obj === '' || obj === null || obj === undefined) {
        if (parentKey === 'bk:Name') return 'Unknown Author';
        if (parentKey === 'bk:Tag') return 'Uncategorized';
        return 'Unknown';
    }
    return obj;
}

// Utility: Remove <root> wrapper if not part of schema (XML → JSON)
function unwrapRootIfNeeded(json) {
  if (
    json &&
    typeof json === 'object' &&
    Object.keys(json).length === 1 &&
    Object.keys(json)[0] === 'root'
  ) {
    const rootVal = json['root'];
    // Only unwrap if <root> has a single child element (not attributes/text)
    if (
      rootVal &&
      typeof rootVal === 'object' &&
      Object.keys(rootVal).length === 1 &&
      !Object.keys(rootVal)[0].startsWith('@')
    ) {
      return { [Object.keys(rootVal)[0]]: rootVal[Object.keys(rootVal)[0]] };
    }
  }
  return json;
}

// Utility: Remove <root> wrapper from XML string if present and not part of schema
function stripRootElement(xmlStr) {
  // Only strip if <root> is the outermost element
  return xmlStr.replace(/^\s*<root>([\s\S]*)<\/root>\s*$/i, '$1').trim();
}

// Utility: Recursively clean JSON for XML output (JSON → XML)
function cleanJsonForXml(obj) {
  if (Array.isArray(obj)) {
    return obj
      .map(cleanJsonForXml)
      .filter(item => item !== undefined);
  } else if (typeof obj === 'object' && obj !== null) {
    const newObj = {};
    for (const [key, value] of Object.entries(obj)) {
      // Always preserve required empty elements
      if ((key === 'ns1:EmptyNode' || key === 'ns2:Note')) {
        newObj[key] = (value && typeof value === 'object' && Object.keys(value).length === 0) ? {} : cleanJsonForXml(value);
        continue;
      }
      // Remove other empty elements (no attributes, no text, no children)
      if (
        value === '' ||
        value === null ||
        (typeof value === 'object' && value !== null && Object.keys(value).length === 0)
      ) {
        continue;
      }
      newObj[key] = cleanJsonForXml(value);
    }
    return Object.keys(newObj).length === 0 ? undefined : newObj;
  }
  return obj;
}

// Utility: Recursively clean JSON for JSON output (XML → JSON)
function cleanJsonFromXml(obj) {
  if (Array.isArray(obj)) {
    return obj
      .map(cleanJsonFromXml)
      .filter(item => item !== undefined);
  } else if (typeof obj === 'object' && obj !== null) {
    const newObj = {};
    for (const [key, value] of Object.entries(obj)) {
      // Always preserve required empty elements
      if ((key === 'ns1:EmptyNode' || key === 'ns2:Note')) {
        newObj[key] = (value && typeof value === 'object' && Object.keys(value).length === 0) ? {} : cleanJsonFromXml(value);
        continue;
      }
      // Remove other empty elements (no attributes, no text, no children)
      if (
        value === '' ||
        value === null ||
        (typeof value === 'object' && value !== null && Object.keys(value).length === 0)
      ) {
        continue;
      }
      newObj[key] = cleanJsonFromXml(value);
    }
    return Object.keys(newObj).length === 0 ? undefined : newObj;
  }
  return obj;
}

export function load(toolContent) {
    toolContent.innerHTML = `
        <div class="tool-header">
            <h2>JSON ↔ XML Converter</h2>
            <p>Convert between JSON and XML formats. Input must be valid and well-formed.</p>
        </div>
        <div class="tool-interface">
            <div class="tool-controls">
                <button class="btn btn--secondary" id="to-xml">JSON → XML</button>
                <button class="btn btn--outline" id="to-json">XML → JSON</button>
                <button class="btn btn--outline" id="json-xml-clear-btn">Clear</button>
            </div>
            <div class="io-container">
                <div class="input-section">
                    <div class="section-header">
                        <label class="form-label">Input JSON or XML</label>
                        <button class="btn btn--sm copy-btn" data-target="json-xml-input">Copy</button>
                    </div>
                    <textarea id="json-xml-input" class="form-control code-input" placeholder="Paste or type JSON or XML here..." rows="12"></textarea>
                </div>
                <div class="output-section">
                    <div class="section-header">
                        <label class="form-label">Output</label>
                        <button class="btn btn--sm copy-btn" data-target="json-xml-output">Copy</button>
                    </div>
                    <textarea id="json-xml-output" class="form-control code-input" readonly rows="12"></textarea>
                </div>
            </div>
            <div id="json-xml-status" class="hidden"></div>
        </div>
        <style>
        .tool-header { margin-bottom: 12px; }
        .tool-interface { background: var(--color-bg-card,#fff); border-radius: 14px; box-shadow: 0 2px 12px #0001; padding: 18px 18px 24px 18px; }
        .tool-controls { display: flex; gap: 12px; margin-bottom: 18px; }
        .io-container { display: flex; gap: 24px; flex-wrap: wrap; }
        .input-section, .output-section { flex: 1 1 320px; min-width: 0; display: flex; flex-direction: column; }
        .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
        .form-label { font-weight: 600; font-size: 1.08em; }
        .code-input { font-family: var(--font-mono,monospace); font-size: 1.08em; border-radius: 8px; border: 1px solid var(--color-border,#d0d7de); background: var(--color-bg-muted,#f7f9fa); padding: 10px 12px; }
        @media (max-width: 900px) { .io-container { flex-direction: column; gap: 0; } .input-section, .output-section { margin-bottom: 18px; } }
        </style>
    `;
    setupCopyButtons();
    setupJSONXmlTool();
}

export function setupJSONXmlTool() {
    const input = document.getElementById('json-xml-input');
    const output = document.getElementById('json-xml-output');
    const status = document.getElementById('json-xml-status');
    const toXmlBtn = document.getElementById('to-xml');
    const toJsonBtn = document.getElementById('to-json');
    const clearBtn = document.getElementById('json-xml-clear-btn');
    if (!input || !output || !status) return;
    toXmlBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const [json, err] = parseJSONSafe(input.value);
        if (err) {
            status.className = 'error-message';
            status.textContent = 'Error: Invalid JSON - ' + err;
            status.classList.remove('hidden');
            output.value = '';
            if (window.showStatus) window.showStatus(status.textContent, 'error');
            return;
        }
        try {
            // Remove <root> wrapper if present and not part of schema
            let cleanedJson = json;
            // Unwrap root if it only contains a single child element (recursively)
            while (
              cleanedJson &&
              typeof cleanedJson === 'object' &&
              Object.keys(cleanedJson).length === 1 &&
              Object.keys(cleanedJson)[0] === 'root' &&
              typeof cleanedJson.root === 'object' &&
              Object.keys(cleanedJson.root).length === 1 &&
              !Object.keys(cleanedJson.root)[0].startsWith('@')
            ) {
              cleanedJson = { [Object.keys(cleanedJson.root)[0]]: cleanedJson.root[Object.keys(cleanedJson.root)[0]] };
            }
            cleanedJson = cleanJsonForXml(cleanedJson);
            const xml = formatXml(convertJsonToXml(cleanedJson));
            output.value = xml;
            status.className = 'success-message';
            status.textContent = 'Converted JSON to XML.';
            status.classList.remove('hidden');
        } catch (e) {
            status.className = 'error-message';
            status.textContent = 'Error: ' + e.message;
            status.classList.remove('hidden');
            output.value = '';
            if (window.showStatus) window.showStatus(status.textContent, 'error');
        }
    };
    toJsonBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        let xmlStr = input.value;
        xmlStr = stripRootElement(xmlStr); // Remove <root> wrapper if present
        const [xml, err] = parseXMLSafe(xmlStr);
        if (err) {
            status.className = 'error-message';
            status.textContent = 'Error: Invalid XML - ' + err;
            status.classList.remove('hidden');
            output.value = '';
            if (window.showStatus) window.showStatus(status.textContent, 'error');
            return;
        }
        try {
            let json = xmlToJson(xml.documentElement);
            json = unwrapRootIfNeeded(json); // Remove <root> wrapper in JSON if present
            json = cleanJsonFromXml(json); // Clean up empty elements
            output.value = JSON.stringify(json, null, 2);
            status.className = 'success-message';
            status.textContent = 'Converted XML to JSON.';
            status.classList.remove('hidden');
        } catch (e) {
            status.className = 'error-message';
            status.textContent = 'Error: ' + e.message;
            status.classList.remove('hidden');
            output.value = '';
            if (window.showStatus) window.showStatus(status.textContent, 'error');
        }
    };
    clearBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        input.value = '';
        output.value = '';
        status.classList.add('hidden');
    };
    if (typeof window.setupCopyButtons === 'function') window.setupCopyButtons();
}

// Pretty-print XML output
function formatXml(xml) {
    const PADDING = '  ';
    const reg = /(>)(<)(\/*)/g;
    let formatted = '', pad = 0;
    xml = xml.replace(reg, '$1\r\n$2$3');
    xml.split(/\r?\n/).forEach((node) => {
        let indent = 0;
        if (node.match(/^<\//)) indent = -1;
        else if (node.match(/^<[^!?]/) && !node.endsWith('/>')) indent = 1;
        formatted += PADDING.repeat(Math.max(pad, 0)) + node + '\n';
        pad += indent;
    });
    return formatted.trim();
}
