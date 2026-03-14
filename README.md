# Analytica AI Enterprise Analytics Platform

A production-ready AI-powered analytics SaaS platform for automated data insights, machine learning, and natural language data exploration.

## 🏗️ System Architecture

Custom-built modular architecture designed for high scalability:

- **Frontend**: Next.js (App Router), TypeScript, TailwindCSS, Shadcn UI, Recharts.
- **Backend**: FastAPI (Python), SQLAlchemy, Pydantic.
- **AI/ML Layer**: 
    - **Processing**: Pandas, NumPy, Scikit-learn.
    - **Models**: Isolation Forest (Anomaly), K-Means (Clustering), Random Forest (Prediction).
- **Multi-Agent System**:
    - **Data Agent**: Cleans and prepares data.
    - **Insight Agent**: Generates patterns.
    - **Copilot Agent**: Natural language reasoning (LLM).
- **Storage/DB**: PostgreSQL (Data), Redis (Cache), S3 (Files).
- **Task Queue**: Celery with Redis for background analysis.

## 📂 Project Structure

```text
├── frontend/             # Next.js Application
├── backend/              # FastAPI Services
│   ├── app/
│   │   ├── api/          # Route handlers
│   │   ├── models/       # DB Models
│   │   ├── schemas/      # Pydantic models
│   │   ├── core/         # Security & Config
│   │   └── services/     # Business logic
├── ml-engine/            # Scikit-learn processing pipelines
├── agents/               # Multi-agent AI logic
├── workers/              # Celery background tasks
├── infrastructure/       # Docker, K8s, CI/CD
└── docs/                 # Documentation
```

## 🛠️ Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js 18+
- Python 3.10+

### Setup
1. Clone the repository
2. Run `docker-compose up --build`
3. Access the dashboard at `http://localhost:3000`
