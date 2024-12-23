import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-800">
              PlanFlow
            </Link>
          </div>
          <div className="hidden sm:flex sm:items-center sm:ml-6">
            <Link to="/create-project">
              <Button className="mr-2">Create Project</Button>
            </Link>
            <Button variant="outline" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
          <div className="flex items-center sm:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Plus className="h-6 w-6" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1 px-4">
            <Link to="/create-project">
              <Button className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" /> Create Project
              </Button>
            </Link>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
