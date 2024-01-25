from app import db
from dataclasses import dataclass
from dataclasses_json import LetterCase, dataclass_json
from sqlalchemy import Text
from sqlalchemy.orm import Mapped, mapped_column


@dataclass_json(letter_case=LetterCase.CAMEL)
@dataclass
class SystemVariable(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(Text(), nullable=False)
    value: Mapped[str] = mapped_column(Text(), nullable=False)
