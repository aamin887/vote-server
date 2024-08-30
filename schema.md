To design the backend for your MERN stack application, we'll be using Node.js with Express as the framework for the server, MongoDB as the database, and Mongoose for object data modelling (ODM). Here's a high-level outline of how you can structure the backend:

### 1. **Database Models**

You'll need to define the following key models:

#### 1.1 **User Model**
This will store information about users, who could be either administrators of an organisation or voters.

```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'voter'], required: true },
    organisation: { type: mongoose.Schema.Types.ObjectId, ref: 'Organisation' },
});

module.exports = mongoose.model('User', userSchema);
```

#### 1.2 **Organisation Model**
This stores details about each organisation.

```javascript
const organisationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Organisation', organisationSchema);
```

#### 1.3 **Election Model**
Each election conducted by an organisation is stored here.

```javascript
const electionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    organisation: { type: mongoose.Schema.Types.ObjectId, ref: 'Organisation', required: true },
    positions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Position' }],
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model('Election', electionSchema);
```

#### 1.4 **Position Model**
Each position in an election (e.g., President, Secretary) is stored here.

```javascript
const positionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    election: { type: mongoose.Schema.Types.ObjectId, ref: 'Election', required: true },
    candidates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' }],
    votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vote' }],
});

module.exports = mongoose.model('Position', positionSchema);
```

#### 1.5 **Candidate Model**
This model holds information about candidates running for positions.

```javascript
const candidateSchema = new mongoose.Schema({
    name: { type: String, required: true },
    position: { type: mongoose.Schema.Types.ObjectId, ref: 'Position', required: true },
});

module.exports = mongoose.model('Candidate', candidateSchema);
```

#### 1.6 **Vote Model**
Records votes by users for specific candidates.

```javascript
const voteSchema = new mongoose.Schema({
    voter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
    position: { type: mongoose.Schema.Types.ObjectId, ref: 'Position', required: true },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Vote', voteSchema);
```

### 2. **Authentication & Authorization**

You can use JWT (JSON Web Tokens) for authentication. Users will log in, and if their credentials are valid, they receive a token that they can use for subsequent API requests. Ensure that the `admin` role has permissions to create elections, add positions, and manage candidates.

### 3. **API Routes**

Here’s a quick overview of the main API routes you'll need:

#### 3.1 **Authentication Routes**
- `POST /auth/register` - Register a new user.
- `POST /auth/login` - Login and get a JWT token.

#### 3.2 **Organisation Routes**
- `POST /organisations` - Create a new organisation (admin only).
- `GET /organisations/:id` - Get details of an organisation.

#### 3.3 **Election Routes**
- `POST /elections` - Create a new election (admin only).
- `GET /elections/:id` - Get details of an election.
- `GET /organisations/:id/elections` - List all elections for a specific organisation.

#### 3.4 **Position Routes**
- `POST /elections/:id/positions` - Create a position for an election.
- `GET /elections/:id/positions/:positionId` - Get details of a position.

#### 3.5 **Vote Routes**
- `POST /elections/:id/positions/:positionId/vote` - Cast a vote for a candidate (once per position).
- `GET /elections/:id/positions/:positionId/results` - Get results for a position (admin only).

### 4. **Business Logic**

- **One-time Voting:** Before allowing a vote, check if the user has already voted for that position.
- **Election Lifecycle:** Ensure that voting is only possible within the election’s start and end dates.
- **Data Validation:** Use Mongoose middlewares and validations to ensure data integrity.

### 5. **Error Handling**

Implement proper error handling for invalid routes, missing data, unauthorized access, and other edge cases.

### 6. **Testing & Security**

- **Unit and Integration Testing:** Write tests for all critical paths using tools like Jest or Mocha.
- **Security:** Implement measures like rate limiting, input validation (to prevent SQL injection), HTTPS, and CORS policies.

### 7. **Deployment**

Once the backend is tested and stable, you can deploy it on platforms like Heroku, AWS, or DigitalOcean.

### 8. **Additional Features (Optional)**

- **WebSockets:** For real-time updates (e.g., results).
- **Admin Dashboard:** For admins to manage elections and view statistics.
- **Email Notifications:** For sending reminders or results to voters.

This structure should give you a solid foundation for your MERN stack election application.