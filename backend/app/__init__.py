from datetime import timedelta
import os
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
from dotenv import load_dotenv

load_dotenv()


class Base(DeclarativeBase):
    pass


db = SQLAlchemy(model_class=Base)
migrate = Migrate()
jwt = JWTManager()


def create_app():
    """Create and configure an instance of the Flask application."""
    app = Flask(__name__)

    # some deploy systems set the database url in the environ
    db_url = os.environ.get("DATABASE_URL")

    if db_url is None:
        # default to a sqlite database in the instance folder
        db_url = "sqlite:///zapps_library.sqlite"

    app.config.from_mapping(
        # default secret that should be overridden in environ or config
        JWT_SECRET_KEY=os.environ.get("JWT_SECRET_KEY", "change-me"),
        JWT_ACCESS_TOKEN_EXPIRES=os.environ.get(
            "JWT_ACCESS_TOKEN_EXPIRES", timedelta(hours=2)
        ),
        JWT_REFRESH_TOKEN_EXPIRES=os.environ.get(
            "JWT_REFRESH_TOKEN_EXPIRES", timedelta(days=30)
        ),
        SQLALCHEMY_DATABASE_URI=db_url,
    )

    CORS(app)

    db.init_app(app)

    migrate.init_app(app, db)

    jwt.init_app(app)

    # apply the blueprints to the app

    from app import auth, books, borrowed, returned, dashboard, users

    app.register_blueprint(auth.blueprint)
    app.register_blueprint(books.blueprint)
    app.register_blueprint(borrowed.blueprint)
    app.register_blueprint(returned.blueprint)
    app.register_blueprint(dashboard.blueprint)
    app.register_blueprint(users.blueprint)

    return app
