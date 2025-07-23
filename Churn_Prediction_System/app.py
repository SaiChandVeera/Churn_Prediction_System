from flask import Flask, render_template, request, jsonify
import pickle
import numpy as np
import cohere
import os
import smtplib
from dotenv import load_dotenv, find_dotenv
from email.message import EmailMessage

# Load environment variables
dotenv_path = find_dotenv()
load_dotenv(dotenv_path)

COHERE_API_KEY = os.getenv("COHERE_API_KEY")
EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")

print("✅ EMAIL_ADDRESS:", EMAIL_ADDRESS)
print("✅ EMAIL_PASSWORD exists:", EMAIL_PASSWORD is not None)
print("✅ COHERE_API_KEY exists:", COHERE_API_KEY is not None)

# Initialize Cohere client
co = cohere.Client(COHERE_API_KEY)

# Load model and encoders
try:
    with open('customer_churn_model.pkl', 'rb') as f:
        model_data = pickle.load(f)
        model = model_data['model']
        print("✅ Model loaded from dictionary")
        print(f"Model classes: {model.classes_}")
except Exception as e:
    print("❌ Error loading model:", e)
    model = None

try:
    with open('encoders.pkl', 'rb') as f:
        encoders = pickle.load(f)
        print("✅ Encoders loaded")
        for col, encoder in encoders.items():
            print(f"Encoder '{col}': classes {encoder.classes_}")
except Exception as e:
    print("❌ Error loading encoders:", e)
    encoders = {}

app = Flask(__name__)

