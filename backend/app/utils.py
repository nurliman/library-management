import re
from datetime import datetime, timezone
from flask import jsonify


def make_error_response(
    status_code: int = 500,
    message: str = "Something went wrong!",
):
    """Make a JSON response with an error message."""
    response = jsonify(
        {
            "status": status_code,
            "message": message,
        }
    )

    response.status_code = status_code

    return response


def make_success_response(
    data,
    message: str = "Ok!",
    status_code: int = 200,
):
    """Make a JSON response with a success message."""
    response = jsonify(
        {
            "data": data,
            "status": status_code,
            "message": message,
        }
    )

    response.status_code = status_code

    return response


def is_email(value: str) -> bool:
    """Check if a string is a valid email address."""

    email_pattern = re.compile(r"(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)")

    return bool(re.match(email_pattern, value))


def is_valid_url(value: str) -> bool:
    """Check if a string is a valid url."""

    url_pattern = re.compile(
        r"^(?:http|ftp)s?://"  # http:// or https://
        r"(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?)|"  # domain...
        r"localhost|"  # localhost...
        r"\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})"  # ...or ip
        r"(?::\d+)?"  # optional port
        r"(?:/?|[/?]\S+)$",
        re.IGNORECASE,
    )

    return bool(re.match(url_pattern, value))


def is_date_in_future(date: datetime):
    """Check if a datetime is in the future."""

    # print type of date
    return datetime.now(timezone.utc) < date


def calc_late_fee(due_date: datetime, return_date: datetime) -> float:
    """Calculate the late fee."""

    # return early when it's not late
    if return_date <= due_date:
        return 0.0

    perday = 1000
    days_late = (return_date - due_date).days
    return perday * days_late
