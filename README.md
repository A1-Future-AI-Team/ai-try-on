# Virtual Try-On System

A sophisticated virtual try-on system for fashion brands that allows users to virtually try on clothes using AI technology.

## Features
- Real-time virtual try-on
- Body measurements extraction
- Multiple angle views
- Size recommendation system
- Garment catalog
- Save and share functionality

## Tech Stack
- Frontend: React.js/Next.js, Three.js, Tailwind CSS
- Backend: Python (FastAPI), PyTorch
- AI/ML: Virtual Try-On Models, Body Segmentation
- Storage: AWS S3
- Database: PostgreSQL
- Caching: Redis

## Project Structure
```
virtual-tryon/
├── frontend/           # React/Next.js frontend application
├── backend/           # FastAPI backend server
├── ml_models/         # AI/ML models and processing
├── docs/             # Documentation
└── docker/           # Docker configuration files
```

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 14+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/virtual-tryon.git
cd virtual-tryon
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Install frontend dependencies:
```bash
cd frontend
npm install
cd ..
```

### Running the Application

#### Option 1: Run everything together
```bash
./run_all.sh
```

#### Option 2: Run backend and frontend separately

1. Start the backend server:
```bash
python run_backend.py
```

2. In a new terminal, start the frontend server:
```bash
./run_frontend.sh
```

### Accessing the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## Testing the Model

To test the virtual try-on model:

1. Open the web application at http://localhost:3000
2. Upload a person image (full-body photo)
3. Upload a garment image (on a white background)
4. Click "Try On" to see the result

## License
MIT License 