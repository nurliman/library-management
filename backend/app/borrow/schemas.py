from app.utils import is_date_in_future
from datetime import datetime
from schema import Schema, And, Use, Optional

borrowed_book_schema = Schema(
    {
        "book_id": And(int, lambda n: n >= 0),
        "member_id": And(int, lambda n: n >= 0),
        "borrow_date": And(Use(datetime.fromisoformat)),
        "return_date": And(Use(datetime.fromisoformat), is_date_in_future),
        Optional("extended"): And(bool),
    }
)
