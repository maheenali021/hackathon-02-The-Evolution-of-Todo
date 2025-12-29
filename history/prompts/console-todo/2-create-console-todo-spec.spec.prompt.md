---
id: 2
title: Create Console Todo Spec
stage: spec
date: 2025-12-29
surface: agent
model: Claude Sonnet 4.5
feature: console-todo
branch:
user:
command: sp.specify
labels: [specification, todo-app, console]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - specs/1-console-todo/spec.md
 - specs/1-console-todo/checklists/requirements.md
tests:
---

## Prompt

```text
PURPOSE:
Simple console-based todo list manager that stores all tasks in memory (no file/database persistence in this phase)

SUCCESS CRITERIA:
- User can perform all 5 basic operations through a clear text menu/command interface
- All operations work correctly and show appropriate feedback
- Tasks are properly associated with: title (required), description (optional), completion status
- Application runs continuously until user chooses to quit
- Clean exit when user selects quit/exit option

CORE FEATURES TO IMPLEMENT (all mandatory):

1. Add new task
   - Ask for title (required, non-empty)
   - Ask for description (optional)
   - Automatically assign unique incremental ID
   - Mark as not completed by default

2. View/List all tasks
   - Show numbered list (ID-based)
   - Display for each task: ID, Title, Status (✓ Done / ☐ Pending), Description (if exists)
   - If no tasks → show friendly "No tasks yet" message

3. Update existing task
   - Ask for task ID
   - If ID exists → allow changing title and/or description
   - If ID doesn't exist → show clear error message

4. Delete task
   - Ask for task ID
   - If ID exists → remove it and confirm
   - If ID doesn't exist → show error

5. Mark task as complete / incomplete
   - Ask for task ID
   - Toggle completion status (complete ↔ incomplete)
   - Show confirmation message with new status

MAIN INTERFACE STYLE:
- Simple numbered menu (most common and judge-friendly):
  1. Add new task
  2. List all tasks
  3. Update task
  4. Delete task
  5. Toggle complete/incomplete
  6. Quit
- Clear input validation (handle wrong numbers, invalid IDs, empty inputs)
- After each operation → return to main menu (loop until quit)

CONSTRAINTS:
- Must use only in-memory storage (list or dict of task objects)
- Python 3.13+ with modern type hints
- No external dependencies except what's provided by UV / stdlib
- Project must follow clean Python project structure created with UV
- No file/database persistence in this phase
- All user-facing text must be clear,
```

## Response snapshot

Successfully created a comprehensive specification for the console-based todo list manager feature. The specification includes:

1. User Scenarios & Testing with 3 prioritized user stories covering:
   - Adding and managing tasks (P1)
   - Updating and deleting tasks (P2)
   - Tracking task completion (P3)

2. Functional Requirements (FR-001 through FR-011) covering all core functionality:
   - Console menu interface
   - Task creation with required title and optional description
   - Unique incremental ID assignment
   - In-memory storage only
   - Task display with ID, title, status, and description
   - Update, delete, and toggle operations
   - Input validation and error handling
   - Continuous operation until quit

3. Key Entity definition for Task with properties: ID, Title, Description, and Completion Status

4. Success Criteria with measurable outcomes (SC-001 through SC-005)

Also created a quality checklist that validates all requirements were met.

## Outcome

- ✅ Impact: Complete specification created for console todo app feature
- 🧪 Tests: No tests needed for specification creation
- 📁 Files: Created spec.md and requirements.md checklists
- 🔁 Next prompts: Ready for planning phase with /sp.plan
- 🧠 Reflection: Specification covers all requirements and user scenarios

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS - Specification complete and validated
- Prompt variant (if applicable): Standard specification creation
- Next experiment (smallest change to try): Proceed to planning phase