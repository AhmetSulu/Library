import { NavLink } from 'react-router-dom';
import { 
  Home,
  BookOpen,
  Users,
  BookCopy,
  Library,
  FolderOpen
} from 'lucide-react';

// Navigation items configuration
const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/publishers', label: 'Publishers', icon: Library },
  { path: '/categories', label: 'Categories', icon: FolderOpen },
  { path: '/authors', label: 'Authors', icon: Users },
  { path: '/books', label: 'Books', icon: BookOpen },
  { path: '/borrows', label: 'Borrow Books', icon: BookCopy },
];

export default function Navbar() {
  return (
    <nav className="navbar gradient-border">
      <div className="navbar-container">
        {/* Brand logo and title */}
        <NavLink to="/" className="nav-brand">
          <Library size={24} />
          <span>Library Management</span>
        </NavLink>
        
        {/* Navigation links */}
        <div className="nav-links">
          {navItems.map(({ path, label, icon: Icon }) => (
            <NavLink 
              key={path} 
              to={path} 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}