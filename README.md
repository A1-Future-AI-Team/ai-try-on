# Virtual Try-On System ✨
A cutting-edge virtual try-on platform designed for fashion brands, enabling users to visualize how garments will look on them using advanced AI and computer vision technology.

---

## 🔧 Features

- ⏱ **Real-time virtual try-on** for an interactive user experience
- 🏋️ **Automatic body measurement extraction** for better garment fit
- 📷 **Multiple angle views** to visualize outfits from different perspectives
- 🛏️ **Smart size recommendation system**
- 💼 **Digital garment catalog** integration
- ✨ **Save and share** outfit looks instantly

---

## 🧠 Tech Stack

- **Frontend**: React.js / Next.js, Three.js, Tailwind CSS
- **Backend**: Python (FastAPI), PyTorch
- **AI/ML**: Virtual Try-On Models, Body Segmentation
- **Storage**: AWS S3
- **Database**: PostgreSQL
- **Caching**: Redis

---

## 📁 Project Structure
```bash
virtual-tryon/
├── frontend/         # React/Next.js frontend application
├── backend/          # FastAPI backend server
├── ml_models/        # AI/ML models and processing
├── docs/             # Documentation
└── docker/           # Docker configuration files
```

---

## ✨ Getting Started

### ⚡ Prerequisites
- Python 3.8+
- Node.js 14+
- npm or yarn

### ↓ Installation

1. **Clone the repository**:
```bash
git clone https://github.com/yourusername/virtual-tryon.git
cd virtual-tryon
```

2. **Install Python dependencies**:
```bash
pip install -r requirements.txt
```

3. **Install frontend dependencies**:
```bash
cd frontend
npm install
cd ..
```

---

### 🚀 Running the Application

#### Option 1: Run everything together
```bash
./run_all.sh
```

#### Option 2: Run backend and frontend separately

1. **Start the backend server**:
```bash
python run_backend.py
```

2. **Start the frontend server (in a new terminal)**:
```bash
./run_frontend.sh
```

---

## 🌐 Accessing the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs (Swagger)**: http://localhost:8000/docs

---

## 📊 Testing the Model

1. Open the app in your browser: `http://localhost:3000`
2. Upload a **full-body photo** of the person
3. Upload a **garment image** (preferably on a plain background)
4. Click **"Try On"** to see the virtual result!

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).

---

