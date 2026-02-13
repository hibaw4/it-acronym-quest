# IT Acronym Quest 🎮

An educational Serious Game that helps computer science students memorize IT abbreviations and logos (API, DNS, SQL, JEE, Docker, etc.).

https://github.com/user-attachments/assets/7b4579e9-f545-4264-89a6-4c04a55328c5

🔗 **Link**: [https://it-acronym-quest.netlify.app/](https://it-acronym-quest.netlify.app/)

## Project Description

IT Acronym Quest is an educational game inspired by the "Guess the Brand" concept. The idea is simple:

- An image or abbreviation is displayed
- The user must enter the full term
- Immediate visual feedback (Correct/Incorrect)
- Scoring system and progress tracking

## Installation & Setup

### Prerequisites
- Node.js (version 18 or higher)
- npm (version 9 or higher)
- Angular CLI 17

### Installation
To run the app manually:

Clone the repository:
```bash
git clone https://github.com/YOUR-USERNAME/it-acronym-quest.git
cd it-acronym-quest
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm start
# or
ng serve
```

Open your browser at:
```
http://localhost:4200
```

### Production Build
```bash
npm run build
```

Production files will be generated in `dist/it-acronym-quest/browser/`.

## 📁 Project Structure
```
src/
├── app/
│   ├── core/      # Models & services
│   ├── shared/    # Reusable components
│   ├── game/      # Quiz & results (Lazy Loaded)
│   └── admin/     # Admin panel (Lazy Loaded)
├── assets/
│   ├── data/      # acronyms.json
│   └── logos/
├── _redirects     # Netlify SPA routing
└── styles.css
netlify.toml       # Netlify config
angular.json
package.json
README.md
```

## 📊 JSON Data Structure

The file `src/assets/data/acronyms.json` contains an array of objects structured as follows:
```json
{
  "id": "1",
  "abbreviation": "API",
  "fullTerm": "Application Programming Interface",
  "category": "Software Development",
  "description": "A set of rules that allows different software applications to communicate with each other",
  "logoUrl": "assets/logos/api.png"
}
```

### Required Fields

- `id` – Unique identifier (string)
- `abbreviation` – The abbreviation to guess (string)
- `fullTerm` – The complete term (string)
- `category` – Category (string)
- `description` – Optional description (string)
- `logoUrl` – Optional logo URL (string)

### How JSON Data Management Works

This application uses a **hybrid approach** for data management without requiring a backend server:

**Initial Data Loading:**
The application reads the initial dataset from `src/assets/data/acronyms.json` at startup. The `DataService` uses Angular's `HttpClient` to fetch this JSON file and populates a `BehaviorSubject` that acts as an in-memory data store. This approach simulates a real API call using RxJS Observables, making the code easily adaptable to a real backend in the future.

**Runtime Data Management:**
When users add, edit, or delete acronyms through the Admin panel, these changes are:
1. Immediately reflected in the application state via the `BehaviorSubject`
2. Persisted to the browser's `localStorage` through the `StorageService`
3. Available across page refreshes without needing a database

## 🎯 Features

### Quiz Mode

- ✅ Random display of logos or abbreviations
- ✅ Immediate visual feedback (green for correct, red for incorrect)
- ✅ Scoring system (10 points per correct answer)
- ✅ Progress bar showing current question and total
- ✅ Statistics: Correct, Incorrect, Remaining questions
- ✅ Available hints:
  - First two letters hint
  - Technology description

### Administration Panel

- ✅ Dashboard listing all acronyms
- ✅ Add, edit, and delete acronyms
- ✅ Complete form with validation
- ✅ Data persistence using `localStorage`
- ✅ Responsive Material Design interface

### Results Page

- ✅ Final score display
- ✅ Percentage calculation
- ✅ Performance message based on score
- ✅ Correct/Incorrect breakdown
- ✅ Play again functionality

## 🛠️ Technologies Used

- **Angular 17.3.0** – Main framework with modular architecture (NgModules)
- **Angular Material 17.3.10** – UI components (dialogs, forms, tables)
- **Tailwind CSS 3.4.0** – Responsive utility-first styling
- **RxJS 7.8.0** – Reactive programming with Observables
- **TypeScript 5.4.0** – Strict typing and modern JavaScript features

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Angular Material](https://img.shields.io/badge/Angular_Material-E0352B?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![RxJS](https://img.shields.io/badge/RxJS-B7178C?style=for-the-badge&logo=rxjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 🏗️ Architecture

The application follows a **modular architecture** with **lazy loading**:

### Core Module
- Shared services and models
- Single instance throughout the application
- Business logic isolation

### Shared Module
- Reusable UI components (Header, Card)
- Exported Angular Material modules
- Common utilities

### Feature Modules

**Game Module** (Lazy Loaded)
- Quiz component
- Result component
- Quiz state management

**Admin Module** (Lazy Loaded)
- Dashboard component
- Item form component
- CRUD operations

### State Management

- Uses Angular services with:
  - `BehaviorSubject` for reactive state management
  - `Observables` for component communication
- API simulation using `of()` from RxJS (no backend required)
- Clean separation between presentation and business logic

### Data Persistence

- **Initial data**: JSON file in `/assets/data/acronyms.json`
- **Admin changes**: Stored in browser `localStorage`
- **No backend required**: Fully client-side application

This project uses **NgModules** (the traditional Angular approach) instead of the newer **standalone components** introduced in Angular 14+.

**NgModule Architecture (Used in this project):**
```typescript
// game.module.ts - Feature module with clear boundaries
@NgModule({
  declarations: [GameComponent, QuizComponent, ResultComponent],
  imports: [CommonModule, SharedModule, GameRoutingModule]
})
export class GameModule { }
```

**Advantages of NgModules:**
- **Clear organizational structure**: Each feature (Game, Admin) is encapsulated in its own module
- **Explicit dependency management**: All component dependencies are declared in one place
- **Better for large teams**: Clearer boundaries between different application areas
- **Lazy loading**: Easy to implement code-splitting for better performance
- **Educational value**: Demonstrates traditional Angular architecture used in most existing enterprise applications

**Standalone Components Alternative:**
```typescript
// Example of standalone approach (NOT used in this project)
@Component({
  selector: 'app-quiz',
  standalone: true,  // Component is self-contained
  imports: [CommonModule, FormsModule]  // Direct imports
})
export class QuizComponent { }
```
While standalone components offer simpler syntax and less boilerplate, NgModules provide better organization for medium-to-large applications and demonstrate architectural patterns commonly found in professional Angular projects.

### Lazy Loading Implementation

**What is Lazy Loading?**
Lazy loading is a design pattern that delays the loading of non-critical resources (in this case, entire feature modules) until they are needed. Instead of loading all application code upfront, lazy loading splits the application into chunks that are loaded on-demand.

**How It Works in This Project:**

The application uses route-based lazy loading configured in `app-routing.module.ts`:
```typescript
const routes: Routes = [
  { path: '', redirectTo: 'game', pathMatch: 'full' },
  {
    path: 'game',
    loadChildren: () => import('./game/game.module').then(m => m.GameModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  }
];
```

**What This Means:**
1. **Initial Load**: When the app first loads, only the Core module, Shared module, and App module are downloaded
2. **On-Demand Loading**: When a user navigates to `/game`, the Game module (and all its components) are downloaded
3. **Separate Bundles**: The Admin module is in a completely separate JavaScript bundle, only loaded when needed

**Performance Benefits:**
- **Faster initial load time**: Main bundle is smaller (~200KB instead of ~500KB)
- **Better user experience**: Users only download what they need
- **Reduced bandwidth usage**: Users who never visit Admin don't download Admin code
- **Improved caching**: Smaller, focused bundles are cached more effectively

**Visual Example:**
```
Without Lazy Loading:          With Lazy Loading:
┌─────────────────────┐        ┌──────────────┐
│   Main Bundle       │        │ Main Bundle  │
│   - Core            │        │ - Core       │
│   - Shared          │        │ - Shared     │
│   - Game    ←       │        │ - App        │
│   - Admin   ← Big   │        └──────────────┘
└─────────────────────┘        ┌──────────────┐
      (~500KB)                 │ Game Bundle  │ (loaded on /game)
                               └──────────────┘
                               ┌──────────────┐
                               │ Admin Bundle │ (loaded on /admin)
                               └──────────────┘
                               (Total: ~200KB initial, ~150KB per feature)
```

This lazy loading strategy is especially important for applications that will grow over time, as new features can be added without impacting initial load performance.

## 🎨 Design

- Modern, game-inspired interface
- Smooth transitions with Angular Animations
- Responsive design (mobile-first approach)
- Accessibility support:
  - Material Design labels
  - Proper color contrast
  - Keyboard navigation

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server on http://localhost:4200 |
| `npm run build` | Production build (outputs to `dist/`) |
| `npm test` | Run unit tests with Karma |
| `ng generate component <name>` | Generate a new component |

## 🚀 Deployment

### Netlify
The application is configured for Netlify deployment with SPA routing support. To see the website deployed with Netlify, enter to the link mentionned above.
The project includes the file `netlify.toml` for automatic configuration.

![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)

## 📚 Technical Documentation

### Main Services

**DataService** (`core/services/data.service.ts`)
- Manages acronym CRUD operations
- Uses `BehaviorSubject` for reactive data flow
- Simulates API calls with RxJS `of()`

**QuizService** (`core/services/quiz.service.ts`)
- Quiz state management
- Score calculation
- Question shuffling
- Hint system

**StorageService** (`core/services/storage.service.ts`)
- `localStorage` abstraction
- Data persistence for admin changes

### Main Components

**QuizComponent** (`game/quiz/quiz.component.ts`)
- Game interface
- Answer validation
- Feedback display
- Progress tracking

**ResultComponent** (`game/result/result.component.ts`)
- Final score display
- Performance metrics
- Replay functionality

**DashboardComponent** (`admin/dashboard/dashboard.component.ts`)
- Acronym list display
- CRUD operations interface
- Material Design table

**ItemFormComponent** (`admin/item-form/item-form.component.ts`)
- Reactive form for adding/editing acronyms
- Form validation
- Material Design dialog

## ⚡ Known Limitations & Improvements

### Admin Changes Persistence

Currently, new acronyms added via the **Admin panel**:

- Are stored only in the **browser's localStorage**.
- Work immediately in the quiz **for the same browser and session**.
- **Do not persist across page refreshes or for other users** on the deployed Netlify site.

**Reason:** The app is hosted as a **static site**; Netlify serves the initial JSON file (`/assets/data/acronyms.json`) on each load. LocalStorage changes are not shared between users or sessions.

**Potential improvements:**

- Integrate a **backend service** (e.g., Firebase, Supabase, or Node.js API) to store acronyms centrally.
- Ensure **all users** can see newly added acronyms.
- Persist admin changes across **deployments and sessions**.
