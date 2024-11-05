from fastapi import FastAPI
from src.presentation.controller import (
    oauth,
    rag,
    chatbot
)


app = FastAPI()


app.include_router(
    oauth.router
)

app.include_router(
    rag.router
)

app.include_router(
    chatbot.router
)
