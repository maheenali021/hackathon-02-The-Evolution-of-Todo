# Todo Full-Stack Web Application

A modern multi-user Todo Web Application with JWT-authenticated REST API and attractive Next.js dashboard.

## Features

- Multi-user support with secure authentication
- JWT-based authentication using Better Auth
- Beautiful dashboard with neon purple + midnight blue theme
- Glassmorphism UI effects
- Full CRUD operations for todo tasks
- Responsive design for mobile, tablet, and desktop
- User isolation - users can only access their own tasks
- Optimistic updates for smooth UX
- Animated task completion effects

## Tech Stack

- **Frontend**: Next.js 16+ with App Router, TypeScript, Tailwind CSS
- **Backend**: FastAPI with SQLModel
- **Database**: Neon PostgreSQL Serverless
- **Authentication**: Better Auth with JWT tokens
- **Styling**: Tailwind CSS with custom theme

## Setup

### Prerequisites

- Node.js 18+
- Python 3.10+
- UV package manager
- Neon PostgreSQL account

### Installation

1. Clone the repository
2. Install backend dependencies:
   ```bash
   cd backend
   uv venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   uv pip install fastapi uvicorn sqlmodel python-multipart python-jose[cryptography] passlib[bcrypt] python-dotenv
   ```
3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```
4. Set up environment variables (see `.env.example`)

### Running the Application

1. Start the backend:
   ```bash
   cd backend
   uvicorn main:app --reload --port 8000
   ```
2. Start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

The application will be available at `http://localhost:3000`

## API Endpoints

All API endpoints require JWT authentication in the Authorization header.

- `GET /api/{user_id}/tasks` - List all tasks for a user
- `POST /api/{user_id}/tasks` - Create a new task
- `GET /api/{user_id}/tasks/{id}` - Get a specific task
- `PUT /api/{user_id}/tasks/{id}` - Update a task
- `DELETE /api/{user_id}/tasks/{id}` - Delete a task
- `PATCH /api/{user_id}/tasks/{id}/complete` - Toggle task completion

## Environment Variables

Create `.env` files in both frontend and backend directories:

**Backend (.env):**
```
DATABASE_URL=postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require
BETTER_AUTH_SECRET=your-super-secret-jwt-key-here
```

## Screenshots

![Dashboard View](screenshots/dashboard.png)
![Task List](screenshots/task-list.png)
![Create Task Modal](screenshots/create-task-modal.png)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details