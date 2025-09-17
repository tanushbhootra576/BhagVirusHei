# CivicPulse - Citizen Issue Reporting and Management System

CivicPulse is a comprehensive platform that bridges the gap between citizens and government, enabling efficient reporting and resolution of civic issues. The application provides separate interfaces for citizens to report problems and government officials to manage and resolve them.

## Features

### For Citizens
- **Issue Reporting**: Easy-to-use interface for reporting civic problems with location, description, and photo uploads
- **Issue Tracking**: Real-time tracking of reported issues with status updates and timeline visualization
- **Notifications**: Stay informed about issue status changes and official responses
- **User Dashboard**: View all submitted issues and their current status in one place
- **Authentication**: Secure login and registration with profile management

### For Government Officials
- **Issue Management**: Comprehensive dashboard to view, assign, update, and resolve citizen-reported issues
- **Analytics Dashboard**: Data visualization and statistics to identify trends and problem areas
- **Alert Management**: Create and manage public alerts for emergencies or planned maintenance
- **Department Assignment**: Assign issues to relevant departments for faster resolution
- **Resolution Documentation**: Upload proof of resolution with photos and details
- **Performance Metrics**: Track department performance and resolution time

### General Features
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Indian Government Theme**: Professional UI with official Indian government design language
- **Role-based Access**: Different interfaces and permissions for citizens and government officials
- **Mock Data**: Comprehensive testing data included for development purposes
- **Dark/Light Mode**: Customizable appearance options

## Technology Stack

### Frontend
- React.js with React Router for SPA navigation
- Context API for state management
- Modern CSS with responsive design
- Chart.js for data visualization
- Firebase Authentication

### Backend (API)
- Express.js RESTful API
- MongoDB database
- JWT authentication
- File upload handling
- Data analytics processing

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/civic-pulse.git
   cd civic-pulse
   ```

2. Install dependencies for frontend
   ```bash
   cd frontend
   npm install
   ```

3. Install dependencies for backend
   ```bash
   cd ../backend
   npm install
   ```

### Running the Application

1. Start the backend server
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend application
   ```bash
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal)

## Usage

### Citizen Access
- Register as a new user with the "Citizen" role
- Report issues via the "Report Issue" page
- Track issue status and updates on your dashboard
- Receive notifications when your issue status changes

### Government Access
- Register with the "Government" role (requires approval in production)
- View pending issues on the dashboard
- Assign issues to departments
- Update issue status as they progress
- Mark issues as resolved with resolution details
- View analytics to identify problem areas

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any questions or feedback, please contact us at support@civicpulse.gov.in

## Theming System

The application uses a CSS variables approach for light/dark themes. A `data-theme` attribute is applied to the root `<html>` element. Variables are defined in `src/index.css` under `:root` (light) and `[data-theme="dark"]` (dark). Use the semantic tokens (e.g. `--color-bg-primary`, `--color-text-secondary`, `--color-primary`) instead of hard-coded hex values when adding new components.

`ThemeContext` (see `src/context/ThemeContext.jsx`) exposes:
* `theme` – the resolved current theme (`light` or `dark`).
* `rawPreference` – user preference (`light`, `dark`, or `system`).
* `toggleTheme()` – flips between light and dark (overrides system).
* `setTheme(pref)` – set explicit preference (`light` | `dark` | `system`).

Example usage:
```jsx
import React, { useContext } from 'react';
import ThemeContext from '../context/ThemeContext';

const ThemeToggleButton = () => {
   const { toggleTheme, theme } = useContext(ThemeContext);
   return <button onClick={toggleTheme}>Theme: {theme}</button>;
};
```

## Search Bar Component

`SearchBar` (in `src/components/common/SearchBar.jsx`) provides debounced search input with a clear button. Props:
* `onChange(term)` – invoked after debounce (default 300ms).
* `placeholder` – custom placeholder text.
* `delay` – debounce interval.
* `value` / `defaultValue` – controlled / uncontrolled usage.

Example usage:
```jsx
<SearchBar onChange={(term) => setFilter(term)} placeholder="Search issues" />
```

The All Issues dashboard page demonstrates filtering across multiple fields using `useMemo`.
