document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('reviewsTrack');
    const carousel = document.querySelector('.reviews-carousel');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    let originalCards = Array.from(track.children);
    const totalOriginals = originalCards.length;
    const cardWidth = 300;
    const gap = 24;
    const moveAmount = cardWidth + gap;

    // 1. Cloner les cartes pour créer l'effet de boucle infinie fluide
    originalCards.forEach(card => {
        const cloneAfter = card.cloneNode(true);
        const cloneBefore = card.cloneNode(true);
        track.appendChild(cloneAfter);
        track.insertBefore(cloneBefore, track.firstChild);
    });

    let allCards = Array.from(track.children);
    let currentIndex = totalOriginals; // Démarre au début du vrai lot (milieu)
    let isTransitioning = false;

    function getVisibleCardsCount() {
        if (window.innerWidth < 650) return 1;
        if (window.innerWidth < 1000) return 2;
        return 3;
    }

    function updateCarouselLayout() {
        const visibleCards = getVisibleCardsCount();
        
        // La largeur du conteneur affiche N cartes complètes + 2 demi-cartes sur les bords
        const carouselWidth = (cardWidth * visibleCards) + (gap * (visibleCards - 1)) + moveAmount;
        carousel.style.width = `${carouselWidth}px`;

        applyPosition(false);
    }

    function applyPosition(animated = true) {
        if (animated) {
            track.style.transition = 'transform 0.4s ease-in-out';
        } else {
            track.style.transition = 'none';
        }

        // Décale de manière à laisser dépasser la moitié d'une carte à gauche
        const offset = (currentIndex * moveAmount) - (moveAmount / 2);
        track.style.transform = `translateX(-${offset}px)`;

        updateActiveCards();
    }

    function updateActiveCards() {
        const visibleCards = getVisibleCardsCount();
        allCards.forEach((card, index) => {
            if (index >= currentIndex && index < currentIndex + visibleCards) {
                card.classList.add('is-visible');
            } else {
                card.classList.remove('is-visible');
            }
        });
    }

    // Réinitialisation silencieuse (sans animation) quand on sort des bornes
    track.addEventListener('transitionend', () => {
        isTransitioning = false;

        if (currentIndex >= totalOriginals * 2) {
            currentIndex -= totalOriginals;
            applyPosition(false);
        } else if (currentIndex < totalOriginals) {
            currentIndex += totalOriginals;
            applyPosition(false);
        }
    });

    nextBtn.addEventListener('click', () => {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex++;
        applyPosition(true);
    });

    prevBtn.addEventListener('click', () => {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex--;
        applyPosition(true);
    });

    window.addEventListener('resize', updateCarouselLayout);
    
    // Initialisation
    updateCarouselLayout();
});