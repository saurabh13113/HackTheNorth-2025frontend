import { ShoppingBag, Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme.jsx';

const Header = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="border-b border-color bg-secondary">
      <div className="container">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent-primary text-white rounded-xl">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary">InstaShopper</h1>
              <p className="text-sm text-secondary">AI-Powered Video Product Analysis</p>
            </div>
          </div>

          <button
            onClick={toggleTheme}
            className="btn btn-ghost p-2"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;