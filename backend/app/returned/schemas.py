from datetime import datetime
from schema import Schema, And, Use, Optional

returned_book_schema = Schema(
    {
        "book_id": And(int, lambda n: n >= 0),
        "member_id": And(int, lambda n: n >= 0),
        Optional("return_date"): And(Use(datetime.fromisoformat)),
        Optional("condition"): And(str, len),
    }
)
