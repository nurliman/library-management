from app.users.models import UserRole
from app.utils import is_email
from schema import Schema, And, Or, Optional

add_user_schema = Schema(
    {
        "username": And(str, len),
        "password": And(str, len),
        "email": And(str, is_email),
        "role": Or(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MEMBER),
    }
)

edit_user_schema = Schema(
    {
        Optional("username"): And(str, len),
        Optional("password"): And(str, len),
        Optional("email"): And(str, is_email),
        Optional("role"): Or(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MEMBER),
    }
)
