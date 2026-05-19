// 🎮 İnteraktiv Funksionallıq və Animasiyalar

class InteractiveEnhancements {
    constructor() {
        this.initializeOnLoad();
    }

    initializeOnLoad() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        this.setupIntersectionObserver();
        this.setupSmoothScrolling();
        this.setupInteractiveCards();
        this.setupParallax();
        this.setupToastSystem();
        this.setupProgressBars();
        this.setupFloatingActionButton();
        this.setupLoadingStates();
        this.setupDarkModeToggle();
        this.addAnimationsToExistingElements();
        console.log('🎨 Futbol.az təkmilləşdirmələri yükləndi!');
    }

    // İntersection Observer - elementlər görünəndə animasiya
    setupIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        // Bütün kartlar və məzmunu elementləri müşahidə et
        document.querySelectorAll('.match-card, .news-item, .stat-card, .player-card').forEach(el => {
            observer.observe(el);
        });
    }

    // Hamar skrolling
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // İnteraktiv kartlar
    setupInteractiveCards() {
        document.querySelectorAll('.match-card, .news-item, .player-card').forEach(card => {
            if (!card.classList.contains('interactive-enhanced')) {
                card.classList.add('interactive-card', 'zoom-hover', 'interactive-enhanced');
                
                // Kartlara klik effekti əlavə et
                card.addEventListener('click', (e) => {
                    this.createRippleEffect(e, card);
                });
            }
        });
    }

    // Ripple effekti
    createRippleEffect(e, element) {
        const ripple = document.createElement('div');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple 0.6s linear;
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            pointer-events: none;
        `;

        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // Parallax effekti
    setupParallax() {
        const parallaxElements = document.querySelectorAll('.parallax, .hero-section');
        
        if (parallaxElements.length > 0) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                parallaxElements.forEach(element => {
                    const rate = scrolled * -0.5;
                    element.style.transform = `translateY(${rate}px)`;
                });
            });
        }
    }

    // Toast bildiriş sistemi
    setupToastSystem() {
        this.toastContainer = document.createElement('div');
        this.toastContainer.id = 'toast-container';
        document.body.appendChild(this.toastContainer);

        // Global toast funksiyası
        window.showToast = (message, type = 'info', duration = 3000) => {
            this.showToast(message, type, duration);
        };
    }

    showToast(message, type, duration) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        this.toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, duration);
    }

    // Progress barların animasiyası
    setupProgressBars() {
        const progressBars = document.querySelectorAll('.progress-bar-fill');
        
        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const percentage = bar.dataset.percentage || '75';
                    setTimeout(() => {
                        bar.style.width = percentage + '%';
                    }, 500);
                    progressObserver.unobserve(bar);
                }
            });
        });

        progressBars.forEach(bar => {
            progressObserver.observe(bar);
        });
    }

    // Floating Action Button
    setupFloatingActionButton() {
        const fab = document.createElement('button');
        fab.className = 'fab';
        fab.innerHTML = '⚽';
        fab.title = 'Yuxarı qayıt';
        
        fab.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Scroll zamanı göstər/gizlət
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                fab.style.display = 'block';
                fab.style.opacity = '1';
            } else {
                fab.style.opacity = '0';
                setTimeout(() => {
                    if (window.pageYOffset <= 300) {
                        fab.style.display = 'none';
                    }
                }, 300);
            }
        });

        document.body.appendChild(fab);
    }

    // Loading state management
    setupLoadingStates() {
        // API çağırıları üçün loading spinner
        window.showLoading = (container) => {
            const spinner = document.createElement('div');
            spinner.className = 'loading-spinner';
            spinner.id = 'global-loader';
            
            if (container) {
                container.appendChild(spinner);
            } else {
                document.body.appendChild(spinner);
            }
        };

        window.hideLoading = () => {
            const loader = document.getElementById('global-loader');
            if (loader) {
                loader.remove();
            }
        };
    }

    // Dark mode toggle
    setupDarkModeToggle() {
        const toggle = document.createElement('button');
        toggle.innerHTML = '🌙';
        toggle.className = 'dark-mode-toggle';
        toggle.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            width: 50px;
            height: 50px;
            font-size: 20px;
            cursor: pointer;
            z-index: 1000;
            transition: all 0.3s ease;
        `;

        toggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            toggle.innerHTML = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
            localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
        });

        // Əvvəlki preferansı yaddaşdan al
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
            toggle.innerHTML = '☀️';
        }

        document.body.appendChild(toggle);
    }

    // Mövcud elementlərə animasiya əlavə et
    addAnimationsToExistingElements() {
        // Düymələrə animasiya
        document.querySelectorAll('button:not(.animated-button)').forEach(btn => {
            if (!btn.classList.contains('fab') && !btn.classList.contains('dark-mode-toggle')) {
                btn.classList.add('animated-button');
            }
        });

        // Tablolara zebra effekti
        document.querySelectorAll('table tr:nth-child(even)').forEach(row => {
            row.style.backgroundColor = 'rgba(0, 255, 127, 0.05)';
        });

        // İmage lazy loading və zoom
        document.querySelectorAll('img').forEach(img => {
            img.classList.add('zoom-hover');
            img.loading = 'lazy';
        });
    }
}

// CSS animasiya yaradın
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .dark-mode {
        filter: invert(1) hue-rotate(180deg);
    }
    
    .dark-mode img, .dark-mode video {
        filter: invert(1) hue-rotate(180deg);
    }
`;
document.head.appendChild(style);

// Initialize
const enhancements = new InteractiveEnhancements();

// Export for global use
window.FutbolAzEnhancements = enhancements;