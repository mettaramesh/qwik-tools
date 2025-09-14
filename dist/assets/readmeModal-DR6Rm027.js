function o(e){return e=e.replace(/^# .*(\r?\n)+/,""),e=e.replace(/[&<>]/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;"})[a]),e=e.replace(/^###### (.*)$/gm,"<h6>$1</h6>").replace(/^##### (.*)$/gm,"<h5>$1</h5>").replace(/^#### (.*)$/gm,"<h4>$1</h4>").replace(/^### (.*)$/gm,"<h3>$1</h3>").replace(/^## (.*)$/gm,"<h2>$1</h2>").replace(/^# (.*)$/gm,"<h1>$1</h1>"),e=e.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\*(.*?)\*/g,"<em>$1</em>"),e=e.replace(/`([^`]+)`/g,'<code class="inline-code">$1</code>'),e=e.replace(/```([\s\S]*?)```/g,'<pre class="md-code-block"><code>$1</code></pre>'),e=e.replace(/\[([^\]]+)\]\(([^\)]+)\)/g,'<a href="$2" target="_blank">$1</a>'),e=e.replace(/^(?:<li>.*<\/li>\s*)+/gm,a=>`<ul>${a.replace(/\s*$/,"")}</ul>`),e=e.replace(/^(?!<h\d|<ul|<li|<\/ul|<\/li|<p|<strong|<em|<code|<a|<pre)(.+)$/gm,"<p>$1</p>"),e}function d(){let e=document.getElementById("readmeModal");if(!e&&(e=document.createElement("div"),e.id="readmeModal",e.className="rdm-modal",e.setAttribute("aria-hidden","true"),e.innerHTML=`
      <div class="rdm-backdrop" data-close></div>
      <div class="rdm-dialog" role="dialog" aria-modal="true" aria-labelledby="rdm-title">
        <header class="rdm-header" style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
          <h3 id="rdm-title" style="margin:0;">Qwik-Tools</h3>
          <button class="rdm-close" aria-label="Close" data-close style="margin-left:auto;font-size:1.4rem;background:transparent;border:0;color:var(--color-text-secondary,#9aa7b2);cursor:pointer;padding:6px 8px;border-radius:8px;">&times;</button>
        </header>
        <div class="rdm-body" id="rdm-content" tabindex="0">Loading...</div>
        <footer class="rdm-footer">
          <button class="btn btn--primary" data-close>Close</button>
        </footer>
      </div>
    `,document.body.appendChild(e),!document.getElementById("rdm-modal-style"))){const t=document.createElement("link");t.rel="stylesheet",t.href="/readmeModal.css",t.id="rdm-modal-style",document.head.appendChild(t)}e.classList.add("is-open"),e.setAttribute("aria-hidden","false"),document.body.style.overflow="hidden";const a=e.querySelector("#rdm-content");a&&a.focus(),fetch("./README.md").then(t=>t.text()).then(t=>{a.innerHTML=o(t)});function r(){e.classList.remove("is-open"),e.setAttribute("aria-hidden","true"),document.body.style.overflow=""}e.querySelectorAll("[data-close]").forEach(t=>t.onclick=r),e.querySelector(".rdm-backdrop").onclick=r,document.addEventListener("keydown",function(l){l.key==="Escape"&&r()},{once:!0})}export{d as showReadmeModal};
