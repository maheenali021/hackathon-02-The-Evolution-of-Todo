---
description: "Task list for console todo app implementation"
---

# Tasks: Console Todo App

**Input**: Design documents from `/specs/1-console-todo/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Paths shown below assume single project - adjust based on plan.md structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create project structure per implementation plan in src/
- [X] T002 Initialize Python project with proper __init__.py files
- [X] T003 [P] Create directory structure for source code

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

Examples of foundational tasks (adjust based on your project):

- [X] T004 Define Task dataclass in src/todo_app.py with id, title, description, completed fields
- [X] T005 [P] Implement Task validation logic with proper error handling
- [X] T006 Create TodoApp class structure in src/todo_app.py
- [X] T007 Setup in-memory storage mechanism using dictionary in TodoApp class
- [X] T008 Create main menu structure and navigation in TodoApp class

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Add and Manage Tasks (Priority: P1) 🎯 MVP

**Goal**: Users can create, view, and manage their todo tasks through a simple console interface

**Independent Test**: Users can add a task, view it in the list, and confirm it appears with the correct status and details

### Implementation for User Story 1

- [X] T009 [P] [US1] Implement add_task method in src/todo_app.py with title validation
- [X] T010 [P] [US1] Implement list_tasks method in src/todo_app.py to display all tasks
- [X] T011 [US1] Add task ID auto-increment functionality in src/todo_app.py
- [X] T012 [US1] Add default completion status (False) for new tasks in src/todo_app.py
- [X] T013 [US1] Implement task display formatting with ID, title, status, and description in src/todo_app.py
- [X] T014 [US1] Add "No tasks yet" message when task list is empty in src/todo_app.py

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Update and Delete Tasks (Priority: P2)

**Goal**: Users can modify or remove tasks they've previously created

**Independent Test**: User can update an existing task's title or description, or delete a task completely

### Implementation for User Story 2

- [X] T015 [P] [US2] Implement update_task method in src/todo_app.py with ID validation
- [X] T016 [P] [US2] Implement delete_task method in src/todo_app.py with ID validation
- [X] T017 [US2] Add error handling for non-existent task IDs in update/delete operations
- [X] T018 [US2] Add confirmation messages after update/delete operations in src/todo_app.py

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Track Task Completion (Priority: P3)

**Goal**: Users can mark tasks as complete or incomplete to track their progress

**Independent Test**: User can toggle a task's completion status and see the change reflected in the task list

### Implementation for User Story 3

- [X] T019 [P] [US3] Implement toggle_task_status method in src/todo_app.py
- [X] T020 [P] [US3] Add status display logic to show ✓ Done / ☐ Pending in task display
- [X] T021 [US3] Add confirmation messages after toggling task status in src/todo_app.py
- [X] T022 [US3] Implement ID validation for toggle operations in src/todo_app.py

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Input Validation and Error Handling (Priority: P2)

**Goal**: Ensure robust input handling to prevent crashes and provide clear feedback

**Independent Test**: Invalid inputs show appropriate error messages without crashing the application

### Implementation for Input Validation

- [X] T023 [P] Add input validation for menu selection in main loop
- [X] T024 [P] Add error handling for invalid task IDs in all operations
- [X] T025 Add proper error messages for all validation failures
- [X] T026 Implement graceful error recovery without application crashes

---

## Phase 7: User Interface and Menu Flow (Priority: P1)

**Goal**: Implement the main menu loop and ensure proper navigation flow

**Independent Test**: Users can navigate through all menu options and return to main menu after each operation

### Implementation for UI and Menu

- [X] T027 [P] Implement main menu display with options 1-6
- [X] T028 [P] Implement menu selection logic with proper input handling
- [X] T029 Add pause after each operation to return to main menu
- [X] T030 Implement clean exit functionality when user selects quit option

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T031 [P] Add type hints throughout the application in src/todo_app.py
- [X] T032 Documentation updates in src/todo_app.py with docstrings
- [X] T033 Code cleanup and refactoring
- [X] T034 [P] Create README.md with project information and usage instructions
- [X] T035 [P] Update CLAUDE.md with Phase I details
- [X] T036 Run quickstart.md validation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence