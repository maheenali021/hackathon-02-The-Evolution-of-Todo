# Data Model: Console Todo App

## Core Entities

### Task
Represents a single todo item with properties for tracking and management.

**Fields:**
- `id` (int): Unique incremental identifier assigned automatically
- `title` (str): Required task title (non-empty)
- `description` (Optional[str]): Optional task description
- `completed` (bool): Task completion status (default: False)

**Validation Rules:**
- `id`: Must be unique, auto-incremented from 1
- `title`: Required, must be non-empty string after stripping whitespace
- `description`: Optional, if provided must be non-empty string after stripping whitespace
- `completed`: Boolean value, defaults to False when created

**State Transitions:**
- `pending` → `completed`: When user toggles status from incomplete to complete
- `completed` → `pending`: When user toggles status from complete to incomplete

**Relationships:**
- None (standalone entity)

## Storage Model

### In-Memory Dictionary
- **Structure**: `Dict[int, Task]` - Dictionary mapping task IDs to Task objects
- **Key**: Task ID (integer)
- **Value**: Task object instance
- **Operations**:
  - Add: O(1) insertion with new ID
  - Retrieve: O(1) lookup by ID
  - Update: O(1) modification by ID
  - Delete: O(1) removal by ID
  - List All: O(n) where n is number of tasks

**Constraints:**
- All operations are in-memory only (no persistence)
- Data is lost when application exits
- ID sequence continues from last assigned ID even after deletions

## User Interface Data Flow

### Menu Options
- **Representation**: Integer choices (1-6) corresponding to operations
- **Validation**: Must be integer between 1-6, with appropriate error handling

### Input Data
- **Task Title**: String input, required, validated for non-empty after strip
- **Task Description**: String input, optional, can be empty
- **Task ID**: Integer input, must exist in storage for operations requiring ID
- **Operation Selection**: Integer input, must be valid menu option

## Error States

### Validation Errors
- **Empty Title**: When user provides empty or whitespace-only title
- **Invalid ID**: When user provides ID that doesn't exist in storage
- **Invalid Menu Choice**: When user provides number outside menu range

### Expected Error Messages
- "Title cannot be empty!"
- "Task with ID {id} does not exist!"
- "Please enter a valid choice (1-6)!"