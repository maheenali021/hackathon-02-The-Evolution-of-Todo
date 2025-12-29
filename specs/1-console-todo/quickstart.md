# Quickstart: Console Todo App

## Getting Started

### Prerequisites
- Python 3.13+ installed
- UV package manager 

### Installation
1. Clone or navigate to the project directory
2. Ensure Python 3.13+ is available in your environment

### Running the Application
```bash
python src/todo_app.py
```

## Basic Usage

### Main Menu Options
1. **Add new task**: Create a new todo item with title and optional description
2. **List all tasks**: View all existing tasks with their status
3. **Update task**: Modify the title or description of an existing task
4. **Delete task**: Remove a task from your list
5. **Toggle complete/incomplete**: Change the completion status of a task
6. **Quit**: Exit the application

### Example Workflow
1. Select "1. Add new task" to create your first task
2. Enter a title (required) and description (optional)
3. Select "2. List all tasks" to view your tasks
4. Use other options as needed to manage your tasks
5. Select "6. Quit" when finished

## Important Notes
- All data is stored in memory only and will be lost when the application exits
- Task IDs are assigned automatically and incrementally
- Each operation returns to the main menu after completion
- Invalid inputs will show clear error messages