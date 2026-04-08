// Functia pentru schimbarea limbii
function setLang(lang) {
    // Schimbam clasa pe body
    document.body.className = 'lang-' + lang;
    
    // Actualizam butoanele
    document.getElementById('btn-ro').classList.toggle('active', lang === 'ro');
    document.getElementById('btn-en').classList.toggle('active', lang === 'en');
}

// Functia pentru activarea simulatorului (elimina protectia de scroll)
function activateIframe() {
    document.getElementById('overlay').classList.add('active');
}

// Reactivarea protectiei de scroll daca utilizatorul da click in afara simulatorului
window.onclick = function(event) {
    const phoneBox = document.getElementById('phone-box');
    const overlay = document.getElementById('overlay');
    
    if (phoneBox && !phoneBox.contains(event.target)) {
        overlay.classList.remove('active');
    }
}