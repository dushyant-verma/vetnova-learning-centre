const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const html = fs.readFileSync('about.html', 'utf8');
const dom = new JSDOM(html, { runScripts: "dangerously", resources: "usable" });
const window = dom.window;
const document = window.document;

window.addEventListener('load', () => {
    try {
        const scriptContent = fs.readFileSync('script.js', 'utf8');
        window.eval(scriptContent);
        
        console.log("script executed successfully");
        const modal = document.getElementById('faculty-modal');
        console.log("Modal classes before click:", modal.className);
        
        const btn = document.querySelector('.faculty-profile-btn');
        if (!btn) {
           console.log("Button not found!");
           return;
        }
        btn.click();
        
        setTimeout(() => {
            console.log("Modal classes after click:", modal.className);
            console.log("Modal is open:", modal.classList.contains('open'));
            console.log("Modal Name:", document.getElementById('faculty-modal-name').textContent);
        }, 100);
    } catch (e) {
        console.error("Error:", e);
    }
});
