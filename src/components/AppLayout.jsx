import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWorkspace } from '../context/WorkspaceContext';
import { 
  LayoutDashboard, 
  FileText, 
  Brain, 
  MessageSquare, 
  Settings, 
  LogOut,
  BookOpen,
  Menu,
  X,
  FolderPlus,
  ChevronDown
} from 'lucide-react';
import { Button } from './ui/button';
import WorkspaceCreateModal from './WorkspaceCreateModal';
import { COLORS } from '../constants/theme';

const AppLayout = ({ children }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { currentWorkspace, workspaces, selectWorkspace, loading } = useWorkspace();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [workspaceModalOpen, setWorkspaceModalOpen] = useState(false);
  const [workspaceDropdownOpen, setWorkspaceDropdownOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Documents', href: '/documents', icon: FileText },
    { name: 'Flashcards', href: '/flashcards', icon: BookOpen },
    { name: 'Knowledge Graph', href: '/knowledge-graph', icon: Brain },
    { name: 'Knowledge Assistant', href: '/chat', icon: MessageSquare },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary-teal">MentraFlow</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-40
            w-64 bg-white border-r border-gray-200
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0
            pt-16 lg:pt-0
            h-screen lg:h-full
            flex flex-col
          `}
        >
          <div className="flex flex-col h-full overflow-hidden">
            {/* Logo */}
            <div className="px-6 py-4 border-b border-gray-200 hidden lg:block">
              <h1 className="text-2xl font-bold text-primary-teal">MentraFlow</h1>
              <p className="text-sm text-gray-500">Learn Smarter</p>
            </div>

            {/* Workspace Selector */}
            <div className="px-6 py-4 border-b border-gray-200">
              <p className="text-xs text-gray-500 mb-2 font-medium">Workspace</p>
              {workspaces.length === 0 ? (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 mb-2">No workspaces yet</p>
                  <Button
                    onClick={() => setWorkspaceModalOpen(true)}
                    className="w-full"
                    size="sm"
                    style={{ backgroundColor: COLORS.brand.deepTeal, color: 'white' }}
                  >
                    <FolderPlus className="mr-2 h-4 w-4" />
                    Create Workspace
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="relative">
                    <button
                      onClick={() => setWorkspaceDropdownOpen(!workspaceDropdownOpen)}
                      className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-teal transition-colors"
                    >
                      <span className="truncate text-left">
                        {currentWorkspace ? currentWorkspace.name : 'Select workspace'}
                      </span>
                      <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${workspaceDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {workspaceDropdownOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-10"
                          onClick={() => setWorkspaceDropdownOpen(false)}
                        />
                        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                          {workspaces.map((ws) => (
                            <button
                              key={ws.id}
                              onClick={() => {
                                selectWorkspace(ws);
                                setWorkspaceDropdownOpen(false);
                              }}
                              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                                currentWorkspace?.id === ws.id ? 'bg-primary-teal/10 text-primary-teal font-medium' : 'text-gray-700'
                              }`}
                            >
                              {ws.name}
                            </button>
                          ))}
                          <div className="border-t border-gray-200">
                            <button
                              onClick={() => {
                                setWorkspaceDropdownOpen(false);
                                setWorkspaceModalOpen(true);
                              }}
                              className="w-full text-left px-3 py-2 text-sm text-primary-teal hover:bg-gray-50 transition-colors flex items-center"
                            >
                              <FolderPlus className="mr-2 h-4 w-4" />
                              Create New Workspace
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <WorkspaceCreateModal
              open={workspaceModalOpen}
              onOpenChange={setWorkspaceModalOpen}
              onSuccess={() => {
                // Workspace will be automatically selected after creation
              }}
            />

            {/* Navigation */}
            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`
                      flex items-center px-4 py-3 text-sm font-medium rounded-lg
                      transition-colors
                      ${
                        isActive
                          ? 'bg-primary-teal text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* User Section */}
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 rounded-full bg-primary-teal flex items-center justify-center text-white text-sm font-medium">
                  {user?.display_name?.[0] || user?.email?.[0] || 'U'}
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.display_name || user?.full_name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-0 h-full bg-gray-50 flex flex-col overflow-hidden">
          <div className="pt-16 lg:pt-0 flex-1 min-h-0 overflow-y-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AppLayout;

