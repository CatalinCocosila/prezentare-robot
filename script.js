function setLang(lang) {
    document.body.className = 'lang-' + lang;
    document.getElementById('btn-ro').classList.toggle('active', lang === 'ro');
    document.getElementById('btn-en').classList.toggle('active', lang === 'en');
}

function activateIframe() {
    document.getElementById('overlay').classList.add('active');
}

const phoneBox = document.getElementById('phone-box');

if (phoneBox) {
    phoneBox.addEventListener('mouseleave', function() {
        document.getElementById('overlay').classList.remove('active');
    });

    phoneBox.addEventListener('wheel', function(e) {
        if (document.getElementById('overlay').classList.contains('active')) {
            e.stopPropagation();
        }
    }, { passive: true });
}