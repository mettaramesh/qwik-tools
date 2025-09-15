async function o(){const t=document.getElementById("app")||document.body,n=await fetch("src/notFound.html").then(e=>e.text());t.innerHTML=n}export{o as render};
