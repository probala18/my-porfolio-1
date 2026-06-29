const body = document.body;
const navbar = document.querySelector('.navbar');
const themeToggle = document.getElementById('theme-toggle');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.querySelector('.contact-form');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const savedTheme = localStorage.getItem('theme') || 'light';
if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    if (window.ScrollTrigger) ScrollTrigger.refresh(true);
});

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    body.classList.toggle('menu-open');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        body.classList.remove('menu-open');
    });
});

let lenis;
if (!prefersReducedMotion && window.Lenis) {
    lenis = new Lenis({
        duration: 1.15,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true
    });

    const raf = time => {
        lenis.raf(time);
        requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', event => {
        const targetId = anchor.getAttribute('href');
        if (!targetId || targetId === '#') return;

        const target = document.querySelector(targetId);
        if (!target) return;

        event.preventDefault();
        if (lenis) {
            lenis.scrollTo(target, { offset: -96 });
        } else {
            target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        }
    });
});

const setActiveLink = () => {
    const sections = document.querySelectorAll('main section[id]');
    let current = 'home';

    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 180) {
            current = section.id;
        }
    });

    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
};

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 12);
    setActiveLink();
});

setActiveLink();

if (window.gsap && window.ScrollTrigger && !prefersReducedMotion) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from('.navbar', {
        y: -30,
        opacity: 0,
        duration: 0.75,
        ease: 'power3.out'
    });

    gsap.from('.hero-copy > *', {
        y: 34,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out'
    });

    gsap.from('.hero-visual', {
        y: 18,
        rotate: 1,
        opacity: 0.001,
        duration: 0.65,
        delay: 0.05,
        ease: 'power3.out'
    });

    gsap.from('.story-marquee', {
        scrollTrigger: {
            trigger: '.story-marquee',
            start: 'top 90%',
            once: true
        },
        clipPath: 'inset(0 50% 0 50%)',
        duration: 0.9,
        ease: 'power3.out'
    });

    gsap.utils.toArray('.text-reveal').forEach(element => {
        const words = element.textContent.trim().split(/\s+/);
        element.innerHTML = words.map(word => `<span class="reveal-word">${word}</span>`).join(' ');
    });

    const aboutSection = document.querySelector('.split-section');
    const aboutWords = aboutSection?.querySelectorAll('.reveal-word');
    if (aboutSection && aboutWords?.length) {
        ScrollTrigger.matchMedia({
            '(min-width: 981px)': () => {
                gsap.timeline({
                    scrollTrigger: {
                        trigger: aboutSection,
                        start: 'top top',
                        end: '+=140%',
                        pin: true,
                        scrub: 0.8,
                        anticipatePin: 1,
                        invalidateOnRefresh: true
                    }
                })
                .fromTo(aboutWords, {
                    color: () => getComputedStyle(document.body).getPropertyValue('--muted').trim(),
                    opacity: 0,
                    y: 18
                }, {
                    color: () => getComputedStyle(document.body).getPropertyValue('--ink').trim(),
                    opacity: 1,
                    y: 0,
                    stagger: 0.05,
                    ease: 'none'
                }, 0)
                .fromTo('.section-copy', {
                    opacity: 0.35,
                    y: 20
                }, {
                    opacity: 1,
                    y: 0,
                    ease: 'none'
                }, 0.05);
            }
        });
    }

    gsap.utils.toArray('.section-heading, .split-section > *, .skill-card, .project-card').forEach((element, index) => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: 'top 82%',
                once: true
            },
            y: 46,
            opacity: 0,
            duration: 0.8,
            delay: (index % 3) * 0.04,
            ease: 'power3.out'
        });
    });

    gsap.timeline({
        scrollTrigger: {
            trigger: '.contact',
            start: 'top 75%',
            once: true
        }
    })
        .from('.contact-header .section-kicker', {
            y: 20,
            opacity: 0,
            duration: 0.5,
            ease: 'power2.out'
        })
        .from('.contact-header .section-title', {
            y: 30,
            opacity: 0,
            duration: 0.65,
            ease: 'power3.out'
        }, '-=0.25')
        .from('.contact-subtitle', {
            y: 20,
            opacity: 0,
            duration: 0.55,
            ease: 'power2.out'
        }, '-=0.3')
        .from('.contact-card', {
            x: -35,
            opacity: 0,
            scale: 0.96,
            duration: 0.6,
            stagger: 0.12,
            ease: 'power2.out'
        }, '-=0.2')
        .from('.contact-availability', {
            x: -25,
            opacity: 0,
            duration: 0.5,
            ease: 'power2.out'
        }, '-=0.3')
        .from('.contact-form-panel', {
            y: 50,
            opacity: 0,
            rotateX: 4,
            scale: 0.97,
            duration: 0.85,
            ease: 'power3.out'
        }, '-=0.6')
        .from('.contact-form-title', {
            y: 14,
            opacity: 0,
            duration: 0.4,
            ease: 'power2.out'
        }, '-=0.4')
        .from('.contact-form label', {
            y: 18,
            opacity: 0,
            duration: 0.4,
            stagger: 0.08,
            ease: 'power2.out'
        }, '-=0.25')
        .from('.btn-submit', {
            y: 14,
            opacity: 0,
            scale: 0.95,
            duration: 0.5,
            ease: 'back.out(1.4)'
        }, '-=0.15');

    gsap.utils.toArray('.project-media').forEach(media => {
        gsap.to(media, {
            scrollTrigger: {
                trigger: media,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            },
            backgroundPosition: '100% 50%',
            ease: 'none'
        });
    });
}

