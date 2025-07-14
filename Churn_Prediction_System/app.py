from flask import Flask, render_template, request
import pickle
import numpy as np

app = Flask(__name__)

# Load model and encoders
with open('customer_churn_model.pkl', 'rb') as f:
    model_data = pickle.load(f)
    model = model_data['model']  # Extract actual model from dict

with open('encoders.pkl', 'rb') as f:
    encoders = pickle.load(f)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.form

    # Collect inputs
    input_data = {
        'gender': data['gender'],
        'SeniorCitizen': int(data['SeniorCitizen']),
        'Partner': data['Partner'],
        'Dependents': data['Dependents'],
        'tenure': int(data['tenure']),
        'PhoneService': data['PhoneService'],
        'MultipleLines': data['MultipleLines'],
        'InternetService': data['InternetService'],
        'OnlineSecurity': data['OnlineSecurity'],
        'OnlineBackup': data['OnlineBackup'],
        'DeviceProtection': data['DeviceProtection'],
        'TechSupport': data['TechSupport'],
        'StreamingTV': data['StreamingTV'],
        'StreamingMovies': data['StreamingMovies'],
        'Contract': data['Contract'],
        'PaperlessBilling': data['PaperlessBilling'],
        'PaymentMethod': data['PaymentMethod'],
        'MonthlyCharges': float(data['MonthlyCharges']),
        'TotalCharges': float(data['TotalCharges']),
    }

    # Apply encoders
    for col in encoders:
        if col in input_data:
            input_data[col] = encoders[col].transform([input_data[col]])[0]

    # Final feature order
    feature_order = [
        'gender', 'SeniorCitizen', 'Partner', 'Dependents', 'tenure',
        'PhoneService', 'MultipleLines', 'InternetService', 'OnlineSecurity',
        'OnlineBackup', 'DeviceProtection', 'TechSupport', 'StreamingTV',
        'StreamingMovies', 'Contract', 'PaperlessBilling', 'PaymentMethod',
        'MonthlyCharges', 'TotalCharges'
    ]

    final_input = np.array([[input_data[col] for col in feature_order]])

    prediction = model.predict(final_input)[0]
    result = "likely to CHURN ❌" if prediction == 1 else "NOT likely to churn ✅"

    return render_template('index.html', prediction_text=f"The customer is {result}")

if __name__ == '__main__':
    app.run(debug=True)
