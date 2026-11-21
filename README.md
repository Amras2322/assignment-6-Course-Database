# Assignment #6: Course Database

A course catalog management API built with **Express.js** and a **SQLite** data tier. Courses are stored in `university.db` and persist between server restarts.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. The repository already includes a seeded `database/university.db`, so you can skip straight to step 3. To recreate the database from scratch, run:

   ```bash
   node database/setup.js   # creates university.db and the courses table
   node database/seed.js    # inserts the sample course catalog
   ```

3. Start the server:

   ```bash
   npm start
   ```

   The API runs at `http://localhost:3000`.

Both scripts are safe to re-run: `setup.js` uses `CREATE TABLE IF NOT EXISTS`, and `seed.js` clears the table before inserting, so you won't end up with duplicate rows.

## Database Schema

`database/setup.js` creates a `courses` table:

| Column | Type | Notes |
| --- | --- | --- |
| `id` | INTEGER | Primary key, auto-increment |
| `courseCode` | TEXT | e.g. `CS101` |
| `title` | TEXT | e.g. `Intro Programming` |
| `credits` | INTEGER | e.g. `3` |
| `description` | TEXT | Short course description |
| `semester` | TEXT | e.g. `Fall 2024` |

The database ships pre-seeded with 8 courses.

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/courses` | Get all courses |
| GET | `/api/courses/:id` | Get a single course by ID |
| POST | `/api/courses` | Create a new course |
| PUT | `/api/courses/:id` | Update an existing course |
| DELETE | `/api/courses/:id` | Delete a course |

All queries use parameterized statements, and requests for a course that does not exist return `404`.

### Example requests

```bash
# List all courses
curl http://localhost:3000/api/courses

# Create a course
curl -X POST http://localhost:3000/api/courses \
  -H "Content-Type: application/json" \
  -d '{"courseCode":"CS350","title":"Operating Systems","credits":4,"description":"Processes, memory, and concurrency","semester":"Spring 2025"}'

# Update a course
curl -X PUT http://localhost:3000/api/courses/1 \
  -H "Content-Type: application/json" \
  -d '{"courseCode":"CS101","title":"Intro Programming","credits":4,"description":"Learn Python basics","semester":"Fall 2024"}'

# Delete a course
curl -X DELETE http://localhost:3000/api/courses/1
```

## File Structure

```
server.js            # Express app: SQLite connection + CRUD routes
database/
├── setup.js         # Creates university.db and the courses table
├── seed.js          # Inserts the sample course catalog
└── university.db    # SQLite database (pre-seeded)
package.json
README.md
```