const animateCounters = () => {
    const counters = document.querySelectorAll('[data-count]');
    const runCounter = element => {
        const target = Number(element.dataset.count);
        let current = 0;
        const step = Math.max(1, Math.round(target / 70));

        const tick = () => {
            current = Math.min(target, current + step);
            element.textContent = `${current}+`;
            if (current < target) requestAnimationFrame(tick);
        };

        tick();
    };

    if ('IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                runCounter(entry.target);
                counterObserver.unobserve(entry.target);
            });
        }, { threshold: 0.4 });

        counters.forEach(counter => counterObserver.observe(counter));
    } else {
        counters.forEach(runCounter);
    }
};

animateCounters();

const tiltTarget = document.querySelector('[data-tilt]');
if (tiltTarget && !prefersReducedMotion) {
    tiltTarget.addEventListener('mousemove', event => {
        if (window.innerWidth < 900) return;
        const rect = tiltTarget.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        tiltTarget.style.transform = `rotateX(${-y * 5}deg) rotateY(${x * 7}deg)`;
    });

    tiltTarget.addEventListener('mouseleave', () => {
        tiltTarget.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
}

document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', event => {
        if (window.innerWidth < 900 || prefersReducedMotion) return;
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const rotateX = -((y - rect.height / 2) / 28);
        const rotateY = (x - rect.width / 2) / 28;
        card.style.transform = `perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1100px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
});

document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('mousemove', event => {
        if (prefersReducedMotion) return;
        const rect = card.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--glow-x', `${x}%`);
        card.style.setProperty('--glow-y', `${y}%`);
    });
});

const createScrollToTopButton = () => {
    const button = document.createElement('button');
    button.id = 'scroll-to-top';
    button.type = 'button';
    button.innerHTML = '<i class="fas fa-arrow-up"></i>';
    button.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(button);

    window.addEventListener('scroll', () => {
        button.classList.toggle('show', window.scrollY > 420);
    });

    button.addEventListener('click', () => {
        if (lenis) {
            lenis.scrollTo(0);
        } else {
            window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        }
    });
};

createScrollToTopButton();

contactForm.addEventListener('submit', event => {
    event.preventDefault();

    const name = contactForm.querySelector('input[type="text"]').value.trim();
    const email = contactForm.querySelector('input[type="email"]').value.trim();
    const message = contactForm.querySelector('textarea').value.trim();

    if (!name || !email || !message) {
        alert('Please fill in all fields.');
        return;
    }

    alert(`Thanks, ${name}. Your message is ready to be sent.`);
    contactForm.reset();
});

window.addEventListener('load', async () => {
    try {
        const motionModule = await import('https://cdn.jsdelivr.net/npm/motion@10.18.0/+esm');
        const { animate, stagger } = motionModule;

        if (!prefersReducedMotion) {
            animate('.metric', { opacity: [0, 1], y: [24, 0] }, { delay: stagger(0.08), duration: 0.65, easing: 'ease-out' });
            animate('.btn, .social-icon', { scale: [0.96, 1] }, { duration: 0.45, easing: 'ease-out' });
        }
    } catch (error) {
        console.info('Motion CDN unavailable; GSAP and CSS interactions remain active.');
    }
});
