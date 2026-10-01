/* ***********************************AVIS : carrousel*********************************** */
/* Quand les 3 cartes d'avis ne tiennent plus côte à côte, on n'en affiche qu'une seule
   (classe .is-single sur .reviews-track) et les flèches font défiler les avis.
   Le seuil est calculé à partir de la vraie largeur des cartes (width de .review-card
   dans le CSS) : si on change cette largeur, le seuil suit automatiquement. */
document.addEventListener('DOMContentLoaded', function () {
    var track = document.querySelector('.reviews-track');
    if (!track) return;

    var cards = Array.prototype.slice.call(track.querySelectorAll('.review-card'));
    var navs = track.querySelectorAll('.review-nav');
    var prev = navs[0];
    var next = navs[navs.length - 1];
    var current = 0;

    function show(index) {
        current = (index + cards.length) % cards.length; // boucle : après le dernier, le premier
        cards.forEach(function (card, i) {
            card.classList.toggle('is-active', i === current);
        });
    }

    // Place nécessaire pour toutes les cartes + les flèches, comparée à la place disponible
    function updateMode() {
        var trackStyle = getComputedStyle(track);
        var available = track.clientWidth
            - parseFloat(trackStyle.paddingLeft)
            - parseFloat(trackStyle.paddingRight);
        var gap = parseFloat(trackStyle.columnGap) || 0;
        var cardWidth = parseFloat(getComputedStyle(cards[0]).width);
        var navWidth = prev.offsetWidth + next.offsetWidth;
        var items = cards.length + 2;
        var needed = cards.length * cardWidth + navWidth + (items - 1) * gap;

        track.classList.toggle('is-single', needed > available);
    }

    prev.addEventListener('click', function () { show(current - 1); });
    next.addEventListener('click', function () { show(current + 1); });

    show(0);
    updateMode();
    window.addEventListener('resize', updateMode);
});
