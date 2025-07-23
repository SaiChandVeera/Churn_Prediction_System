# 🔮 AI Churn Prediction System with Automated Email Marketing

A sophisticated and intelligent AI-powered web application that predicts customer churn using advanced machine learning algorithms and automatically engages customers with personalized email campaigns. This comprehensive solution empowers businesses to not only anticipate customer attrition but also take immediate proactive action through intelligent retention strategies.

## 🚀 Key Features

- 🧠 **Intelligent ML Model**: Advanced Random Forest Classifier predicts customer churn probability with high accuracy
- 📧 **Smart Email Marketing**: Automated, AI-generated personalized emails sent instantly based on prediction results
- 🤖 **AI-Powered Content**: Cohere AI generates contextual, human-like email content tailored to each customer's profile
- 🎨 **Modern Interface**: Sleek, responsive design featuring smooth animations, gradient backgrounds, and intuitive user experience
- 📊 **Smart Data Processing**: Intelligent form handling with real-time calculations, input validation, and feature encoding
- 💡 **Actionable Insights**: Clear, visual prediction results with confidence scores and automated follow-up actions
- ⚡ **Real-time Analysis**: Instant predictions with dynamic feedback and immediate email deployment
- 🎯 **Business-Ready**: Production-ready application with enterprise-grade email automation capabilities

## 🛠️ Technology Stack

**Backend:**
- Python with Flask framework
- Machine Learning with scikit-learn
- AI Content Generation with Cohere API
- Email automation with SMTP integration
- Data processing with pandas and numpy

**Frontend:**
- Modern HTML5 and CSS3 with advanced animations
- Vanilla JavaScript for seamless interactions
- Responsive design optimized for all devices

**Infrastructure & APIs:**
- RESTful API architecture
- Cohere AI API for intelligent content generation
- Gmail SMTP for reliable email delivery
- Environment-based configuration management
- Cross-platform compatibility

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.7 or higher
- Required libraries: Flask, scikit-learn, pandas, numpy, cohere, python-dotenv
- Gmail account with App Password for email functionality
- Cohere API key for AI content generation

### Environment Setup
Create a `.env` file in your project root:
```env
COHERE_API_KEY=your_cohere_api_key_here
EMAIL_ADDRESS=your_gmail_address@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
```

### Launch Application
```bash
python app.py
```

### Access the Application
Open your browser and navigate to `http://localhost:5002`

## 📁 Project Architecture
```
CHURN-PREDICTION-SYSTEM/
├── app.py                                    # Main Flask application with email automation
├── .env                                      # Environment variables (not in repo)
├── WA_Fn-UseC_-Telco-Customer-Churn.csv    # Training dataset
├── customer_churn_model.pkl                 # Trained ML model
├── encoders.pkl                             # Feature encoders for data preprocessing
├── static/
│   ├── css/
│   │   └── style.css                       # Styling and animations
│   └── js/
│       └── script.js                       # Client-side functionality
└── templates/
    └── index.html                          # Main application interface
```

## 🧠 Machine Learning & AI Integration

### Churn Prediction Model
The system employs a Random Forest Classifier trained on processed and balanced customer data to accurately predict customer churn probability.

### AI-Powered Email Generation
- **Cohere AI Integration**: Generates contextual, personalized email content
- **Dynamic Content**: Emails adapt based on customer profile and churn risk level
- **Human-like Communication**: Natural language generation for authentic customer engagement

### Input Features:
- **Demographics**: Gender, Senior Citizen status, Partner, Dependents
- **Services**: Phone service, Internet service type, Online security
- **Support Services**: Tech support, Device protection, Streaming services
- **Account Information**: Contract type, Payment method, Paperless billing
- **Financial Data**: Monthly charges, Total charges, Tenure

### Model Performance:
- High accuracy rate with robust cross-validation
- Optimized hyperparameters for production use
- Real-time prediction capability with instant email triggers

## 📧 Automated Email Marketing System

### For High-Risk Customers (Likely to Churn):
- **Retention Emails**: Special offers, discounts, and service upgrades
- **Personalized Incentives**: Tailored based on current service usage and tenure
- **Immediate Deployment**: Email sent within seconds of prediction

### For Low-Risk Customers (Loyal):
- **Appreciation Emails**: Thank you messages and loyalty recognition
- **Upselling Opportunities**: Introduction to new services and features
- **Relationship Building**: Strengthening customer connection

### Email Features:
- **Professional Templates**: Branded, responsive email design
- **Personalization**: Customer-specific details and offers
- **Delivery Tracking**: Success/failure status reporting
- **SMTP Security**: Secure Gmail integration with App Password authentication

## 📊 Prediction & Email Examples

| Customer Profile | Prediction Result | Email Action |
|------------------|-------------------|--------------|
| Senior citizen, Month-to-month contract, High charges | 🔴 Likely to Churn | 📧 Retention Email: Special discount offer and service upgrade |
| Long-term customer, Annual contract, Multiple services | ✅ Not Likely to Churn | 📧 Appreciation Email: Thank you message with new service highlights |
| New customer, Basic services, Electronic payment | 🔴 Likely to Churn | 📧 Engagement Email: Welcome bonus and enhanced service options |

## 🎯 Business Impact

- **Proactive Retention**: Identify and immediately engage at-risk customers
- **Automated Marketing**: Reduce manual effort with AI-powered email campaigns
- **Cost Reduction**: Lower customer acquisition costs through intelligent retention
- **Revenue Protection**: Maintain revenue streams through targeted interventions
- **Personalized Experience**: Deliver relevant, timely communications to each customer
- **Data-Driven Decisions**: Make informed business decisions based on ML insights and engagement metrics

## 🔧 Configuration & Customization

The application supports various customization options:

- **Model Retraining**: Update with new customer data
- **Email Templates**: Customize AI prompts for different campaign types
- **Feature Engineering**: Modify input features and encoding strategies
- **UI/UX Themes**: Personalize interface design and branding
- **API Endpoints**: Configure external integrations
- **Email Providers**: Support for different SMTP services

## 🚀 Deployment Options

### Cloud Platforms:
- Heroku (with environment variable support)
- Railway (Flask + Email automation ready)
- Render (Built-in secret management)
- AWS Elastic Beanstalk (Enterprise scaling)
- Google Cloud Run (Serverless deployment)

### Containerization:
- Docker support with environment variable injection
- Kubernetes-ready configuration with secret management

## 🔄 Future Enhancements

- **Advanced AI Models**: Integration of GPT-based content generation and ensemble ML methods
- **Email Analytics**: Open rates, click-through rates, and conversion tracking
- **Multi-channel Communication**: SMS, push notifications, and social media integration
- **User Authentication**: Secure login and user management system
- **Database Integration**: Persistent storage for predictions, emails, and customer interactions
- **A/B Testing**: Email content optimization and model performance comparison
- **Real-time Dashboard**: Comprehensive analytics, campaign performance, and churn metrics
- **CRM Integration**: Seamless connection with Salesforce, HubSpot, and other platforms
- **Advanced Segmentation**: Dynamic customer grouping for targeted campaigns
- **Predictive Analytics**: Advanced forecasting and customer lifetime value prediction

## 🤝 Contributing

We welcome contributions! This project combines machine learning, AI-powered content generation, and automated marketing - perfect for developers interested in:

- Machine Learning and predictive analytics
- Natural Language Processing and AI content generation
- Email marketing automation and customer engagement
- Full-stack web development with modern technologies

Please feel free to submit issues, feature requests, or pull requests to help improve this comprehensive customer retention solution.

---

⭐ **Star this repository if you find it helpful!** ⭐
