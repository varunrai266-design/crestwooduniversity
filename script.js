/**
 * EduApply - Crestwood University Application Portal JS
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // Initialize Lucide Icons
    lucide.createIcons();
    
    /* --- DATA STATE --- */
    const programsData = [
        { id: 1, title: 'B.Tech Computer Science & AI', category: 'stem', duration: '4 Years', courses: 42 },
        { id: 2, title: 'B.Tech Mechanical Engineering', category: 'stem', duration: '4 Years', courses: 40 },
        { id: 3, title: 'BBA Business Administration', category: 'professional', duration: '3 Years', courses: 30 },
        { id: 4, title: 'B.Sc Data Science', category: 'stem', duration: '3 Years', courses: 28 },
        { id: 5, title: 'LLB Law', category: 'professional', duration: '5 Years', courses: 50 },
        { id: 6, title: 'MBBS Medicine', category: 'stem', duration: '5.5 Years', courses: 60 },
        { id: 7, title: 'BA English Literature', category: 'humanities', duration: '3 Years', courses: 24 },
        { id: 8, title: 'MA Psychology', category: 'humanities', duration: '2 Years', courses: 18 },
        { id: 9, title: 'MBA Finance', category: 'professional', duration: '2 Years', courses: 22 },
        { id: 10, title: 'B.Arch Architecture', category: 'professional', duration: '5 Years', courses: 45 }
    ];

    const faqData = [
        { q: "What is the application fee?", a: "The non-refundable application fee for all programs is $75. It can be paid via credit/debit card or net banking during the application process." },
        { q: "Is financial aid available?", a: "Yes, Crestwood University offers need-based and merit-based scholarships. You can apply for financial aid after receiving your admission offer." },
        { q: "Can I apply to multiple programs?", a: "No, you can only select one primary program preference in your application. However, you can choose a secondary preference if applicable." },
        { q: "When will I receive the admission decision?", a: "Admission decisions will be announced by May 15, 2025. You will receive an email notification and can check the portal." },
        { q: "Do you offer campus housing?", a: "Yes, we guarantee campus housing for all first-year undergraduate students. We have diverse residential communities to choose from." }
    ];

    const testimonialsData = [
        { id: 1, text: "Crestwood changed my life. The faculty and resources are world-class.", name: "Priya Sharma", role: "CS '23" },
        { id: 2, text: "The campus culture is vibrant and inclusive. I found my second home here.", name: "James Lee", role: "MBA '22" },
        { id: 3, text: "From day one, I felt supported. The career center helped me land my dream job.", name: "Anika Patel", role: "Law '24" }
    ];

    /* --- LAYOUT & NAVIGATION --- */
    
    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        updateActiveNavLink();
    });

    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    mobileBtn.addEventListener('click', () => {
        const isVisible = navLinks.style.display === 'flex';
        navLinks.style.display = isVisible ? 'none' : 'flex';
        if (!isVisible) {
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.background = 'rgba(10, 25, 47, 0.95)';
            navLinks.style.padding = '1rem 0';
        }
    });

    // Smooth Scroll for Nav Links
    document.querySelectorAll('.nav-links a[href^="#"], .hero-actions a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
                // Hide mobile menu on click
                if (window.innerWidth <= 768) {
                    navLinks.style.display = 'none';
                }
            }
        });
    });

    // Active Section highlighting
    const sections = document.querySelectorAll('section[id]');
    function updateActiveNavLink() {
        const scrollY = window.pageYOffset;
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute('id');
            const link = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
            if (!link) return;
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Number Animators (Intersection Observer)
    const stats = document.querySelectorAll('.stat-num');
    const statObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateValue(entry.target, 0, target, 2000);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    stats.forEach(stat => statObserver.observe(stat));

    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start).toLocaleString();
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // Fade-in Elements & Timeline Reveal
    const fadeElements = document.querySelectorAll('.timeline-item');
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    fadeElements.forEach(el => fadeObserver.observe(el));


    /* --- DYNAMIC CONTENT MOUNTING --- */

    // 1. Programs Filter
    const programsContainer = document.getElementById('programs-container');
    const filterBtns = document.querySelectorAll('.filter-btn');

    function renderPrograms(filter = 'all') {
        const filtered = filter === 'all' ? programsData : programsData.filter(p => p.category === filter);
        programsContainer.innerHTML = filtered.map(program => `
            <div class="program-card">
                <div class="program-card-body">
                    <span class="program-tag">${program.category.toUpperCase()}</span>
                    <h3 class="program-title">${program.title}</h3>
                    <div class="program-meta">
                        <span><i data-lucide="book-open"></i> ${program.courses} Courses</span>
                        <span><i data-lucide="clock"></i> ${program.duration}</span>
                    </div>
                    <div class="program-card-footer">
                        <a href="#">Learn More <i data-lucide="arrow-right"></i></a>
                    </div>
                </div>
            </div>
        `).join('');
        lucide.createIcons();
    }
    
    renderPrograms(); // Initial render

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderPrograms(e.target.dataset.filter);
        });
    });

    // Populate Program Dropdown
    const programPrefSelect = document.getElementById('programPref');
    if (programPrefSelect) {
        programsData.forEach(p => {
            const option = document.createElement('option');
            option.value = p.id;
            option.textContent = p.title;
            programPrefSelect.appendChild(option);
        });
    }

    // 2. Populate FAQ
    const faqAccordion = document.getElementById('faq-accordion');
    if (faqAccordion) {
        faqAccordion.innerHTML = faqData.map((item, index) => `
            <div class="accordion-item">
                <button class="accordion-header" aria-expanded="false">
                    ${item.q}
                    <i data-lucide="chevron-down"></i>
                </button>
                <div class="accordion-content">
                    <p>${item.a}</p>
                </div>
            </div>
        `).join('');
    }

    // Accordion Logic
    const accHeaders = document.querySelectorAll('.accordion-header');
    accHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const isOpen = content.style.maxHeight;
            
            // Close all other
            document.querySelectorAll('.accordion-content').forEach(c => { c.style.maxHeight = null; });
            document.querySelectorAll('.accordion-header i').forEach(icon => { icon.setAttribute('data-lucide', 'chevron-down'); });
            
            if (!isOpen) {
                content.style.maxHeight = content.scrollHeight + 'px';
                this.querySelector('i').setAttribute('data-lucide', 'chevron-up');
            }
            lucide.createIcons();
        });
    });

    // 3. Populate Testimonials
    const testContainer = document.getElementById('testimonial-carousel');
    const dotsContainer = document.querySelector('.carousel-dots');
    if (testContainer && dotsContainer) {
        testContainer.innerHTML = testimonialsData.map((t, idx) => `
            <div class="testimonial-item ${idx === 0 ? 'active' : ''}" data-index="${idx}">
                <i data-lucide="quote" class="quote-icon"></i>
                <p class="testimonial-text">"${t.text}"</p>
                <div class="testimonial-author">
                    <h4>${t.name}</h4>
                    <p>${t.role}</p>
                </div>
            </div>
        `).join('');

        dotsContainer.innerHTML = testimonialsData.map((_, idx) => `
            <div class="dot ${idx === 0 ? 'active' : ''}" data-index="${idx}"></div>
        `).join('');

        const dots = document.querySelectorAll('.dot');
        const items = document.querySelectorAll('.testimonial-item');
        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const idx = e.target.dataset.index;
                dots.forEach(d => d.classList.remove('active'));
                items.forEach(i => i.classList.remove('active'));
                e.target.classList.add('active');
                items[idx].classList.add('active');
            });
        });
    }

    // Timer logic simple mock
    setInterval(() => {
        const daysCount = document.getElementById('days-count');
        // static for demo, conceptually it could decrement
    }, 86400000);


    /* --- MULTI-STEP FORM LOGIC --- */
    let currentStep = 1;
    const totalSteps = 5;
    
    const form = document.getElementById('admission-form');
    const steps = document.querySelectorAll('.form-step');
    const stepIndicators = document.querySelectorAll('.stepper .step');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const submitBtn = document.getElementById('submit-btn');
    const saveBtn = document.getElementById('save-btn');
    const progressBar = document.getElementById('form-progress');
    const stepIndicatorText = document.getElementById('step-indicator');
    const stepTitleText = document.getElementById('step-title');

    const stepTitles = [
        "Personal Details",
        "Academic Background",
        "Program Selection",
        "Documents Upload",
        "Review & Submit"
    ];

    // Restore Draft from LocalStorage
    const draftData = JSON.parse(localStorage.getItem('eduApplyDraft'));
    if (draftData && Object.keys(draftData).length > 0) {
        Object.keys(draftData).forEach(key => {
            const field = form.elements[key];
            if (field) {
                if (field.type === 'checkbox') {
                    field.checked = draftData[key];
                } else {
                    field.value = draftData[key];
                }
            }
        });
    }

    function updateFormUI() {
        // Update Sections
        steps.forEach((step, index) => {
            if (index + 1 === currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        // Update Nav Stepper
        stepIndicators.forEach((ind, index) => {
            ind.classList.remove('active', 'completed');
            if (index + 1 === currentStep) {
                ind.classList.add('active');
            } else if (index + 1 < currentStep) {
                ind.classList.add('completed');
            }
        });

        // Update Headers & Progress
        stepIndicatorText.textContent = `Step ${currentStep} of ${totalSteps}`;
        stepTitleText.textContent = stepTitles[currentStep - 1];
        progressBar.style.width = `${(currentStep / totalSteps) * 100}%`;

        // Button States
        prevBtn.style.display = currentStep > 1 ? 'inline-flex' : 'none';
        
        if (currentStep === totalSteps) {
            nextBtn.style.display = 'none';
            saveBtn.style.display = 'none';
            submitBtn.style.display = 'inline-flex';
            generateSummary();
        } else {
            nextBtn.style.display = 'inline-flex';
            saveBtn.style.display = 'inline-flex';
            submitBtn.style.display = 'none';
        }
    }

    function validateStep(stepNum) {
        let isValid = true;
        const currentStepEl = document.getElementById(`step-${stepNum}`);
        const inputs = currentStepEl.querySelectorAll('input[required], select[required]');

        inputs.forEach(input => {
            const formGroup = input.closest('.form-group');
            const errorMsg = formGroup.querySelector('.error-msg');
            
            if (input.type === 'checkbox' && !input.checked) {
                formGroup.classList.add('error');
                if(errorMsg) errorMsg.textContent = 'You must agree to proceed.';
                isValid = false;
            } else if (!input.value.trim()) {
                formGroup.classList.add('error');
                if(errorMsg) errorMsg.textContent = 'This field is required.';
                isValid = false;
            } else if (input.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.value)) {
                formGroup.classList.add('error');
                if(errorMsg) errorMsg.textContent = 'Please enter a valid email.';
                isValid = false;
            } else {
                formGroup.classList.remove('error');
                if(errorMsg) errorMsg.textContent = '';
            }
        });
        return isValid;
    }

    function generateSummary() {
        const content = document.getElementById('summary-content');
        const fd = new FormData(form);
        const data = Object.fromEntries(fd.entries());
        
        // Find program title text instead of just ID
        const progSelect = document.getElementById('programPref');
        const targetProg = Array.from(progSelect.options).find(opt => opt.value === data.programPref);
        const progTitle = targetProg ? targetProg.textContent : 'Not Selected';

        content.innerHTML = `
            <div class="summary-item"><span class="summary-label">Name:</span> <span class="summary-value">${data.fullName || 'N/A'}</span></div>
            <div class="summary-item"><span class="summary-label">Email:</span> <span class="summary-value">${data.email || 'N/A'}</span></div>
            <div class="summary-item"><span class="summary-label">Phone:</span> <span class="summary-value">${data.phone || 'N/A'}</span></div>
            <div class="summary-item"><span class="summary-label">GPA/Percentage:</span> <span class="summary-value">${data.gpa || 'N/A'}</span></div>
            <div class="summary-item"><span class="summary-label">Program:</span> <span class="summary-value">${progTitle}</span></div>
            <div class="summary-item"><span class="summary-label">Start Term:</span> <span class="summary-value">${data.startTerm || 'N/A'}</span></div>
        `;
    }

    nextBtn.addEventListener('click', () => {
        if (validateStep(currentStep)) {
            currentStep++;
            updateFormUI();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateFormUI();
        }
    });

    saveBtn.addEventListener('click', () => {
        if(validateStep(currentStep)) {
            const fd = new FormData(form);
            const dataToSave = {};
            for (let [key, value] of fd.entries()) {
                if(typeof value === 'string') dataToSave[key] = value;
            }
            localStorage.setItem('eduApplyDraft', JSON.stringify(dataToSave));
            
            const originalText = saveBtn.innerHTML;
            saveBtn.innerHTML = '<i data-lucide="check"></i> Saved';
            lucide.createIcons();
            setTimeout(() => { saveBtn.innerHTML = originalText; }, 2000);
        }
    });

    // File Upload handling visualization
    const fileInputs = document.querySelectorAll('.file-input');
    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            const box = this.closest('.upload-box');
            if (this.files && this.files[0]) {
                box.classList.add('has-file');
                box.querySelector('span').textContent = this.files[0].name;
            } else {
                box.classList.remove('has-file');
                box.querySelector('span').textContent = box.dataset.for === 'doc-photo' ? 'Passport Photo' : 'Upload Document'; // Simplistic reset
            }
        });
    });

    // Form Submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (validateStep(currentStep)) {
            // "Submit" sequence
            const btnOrigText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Processing...';
            submitBtn.disabled = true;

            setTimeout(() => {
                // Clear draft
                localStorage.removeItem('eduApplyDraft');
                
                // Show modal
                document.getElementById('display-app-id').textContent = 'CWU-2025-' + Math.floor(1000 + Math.random() * 9000);
                document.getElementById('success-modal').classList.add('active');
                
                // Confetti animation
                fireConfetti();
                
                // Reset form state under the modal
                form.reset();
                submitBtn.innerHTML = btnOrigText;
                submitBtn.disabled = false;
                currentStep = 1;
                updateFormUI();
                document.querySelectorAll('.upload-box').forEach(box => {
                    box.classList.remove('has-file');
                });
            }, 1000);
        }
    });

    // Modal Close
    const closeModalBtn = document.getElementById('close-modal');
    closeModalBtn.addEventListener('click', () => {
        document.getElementById('success-modal').classList.remove('active');
        document.getElementById('confetti-container').style.display = 'none';
        document.getElementById('confetti-container').innerHTML = '';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Basic Confetti implementation
    function fireConfetti() {
        const container = document.getElementById('confetti-container');
        container.style.display = 'block';
        const colors = ['#D4AF37', '#0A192F', '#FFFFFF', '#52C41A', '#FF4D4F'];
        
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            // Random animation
            const delay = Math.random() * 2 + 's';
            const duration = Math.random() * 2 + 3 + 's';
            
            confetti.animate([
                { transform: `translate3d(0, -10px, 0) rotate(0deg)`, opacity: 1 },
                { transform: `translate3d(${Math.random()*100 - 50}px, 100vh, 0) rotate(${Math.random()*360}deg)`, opacity: 0 }
            ], {
                duration: parseFloat(duration) * 1000,
                delay: parseFloat(delay) * 1000,
                iterations: Infinity
            });
            
            container.appendChild(confetti);
        }
    }

    // Input error clearing on interaction
    document.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('input', function() {
            const fg = this.closest('.form-group');
            if (fg) {
                fg.classList.remove('error');
                const msg = fg.querySelector('.error-msg');
                if (msg) msg.textContent = '';
            }
        });
    });
});
