# Berkeley Student Information System

A comprehensive student information management system for Philippine schools with grade encoding, SF10 generation, and student enrollment management.

## Features

- **School Management**: Configure school profile and manage sections
- **Student Enrollment**: Enroll students with detailed profiles and academic history
- **Grade Encoding**: Bulk import and encode grades by quarter
- **SF10 Generation**: Generate and export Student Form 10 documents
- **Import Management**: Track and manage grade import operations
- **Subject Management**: Configure subjects and curriculum

## Tech Stack

- **Backend**: Node.js + Express.js + PostgreSQL
- **Frontend**: React + TypeScript + Vite
- **Database**: PostgreSQL with stored procedures
- **UI**: Tailwind CSS + shadcn/ui components

## Setup Instructions

### 1. Database Setup

1. Install PostgreSQL and create a database named `berkeley_sis`
2. Run the schema file:
   ```sql
   psql -d berkeley_sis -f database/berkeley_schema.sql
   ```
3. Import mock data (optional):
   ```sql
   psql -d berkeley_sis -f database/mock_data_import.sql
   ```

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd back-end
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure database connection in `db.js`:
   ```javascript
   const db = pgp({
     host: 'localhost',
     port: 5432,
     database: 'berkeley_sis',
     user: 'your_username',
     password: 'your_password'
   });
   ```

4. Start the backend server:
   ```bash
   npm start
   ```
   The server will run on http://localhost:4000

### 3. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd front-end
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The app will be available at http://localhost:5173

### 4. Running Both Services

Use the provided batch file to run both services:
```bash
run-all.bat
```

## API Endpoints

### School Management
- `GET /api/school/profile` - Get school profile
- `PUT /api/school/profile` - Update school profile
- `GET /api/school-years` - Get school years
- `POST /api/school-years` - Create school year
- `GET /api/sections` - Get sections
- `POST /api/sections` - Create section

### Student Management
- `GET /api/students` - Get students (with filters)
- `POST /api/students` - Add student
- `GET /api/students/:id` - Get student details
- `PUT /api/students/:id` - Update student
- `POST /api/students/enroll` - Enroll student

### Grade Management
- `GET /api/grades/class` - Get class grade sheet
- `PUT /api/grades/class` - Save class grades
- `GET /api/grades/student/:id` - Get student grades
- `GET /api/grades/general-average` - Get general averages

### Import Management
- `POST /api/imports` - Start import
- `GET /api/imports` - Get import history
- `POST /api/imports/:id/confirm` - Confirm import

### SF10 Management
- `GET /api/sf10/:studentId` - Get SF10 data
- `POST /api/sf10/bulk` - Generate bulk SF10
- `GET /api/sf10/:studentId/export` - Export SF10 PDF

## Database Schema

The system uses PostgreSQL with the following main tables:
- `school` - School information
- `school_years` - Academic years
- `sections` - Class sections
- `teachers` - Teaching staff
- `students` - Student records
- `enrollments` - Student enrollments
- `subjects` - Subject definitions
- `subject_grades` - Individual grades
- `academic_records` - Academic history
- `import_logs` - Import operation logs

## Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **pg-promise** - PostgreSQL client
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Frontend
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible UI components
- **Lucide React** - Icon library
- **Recharts** - Chart library
- **shadcn/ui** - Component library

### Database
- **PostgreSQL** - Relational database
- **PL/pgSQL** - Stored procedures and functions

## Project Structure

```
berkeley-student-information-system/
├── run-all.bat                    # Batch script to start both servers
├── back-end/                      # Backend application
│   ├── app.js                     # Main Express application
│   ├── db.js                      # Database connection
│   ├── package.json               # Backend dependencies and scripts
│   └── routes/                    # API route handlers
│       ├── auth.js                # Authentication routes
│       ├── school.js              # School management routes
│       ├── students.js            # Student management routes
│       ├── subjects.js            # Subject management routes
│       ├── grades.js              # Grade encoding routes
│       ├── imports.js             # Import management routes
│       └── sf10.js                # SF10 generation routes
├── database/                      # Database schema and scripts
│   ├── berkeley_schema.sql        # PostgreSQL schema with tables and functions
│   └── mock_data_import.sql       # Mock data for testing
└── front-end/                     # Frontend React application
    ├── package.json               # Frontend dependencies and scripts
    ├── index.html                 # Main HTML file
    ├── tsconfig.json              # TypeScript configuration
    ├── vite.config.ts             # Vite configuration
    ├── src/
    │   ├── main.tsx               # Application entry point
    │   ├── App.tsx                # Main application component
    │   ├── routes.ts              # Route definitions
    │   ├── services/
    │   │   ├── api.ts             # API service functions
    │   │   └── auth.ts            # Authentication service
    │   ├── components/            # Reusable UI components
    │   ├── pages/                 # Page components
    │   └── lib/                   # Utility functions
```

