from app import db
from enum import Enum
from dataclasses import dataclass
from dataclasses_json import LetterCase, dataclass_json
from flask_jwt_extended import create_access_token, create_refresh_token
from sqlalchemy.orm import Mapped, mapped_column
from werkzeug.security import check_password_hash
from werkzeug.security import generate_password_hash


class UserRole(Enum):
    SUPERUSER = "superuser"
    ADMIN = "admin"
    MEMBER = "member"


@dataclass_json(letter_case=LetterCase.CAMEL)
@dataclass
class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(unique=True)
    email: Mapped[str] = mapped_column(unique=True)
    role: Mapped[UserRole] = mapped_column(default=UserRole.MEMBER)
    password_hash: Mapped[str]

    def set_password(self, value: str) -> None:
        """Store the password as a hash for security."""
        self.password_hash = generate_password_hash(value)

    # allow password = "..." to set a password
    password = property(fset=set_password)

    def check_password(self, value: str) -> bool:
        return check_password_hash(self.password_hash, value)

    def create_credentials(self):
        """Create a new set of credentials for the user."""
        credentials = Credentials(
            access_token=create_access_token(identity=self.id),
            refresh_token=create_refresh_token(identity=self.id),
        )
        return credentials

    @property
    def safe_dict(self):
        """Return a dictionary representation of the user."""
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "role": self.role.value,
        }


@dataclass_json(letter_case=LetterCase.CAMEL)
@dataclass
class Credentials:
    access_token: str
    refresh_token: str
