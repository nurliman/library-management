import os
from app import create_app

host = os.environ.get("HOST", "0.0.0.0")
port = int(os.environ.get("PORT", 3001))


if __name__ == "__main__":
    create_app().run(
        host=host,
        port=port,
        debug=True,
    )