## Development

### Adding New Features

1. **Backend**: Add routes in the appropriate file under `back-end/routes/`
2. **Frontend**: Add API functions in `front-end/src/services/api.ts`
3. **Database**: Add stored procedures in `database/berkeley_schema.sql`

### Testing

- Backend tests: Run `npm test` in the `back-end` directory
- Frontend tests: Run `npm test` in the `front-end` directory

## License

This project is for educational purposes.
    ├── vite.config.ts             # Vite configuration
    ├── tsconfig*.json             # TypeScript configurations
    ├── eslint.config.js           # ESLint configuration
    ├── components.json            # shadcn/ui configuration
    ├── public/                    # Static assets
    └── src/
        ├── main.tsx               # Application entry point
        ├── App.tsx                # Main App component with routing
        ├── App.css                # Global styles
        ├── index.css              # Additional global styles
        ├── routes.ts              # Route definitions (assumed)
        ├── assets/                # Static assets
        ├── components/            # Reusable UI components
        │   ├── sidebar.tsx        # Sidebar navigation
        │   └── ui/                # shadcn/ui components
        │       ├── alert-dialog.tsx
        │       ├── alert.tsx
        │       ├── avatar.tsx
        │       ├── badge.tsx
        │       ├── button.tsx
        │       ├── card.tsx
        │       ├── dialog.tsx
        │       ├── dropdown-menu.tsx
        │       ├── GradeEncoding.tsx
        │       ├── input.tsx
        │       ├── label.tsx
        │       ├── progress.tsx
        │       ├── select.tsx
        │       ├── separator.tsx
        │       └── switch.tsx
        ├── hooks/                 # Custom React hooks
        ├── lib/
        │   └── utils.ts           # Utility functions
        ├── pages/                 # Page components
        │   ├── Dashboard.tsx      # Main dashboard
        │   ├── MockData.ts        # Mock data utilities
        │   ├── types.ts           # TypeScript type definitions
        │   ├── auth/
        │   │   └── Login.tsx      # Login page
        │   ├── encoding/          # Grade encoding pages
        │   │   ├── ClassGradeSheet.tsx
        │   │   ├── GeneralAverageView.tsx
        │   │   ├── GradeEncodingHome.tsx
        │   │   ├── MockData.ts
        │   │   └── StudentGradeView.tsx
        │   ├── import/            # Grade import pages
        │   │   ├── ImportDashboard.tsx
        │   │   ├── ImportHistory.tsx
        │   │   └── NewImport.tsx
        │   ├── school/            # School management pages
        │   │   ├── AdviserAssignment.tsx
        │   │   ├── SchoolProfile.tsx
        │   │   ├── SchoolYearForm.tsx
        │   │   ├── SchoolYearList.tsx
        │   │   ├── SectionForm.tsx
        │   │   ├── SectionList.tsx
        │   ├── sf10/              # SF10 report generation pages
        │   │   ├── BulkSF10Generation.tsx
        │   │   ├── SF10Home.tsx
        │   │   ├── SF10Preview.tsx
        │   │   └── SingleStudentSF10.tsx
        │   ├── students/          # Student management pages
        │   │   ├── EnrollStudent.tsx
        │   │   ├── mockData.ts
        │   │   ├── StudentForm.tsx
        │   │   ├── StudentList.tsx
        │   │   └── StudentProfile.tsx
        │   └── subjects/          # Subject management pages
        │       ├── SubjectForm.tsx
        │       └── SubjectList.tsx
        └── services/              # API service functions
            └── auth.ts            # Authentication service
