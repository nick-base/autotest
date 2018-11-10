from .localhost import localhost
from .localIP import localIP
from .stage import stage
from .test import test
from .production import production

aj = {
    "name": "Ajinga",
    "description": "菁客招聘",
    "disable": False,
    "root_path": "",
    "sub": [
        {
            "name": "Localhost",
            "description": "http://127.0.0.1:8000",
            "case": localhost
        },
        {
            "name": "Local IP",
            "description": "http://192.168.244.59:8000",
            "case": localIP
        },
        {
            "name": "Stage Env",
            "description": "http://stage.ajinga.com",
            "case": stage
        },
        {
            "name": "Test Env",
            "description": "http://test.ajinga.com",
            "case": test
        },
        {
            "name": "Production",
            "description": "http://www.ajinga.com",
            "case": production
        },
    ]
}
