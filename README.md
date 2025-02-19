# Library Management System

A modern, responsive web application for managing library operations including books, authors, publishers, and borrowing processes.

## [Live Demo](https://venerable-flan-0caa88.netlify.app/)


## 🚀 Features

- **Book Management**: Add, edit, delete, and track books with detailed information
- **Author Management**: Maintain author profiles with biographical data
- **Publisher Management**: Track publisher details and their publications
- **Category System**: Organize books by categories
- **Borrowing System**: Handle book borrowing and returns
- **Dashboard**: View key statistics and recent activities
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Technologies

- **Frontend Framework**: React
- **State Management**: Context API
- **Routing**: React Router
- **HTTP Client**: Axios
- **UI Components**: Custom components with responsive design
- **Icons**: Lucide React
- **Styling**: CSS with CSS Variables

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API server running on `http://localhost:8080`

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/library-management.git
```

2. Navigate to the project directory:
```bash
cd library-management
```

3. Install dependencies:
```bash
npm install
# or
yarn install
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── authors/      # Author management components
│   │   ├── AuthorForm.jsx
│   │   └── Authors.jsx
│   ├── books/        # Book management components
│   │   ├── BookForm.jsx
│   │   └── Books.jsx
│   ├── borrows/      # Borrowing system components
│   │   ├── BorrowForm.jsx
│   │   ├── Borrows.jsx
│   │   └── BorrowsTable.jsx
│   ├── categories/   # Category management components
│   │   ├── CategoryForm.jsx
│   │   └── Categories.jsx
│   ├── common/       # Reusable components
│   │   ├── Layout.jsx
│   │   ├── Modal.jsx
│   │   ├── Navbar.jsx
│   │   ├── Spinner.jsx
│   │   ├── Table.jsx
│   │   └── Toast.jsx
│   ├── error/        # Error handling components
│   │   └── ErrorAlert.jsx
│   └── publishers/   # Publisher management components
│       ├── PublisherForm.jsx
│       └── Publishers.jsx
├── contexts/         # React Context providers
│   ├── LibraryContext.jsx
│   ├── RootProvider.jsx
│   └── UIContext.jsx
├── pages/           # Page components
│   └── Home.jsx     # Landing page with dashboard
├── hooks/           # Custom React hooks
│   ├── useCRUD.js
│   └── useErrorHandler.js
├── services/        # API service layer
│   └── api.js      # API configuration and endpoints
└── styles/          # Global styles and themes
    └── global.css   # Global CSS styles and variables
```

### Directory Details:

- **components/**: Contains all React components organized by feature
  - **authors/**: Author management related components
  - **books/**: Book management related components
  - **borrows/**: Borrowing system related components
  - **categories/**: Category management related components
  - **common/**: Reusable components used across the application
  - **error/**: Error handling and display components
  - **publishers/**: Publisher management related components

- **contexts/**: Contains React Context providers for state management
  - `LibraryContext.jsx`: Manages library data state
  - `UIContext.jsx`: Manages UI state (toasts, modals)
  - `RootProvider.jsx`: Root context provider

- **pages/**: Contains page-level components
  - `Home.jsx`: Landing page with dashboard and statistics

- **hooks/**: Custom React hooks for shared logic
  - `useCRUD.js`: Hook for handling CRUD operations
  - `useErrorHandler.js`: Hook for error handling

- **services/**: Contains API and service configurations
  - `api.js`: Axios configuration and API endpoints

- **styles/**: Contains global styles and theme configurations
  - `global.css`: Global CSS variables and styles

## 🔍 Key Features Detail

### 📚 Books Module
- Complete CRUD operations
- Stock tracking
- Author and publisher associations
- Category assignments
- Publication year tracking

### 👥 Authors Module
- Author information management
- Birth date and country tracking
- Books by author listing

### 📖 Borrowing Module
- Book lending process
- Return tracking
- Borrowing history
- Active loans monitoring

### 🏢 Publishers Module
- Publisher information
- Establishment year tracking
- Address management
- Books by publisher listing

### 🏷️ Categories Module
- Category management
- Books by category listing

## 🎨 UI/UX Features

- Clean, modern interface
- Responsive design
- Loading states
- Toast notifications
- Modal dialogs
- Form validations
- Error handling
- Gradient animations
- Interactive hover effects

## 🔒 Security Features

- Input validation
- Date validations
- Stock quantity checks
- Data integrity checks

## 📞 Support

For support, email ahmet.sulu1993@gmail.com or create an issue in the repository.