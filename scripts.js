// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Navigation elements
    const reportTab = document.getElementById('report-tab');
    const viewTab = document.getElementById('view-tab');
    const galleryTab = document.getElementById('gallery-tab');
    const reportContainer = document.getElementById('report-container');
    const issuesContainer = document.getElementById('issues-container');
    const galleryContainer = document.getElementById('gallery-container');
    
    // Form elements
    const issueForm = document.getElementById('issue-form');
    const issueTitle = document.getElementById('issue-title');
    const issueLocation = document.getElementById('issue-location');
    const issueType = document.getElementById('issue-type');
    const issueDescription = document.getElementById('issue-description');
    const reporterEmail = document.getElementById('reporter-email');
    const reporterPassword = document.getElementById('reporter-password');
    const submitBtn = document.getElementById('submit-btn');
    const clearBtn = document.getElementById('clear-btn');
    
    // Validation elements
    const titleValidation = document.getElementById('title-validation');
    const locationValidation = document.getElementById('location-validation');
    const typeValidation = document.getElementById('type-validation');
    const emailValidation = document.getElementById('email-validation');
    const passwordValidation = document.getElementById('password-validation');
    const descriptionValidation = document.getElementById('description-validation');
    
    // Display elements
    const issuesList = document.getElementById('issues-list');
    const searchIssues = document.getElementById('search-issues');
    const filterType = document.getElementById('filter-type');
    const statusMessage = document.getElementById('status-message');
    const keyDisplay = document.getElementById('key-display');
    
    // Interactive elements
    const secretBtn = document.getElementById('secret-btn');
    const themeToggle = document.getElementById('theme-toggle');
    const longPressElement = document.getElementById('long-press');
    
    // Gallery elements
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const slides = document.querySelectorAll('.slideshow-slide');
    const dots = document.querySelectorAll('.dot');
    
    // Modal elements
    const modal = document.getElementById('modal');
    const closeModal = document.querySelector('.close-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    // Accordion elements
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    // Variables
    let issues = JSON.parse(localStorage.getItem('environmentalIssues')) || [];
    const statusMessages = [
        "Report environmental issues in your community",
        "Together we can make a difference",
        "Help protect our environment",
        "Every report matters in environmental conservation"
    ];
    let currentMessageIndex = 0;
    let currentSlide = 0;
    let longPressTimer;
    let doubleClickTimer;
    let isDoubleClicked = false;
    
    // Initialize the app
    function init() {
        renderIssues();
        startStatusRotation();
        initializeAccordion();
        
        // Check if dark mode was previously enabled
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
        }
    }
    
    // ===== EVENT HANDLING =====
    
    // 1. Button clicks
    reportTab.addEventListener('click', () => switchTab('report'));
    viewTab.addEventListener('click', () => switchTab('view'));
    galleryTab.addEventListener('click', () => switchTab('gallery'));
    clearBtn.addEventListener('click', clearForm);
    themeToggle.addEventListener('click', toggleTheme);
    
    // Gallery controls
    prevBtn.addEventListener('click', () => changeSlide(-1));
    nextBtn.addEventListener('click', () => changeSlide(1));
    
    // 2. Hover effects
    const buttons = document.querySelectorAll('button:not(.delete-issue)');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', (e) => {
            e.target.style.transform = 'translateY(-3px)';
        });
        
        button.addEventListener('mouseleave', (e) => {
            e.target.style.transform = '';
        });
    });
    
    // 3. Keypress detection
    document.addEventListener('keydown', (e) => {
        keyDisplay.textContent = e.key;
        keyDisplay.style.color = getRandomColor();
        
        // Navigation with arrow keys
        if (e.key === 'ArrowLeft') {
            if (galleryContainer.classList.contains('hidden') === false) {
                changeSlide(-1);
            }
        } else if (e.key === 'ArrowRight') {
            if (galleryContainer.classList.contains('hidden') === false) {
                changeSlide(1);
            }
        }
        
        // Easter egg: Konami code check (just the first key 'ArrowUp')
        if (e.key === 'ArrowUp') {
            document.body.style.animation = 'shake 0.5s';
            setTimeout(() => {
                document.body.style.animation = '';
            }, 500);
        }
    });
    
    // 4. Secret action for double-click
    secretBtn.addEventListener('dblclick', (e) => {
        clearTimeout(doubleClickTimer);
        isDoubleClicked = true;
        secretBtn.classList.add('active');
        secretBtn.textContent = "🎉 You found the secret! 🎉";
        
        // Show a confetti effect
        for (let i = 0; i < 20; i++) {
            createConfetti();
        }
        
        setTimeout(() => {
            secretBtn.classList.remove('active');
            secretBtn.textContent = "Click me twice for a surprise!";
        }, 5000);
    });
    
    secretBtn.addEventListener('click', () => {
        if (!isDoubleClicked) {
            doubleClickTimer = setTimeout(() => {
                isDoubleClicked = false;
            }, 300);
        }
    });
    
    // 5. Long press
    longPressElement.addEventListener('mousedown', (e) => {
        longPressTimer = setTimeout(() => {
            longPressElement.classList.add('activated');
            longPressElement.textContent = "Activated!";
            
            showModal('Secret Feature Unlocked!', 'You have activated the environment sensor. This would connect to local environmental monitoring systems in a real application.');
            
            setTimeout(() => {
                longPressElement.classList.remove('activated');
                longPressElement.textContent = "Press and hold for 2 seconds";
            }, 5000);
        }, 2000);
    });
    
    longPressElement.addEventListener('mouseup', () => {
        clearTimeout(longPressTimer);
    });
    
    longPressElement.addEventListener('mouseleave', () => {
        clearTimeout(longPressTimer);
    });
    
    // Close modal
    closeModal.addEventListener('click', closeModalFunc);
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModalFunc();
        }
    });
    
    // ===== INTERACTIVE ELEMENTS =====
    
    // Tab switching
    function switchTab(tab) {
        // Reset active classes
        reportTab.classList.remove('active');
        viewTab.classList.remove('active');
        galleryTab.classList.remove('active');
        
        // Hide all containers
        reportContainer.classList.add('hidden');
        issuesContainer.classList.add('hidden');
        galleryContainer.classList.add('hidden');
        
        // Set active tab and show relevant container
        if (tab === 'report') {
            reportTab.classList.add('active');
            reportContainer.classList.remove('hidden');
        } else if (tab === 'view') {
            viewTab.classList.add('active');
            issuesContainer.classList.remove('hidden');
        } else if (tab === 'gallery') {
            galleryTab.classList.add('active');
            galleryContainer.classList.remove('hidden');
        }
    }
    
    // Image gallery/slideshow
    function changeSlide(direction) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        
        currentSlide = (currentSlide + direction + slides.length) % slides.length;
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }
    
    // Initialize dots for slideshow
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const slideIndex = parseInt(dot.getAttribute('data-slide'));
            
            slides[currentSlide].classList.remove('active');
            dots[currentSlide].classList.remove('active');
            
            currentSlide = slideIndex;
            
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        });
    });
    
    // Accordion functionality
    function initializeAccordion() {
        accordionHeaders.forEach(header => {
            header.addEventListener('click', () => {
                // Toggle active class on the header
                header.classList.toggle('active');
                
                // Toggle show class on the content
                const content = header.nextElementSibling;
                content.classList.toggle('show');
            });
        });
    }
    
    // Modal functions
    function showModal(title, content) {
        modalTitle.textContent = title;
        modalBody.textContent = content;
        modal.classList.add('show');
    }
    
    function closeModalFunc() {
        modal.classList.remove('show');
    }
    
    // ===== FORM VALIDATION =====
    
    // Validate form fields in real-time
    issueTitle.addEventListener('input', () => validateField(issueTitle, titleValidation, 'Please enter a title (at least 5 characters)', value => value.length >= 5));
    
    issueLocation.addEventListener('input', () => validateField(issueLocation, locationValidation, 'Please enter a valid location (at least 5 characters)', value => value.length >= 5));
    
    issueType.addEventListener('change', () => validateField(issueType, typeValidation, 'Please select an issue type', value => value !== ''));
    
    reporterEmail.addEventListener('input', () => validateField(reporterEmail, emailValidation, 'Please enter a valid email address', value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)));
    
    reporterPassword.addEventListener('input', () => {
        const value = reporterPassword.value;
        const isValid = value.length >= 8;
        
        if (!isValid) {
            reporterPassword.classList.add('invalid');
            reporterPassword.classList.remove('valid');
            passwordValidation.textContent = 'Password must be at least 8 characters';
        } else {
            reporterPassword.classList.remove('invalid');
            reporterPassword.classList.add('valid');
            passwordValidation.textContent = 'Password is valid';
            
            // Add strength indicator
            if (value.length >= 12 && /[A-Z]/.test(value) && /[0-9]/.test(value) && /[^A-Za-z0-9]/.test(value)) {
                passwordValidation.textContent = 'Strong password';
                passwordValidation.style.color = '#4caf50';
            } else if (value.length >= 8) {
                passwordValidation.textContent = 'Moderate password';
                passwordValidation.style.color = '#ff9800';
            }
        }
    });
    
    issueDescription.addEventListener('input', () => validateField(issueDescription, descriptionValidation, 'Please provide a description (at least 20 characters)', value => value.length >= 20));
    
    // Generic field validation function
    function validateField(field, validationElement, errorMessage, validationFunction) {
        const value = field.value.trim();
        const isValid = validationFunction(value);
        
        if (!isValid) {
            field.classList.add('invalid');
            field.classList.remove('valid');
            validationElement.textContent = errorMessage;
        } else {
            field.classList.remove('invalid');
            field.classList.add('valid');
            validationElement.textContent = '';
        }
        
        return isValid;
    }
    
    // Form submission with validation
    issueForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Validate all fields
        const isTitleValid = validateField(issueTitle, titleValidation, 'Please enter a title (at least 5 characters)', value => value.length >= 5);
        const isLocationValid = validateField(issueLocation, locationValidation, 'Please enter a valid location (at least 5 characters)', value => value.length >= 5);
        const isTypeValid = validateField(issueType, typeValidation, 'Please select an issue type', value => value !== '');
        const isEmailValid = validateField(reporterEmail, emailValidation, 'Please enter a valid email address', value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
        const isPasswordValid = validateField(reporterPassword, passwordValidation, 'Password must be at least 8 characters', value => value.length >= 8);
        const isDescriptionValid = validateField(issueDescription, descriptionValidation, 'Please provide a description (at least 20 characters)', value => value.length >= 20);
        
        // If all fields are valid, submit the form
        if (isTitleValid && isLocationValid && isTypeValid && isEmailValid && isPasswordValid && isDescriptionValid) {
            handleFormSubmit();
        } else {
            // Shake the form to indicate validation errors
            issueForm.style.animation = 'shake 0.5s';
            setTimeout(() => {
                issueForm.style.animation = '';
            }, 500);
        }
    });
    
    // Form submission handler
    function handleFormSubmit() {
        // Create new issue object
        const newIssue = {
            title: issueTitle.value,
            location: issueLocation.value,
            type: issueType.value,
            email: reporterEmail.value,
            description: issueDescription.value,
            date: new Date().toLocaleString()
        };
        
        // Add to issues array
        issues.unshift(newIssue);
        
        // Save to localStorage
        localStorage.setItem('environmentalIssues', JSON.stringify(issues));
        
        // Clear form
        issueForm.reset();
        
        // Clear validation styles
        const formInputs = issueForm.querySelectorAll('input, select, textarea');
        formInputs.forEach(input => {
            input.classList.remove('valid', 'invalid');
        });
        
        // Clear validation messages
        const validationMessages = issueForm.querySelectorAll('.validation-message');
        validationMessages.forEach(message => {
            message.textContent = '';
        });
        
        // Show confirmation message
        showConfirmation();
        
        // Switch to view tab and re-render issues list
        switchTab('view');
        renderIssues();
    }
    
    // ===== DISPLAY FUNCTIONS =====
    
    // Rotate status messages every 5 seconds
    function startStatusRotation() {
        setInterval(() => {
            currentMessageIndex = (currentMessageIndex + 1) % statusMessages.length;
            // DOM Manipulation: Changing text content dynamically
            statusMessage.textContent = statusMessages[currentMessageIndex];
        }, 5000);
    }
    
    // Show confirmation message after submission
    function showConfirmation() {
        showModal('Issue Reported', 'Thank you for reporting this environmental issue! Your contribution helps make our environment cleaner and safer.');
    }
    
    // Render all reported issues
    function renderIssues() {
        if (issues.length === 0) {
            issuesList.innerHTML = '<p class="no-issues">No issues reported yet. Be the first to report!</p>';
            return;
        }
        
        issuesList.innerHTML = '';
        
        issues.forEach((issue, index) => {
            // DOM Manipulation: Adding elements
            const issueCard = document.createElement('div');
            issueCard.className = 'issue-card';
            
            issueCard.innerHTML = `
                <h3>${issue.title}</h3>
                <p class="location"><strong>Location:</strong> ${issue.location}</p>
                <p>${issue.description}</p>
                <span class="type">${issue.type}</span>
                <p class="date"><small>Reported on: ${issue.date}</small></p>
                <button class="delete-issue" data-index="${index}">Delete</button>
            `;
            
            issuesList.appendChild(issueCard);
        });
        
        // Add event listeners to delete buttons
        document.querySelectorAll('.delete-issue').forEach(button => {
            button.addEventListener('click', deleteIssue);
        });
    }
    
    // Delete an issue
    function deleteIssue(e) {
        const index = parseInt(e.target.getAttribute('data-index'));
        
        // DOM Manipulation: Removing elements
        const issueCard = e.target.parentElement;
        issueCard.style.backgroundColor = '#ffcdd2';
        issueCard.style.opacity = '0.7';
        
        setTimeout(() => {
            // Remove from array
            issues.splice(index, 1);
            
            // Save to localStorage
            localStorage.setItem('environmentalIssues', JSON.stringify(issues));
            
            // Re-render issues list
            renderIssues();
        }, 300);
    }
    
    // Filter issues by search and type
    searchIssues.addEventListener('input', filterIssuesList);
    filterType.addEventListener('change', filterIssuesList);
    
    function filterIssuesList() {
        const searchTerm = searchIssues.value.toLowerCase();
        const typeFilter = filterType.value;
        
        const filteredIssues = issues.filter(issue => {
            const matchesSearch = issue.title.toLowerCase().includes(searchTerm) || 
                                issue.description.toLowerCase().includes(searchTerm) ||
                                issue.location.toLowerCase().includes(searchTerm);
            
            const matchesType = typeFilter === '' || issue.type === typeFilter;
            
            return matchesSearch && matchesType;
        });
        
        // Render filtered issues
        if (filteredIssues.length === 0) {
            issuesList.innerHTML = '<p class="no-issues">No matching issues found.</p>';
            return;
        }
        
        issuesList.innerHTML = '';
        
        filteredIssues.forEach((issue, index) => {
            const originalIndex = issues.findIndex(i => i === issue);
            
            const issueCard = document.createElement('div');
            issueCard.className = 'issue-card';
            
            issueCard.innerHTML = `
                <h3>${issue.title}</h3>
                <p class="location"><strong>Location:</strong> ${issue.location}</p>
                <p>${issue.description}</p>
                <span class="type">${issue.type}</span>
                <p class="date"><small>Reported on: ${issue.date}</small></p>
                <button class="delete-issue" data-index="${originalIndex}">Delete</button>
            `;
            
            issuesList.appendChild(issueCard);
        });
        
        // Add event listeners to delete buttons
        document.querySelectorAll('.delete-issue').forEach(button => {
            button.addEventListener('click', deleteIssue);
        });
    }
    
    // Clear form fields
    function clearForm() {
        issueForm.reset();
        
        // Clear validation styles
        const formInputs = issueForm.querySelectorAll('input, select, textarea');
        formInputs.forEach(input => {
            input.classList.remove('valid', 'invalid');
        });
        
        // Clear validation messages
        const validationMessages = issueForm.querySelectorAll('.validation-message');
        validationMessages.forEach(message => {
            message.textContent = '';
        });
        
        // DOM Manipulation: Changing styles
        const formGroups = document.querySelectorAll('.form-group');
        
        formGroups.forEach(group => {
            group.style.backgroundColor = '#fffde7';
            
            setTimeout(() => {
                group.style.backgroundColor = '';
            }, 300);
        });
    }
    
    // Toggle dark/light mode
    function toggleTheme() {
        document.body.classList.toggle('dark-mode');
        
        // Save preference
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    }
    
    // ===== UTILITY FUNCTIONS =====
    
    // Create confetti element
    function createConfetti() {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = getRandomColor();
        confetti.style.borderRadius = '50%';
        confetti.style.zIndex = '9999';
        
        // Random starting position near the secret button
        const secretRect = secretBtn.getBoundingClientRect();
        const startX = secretRect.left + secretRect.width / 2;
        const startY = secretRect.top;
        
        confetti.style.left = `${startX}px`;
        confetti.style.top = `${startY}px`;
        
        document.body.appendChild(confetti);
        
        // Animate confetti
        const animationDuration = Math.random() * 3000 + 2000; // 2-5 seconds
        const endX = startX + (Math.random() * 200 - 100);
        const endY = startY - Math.random() * 200;
        
        confetti.animate(
            [
                { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
                { transform: `translate(${endX - startX}px, ${endY - startY}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
            ],
            {
                duration: animationDuration,
                easing: 'cubic-bezier(0.215, 0.610, 0.355, 1.000)'
            }
        );
        
        setTimeout(() => {
            document.body.removeChild(confetti);
        }, animationDuration);
    }
    
    // Generate random color
    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    
    // Initialize the app
    init();
});