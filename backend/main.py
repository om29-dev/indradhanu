from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.views.routes import router as api_router

app = FastAPI(title="Indradhanu Backend")

# CORS: allow local frontend during development to make preflight (OPTIONS) requests
origins = [
	"http://localhost:5173",
	"http://127.0.0.1:5173",
]

app.add_middleware(
	CORSMiddleware,
	allow_origins=origins,
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")
