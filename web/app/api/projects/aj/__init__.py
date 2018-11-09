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
    "sub": {
        "localhost": {
            "name": "Localhost",
            "description": "http://127.0.0.1:8000",
            "case": localhost
        },
        "localIP": {
            "name": "Local IP",
            "description": "http://192.168.244.59:8000",
            "case": localIP
        },
        "stage": {
            "name": "Stage Env",
            "description": "http://stage.ajinga.com",
            "case": stage
        },
        "test": {
            "name": "Test Env",
            "description": "http://test.ajinga.com",
            "case": test
        },
        "production": {
            "name": "Production",
            "description": "http://www.ajinga.com",
            "case": production
        },
    }
}
