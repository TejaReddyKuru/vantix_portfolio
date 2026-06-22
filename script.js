document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Toggle hamburger icon between bars and times
            const icon = hamburger.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = hamburger.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });

    // 2. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Active link switching based on scroll
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // 3. Scroll Animations (Intersection Observer)
    const animateElements = document.querySelectorAll(
        '.animate-fade-up, .animate-fade-left, .animate-fade-right, .animate-pop-up'
    );

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                // Optional: Stop observing once animated
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animateElements.forEach(el => observer.observe(el));

    // 4. Carousel Logic for all projects
    const carousels = document.querySelectorAll('.carousel-container');
    carousels.forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        const prevBtn = carousel.querySelector('.prev-btn');
        const nextBtn = carousel.querySelector('.next-btn');

        if (track && prevBtn && nextBtn) {
            let currentIndex = 0;
            const images = track.querySelectorAll('img');
            const totalImages = images.length;

            const updateCarousel = () => {
                const width = track.parentElement.clientWidth;
                track.style.transform = `translateX(-${currentIndex * width}px)`;
            };

            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % totalImages;
                updateCarousel();
            });

            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + totalImages) % totalImages;
                updateCarousel();
            });

            window.addEventListener('resize', updateCarousel);
        }
    });

    // 5. Lightbox Logic
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');

    if (lightbox && lightboxImg && lightboxClose) {
        let currentGallery = [];
        let currentIndex = 0;

        // Group images by their carousel container so we can cycle through them
        document.querySelectorAll('.carousel-container').forEach(container => {
            const trackImgs = Array.from(container.querySelectorAll('.carousel-track img'));
            
            trackImgs.forEach((img, index) => {
                img.addEventListener('click', () => {
                    currentGallery = trackImgs;
                    currentIndex = index;
                    lightboxImg.src = img.src;
                    lightbox.classList.add('show');
                });
            });
        });

        const updateLightboxImage = () => {
            if (currentGallery.length > 0) {
                lightboxImg.src = currentGallery[currentIndex].src;
            }
        };

        if (lightboxPrev && lightboxNext) {
            lightboxPrev.addEventListener('click', (e) => {
                e.stopPropagation(); // prevent closing the modal
                if (currentGallery.length > 0) {
                    currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
                    updateLightboxImage();
                }
            });

            lightboxNext.addEventListener('click', (e) => {
                e.stopPropagation();
                if (currentGallery.length > 0) {
                    currentIndex = (currentIndex + 1) % currentGallery.length;
                    updateLightboxImage();
                }
            });
        }

        // Close lightbox on X click
        lightboxClose.addEventListener('click', () => {
            lightbox.classList.remove('show');
            setTimeout(() => { lightboxImg.src = ''; }, 300); // clear src after animation
        });

        // Close lightbox on background click
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('show');
                setTimeout(() => { lightboxImg.src = ''; }, 300);
            }
        });
    }

    // 6. Project Filtering Logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterBtns.length > 0 && projectCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                projectCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    
                    // Reset animation state
                    card.classList.remove('show', 'hide');

                    if (filterValue === 'all' || filterValue === cardCategory) {
                        card.classList.add('show');
                        setTimeout(() => {
                            // Ensure display is block/flex after animation starts
                            card.style.display = 'flex';
                        }, 10);
                    } else {
                        card.classList.add('hide');
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 10); // hiding instantly because it's set to display: none
                    }
                });
            });
        });
    }
});
