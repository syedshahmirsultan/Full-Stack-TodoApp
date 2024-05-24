from typing import Annotated
from fastapi import Depends, FastAPI, HTTPException
from sqlmodel import SQLModel, Field, create_engine, Session, select 
from dailydo_todo_app import setting
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from uuid import uuid4

def create_tables():
    # Create all database tables based on SQLModel metadata
    SQLModel.metadata.create_all(engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Context manager to handle application startup and shutdown events
    create_tables()
    yield

# Creating Connection With FastAPI
app: FastAPI = FastAPI(lifespan=lifespan, title="TODO APP")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust as needed
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)


class Todo(SQLModel, table=True):
    id: int |None = Field(default= None ,primary_key=True)
    content: str = Field(index=True, min_length=3, max_length=200)
    is_completed: bool = Field(default=False)

    
# Connection String of Database
connection_string = str(setting.DATABASE_URL).replace("postgresql", "postgresql+psycopg")

# Creating Engine
engine = create_engine(connection_string, connect_args={"sslmode": "require"}, pool_recycle=600, pool_size=10)

def get_session():
    # Dependency to provide a database session
    with Session(engine) as session:
        yield session

# Getting All Todos API
@app.get("/todo/", response_model=list[Todo])
def get_all_todos(session: Annotated[Session, Depends(get_session)]):
    # Fetch and return all todo items from the database
    todos = session.exec(select(Todo)).all()
    return todos

# Getting Single Todo API
@app.get("/todo/{id}", response_model=Todo)
def get_single_todo(id:int, session: Annotated[Session, Depends(get_session)]):
    # Fetch and return a single todo item by ID
    todo = session.exec(select(Todo).where(Todo.id == id)).first()
    if not todo:
        raise HTTPException(status_code=404, detail="No Task Found")
    return todo

# Creating Todo API
@app.post("/todo/", response_model=Todo)
def create_todos(todo: Todo, session: Annotated[Session, Depends(get_session)]):
    # Create a new todo item and save it to the database
    session.add(todo)
    session.commit()
    session.refresh(todo)
    return todo

# Updating Todo API
@app.put("/todo/{id}", response_model=Todo)
def updating_todo(id:int, todo: Todo, session: Annotated[Session, Depends(get_session)]):
    # Update an existing todo item by ID
    existing_todo = session.get(Todo, id)
    if existing_todo:
        existing_todo.content = todo.content
        existing_todo.is_completed = todo.is_completed
        session.commit()
        session.refresh(existing_todo)
        return existing_todo
    else:
        raise HTTPException(status_code=404, detail="No Task Found")

# Deleting Todo API
@app.delete("/todo/{id}")
def delete_todo(id:int, session: Annotated[Session, Depends(get_session)]):
    # Delete a todo item by ID
    todo = session.get(Todo, id)
    if todo:
        session.delete(todo)
        session.commit()
        return {"Message": "Task Successfully Deleted"}
    else:
        raise HTTPException(status_code=404, detail="No Task Found")

# API for testing if FastAPI is working
@app.get("/")
async def root():
    # Root endpoint to verify the FastAPI application is running
    return {"Message": "Welcome to Shahmir FastAPI project"}