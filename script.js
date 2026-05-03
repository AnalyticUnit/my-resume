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
        
        // Анимация шкал во вкладке навыки
        if (tabName === 'skills') {
            document.querySelectorAll('.skill-progress-fill').forEach(bar => {
                bar.style.transition = 'none';
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.transition = 'width 3.0s cubic-bezier(0.22, 1, 0.36, 1)';
                    bar.style.width = bar.getAttribute('data-percent') + '%';
                }, 50);
            });
        }
    }
    
    if (evt) evt.currentTarget.classList.add("active");
    else document.querySelector(`[data-tab="${tabName}"]`)?.classList.add("active");
};

// Функция скролла
window.scrollToPage = function(pageIndex) {
    const scrollContainer = document.querySelector('.scroll-container');
    if (!scrollContainer) return;
    const containerHeight = scrollContainer.offsetHeight; 
    
    scrollContainer.scrollTo({ 
        top: pageIndex * containerHeight, 
        behavior: 'smooth' 
    });

    // Сброс вкладок при переходе
    if (pageIndex === 0) window.openTab(null, 'about');
    if (pageIndex === 2) window.openTab(null, 'smartX'); // Страница R&D (теперь 3-я по счету)
};

// Умная навигация ВПЕРЕД
window.scrollNext = function() {
    const scrollContainer = document.querySelector('.scroll-container');
    const containerHeight = scrollContainer.offsetHeight;
    const currentPg = Math.round(scrollContainer.scrollTop / containerHeight);
    
    // Ищем кнопки табов именно на текущей странице
    const currentPageEl = document.querySelectorAll('.page-section-inner')[currentPg];
    const tabButtons = Array.from(currentPageEl.querySelectorAll('.tab-btn'));
    const activeBtn = currentPageEl.querySelector('.tab-btn.active');
    const currentIndex = tabButtons.indexOf(activeBtn);

    // Если на 1-й или 3-й странице есть куда листать табы
    if ((currentPg === 0 || currentPg === 2) && currentIndex < tabButtons.length - 1) {
        window.openTab(null, tabButtons[currentIndex + 1].dataset.tab);
    } 
    else if (currentPg < 3) { // Листаем до 4-й страницы (индекс 3)
        window.scrollToPage(currentPg + 1);
    }
};

// Умная навигация НАЗАД
window.scrollPrev = function() {
    const scrollContainer = document.querySelector('.scroll-container');
    const containerHeight = scrollContainer.offsetHeight;
    const currentPg = Math.round(scrollContainer.scrollTop / containerHeight);
    
    const currentPageEl = document.querySelectorAll('.page-section-inner')[currentPg];
    const tabButtons = Array.from(currentPageEl.querySelectorAll('.tab-btn'));
    const activeBtn = currentPageEl.querySelector('.tab-btn.active');
    const currentIndex = tabButtons.indexOf(activeBtn);

    if (currentPg > 0) {
        if ((currentPg === 2 || currentPg === 0) && currentIndex > 0) {
            window.openTab(null, tabButtons[currentIndex - 1].dataset.tab);
        } else {
            window.scrollToPage(currentPg - 1);
        }
    } 
    else if (currentPg === 0 && currentIndex > 0) {
        window.openTab(null, tabButtons[currentIndex - 1].dataset.tab);
    }
};

// 2. ИНИЦИАЛИЗАЦИЯ
document.addEventListener('DOMContentLoaded', () => {
    const scrollContainer = document.querySelector('.scroll-container');
    const progressBar = document.querySelector('.scroll-progress-bar');
    const dots = document.querySelectorAll('.nav-dot');
    const dot = document.querySelector('.cursor-dot');
    const outline = document.querySelector('.cursor-outline');

    // УПРАВЛЕНИЕ МЫШЬЮ
    let lastScrollTime = 0;
    scrollContainer.addEventListener('wheel', (e) => {
        e.preventDefault();
        const now = Date.now();
        if (now - lastScrollTime < 150) return; 
        if (e.deltaY > 0) window.scrollNext();
        else window.scrollPrev();
        lastScrollTime = now;
    }, { passive: false });

    // УПРАВЛЕНИЕ КЛАВИАТУРОЙ
    window.addEventListener('keydown', (e) => {
        if (['ArrowDown', 'PageDown'].includes(e.key)) { e.preventDefault(); window.scrollNext(); }
        else if (['ArrowUp', 'PageUp'].includes(e.key)) { e.preventDefault(); window.scrollPrev(); }
    }, { passive: false });

    // ИНДИКАТОРЫ
    scrollContainer.addEventListener('scroll', () => {
        const containerHeight = scrollContainer.offsetHeight;
        const scrollTop = scrollContainer.scrollTop;
        const totalHeight = scrollContainer.scrollHeight - containerHeight;
        if (progressBar) progressBar.style.width = (scrollTop / totalHeight * 100) + "%";
        
        const currentPg = Math.round(scrollTop / containerHeight);
        dots.forEach((d, i) => d.classList.toggle('active', i === currentPg));
        
        const upArrow = document.getElementById('upArrow');
        const downArrow = document.getElementById('downArrow');
        if (upArrow) upArrow.style.opacity = currentPg === 0 ? "0" : "1";
        if (downArrow) downArrow.style.opacity = currentPg === 3 ? "0" : "1";
    });

    // УНИВЕРСАЛЬНЫЙ ЗУМ
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('portfolio-image') && !e.target.classList.contains('active-zoom')) {
            const full = document.createElement('div');
            full.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(15,23,42,0.95); z-index:100000; display:flex; align-items:center; justify-content:center; cursor:zoom-out; opacity:0; transition:opacity 0.3s ease;';
            const clone = e.target.cloneNode();
            clone.classList.add('active-zoom');
            clone.style.cssText = 'max-width:75%; max-height:75%; object-fit:contain; border:1px solid #6cccf5; box-shadow:0 0 50px rgba(0,0,0,0.5); border-radius:8px;';
            full.appendChild(clone);
            document.body.appendChild(full);
            setTimeout(() => full.style.opacity = '1', 10);
            full.onclick = () => { full.style.opacity = '0'; setTimeout(() => full.remove(), 300); };
        }
    });

    // КУРСОР И ХОВЕРЫ
    window.addEventListener('mousemove', (e) => {
        if (dot && outline) {
            dot.style.left = outline.style.left = e.clientX + 'px';
            dot.style.top = outline.style.top = e.clientY + 'px';
        }
    });

    const hoverSelectors = 'a, button, .mini-tags span, .photo-container, .tab-btn, .detail-card, .soft-card, .nav-dot, .nav-arrow, .contact-list li, .scroll-hint-text, .manifesto-card, .hobby-section, .timeline-item, .logic-box, .stat-item, .achievement-card, .portfolio-image';
    document.addEventListener('mouseover', (e) => { if (e.target.closest(hoverSelectors)) outline?.classList.add('cursor-hover'); });
    document.addEventListener('mouseout', (e) => { if (e.target.closest(hoverSelectors)) outline?.classList.remove('cursor-hover'); });
});
