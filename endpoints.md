### 1. **Authentication Endpoints**

#### 1.1 `POST /auth/onboard/register`

- **Purpose**: Register an organisation (this is the onboarding of the association or organisation).
- **Process**:
  1. The organisation submits their registration details (e.g., name, email, password).
  2. The server hashes the user's password using a library like `bcrypt` before saving it to the database.
  3. A new `User` document is created in the `User` collection with the provided data.
  4. If the user is an `admin`, they can later create an `Organisation` and manage elections.
- **Associated Schema**: `User`

#### 1.2 `POST /auth/org/login`

- **Purpose**: Authenticate a user and provide them with a JWT token.
- **Process**:
  1. The user submits their email and password.
  2. The server finds the user by email in the `User` collection.
  3. The server compares the provided password with the hashed password in the database.
  4. If the password matches, the server generates a JWT token and sends it back to the user.
  5. The user will use this token for authenticated requests.
- **Associated Schema**: `User`

### 2. **Organisation Endpoints**

#### 2.1 `POST /organisations`

- **Purpose**: Create a new organisation (only for admins).
- **Process**:
  1. An authenticated admin submits organisation details (e.g., name, description).
  2. The server creates a new `Organisation` document, associating it with the admin who created it.
  3. The admin is now linked to the organisation through the `organisation` field in the `User` schema.
- **Associated Schema**: `Organisation`, `User` (relationship)

#### 2.2 `GET /organisations/:id`

- **Purpose**: Retrieve details of a specific organisation.
- **Process**:
  1. The server retrieves the `Organisation` document by its ID.
  2. The server returns the organisation's details, including its name, description, and associated admin.
- **Associated Schema**: `Organisation`

### 3. **Election Endpoints**

#### 3.1 `POST /elections`

- **Purpose**: Create a new election for an organisation (only for admins).
- **Process**:
  1. An authenticated admin submits the election details (e.g., name, start date, end date).
  2. The server checks that the admin is associated with an organisation.
  3. A new `Election` document is created, linked to the organisation.
  4. The election's `positions` array is initially empty and can be populated later.
- **Associated Schema**: `Election`, `Organisation` (relationship)

#### 3.2 `GET /elections/:id`

- **Purpose**: Retrieve details of a specific election.
- **Process**:
  1. The server retrieves the `Election` document by its ID.
  2. The server returns the election details, including its name, start/end dates, and associated positions.
- **Associated Schema**: `Election`

#### 3.3 `GET /organisations/:id/elections`

- **Purpose**: List all elections for a specific organisation.
- **Process**:
  1. The server retrieves the `Organisation` document by its ID.
  2. The server retrieves all `Election` documents associated with that organisation.
  3. The server returns a list of elections.
- **Associated Schema**: `Election`, `Organisation`

### 4. **Position Endpoints**

#### 4.1 `POST /elections/:id/positions`

- **Purpose**: Create a new position for an election.
- **Process**:
  1. An authenticated admin submits the position details (e.g., name).
  2. The server creates a new `Position` document linked to the election.
  3. The position is added to the `positions` array of the relevant `Election` document.
  4. The `candidates` array in the `Position` schema is initially empty and can be populated later.
- **Associated Schema**: `Position`, `Election` (relationship)

#### 4.2 `GET /elections/:id/positions/:positionId`

- **Purpose**: Retrieve details of a specific position in an election.
- **Process**:
  1. The server retrieves the `Position` document by its ID.
  2. The server returns the position details, including its name and associated candidates.
- **Associated Schema**: `Position`

### 5. **Vote Endpoints**

#### 5.1 `POST /elections/:id/positions/:positionId/vote`

- **Purpose**: Cast a vote for a candidate in a specific position.
- **Process**:
  1. An authenticated voter submits their vote for a candidate in a specific position.
  2. The server checks that the voter hasn’t already voted for that position (using the `Vote` collection).
  3. If valid, a new `Vote` document is created, linked to the voter, candidate, and position.
  4. The `Vote` is added to the `votes` array in the `Position` document.
  5. Once voted for a position, the voter cannot vote again for that position.
- **Associated Schema**: `Vote`, `User`, `Candidate`, `Position` (relationships)

#### 5.2 `GET /elections/:id/positions/:positionId/results`

- **Purpose**: Retrieve the results of voting for a specific position (admin only).
- **Process**:
  1. The server retrieves all `Vote` documents associated with a specific position.
  2. The server counts the votes for each candidate.
  3. The server returns the results, including the number of votes each candidate received.
- **Associated Schema**: `Vote`, `Position`

### **Associated Schema Relationships**

- **User - Organisation**: A `User` can belong to one `Organisation`. This is used to distinguish between different organisations within the platform.
- **Organisation - Election**: An `Organisation` can have multiple `Elections`.
- **Election - Position**: An `Election` can have multiple `Positions`.
- **Position - Candidate**: A `Position` can have multiple `Candidates`.
- **Position - Vote**: A `Position` can have multiple `Votes`, where each `Vote` is linked to a `Candidate` and a `Voter`.

This design should provide a clear and robust structure for your backend, allowing you to manage elections, positions, candidates, and votes effectively within the MERN stack application.
