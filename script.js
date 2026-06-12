document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const backToTop = document.getElementById('backToTop');
    const contactForm = document.getElementById('contactForm');
    const newsletterForm = document.getElementById('newsletterForm');
    const faqQuestions = document.querySelectorAll('.faq-question');

    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // Sticky shadow + back‑to‑top visibility
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 10);
        backToTop.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });

    // Mobile menu toggle
    function openMenu() {
        hamburger.classList.add('active');
        navMenu.classList.add('active');
        hamburger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }
    function closeMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
    hamburger.addEventListener('click', () => {
        hamburger.classList.contains('active') ? closeMenu() : openMenu();
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target) && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) closeMenu();
    });

    // Active link on scroll
    function updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop;
            if (window.scrollY + 120 >= top && window.scrollY + 120 < top + section.offsetHeight) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
        });
        if (window.scrollY < 200) {
            navLinks.forEach(link => link.classList.remove('active'));
            document.querySelector('.nav-link[href="#home"]')?.classList.add('active');
        }
    }
    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();

    // Back to top
    backToTop.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));

    // FAQ accordion
    faqQuestions.forEach(q => {
        q.addEventListener('click', () => {
            const answer = q.nextElementSibling;
            const isOpen = q.getAttribute('aria-expanded') === 'true';
            faqQuestions.forEach(o => { o.setAttribute('aria-expanded','false'); o.nextElementSibling.classList.remove('open'); });
            if (!isOpen) { q.setAttribute('aria-expanded','true'); answer.classList.add('open'); }
        });
    });

    // Contact form
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(contactForm));
            if (!data.fullName || !data.email || !data.phone || !data.serviceType) return alert('Please fill all required fields.');
            const btn = contactForm.querySelector('.btn-submit');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
            btn.disabled = true;
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
                alert('Thank you! Your inquiry has been received. We will contact you shortly.');
                contactForm.reset();
            }, 1200);
        });
    }

    // Newsletter
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const input = newsletterForm.querySelector('input');
            if (!input.value.trim()) return;
            const btn = newsletterForm.querySelector('button');
            btn.innerHTML = '<i class="fa-solid fa-check"></i>';
            setTimeout(() => btn.innerHTML = '<i class="fa-solid fa-arrow-right"></i>', 2000);
            input.value = '';
        });
    }

    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = navbar.offsetHeight + 20;
                window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - offset, behavior:'smooth' });
            }
        });
    });

    // "Inquire" buttons pre‑fill service
    document.querySelectorAll('.btn-inquire').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offset = navbar.offsetHeight + 20;
                    window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - offset, behavior:'smooth' });
                    const serviceSelect = document.getElementById('serviceType');
                    if (serviceSelect) {
                        const card = this.closest('.service-card, .hire-card');
                        if (card) {
                            if (card.classList.contains('hire-card')) serviceSelect.value = 'car-hire';
                            else {
                                const title = card.querySelector('.service-card-title')?.textContent.toLowerCase() || '';
                                if (title.includes('airport')) serviceSelect.value = 'airport-transfer';
                                else if (title.includes('vip')) serviceSelect.value = 'vip-transport';
                                else if (title.includes('corporate')) serviceSelect.value = 'corporate-travel';
                                else if (title.includes('chauffeur')) serviceSelect.value = 'chauffeur';
                                else if (title.includes('group')) serviceSelect.value = 'group-travel';
                            }
                        }
                    }
                }
            }
        });
    });
});