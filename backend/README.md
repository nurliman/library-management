# Backend Library Management System

This is the backend for the Library Management System. It is a Flask application that handles API requests.

## Usage

### 1. Install dependencies

```bash
pip install -r requirements.txt
```

### 2. Set `.env` file

```bash
cp .env.example .env
```

### 3. Run database migrations

```bash
python flask db upgrade
```

### 4. Run the development server

```bash
python dev.py
```