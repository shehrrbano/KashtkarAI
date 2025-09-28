# 🌾 Kashtkar.ai - AI-Powered Agricultural Intelligence

A modern, professional agricultural intelligence platform with intelligent location detection, voice features, and comprehensive farm management tools.

## 🚀 Quick Start

### Option 1: Use the Startup Script (Recommended)
```bash
# On Windows
start_kashtkar.bat

# On Linux/Mac
chmod +x start_kashtkar.sh
./start_kashtkar.sh
```

### Option 2: Manual Start
```bash
# Terminal 1 - Start Backend (Port 8080)
cd backend && npm start

# Terminal 2 - Start Frontend (Port 8081)
python -m http.server 8081
```

## 🌐 Access the Application

Once both servers are running, access Kashtkar.ai at:

| Service | URL | Description |
|---------|-----|-------------|
| **Main Application** | http://localhost:8081 | Complete Kashtkar.ai dashboard |
| **Login Page** | http://localhost:8081/login.html | User authentication |
| **Signup Page** | http://localhost:8081/signup.html | Account creation |
| **Backend API** | http://localhost:8080/api/status | API health check |

## 🎯 Key Features

### 🤖 Intelligent Location Detection
- **Smart Chat Analysis**: AI automatically detects location names in chat messages
- **Natural Language Processing**: Understands queries like "Show me farms in Lahore"
- **Automatic Map Updates**: Map pans to detected locations with markers
- **Context Awareness**: Distinguishes between location queries and regular questions

### 🔐 Professional Authentication
- **GitHub-Style Design**: Modern, clean authentication interface
- **Google Sign-In**: OAuth integration ready for implementation
- **Secure Sessions**: Token-based authentication with localStorage
- **Form Validation**: Real-time validation and error handling

### 🎤 Advanced Voice Features
- **Speech Recognition**: Web Speech API integration
- **Multilingual Support**: English and Urdu voice commands
- **Voice Synthesis**: Text-to-speech with multiple voice options
- **Touch-to-Speak**: Long-press activation for voice input

### 🗺️ Interactive Map Interface
- **Google Maps Integration**: Professional mapping with custom markers
- **Location Markers**: Agriculture-themed map markers
- **Real-time Updates**: Live data visualization on map
- **Responsive Design**: Works on all devices and screen sizes

## 📱 How to Use

### 1. First Time Setup
1. **Access the application** at http://localhost:8081
2. **You'll be redirected** to the login page (GitHub-style interface)
3. **Sign up** for a new account or **sign in** if you already have one
4. **Complete registration** with email, password, username, and country
5. **Access the main dashboard** with all features

### 2. Using Location Detection
- **Type in chat**: "Show me agricultural data for Lahore"
- **AI analyzes**: Detects "Lahore" as a location
- **Map updates**: Automatically pans to Lahore with marker
- **Get feedback**: Confirmation message in chat

### 3. Voice Features
- **Click microphone** in chat interface to start voice recognition
- **Say commands** like "Show me farms in Karachi" or "Help"
- **Voice feedback** responds in your preferred language

### 4. AI Agents
- **Sensor Agent**: Real-time environmental monitoring
- **Prediction Agent**: AI-powered yield and risk predictions
- **Resource Agent**: Resource optimization and planning
- **Market Agent**: Market analysis and pricing intelligence

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/google` - Google OAuth authentication
- `GET /api/auth/verify` - Token verification

### Agricultural Data
- `GET /api/sensor` - Real-time sensor data
- `GET /api/predictions` - AI predictions and forecasts
- `GET /api/resources` - Resource allocation recommendations
- `GET /api/market` - Market analysis and pricing

### Location Services
- `POST /api/location/parse` - AI-powered location parsing

## 🎨 Design Features

### Professional UI/UX
- **Google Material Design 3**: Modern, accessible interface
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Dark/Light Theme**: Automatic theme switching
- **Professional Typography**: Google Sans font family
- **Smooth Animations**: Professional transitions and effects

### Color Scheme
- **Primary**: `#1a73e8` (Google Blue)
- **Secondary**: `#34a853` (Google Green)
- **Background**: `#f1f3f4` (Google Background)
- **Surfaces**: `#ffffff` (Pure White)

## 🔧 Development

### Project Structure
```
kashtkar.ai/
├── frontend.html          # Main dashboard
├── login.html             # Authentication (Login)
├── signup.html            # Authentication (Signup)
├── backend/
│   └── server.js          # Node.js backend server
├── start_kashtkar.bat     # Windows startup script
├── start_kashtkar.sh      # Linux/Mac startup script
└── README.md              # This file
```

### Dependencies
- **Backend**: Node.js, Express.js, CORS
- **Frontend**: Vanilla JavaScript, Google Maps API, Web Speech API
- **External APIs**: Google AI Studio (Gemini), Google Maps

### Environment Setup
1. **Install Node.js** (for backend server)
2. **Install Python** (for frontend server)
3. **Get API Keys**:
   - Google Maps API key
   - Google AI Studio API key
4. **Run startup script** or start servers manually

## 🌟 Example Interactions

### Location Detection
```
User: "Show me agricultural data for Lahore"
AI: "📍 I detected a location in your message: Lahore. I've updated the map to show this location."
```

### Voice Commands
```
User: "Show me farms in Karachi"
Voice: "Location detected: Karachi. Map updated."
```

### AI Agent Queries
```
User: "What's the temperature in Punjab?"
Sensor Agent: "Current temperature is 28.5°C. Temperature is optimal for crop growth."
```

## 🚨 Troubleshooting

### Backend Not Starting
- Ensure Node.js is installed
- Check if port 8080 is available
- Run `cd backend && npm install` if dependencies are missing

### Frontend Not Loading
- Ensure Python is installed
- Check if port 8081 is available
- Verify all files are in the correct directory

### Authentication Issues
- Clear browser localStorage if login problems persist
- Check browser console for detailed error messages
- Ensure backend server is running on port 8080

### Map Not Loading
- Verify Google Maps API key is valid
- Check browser console for API errors
- Ensure stable internet connection

## 📞 Support

For technical support or feature requests:
- Check browser console for error messages
- Verify all servers are running correctly
- Ensure stable internet connection for API calls

## 🔮 Future Enhancements

- **Mobile App**: React Native/Flutter mobile application
- **IoT Integration**: Real sensor data integration
- **Advanced Analytics**: Machine learning predictions
- **Multi-language Support**: Additional language options
- **Offline Mode**: Offline functionality for remote areas

---

**Kashtkar.ai** - Revolutionizing agriculture through AI-powered intelligence! 🌾🤖