def convert_numpy_types(obj):
    """Convert numpy types to native Python types for JSON serialization"""
    if isinstance(obj, (np.integer, np.floating)):
        return int(obj) if isinstance(obj, np.integer) else float(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, dict):
        return {k: convert_numpy_types(v) for k, v in obj.items()}
    elif isinstance(obj, (list, tuple)):
        return [convert_numpy_types(item) for item in obj]
    return obj

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Get data with fallback to form data if JSON fails
        if request.content_type == 'application/json':
            data = request.get_json()
        else:
            data = request.form.to_dict()
        
        print("RAW INPUT DATA:", data)

        if not data:
            return jsonify({"error": "No input received"}), 400

        # Extract customer email - ensure it's properly formatted
        customer_email = data.get("email", "").strip()
        if not customer_email:
            return jsonify({"error": "Email address is required"}), 400

        # Prepare input features with type conversion and defaults
        input_data = {
            'gender': str(data.get('gender', '')),
            'SeniorCitizen': int(data.get('SeniorCitizen', 0)),
            'Partner': str(data.get('Partner', '')),
            'Dependents': str(data.get('Dependents', '')),
            'tenure': int(data.get('tenure', 0)),
            'PhoneService': str(data.get('PhoneService', '')),
            'MultipleLines': str(data.get('MultipleLines', '')),
            'InternetService': str(data.get('InternetService', '')),
            'OnlineSecurity': str(data.get('OnlineSecurity', '')),
            'OnlineBackup': str(data.get('OnlineBackup', '')),
            'DeviceProtection': str(data.get('DeviceProtection', '')),
            'TechSupport': str(data.get('TechSupport', '')),
            'StreamingTV': str(data.get('StreamingTV', '')),
            'StreamingMovies': str(data.get('StreamingMovies', '')),
            'Contract': str(data.get('Contract', '')),
            'PaperlessBilling': str(data.get('PaperlessBilling', '')),
            'PaymentMethod': str(data.get('PaymentMethod', '')),
            'MonthlyCharges': float(data.get('MonthlyCharges', 0)),
            'TotalCharges': float(data.get('TotalCharges', 0)),
        }

        print("PROCESSED INPUT DATA BEFORE ENCODING:", input_data)

        # Apply encoders with validation
        for col in encoders:
            if col in input_data:
                try:
                    input_data[col] = encoders[col].transform([input_data[col]])[0]
                    print(f"Encoded {col}: {input_data[col]}")
                except ValueError as e:
                    print(f"❌ Encoding failed for {col}: {e}")
                    input_data[col] = encoders[col].transform([encoders[col].classes_[0]])[0]

        feature_order = [
            'gender', 'SeniorCitizen', 'Partner', 'Dependents', 'tenure',
            'PhoneService', 'MultipleLines', 'InternetService', 'OnlineSecurity',
            'OnlineBackup', 'DeviceProtection', 'TechSupport', 'StreamingTV',
            'StreamingMovies', 'Contract', 'PaperlessBilling', 'PaymentMethod',
            'MonthlyCharges', 'TotalCharges'
        ]

        final_input = np.array([[input_data[col] for col in feature_order]])
        print("FINAL MODEL INPUT:", final_input)

        # Get prediction and probabilities
        prediction = int(model.predict(final_input)[0])
        probabilities = model.predict_proba(final_input)[0]
        print(f"RAW PROBABILITIES: {probabilities}")

        is_churn = prediction == 1
        churn_probability = float(probabilities[1])

        print(f"🎯 Prediction: {'Churn' if is_churn else 'Not Churn'}, Probability: {churn_probability:.2%}")

        # Generate email content with Cohere
        if is_churn:
            prompt = f"""
            Compose a friendly email to a valued telecom customer offering them special incentives to stay with us.

            Customer Details:
            - Monthly charges: ${data.get('MonthlyCharges')}
            - Tenure: {data.get('tenure')} months
            - Current services: {data.get('InternetService')}

            The email should:
            - Begin with Dear Valued Customer,
            - Express appreciation for their loyalty
            - Offer personalized discounts or service upgrades
            - Be warm and human-sounding
            - Not mention any analysis or predictions
            - Include a call-to-action to contact our support
            - End with
              "Best regards,
              Customer Experience Team
              Telco Services"
            """
        else:
            prompt = f"""
            Write a thank-you email to a loyal telecom customer, encouraging them to explore our new services.

            Customer Details:
            - Monthly charges: ${data.get('MonthlyCharges')}
            - Tenure: {data.get('tenure')} months
            - Current services: {data.get('InternetService')}

            The email should:
            - Begin with Dear Valued Customer,
            - Thank them for their continued business
            - Highlight new services or features they might enjoy
            - Offer a small token of appreciation
            - Be warm and human-sounding
            - Not mention any analysis or predictions
            - End with
              "Best regards,
              Customer Appreciation Team
              Telco Services"
            """

        print("🤖 Calling Cohere to generate email...")
        try:
            cohere_response = co.generate(
                model='command',
                prompt=prompt,
                max_tokens=350,
                temperature=0.7
            )
            email_body = cohere_response.generations[0].text.strip()
            print("✅ Email content generated")
        except Exception as e:
            print("❌ Cohere API failed:", e)
            email_body = "Dear Customer, thank you for being with us. [Fallback message here]"

        # Send email
        email_sent = False
        try:
            msg = EmailMessage()
            msg['Subject'] = "Exclusive Offer Just for You!" if is_churn else "Thanks for Staying With Telco!"
            msg['From'] = EMAIL_ADDRESS
            msg['To'] = customer_email
            msg.set_content(email_body)

            with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
                smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
                smtp.send_message(msg)

            print(f"✅ Email sent to {customer_email}")
            email_sent = True
            email_status = {
                "success": True,
                "message": f"Email sent successfully to {customer_email}"
            }
        except Exception as e:
            print(f"❌ Failed to send email: {e}")
            email_status = {
                "success": False,
                "message": f"Failed to send email to {customer_email}: {str(e)}"
            }

        response_data = {
            "success": True,
            "prediction": "likely to churn" if is_churn else "not likely to churn",
            "probability": f"{churn_probability:.2%}",
            "email_status": email_status,
            "customer_email": customer_email,
            "debug": {
                "input_data": convert_numpy_types(input_data),
                "final_input": convert_numpy_types(final_input),
                "probabilities": convert_numpy_types(probabilities)
            }
        }

        return jsonify(response_data)

    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return jsonify({
            "success": False,
            "error": str(e),
            "message": "Please check server logs for details",
            "email_status": {
                "success": False,
                "message": "An error occurred while processing your request"
            }
        }), 500

if __name__ == "__main__":
    app.run(debug=True, port=5002)
