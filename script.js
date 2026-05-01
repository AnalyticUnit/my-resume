// 1. ГЛОБАЛЬНЫЕ ФУНКЦИИ
window.openTab = function(evt, tabName) {
    document.querySelectorAll(".tab-content").forEach(c => { 
        c.style.display = "none"; 
        c.classList.remove("active-content"); 
    });
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    
    const selected = document.getElementById(tabName);
    if (selected) {
        selected.style.display = "block";
        const title = selected.querySelector('.typing-title');
        if (title) { 
            title.classList.remove('typing-animation'); 
            void title.offsetWidth; 
            title.classList.add('typing-animation'); 
        }
        selected.classList.add("active-content");
        
        // АНИМАЦИЯ ШКАЛ (сброс и заполнение)
        if (tabName === 'skills') {
            const bars = document.querySelectorAll('.skill-progress-fill');
            bars.forEach(bar => {
                bar.style.transition = 'none';
                bar.style.width = '0%';
                setTimeout(() => {
    bar.style.transition = 'width 3.0s cubic-bezier(0.22, 1, 0.36, 1)'; // Тут тоже поставь 3.0s
    const target = bar.getAttribute('data-percent');
    bar.style.width = target + '%';
}, 50);
            });
        }
    }
    
    if (evt) evt.currentTarget.classList.add("active");
    else document.querySelector(`[data-tab="${tabName}"]`)?.classList.add("active");
};

window.scrollToPage = function(pageIndex) {
    const scrollContainer = document.querySelector('.scroll-container');
    if (!scrollContainer) return;
    const containerHeight = scrollContainer.offsetHeight; 
    scrollContainer.scrollTo({ top: pageIndex * containerHeight, behavior: 'smooth' });
    if (pageIndex === 0) window.openTab(null, 'about');
};

window.scrollPrev = function() {
    const scrollContainer = document.querySelector('.scroll-container');
    if (!scrollContainer) return;
    const currentPg = Math.round(scrollContainer.scrollTop / scrollContainer.offsetHeight);
    const tabButtons = Array.from(document.querySelectorAll('.tab-btn'));
    const activeBtn = document.querySelector('.tab-btn.active');
    const currentIndex = tabButtons.indexOf(activeBtn);

    if (currentPg > 0) window.scrollToPage(currentPg - 1);
    else if (currentPg === 0 && currentIndex > 0) window.openTab(null, tabButtons[currentIndex - 1].dataset.tab);
};

window.scrollNext = function() {
    const scrollContainer = document.querySelector('.scroll-container');
    if (!scrollContainer) return;
    const currentPg = Math.round(scrollContainer.scrollTop / scrollContainer.offsetHeight);
    const tabButtons = Array.from(document.querySelectorAll('.tab-btn'));
    const activeBtn = document.querySelector('.tab-btn.active');
    const currentIndex = tabButtons.indexOf(activeBtn);

    if (currentPg === 0 && currentIndex < tabButtons.length - 1) window.openTab(null, tabButtons[currentIndex + 1].dataset.tab);
    else if (currentPg < 4) window.scrollToPage(currentPg + 1);
};

// 2. ИНИЦИАЛИЗАЦИЯ (Курсор и события)
document.addEventListener('DOMContentLoaded', () => {
    const scrollContainer = document.querySelector('.scroll-container');
    const dot = document.querySelector('.cursor-dot');
    const outline = document.querySelector('.cursor-outline');


    
    // ДВИЖЕНИЕ КУРСОРA
    window.addEventListener('mousemove', (e) => {
        if (dot && outline) {
            dot.style.left = outline.style.left = e.clientX + 'px';
            dot.style.top = outline.style.top = e.clientY + 'px';
        }
    });

    // СКРОЛЛ КОЛЕСОМ
    let lastScrollTime = 0;
    scrollContainer.addEventListener('wheel', (e) => {
        e.preventDefault();
        const now = Date.now();
        if (now - lastScrollTime < 150) return;
        if (e.deltaY > 0) window.scrollNext();
        else window.scrollPrev();
        lastScrollTime = now;
    }, { passive: false });

    // КЛАВИАТУРА
    window.addEventListener('keydown', (e) => {
        if (['ArrowDown', 'PageDown'].includes(e.key)) { e.preventDefault(); window.scrollNext(); }
        else if (['ArrowUp', 'PageUp'].includes(e.key)) { e.preventDefault(); window.scrollPrev(); }
    }, { passive: false });

    // ИНДИКАТОРЫ
    scrollContainer.addEventListener('scroll', () => {
        const containerHeight = scrollContainer.offsetHeight;
        const currentPg = Math.round(scrollContainer.scrollTop / containerHeight);
        document.querySelectorAll('.nav-dot').forEach((d, i) => d.classList.toggle('active', i === currentPg));
        const up = document.getElementById('upArrow'), down = document.getElementById('downArrow');
        if (up) up.style.opacity = currentPg === 0 ? "0" : "1";
        if (down) down.style.opacity = currentPg === 4 ? "0" : "1";
    });

    // ХОВЕРЫ
    const selectors = 'a, button, .mini-tags span, .photo-container, .tab-btn, .detail-card, .soft-card, .nav-dot, .nav-arrow, .contact-list li, .scroll-hint-text, .manifesto-card, .hobby-section, .timeline-item, .logic-box, .stat-item, .achievement-card';
    document.addEventListener('mouseover', (e) => { if (e.target.closest(selectors)) outline?.classList.add('cursor-hover'); });
    document.addEventListener('mouseout', (e) => { if (e.target.closest(selectors)) outline?.classList.remove('cursor-hover'); });
});






// Закрытие при клике в любое место оверлея
overlay.addEventListener('click', () => {
    overlay.style.display = 'none';
});
