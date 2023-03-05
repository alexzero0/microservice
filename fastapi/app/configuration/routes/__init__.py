from app.configuration.routes.routes import *
from app.internal.routes import healcheck

__routes__ = Routes(routers=(healcheck.router, ))