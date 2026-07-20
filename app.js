document.addEventListener("DOMContentLoaded", () => {
    
    // ==================== DYNAMIC CURRENT YEAR ====================
    const currentYearEl = document.getElementById("current-year");
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    // ==================== SCROLL HEADER EFFECT ====================
    const header = document.getElementById("site-header");
    const handleScrollHeader = () => {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    };
    window.addEventListener("scroll", handleScrollHeader);
    handleScrollHeader(); // Initialize check

    // ==================== MOBILE NAVIGATION ====================
    const menuToggleBtn = document.getElementById("menu-toggle-btn");
    const mainNavigation = document.getElementById("main-navigation");
    const navMenu = mainNavigation.querySelector(".nav-menu");
    const navLinks = navMenu.querySelectorAll(".nav-link");

    const toggleMenu = () => {
        menuToggleBtn.classList.toggle("open");
        navMenu.classList.toggle("open");
        
        // Prevent body scrolling when menu is open
        if (navMenu.classList.contains("open")) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    };

    menuToggleBtn.addEventListener("click", toggleMenu);

    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            // Close mobile menu if open
            if (navMenu.classList.contains("open")) {
                toggleMenu();
            }
        });
    });

    // ==================== SCROLL INTERSECTION OBSERVER ====================
    // Highlights active menu items & trigger scroll animations
    const sections = document.querySelectorAll("section");
    
    const navObserverOptions = {
        root: null,
        rootMargin: "-20% 0px -60% 0px", // Focus triggers on middle screen scroll
        threshold: 0
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute("id");
                
                navLinks.forEach(link => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === `#${id}`) {
                        link.classList.add("active");
                    }
                });
            }
        });
    }, navObserverOptions);

    sections.forEach(section => {
        navObserver.observe(section);
    });

    // ==================== COUNT-UP ANIMATION FOR STATS ====================
    const counterItems = document.querySelectorAll(".counter-num");
    
    const countUp = (element) => {
        const target = parseInt(element.getAttribute("data-target"), 10);
        const duration = 2000; // 2 seconds
        const stepTime = 30; // speed of incrementing
        const increment = target / (duration / stepTime);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
        }, stepTime);
    };

    const statsObserverOptions = {
        root: null,
        threshold: 0.1
    };

    let countTriggered = false;
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countTriggered) {
                counterItems.forEach(counter => countUp(counter));
                countTriggered = true; // Trigger only once
                statsObserver.unobserve(entry.target);
            }
        });
    }, statsObserverOptions);

    const trustBarSection = document.getElementById("trust-bar");
    if (trustBarSection) {
        statsObserver.observe(trustBarSection);
    }

    // ==================== SERVICES TABS LOGIC ====================
    const tabButtons = document.querySelectorAll(".tab-btn");
    const tabPanels = document.querySelectorAll(".tab-panel");

    tabButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            // Remove active class from all buttons and panels
            tabButtons.forEach(b => {
                b.classList.remove("active");
                b.setAttribute("aria-selected", "false");
            });
            tabPanels.forEach(p => p.classList.remove("active"));

            // Add active class to clicked button
            btn.classList.add("active");
            btn.setAttribute("aria-selected", "true");

            // Add active class to matching panel
            const panelId = btn.getAttribute("aria-controls");
            const targetPanel = document.getElementById(panelId);
            if (targetPanel) {
                targetPanel.classList.add("active");
            }
        });
    });

    // Pre-populate service dropdown when user clicks "Request Consultation" inside services
    const selectServiceButtons = document.querySelectorAll(".select-service-btn");
    const serviceDropdown = document.getElementById("form-service");

    selectServiceButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const serviceName = btn.getAttribute("data-service");
            if (serviceDropdown && serviceName) {
                serviceDropdown.value = serviceName;
            }
        });
    });

    // ==================== TESTIMONIALS SLIDER ====================
    const sliderTrack = document.getElementById("testimonial-slider-track");
    const slides = document.querySelectorAll(".testimonial-slide");
    const prevBtn = document.getElementById("slider-prev");
    const nextBtn = document.getElementById("slider-next");
    const dotsContainer = document.getElementById("slider-dots-container");
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    let slideTimer;

    // Generate dots
    if (dotsContainer) {
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement("button");
            dot.classList.add("slider-dot");
            if (i === 0) dot.classList.add("active");
            dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
            dot.addEventListener("click", () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    const updateSliderUI = () => {
        // Move slider track
        sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Update slide classes for opacity transition
        slides.forEach((slide, idx) => {
            slide.classList.remove("active");
            if (idx === currentSlide) {
                slide.classList.add("active");
            }
        });

        // Update dots
        const dots = dotsContainer.querySelectorAll(".slider-dot");
        dots.forEach((dot, idx) => {
            dot.classList.remove("active");
            if (idx === currentSlide) {
                dot.classList.add("active");
            }
        });
    };

    const goToSlide = (index) => {
        currentSlide = index;
        updateSliderUI();
        resetAutoplay();
    };

    const nextSlide = () => {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSliderUI();
    };

    const prevSlide = () => {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSliderUI();
        resetAutoplay();
    };

    if (nextBtn) nextBtn.addEventListener("click", nextSlide);
    if (prevBtn) prevBtn.addEventListener("click", prevSlide);

    // Autoplay
    const startAutoplay = () => {
        slideTimer = setInterval(nextSlide, 7000); // Change testimonial every 7 seconds
    };

    const resetAutoplay = () => {
        clearInterval(slideTimer);
        startAutoplay();
    };

    if (sliderTrack) {
        startAutoplay();
    }

    // ==================== FAQ ACCORDION LOGIC ====================
    const faqQuestions = document.querySelectorAll(".faq-question");

    faqQuestions.forEach(questionBtn => {
        questionBtn.addEventListener("click", () => {
            const faqItem = questionBtn.parentElement;
            const answerPanel = faqItem.querySelector(".faq-answer");
            const isOpen = faqItem.classList.contains("active");

            // Close other FAQ items first
            document.querySelectorAll(".faq-item").forEach(item => {
                item.classList.remove("active");
                item.querySelector(".faq-answer").style.maxHeight = null;
                item.querySelector(".faq-question").setAttribute("aria-expanded", "false");
            });

            if (!isOpen) {
                faqItem.classList.add("active");
                answerPanel.style.maxHeight = answerPanel.scrollHeight + "px";
                questionBtn.setAttribute("aria-expanded", "true");
            }
        });
    });

    // ==================== CONTACT FORM VALIDATION & MODAL ====================
    const form = document.getElementById("consultation-form");
    const successModal = document.getElementById("success-modal");
    const closeModalBtn = document.getElementById("close-modal-btn");
    
    // Receipt elements
    const receiptName = document.getElementById("receipt-name");
    const receiptPhone = document.getElementById("receipt-phone");
    const receiptService = document.getElementById("receipt-service");
    const receiptRef = document.getElementById("receipt-ref");

    const validateField = (input, errorElId) => {
        const errorEl = document.getElementById(errorElId);
        const group = input.parentElement;
        
        let isValid = true;
        
        if (input.required && !input.value.trim()) {
            isValid = false;
        } else if (input.type === "tel" && input.value) {
            // Very simple mobile validation: must be at least 10 digits
            const phoneClean = input.value.replace(/\D/g, "");
            if (phoneClean.length < 10) isValid = false;
        } else if (input.type === "email" && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) isValid = false;
        }

        if (!isValid) {
            group.classList.add("has-error");
        } else {
            group.classList.remove("has-error");
        }

        return isValid;
    };

    if (form) {
        const inputs = form.querySelectorAll("input[required], select[required]");
        
        inputs.forEach(input => {
            input.addEventListener("blur", () => {
                const errorId = `error-${input.id.replace("form-", "")}`;
                validateField(input, errorId);
            });
            
            input.addEventListener("input", () => {
                const errorId = `error-${input.id.replace("form-", "")}`;
                const group = input.parentElement;
                if (group.classList.contains("has-error")) {
                    validateField(input, errorId);
                }
            });
        });

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            
            let isFormValid = true;
            
            // Validate all inputs
            inputs.forEach(input => {
                const errorId = `error-${input.id.replace("form-", "")}`;
                if (!validateField(input, errorId)) {
                    isFormValid = false;
                }
            });

            if (isFormValid) {
                // Generate a random Reference ID
                const randomRef = "KCS-" + Math.floor(100000 + Math.random() * 900000);
                
                // Populating Receipt Modal
                if (receiptName) receiptName.textContent = document.getElementById("form-name").value;
                if (receiptPhone) receiptPhone.textContent = document.getElementById("form-phone").value;
                if (receiptService) receiptService.textContent = document.getElementById("form-service").value;
                if (receiptRef) receiptRef.textContent = randomRef;

                // Prepare data for Google Sheet
                const formData = new FormData(form);
                formData.append("ReferenceID", randomRef);
                formData.append("Timestamp", new Date().toLocaleString());

                // Google Apps Script Web App URL (User can configure this URL)
                const GOOGLE_SHEET_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz-xUbFkBveGAIywAmonfR3y_4O_8H_a1M2RcNThR7b_Vw9NOK0IijRb24RqjaTXnsjJw/exec"; 

                // Show loading state on submit button
                const submitBtn = document.getElementById("form-submit-btn");
                const originalBtnContent = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';

                const completeSubmission = () => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnContent;
                    
                    // Show Success Modal
                    successModal.classList.add("active");
                    successModal.setAttribute("aria-hidden", "false");
                    document.body.style.overflow = "hidden"; // disable scroll
                    
                    // Reset form
                    form.reset();
                };

                if (GOOGLE_SHEET_SCRIPT_URL && GOOGLE_SHEET_SCRIPT_URL !== "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL") {
                    // Submit to Google Sheets via Fetch API
                    fetch(GOOGLE_SHEET_SCRIPT_URL, {
                        method: "POST",
                        body: formData
                    })
                    .then(response => {
                        console.log("Data logged to Google Sheet successfully", response);
                        completeSubmission();
                    })
                    .catch(err => {
                        console.error("Error submitting to Google Sheet:", err);
                        // Fallback: complete anyway so user is not blocked
                        completeSubmission();
                    });
                } else {
                    // Fallback when script URL is not configured yet
                    console.log("Google Sheets URL not configured. Simulating logging...");
                    setTimeout(completeSubmission, 800); // Small delay for realistic feel
                }
            } else {
                // Focus on first error element
                const firstError = form.querySelector(".has-error input, .has-error select");
                if (firstError) firstError.focus();
            }
        });
    }

    if (closeModalBtn && successModal) {
        closeModalBtn.addEventListener("click", () => {
            successModal.classList.remove("active");
            successModal.setAttribute("aria-hidden", "true");
            document.body.style.overflow = "auto"; // enable scroll
        });

        // Close on click outside card
        successModal.addEventListener("click", (e) => {
            if (e.target === successModal) {
                successModal.classList.remove("active");
                successModal.setAttribute("aria-hidden", "true");
                document.body.style.overflow = "auto";
            }
        });
    }

});