```

## Features

### Authentication
- User login system
- Password hashing with bcrypt
- Session management

### Dashboard
- Overview of system statistics
- Quick access to main features

### School Management
- School profile configuration
- School year management
- Section/class management
- Adviser assignment

### Student Management
- Student enrollment
- Student profiles
- Student listing and search
- Student editing

### Subject Management
- Subject creation and editing
- Subject listing

### Grade Import
- Bulk grade data import
- Import history tracking
- Import log details

### Grade Encoding
- Class grade sheets
- Individual student grade views
- General average calculations

### SF10 Generation
- Individual student SF10 reports
- Bulk SF10 generation
- SF10 preview

## Database Schema

The application uses PostgreSQL with the following main components:

- **users** table: Stores user accounts for authentication
- Authentication functions: `register_user()` and `get_user_for_login()`

*Note: The current schema focuses on authentication. Additional tables for students, subjects, grades, etc., are likely planned for future development.*

## Entities and Data Types

Based on the frontend TypeScript definitions, the following entities represent the core data model for the student information system:

### School Management
- **School**: Basic school information including DepEd ID, district, division, region, and address
- **SchoolYear**: Academic year with start/end dates, active status, and associated quarters
- **Quarter**: Individual grading periods within a school year
- **Teacher**: Staff members with employee IDs and contact information
- **Section**: Class sections with grade level, adviser assignment, and student count

### Student Management
- **Student**: Complete student profile including LRN, personal details, birthdate, and elementary school eligibility information
- **Enrollment**: Student enrollment records with school year, grade level, section, and status tracking
- **AcademicRecord**: Complete academic history with grades and general averages
- **SubjectGrade**: Individual subject grades with quarterly breakdowns and final calculations

### Subject Management
- **Subject**: Curriculum subjects with codes, names, and MAPEH (Music, Arts, Physical Education, Health) handling

### Grade Management
- **StudentGrade**: Student-specific grade records across subjects
- **ImportLog**: Records of grade data imports from external sources (e.g., Google Drive spreadsheets)
- **ValidationError**: Error tracking for data import validation
- **ImportPreviewRow**: Preview data for import operations
- **ColumnMapping**: Field mapping for spreadsheet imports

### Additional Frontend Types
These additional types are used in frontend pages and mock data helpers:
- **SubjectGradeEntry**: Grade row model (q1/q2/q3/q4/final/remarks, with optional MAPEH components)
- **GradeYearEntry**: Historical grades and section for a student in the transfer/enrollment wizard
- **SchoolRecord**: Previous school profile + grade year entries for transfer student history
- **NavChild / NavItem / SidebarUser / SidebarProps**: Sidebar structure and navigation metadata

### Key Relationships
- SchoolYear → Quarters (1:many)
- Section → SchoolYear (many:1), Section → Teacher (adviser) (many:1)
- Student → Enrollment (1:many)
- Enrollment → AcademicRecord (1:1)
- AcademicRecord → SubjectGrade (1:many)
- Subject → SubjectGrade (many:many through AcademicRecord)

### Data Constraints
- Grade levels: 7-10 (Junior High School)
- Quarters: 1-4 per school year
- Grades: 0-100 scale with letter grade conversions
- Student status: Enrolled, Promoted, Retained, Transferred, Dropped
- Import status: success, partial, failed, processing

This type system provides a foundation for designing the complete database schema with proper relationships, constraints, and data integrity rules.

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. **Clone the repository** (if applicable) or navigate to the project directory

2. **Set up the database:**
   - Create a PostgreSQL database
   - Run the schema.sql file to create tables and functions
   - Update database connection settings in back-end environment variables

3. **Install backend dependencies:**
   ```bash
   cd back-end
   npm install
   ```

4. **Install frontend dependencies:**
   ```bash
   cd ../front-end
   npm install
   ```

5. **Configure environment variables:**
   - Create a `.env` file in the `back-end` directory
   - Add database connection string and other required variables

### Running the Application

#### Option 1: Using the batch script (Windows)
```bash
run-all.bat
```
This will start both the backend and frontend servers in separate command windows.

#### Option 2: Manual startup

**Start the backend server:**
```bash
cd back-end
npm start
```
The backend will run on `http://localhost:4000`

**Start the frontend development server:**
```bash
cd front-end
npm run dev
```
The frontend will run on `http://localhost:5173`

### Building for Production

**Build the frontend:**
```bash
cd front-end
npm run build
```

**Start the backend in production:**
```bash
cd back-end
npm start
```

## Development

### Available Scripts

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

**Backend:**
- `npm start` - Start the server
- `npm test` - Run tests (currently not implemented)

### Code Style
- TypeScript for type safety
- ESLint for code linting
- Tailwind CSS for styling
- Component-based architecture with React

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

*Note: Additional API endpoints for students, grades, etc., are planned for future development.*

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Future Development

- Complete database schema implementation
- Full API development for all features
- User role management
- Advanced reporting features
- Integration with external systems
- Mobile responsiveness improvements</content>
<parameter name="filePath">c:\Users\deade\OneDrive\Documents\Projects\berkeley-student-information-system\README.md