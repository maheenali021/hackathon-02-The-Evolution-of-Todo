from typing import Dict, Optional
import sys


class Task:
    """Represents a single todo task with title, description, and completion status."""

    def __init__(self, task_id: int, title: str, description: Optional[str] = None):
        if not title.strip():
            raise ValueError("Title cannot be empty")
        self.id = task_id
        self.title = title.strip()
        self.description = description.strip() if description else None
        self.completed = False

    def __str__(self) -> str:
        status = "✓ Done" if self.completed else "☐ Pending"
        desc = f"\n   Description: {self.description}" if self.description else ""
        return f"ID: {self.id} | {status} | Title: {self.title}{desc}"


class TodoApp:
    """Console-based todo list manager with in-memory storage."""

    def __init__(self):
        self.tasks: Dict[int, Task] = {}
        self.next_id = 1

    def add_task(self) -> None:
        """Add a new task to the todo list."""
        print("\n--- Add New Task ---")
        title = input("Enter task title (required): ").strip()

        if not title:
            print("Error: Title cannot be empty!")
            return

        description_input = input("Enter task description (optional, press Enter to skip): ").strip()
        description = description_input if description_input else None

        task = Task(self.next_id, title, description)
        self.tasks[self.next_id] = task
        print(f"Task added successfully with ID: {self.next_id}")
        self.next_id += 1

    def list_tasks(self) -> None:
        """Display all tasks in the todo list."""
        print("\n--- All Tasks ---")
        if not self.tasks:
            print("No tasks yet")
            return

        for task in sorted(self.tasks.values(), key=lambda t: t.id):
            print(task)

    def update_task(self) -> None:
        """Update an existing task's title and/or description."""
        print("\n--- Update Task ---")
        try:
            task_id = int(input("Enter task ID to update: "))
        except ValueError:
            print("Error: Please enter a valid task ID (number)!")
            return

        if task_id not in self.tasks:
            print(f"Error: Task with ID {task_id} does not exist!")
            return

        task = self.tasks[task_id]
        print(f"Current task: {task}")

        new_title = input(f"Enter new title (current: '{task.title}', press Enter to keep current): ").strip()
        if new_title:
            if not new_title:
                print("Error: Title cannot be empty!")
                return
            task.title = new_title

        new_desc = input(f"Enter new description (current: '{task.description or 'None'}', press Enter to keep current): ").strip()
        if new_desc == "":
            # User pressed Enter, keep current description
            pass
        else:
            task.description = new_desc if new_desc else None

        print(f"Task {task_id} updated successfully!")

    def delete_task(self) -> None:
        """Delete a task from the todo list."""
        print("\n--- Delete Task ---")
        try:
            task_id = int(input("Enter task ID to delete: "))
        except ValueError:
            print("Error: Please enter a valid task ID (number)!")
            return

        if task_id not in self.tasks:
            print(f"Error: Task with ID {task_id} does not exist!")
            return

        del self.tasks[task_id]
        print(f"Task {task_id} deleted successfully!")

    def toggle_task_status(self) -> None:
        """Toggle a task's completion status."""
        print("\n--- Toggle Task Status ---")
        try:
            task_id = int(input("Enter task ID to toggle: "))
        except ValueError:
            print("Error: Please enter a valid task ID (number)!")
            return

        if task_id not in self.tasks:
            print(f"Error: Task with ID {task_id} does not exist!")
            return

        task = self.tasks[task_id]
        task.completed = not task.completed
        status = "completed" if task.completed else "incomplete"
        print(f"Task {task_id} marked as {status}!")

    def show_menu(self) -> None:
        """Display the main menu."""
        print("\n" + "="*40)
        print("         TODO LIST MANAGER")
        print("="*40)
        print("1. Add new task")
        print("2. List all tasks")
        print("3. Update task")
        print("4. Delete task")
        print("5. Toggle complete/incomplete")
        print("6. Quit")
        print("="*40)

    def run(self) -> None:
        """Main application loop."""
        print("Welcome to the Todo List Manager!")

        while True:
            self.show_menu()

            try:
                choice = input("Select an option (1-6): ").strip()

                if choice == "1":
                    self.add_task()
                elif choice == "2":
                    self.list_tasks()
                elif choice == "3":
                    self.update_task()
                elif choice == "4":
                    self.delete_task()
                elif choice == "5":
                    self.toggle_task_status()
                elif choice == "6":
                    print("\nThank you for using the Todo List Manager. Goodbye!")
                    sys.exit(0)
                else:
                    print("\nInvalid option! Please select a number between 1-6.")

                # Pause to let user see the result before showing menu again
                if choice in ["1", "2", "3", "4", "5"]:
                    input("\nPress Enter to continue...")

            except KeyboardInterrupt:
                print("\n\nApplication interrupted. Goodbye!")
                sys.exit(0)
            except EOFError:
                print("\n\nGoodbye!")
                sys.exit(0)


def main():
    """Entry point for the application."""
    app = TodoApp()
    app.run()


if __name__ == "__main__":
    main()