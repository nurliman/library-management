from app.utils import is_date_in_future
from dateutil.parser import isoparse
from schema import Schema, And, Use,Or, Optional

borrowed_book_schema = Schema(
    {
        "book_id": And(int, lambda n: n >= 0),
        "member_id": And(int, lambda n: n >= 0),
        Optional("borrow_date"): And(Use(isoparse)),
        Optional("due_date"): And(Use(isoparse)),
        Optional("return_date"): And(Use(isoparse)),
        Optional("extended"): And(bool),
    }
)

return_book_schema = Schema(
    {
        Optional("is_lost"): And(bool),
        Optional("is_damaged"): And(bool),
        Optional("return_date"): And(Use(isoparse)),
        Optional("additional_fee"): Or(And(int, lambda n: n >= 0), And(float, lambda n: n >= 0)),
    }
)

extend_borrowed_book_schema = Schema(
    {
        "due_date": And(Use(isoparse), is_date_in_future),
    }
)
