from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import motor, policies, claims

app = FastAPI(title="InsureFlow API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(motor.router, prefix="/api/motor", tags=["motor"])
app.include_router(policies.router, prefix="/api/policies", tags=["policies"])
app.include_router(claims.router, prefix="/api/claims", tags=["claims"])


@app.get("/health")
def health():
    return {"status": "ok", "service": "InsureFlow API"}
