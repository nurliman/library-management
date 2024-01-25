from schema import Schema, And

get_system_variable_schema = Schema(
    {
        "value": And(str, len),
    }
)

add_system_variable_schema = Schema(
    {
        "name": And(str, len),
        "value": And(str, len),
    }
)
