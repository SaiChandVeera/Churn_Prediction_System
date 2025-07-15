// DOM Elements
const form = document.getElementById('churnForm');
const tenureInput = document.getElementById('tenure');
const monthlyChargesInput = document.getElementById('MonthlyCharges');
const totalChargesInput = document.getElementById('TotalCharges');
const totalChargesDisplay = document.getElementById('totalChargesDisplay');
const loadingDiv = document.getElementById('loading');
const predictionResultDiv = document.getElementById('predictionResult');
const submitBtn = document.querySelector('.submit-btn');
const navLinks = document.querySelectorAll('.nav-link');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    setupFormValidation();
    setupNavigation();
    setupScrollEffects();
    calculateTotalCharges();
}

// Event Listeners
function setupEventListeners() {
    // Form submission
    form.addEventListener('submit', handleFormSubmission);
    
    // Auto-calculation listeners
    tenureInput.addEventListener('input', calculateTotalCharges);
    monthlyChargesInput.addEventListener('input', calculateTotalCharges);
    
    // Navigation toggle for mobile
    const navToggle = document.querySelector('.nav-toggle');
    navToggle.addEventListener('click', toggleMobileNav);
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavClick);
    });
}

// Navigation Functions
function setupNavigation() {
    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

function handleNavClick(e) {
    e.preventDefault();
    const targetId = e.target.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
        targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
    
    // Update active state
    navLinks.forEach(link => link.classList.remove('active'));
    e.target.classList.add('active');
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            const activeLink = document.querySelector(`a[href="#${sectionId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
}

function toggleMobileNav() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// Scroll Effects
function setupScrollEffects() {
    // Navbar background on scroll
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    });
    
    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            heroSection.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
}

// Form Functions
function calculateTotalCharges() {
    const tenure = parseFloat(tenureInput.value) || 0;
    const monthlyCharges = parseFloat(monthlyChargesInput.value) || 0;
    const totalCharges = tenure * monthlyCharges;
    
    totalChargesInput.value = totalCharges.toFixed(2);
    totalChargesDisplay.textContent = `Total Charges: $${totalCharges.toFixed(2)}`;
    
    // Add animation to the display
    totalChargesDisplay.style.transform = 'scale(1.05)';
    setTimeout(() => {
        totalChargesDisplay.style.transform = 'scale(1)';
    }, 200);
}

function setupFormValidation() {
    const inputs = form.querySelectorAll('input[required], select[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    if (!value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    // Specific validations
    if (field.type === 'number') {
        const numValue = parseFloat(value);
        if (isNaN(numValue) || numValue < 0) {
            showFieldError(field, 'Please enter a valid positive number');
            return false;
        }
    }
    
    clearFieldError(field);
    return true;
}

function showFieldError(field, message) {
    field.style.borderColor = '#ff6b6b';
    field.style.backgroundColor = '#ffebee';
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#ff6b6b';
    errorDiv.style.fontSize = '0.8rem';
    errorDiv.style.marginTop = '0.5rem';
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.style.borderColor = '';
    field.style.backgroundColor = '';
    
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function handleFormSubmission(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    showLoading();
    
    // Simulate API call
    setTimeout(() => {
        const formData = new FormData(form);
        const prediction = generatePrediction(formData);
        showPredictionResult(prediction);
        hideLoading();
    }, 2500);
}

function validateForm() {
    const inputs = form.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField({ target: input })) {
            isValid = false;
        }
    });
    
    return isValid;
}

function showLoading() {
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    loadingDiv.style.display = 'block';
    predictionResultDiv.style.display = 'none';
    
    // Smooth scroll to results section
    setTimeout(() => {
        document.getElementById('predictor').scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }, 500);
}

function hideLoading() {
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
    loadingDiv.style.display = 'none';
}

function generatePrediction(formData) {
    // Extract form data
    const data = {};
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    // Simple prediction logic (replace with actual ML model)
    let churnScore = 0;
    
    // Age factor
    if (data.SeniorCitizen === '1') churnScore += 15;
    
    // Contract factor
    if (data.Contract === 'Month-to-month') churnScore += 30;
    else if (data.Contract === 'One year') churnScore += 10;
    
    // Service factors
    if (data.InternetService === 'Fiber optic') churnScore += 20;
    if (data.OnlineSecurity === 'No') churnScore += 10;
    if (data.TechSupport === 'No') churnScore += 10;
    
    // Billing factors
    if (data.PaperlessBilling === 'Yes') churnScore += 5;
    if (data.PaymentMethod === 'Electronic check') churnScore += 20;
    
    // Tenure factor
    const tenure = parseInt(data.tenure);
    if (tenure < 12) churnScore += 25;
    else if (tenure < 24) churnScore += 15;
    else if (tenure > 48) churnScore -= 15;
    
    // Monthly charges factor
    const monthlyCharges = parseFloat(data.MonthlyCharges);
    if (monthlyCharges > 80) churnScore += 15;
    else if (monthlyCharges < 30) churnScore -= 10;
    
    // Family factors
    if (data.Partner === 'Yes') churnScore -= 10;
    if (data.Dependents === 'Yes') churnScore -= 15;
    
    // Cap the score
    churnScore = Math.max(0, Math.min(100, churnScore));
    
    const isChurn = churnScore > 50;
    const confidence = isChurn ? churnScore : 100 - churnScore;
    
    return {
        isChurn,
        confidence,
        churnScore,
        recommendations: generateRecommendations(data, isChurn)
    };
}

function generateRecommendations(data, isChurn) {
    const recommendations = [];
    
    if (isChurn) {
        recommendations.push("Consider offering a loyalty discount or upgrade incentive");
        recommendations.push("Proactive customer service outreach recommended");
        
        if (data.Contract === 'Month-to-month') {
            recommendations.push("Encourage longer-term contract with benefits");
        }
        
        if (data.OnlineSecurity === 'No') {
            recommendations.push("Offer security services to increase value");
        }
        
        if (data.TechSupport === 'No') {
            recommendations.push("Provide complimentary tech support");
        }
        
        if (data.PaymentMethod === 'Electronic check') {
            recommendations.push("Incentivize automatic payment methods");
        }
    } else {
        recommendations.push("Customer shows strong retention indicators");
        recommendations.push("Consider upselling additional services");
        recommendations.push("Maintain current service quality");
        
        if (parseInt(data.tenure) > 36) {
            recommendations.push("Eligible for loyalty rewards program");
        }
    }
    
    return recommendations;
}

function showPredictionResult(prediction) {
    const { isChurn, confidence, recommendations } = prediction;
    
    predictionResultDiv.className = `prediction-result ${isChurn ? 'churn' : 'no-churn'}`;
    
    const resultHTML = `
        <div class="result-icon">
            ${isChurn ? '⚠️' : '✅'}
        </div>
        <div class="result-title">
            ${isChurn ? 'High Churn Risk' : 'Low Churn Risk'}
        </div>
        <div class="result-subtitle">
            ${isChurn ? 'Customer is likely to churn' : 'Customer is likely to stay'}
        </div>
        <div class="result-confidence">
            <div class="confidence-label">Confidence Level</div>
            <div class="confidence-bar">
                <div class="confidence-fill ${isChurn ? 'danger' : ''}" style="width: ${confidence}%"></div>
            </div>
            <div class="confidence-percentage">${confidence.toFixed(1)}%</div>
        </div>
        <div class="result-recommendations">
            <h4>Recommendations</h4>
            <ul>
                ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
        </div>
    `;
    
    predictionResultDiv.innerHTML = resultHTML;
    predictionResultDiv.style.display = 'block';
    
    // Animate confidence bar
    setTimeout(() => {
        const confidenceFill = predictionResultDiv.querySelector('.confidence-fill');
        confidenceFill.style.width = `${confidence}%`;
    }, 500);
}

// Utility Functions
function scrollToPredictor() {
    document.getElementById('predictor').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Animation utilities
function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });
    
    const animatedElements = document.querySelectorAll('.feature-card, .form-group');
    animatedElements.forEach(el => observer.observe(el));
}

// Initialize animations
document.addEventListener('DOMContentLoaded', observeElements);

// Particle animation for background
function createParticles() {
    const particlesContainer = document.querySelector('.background-animation');
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.position = 'absolute';
        particle.style.width = '2px';
        particle.style.height = '2px';
        particle.style.background = 'rgba(255, 255, 255, 0.3)';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `float ${3 + Math.random() * 4}s ease-in-out infinite`;
        particle.style.animationDelay = Math.random() * 5 + 's';
        
        particlesContainer.appendChild(particle);
    }
}

// Initialize particles
document.addEventListener('DOMContentLoaded', createParticles);

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Debounced scroll handler
const debouncedScrollHandler = debounce(updateActiveNavLink, 100);
window.addEventListener('scroll', debouncedScrollHandler);

// Error handling
window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
    // You could show a user-friendly error message here
});

// Service Worker registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
