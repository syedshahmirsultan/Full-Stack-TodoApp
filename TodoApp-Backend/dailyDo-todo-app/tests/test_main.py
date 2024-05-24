from fastapi.testclient import TestClient
from fastapi import FastAPI
import pytest
from sqlmodel import SQLModel, Session, create_engine
from dailydo_todo_app.setting import TEST_DATABASE_URL
from dailydo_todo_app.main import app, get_session

# Replace PostgreSQL URL for testing purposes
connection_string = str(TEST_DATABASE_URL).replace("postgresql", "postgresql+psycopg")

# Create the engine for connecting to the test database
engine = create_engine(connection_string, connect_args={"sslmode": "require"}, pool_recycle=500, pool_size=10)

@pytest.fixture(scope="module", autouse=True)
def get_db_session():
    # Create all database tables before running tests
    SQLModel.metadata.create_all(engine)
    yield Session(engine)

@pytest.fixture(scope="function")
def test_app(get_db_session):
    # Override the default database session with the test database session
    def test_session():
        yield get_db_session
    app.dependency_overrides[get_session] = test_session
    with TestClient(app=app) as client:
        yield client

# Test the root endpoint to verify the application is running
def test_root():
    client = TestClient(app=app)
    request = client.get("/")
    response = request.json()
    assert request.status_code == 200
    assert response == {"Message": "Welcome to Shahmir FastAPI project"}

# Test for GET ALL TODOS API
def test_get_all_todos(test_app):
    response = test_app.get("/todo/")
    assert response.status_code == 200

# Test for GET A SINGLE TODO API
def test_get_single_todo(test_app):
    new_todo = {"content": "new_todo"}
    adding_new_todo = test_app.post("/todo", json=new_todo)
    new_todo_id = adding_new_todo.json()["id"]
    getting_new_todo = test_app.get(f"/todo/{new_todo_id}")
    res = getting_new_todo.json()["content"]
    assert getting_new_todo.status_code == 200
    assert res == new_todo["content"]

# Test for CREATING TODOS API
def test_create_todos(test_app):
    adding_todo = {"content": "VISIT BOSNIA"}
    posting = test_app.post("/todo/", json=adding_todo)
    response = posting.json()["content"]
    assert response == adding_todo["content"]

# Test for UPDATING TODOS API
def test_updating_todo(test_app):
    adding_todo = {"content": "GO TO PROGRAMMING CLASS"}
    posting = test_app.post("/todo/", json=adding_todo)
    todo_id = posting.json()["id"]
    editing_todo = {"content": "GET A DEGREE FROM UNIVERSITY"}
    editing = test_app.put(f"/todo/{todo_id}", json=editing_todo)
    response = editing.json()["content"]
    assert editing_todo["content"] == response

# Test for DELETING TODOS API
def test_delete_todo(test_app):
    adding_todo = {"content": "Go for Physics Class"}
    posting = test_app.post("/todo/", json=adding_todo)
    todo_id = posting.json()["id"]
    deleting_todo = test_app.delete(f"/todo/{todo_id}")
    assert deleting_todo.status_code == 200
