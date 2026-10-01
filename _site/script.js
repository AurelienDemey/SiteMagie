/* ***********************************AVIS : carrousel*********************************** */
/* Affiche les avis par groupe : 3 côte à côte s'ils tiennent, sinon 1 seul (classe
   .is-single sur .reviews-track). Les flèches avancent d'un avis et bouclent sur tous
   les avis (après le dernier, on revient au premier).
   Le seuil 3 → 1 est calculé à partir de la vraie largeur des cartes (width de
   .review-card dans le CSS) : si on change cette largeur, le seuil suit automatiquement.
   Pour ajouter un avis : copier un bloc <a class="review-card"> dans Index.html. */
document.addEventListener('DOMContentLoaded', function () {
    var MAX_VISIBLE = 3; // nombre d'avis affichés côte à côte quand il y a la place

    var track = document.querySelector('.reviews-track');
    if (!track) return;

    var cards = Array.prototype.slice.call(track.querySelectorAll('.review-card'));
    var navs = track.querySelectorAll('.review-nav');
    var prev = navs[0];
    var next = navs[navs.length - 1];
    var current = 0;   // index du premier avis affiché
    var visible = 1;   // nombre d'avis affichés (MAX_VISIBLE ou 1)

    // Le carrousel est actif : le CSS cache les avis qui n'ont pas la classe .is-active
    // (sans JavaScript, tous les avis restent affichés)
    track.classList.add('is-carousel');

    function render() {
        cards.forEach(function (card) {
            card.classList.remove('is-active');
            card.style.order = '';
        });
        // Les avis affichés sont ceux qui suivent "current", en boucle. La propriété
        // CSS order les remet dans le bon ordre à l'écran (ex. : avis 6, 1, 2).
        for (var k = 0; k < visible; k++) {
            var card = cards[(current + k) % cards.length];
            card.classList.add('is-active');
            card.style.order = k + 1;
        }
    }

    // Toutes les cartes prennent la hauteur de la plus haute (celle dont l'avis a le
    // plus de lignes), y compris les cartes cachées : on les mesure une à une, à la
    // largeur des cartes affichées, sans les montrer.
    function equalizeHeights() {
        cards.forEach(function (card) { card.style.minHeight = ''; });

        // Mode 1 carte (mobile) : pas de hauteur commune, chaque carte s'adapte à son texte
        if (visible === 1) return;

        var width = track.querySelector('.review-card.is-active').getBoundingClientRect().width;
        var max = 0;

        cards.forEach(function (card) {
            if (card.classList.contains('is-active')) {
                max = Math.max(max, card.offsetHeight);
                return;
            }
            // Carte cachée : affichage temporaire, invisible et hors du flux, pour la mesurer
            card.style.cssText += 'display:flex; position:absolute; visibility:hidden; width:' + width + 'px;';
            max = Math.max(max, card.offsetHeight);
            card.style.display = '';
            card.style.position = '';
            card.style.visibility = '';
            card.style.width = '';
        });

        cards.forEach(function (card) { card.style.minHeight = max + 'px'; });
    }

    function go(step) {
        current = (current + step + cards.length) % cards.length;
        render();
    }

    // Place nécessaire pour MAX_VISIBLE cartes + les flèches, comparée à la place disponible
    function updateMode() {
        var trackStyle = getComputedStyle(track);
        var available = track.clientWidth
            - parseFloat(trackStyle.paddingLeft)
            - parseFloat(trackStyle.paddingRight);
        var gap = parseFloat(trackStyle.columnGap) || 0;
        // Largeur minimale d'une carte en mode 3 cartes (variable --review-card-min du CSS) ;
        // à défaut, la largeur normale des cartes
        var cardWidth = parseFloat(trackStyle.getPropertyValue('--review-card-min'))
            || parseFloat(getComputedStyle(cards[0]).width);
        var navWidth = prev.offsetWidth + next.offsetWidth;
        var count = Math.min(MAX_VISIBLE, cards.length);
        var needed = count * cardWidth + navWidth + (count + 1) * gap;

        visible = needed > available ? 1 : count;
        track.classList.toggle('is-single', visible === 1);
        render();
        equalizeHeights();
    }

    prev.addEventListener('click', function () { go(-1); });
    next.addEventListener('click', function () { go(1); });

    updateMode();
    window.addEventListener('resize', updateMode);
    // Les polices (Montserrat) peuvent finir de charger après : le texte change alors
    // de largeur, donc de nombre de lignes → on remesure
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(updateMode);
    }
});
