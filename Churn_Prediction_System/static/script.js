// JavaScript for enhanced interactivity and user experience

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    setupAutoCalculation();
    setupFormValidation();
    setupFormSubmission();
    calculateTotalCharges();
}

function calculateTotalCharges() {
    const tenure = parseFloat(document.getElementById('tenure').value) || 0;
    const monthlyCharges = parseFloat(document.getElementById('MonthlyCharges').value) || 0;
    const totalCharges = tenure * monthlyCharges;

    const totalChargesInput = document.getElementById('TotalCharges');
    const totalChargesDisplay = document.getElementById('totalChargesDisplay');

    if (totalChargesInput) {
        totalChargesInput.value = totalCharges.toFixed(2);
    }

    if (totalChargesDisplay) {
        totalChargesDisplay.textContent = `Total Charges: $${totalCharges.toFixed(2)}`;
    }
}

function setupAutoCalculation() {
    const tenureInput = document.getElementById('tenure');
    const monthlyChargesInput = document.getElementById('MonthlyCharges');

    if (tenureInput) tenureInput.addEventListener('input', calculateTotalCharges);
    if (monthlyChargesInput) monthlyChargesInput.addEventListener('input', calculateTotalCharges);
}

function setupFormValidation() {
    const form = document.getElementById('churnForm');
    const inputs = form.querySelectorAll('input[required], select[required]');

    inputs.forEach(input => {
        input.addEventListener('invalid', function () {
            this.style.borderColor = '#ff6b6b';
            this.style.backgroundColor = '#ffebee';
        });

        input.addEventListener('input', function () {
            if (this.validity.valid) {
                this.style.borderColor = '#51cf66';
                this.style.backgroundColor = '#f8f9fa';
            } else {
                this.style.borderColor = '#ff6b6b';
                this.style.backgroundColor = '#ffebee';
            }
        });
    });
}

function setupFormSubmission() {
    const form = document.getElementById('churnForm');
    const loading = document.getElementById('loading');
    const resultDiv = document.getElementById('predictionResult');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (loading) loading.style.display = 'block';
        if (resultDiv) resultDiv.style.display = 'none';

        const formData = new FormData(form);

        fetch('/predict', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (loading) loading.style.display = 'none';
            showPredictionResult(data.prediction);
        })
        .catch(error => {
            if (loading) loading.style.display = 'none';
            alert('Error during prediction. Please try again.');
            console.error('Prediction error:', error);
        });
    });
}

function showPredictionResult(prediction) {
    const resultDiv = document.getElementById('predictionResult');

    if (!resultDiv) return;

    resultDiv.className = 'prediction-result';

    if (prediction === 'Churn') {
        resultDiv.classList.add('churn');
        resultDiv.innerHTML = '<span class="icon">⚠️</span>High Risk: Customer likely to churn';
    } else {
        resultDiv.classList.add('no-churn');
        resultDiv.innerHTML = '<span class="icon">✅</span>Low Risk: Customer likely to stay';
    }

    resultDiv.style.display = 'block';
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
