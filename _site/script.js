document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('reviewsTrack');
    const carousel = document.querySelector('.reviews-carousel');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (!track || !carousel) return;

    let originalCards = Array.from(track.children);
    const totalOriginals = originalCards.length;
    const gap = 24;

    // Duplication des cartes pour la boucle infinie
    originalCards.forEach(card => {
        const cloneAfter = card.cloneNode(true);
        const cloneBefore = card.cloneNode(true);
        track.appendChild(cloneAfter);
        track.insertBefore(cloneBefore, track.firstChild);
    });

    let allCards = Array.from(track.children);
    let currentIndex = totalOriginals;
    let isTransitioning = false;

    function getVisibleCardsCount() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth < 1000) return 2;
        return 3;
    }

    function updateCarouselLayout() {
        const visibleCards = getVisibleCardsCount();
        const cardWidth = 300;
        const moveAmount = cardWidth + gap;

        if (visibleCards > 1) {
            // Sur Desktop : masque large avec effet de demi-cartes sur les bords
            const carouselWidth = (cardWidth * visibleCards) + (gap * (visibleCards - 1)) + moveAmount;
            carousel.style.width = `${carouselWidth}px`;
        } else {
            // Sur Mobile : largeur exacte de 1 carte
            carousel.style.width = `${cardWidth}px`;
        }

        applyPosition(false);
    }

    function applyPosition(animated = true) {
        if (animated) {
            track.style.transition = 'transform 0.4s ease-in-out';
        } else {
            track.style.transition = 'none';
        }

        const visibleCards = getVisibleCardsCount();
        const cardWidth = 300;
        const moveAmount = cardWidth + gap;
        let offset;

        if (visibleCards === 1) {
            // Mobile : centrage direct
            offset = currentIndex * moveAmount;
        } else {
            // Desktop : décalage pour la demi-carte
            offset = (currentIndex * moveAmount) - (moveAmount / 2);
        }

        track.style.transform = `translateX(-${offset}px)`;
        updateActiveCards();
    }

    function updateActiveCards() {
        const visibleCards = getVisibleCardsCount();
        allCards.forEach((card, index) => {
            if (visibleCards === 1) {
                // Sur mobile, la carte active est toujours à 100%
                card.classList.add('is-visible');
            } else if (index >= currentIndex && index < currentIndex + visibleCards) {
                card.classList.add('is-visible');
            } else {
                card.classList.remove('is-visible');
            }
        });
    }

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
    
    updateCarouselLayout();
});