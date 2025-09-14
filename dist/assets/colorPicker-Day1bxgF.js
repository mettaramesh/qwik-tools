import{h as d,r as u}from"./utils-D6OBsT8e.js";window.hexToRgb=d;window.rgbToHsl=u;function v(e){e.innerHTML=`
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
            <div class="color-preview" id="color-preview" style="background-color: #3B82F6;"></div>
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
    `}function p(){const e=document.getElementById("color-picker"),n=document.getElementById("hex-input"),a=document.getElementById("color-preview"),i=document.getElementById("hex-value"),s=document.getElementById("rgb-value"),c=document.getElementById("hsl-value"),r=l=>{a.style.backgroundColor=l,i.value=l.toUpperCase();let o=null;if(typeof window.hexToRgb=="function"&&(o=window.hexToRgb(l)),o){s.value=`rgb(${o.r}, ${o.g}, ${o.b})`;let t=null;typeof window.rgbToHsl=="function"&&(t=window.rgbToHsl(o.r,o.g,o.b)),t&&(c.value=`hsl(${Math.round(t.h)}, ${Math.round(t.s)}%, ${Math.round(t.l)}%)`)}};e&&e.addEventListener("input",l=>{n.value=l.target.value,r(l.target.value)}),n&&n.addEventListener("input",l=>{const o=l.target.value;/^#[0-9A-F]{6}$/i.test(o)&&(e.value=o,r(o))}),r(e.value),typeof window.setupCopyButtons=="function"&&window.setupCopyButtons()}function b(e,n){v(e),p()}export{b as load,v as loadColorPicker,p as setupColorPicker};
