# API Contracts: Console Todo App

## Overview
This console application doesn't have traditional APIs but has defined input/output contracts for each operation.

## User Interaction Contracts

### 1. Add Task Operation
**Input**:
- Title (string, required, non-empty after trim)
- Description (string, optional)

**Output**:
- Success: "Task added successfully with ID: {id}"
- Error: "Error: Title cannot be empty!"

**Validation**:
- Title must not be empty after whitespace removal
- Description can be empty or omitted

### 2. List Tasks Operation
**Input**: None

**Output**:
- Success: Formatted list of all tasks with ID, title, status, and description
- No tasks: "No tasks yet"

**Format**:
```
ID: {id} | {status} | Title: {title}
   Description: {description}  # if description exists
```

### 3. Update Task Operation
**Input**:
- Task ID (integer, required)
- New title (string, optional)
- New description (string, optional)

**Output**:
- Success: "Task {id} updated successfully!"
- Error: "Error: Task with ID {id} does not exist!"

**Validation**:
- Task ID must exist in storage
- New title, if provided, must not be empty

### 4. Delete Task Operation
**Input**:
- Task ID (integer, required)

**Output**:
- Success: "Task {id} deleted successfully!"
- Error: "Error: Task with ID {id} does not exist!"

**Validation**:
- Task ID must exist in storage

### 5. Toggle Task Status Operation
**Input**:
- Task ID (integer, required)

**Output**:
- Success: "Task {id} marked as {status}!"
- Error: "Error: Task with ID {id} does not exist!"

**Validation**:
- Task ID must exist in storage

### 6. Main Menu Operation
**Input**:
- Menu choice (integer 1-6)

**Output**:
- Corresponding operation result or error message
- Error: "Invalid option! Please select a number between 1-6."

**Validation**:
- Choice must be integer between 1-6