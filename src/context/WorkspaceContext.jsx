import React, { createContext, useContext, useState, useEffect } from 'react';
import { workspaceService } from '../services/api';
import { useAuth } from './AuthContext';

const WorkspaceContext = createContext(null);

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};

export const WorkspaceProvider = ({ children }) => {
  const { user } = useAuth();
  const [workspaces, setWorkspaces] = useState([]);
  const [currentWorkspace, setCurrentWorkspace] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load workspaces when user is available
  useEffect(() => {
    // Only load workspaces if user is authenticated
    if (user?.user_id) {
      loadWorkspaces();
    } else {
      // Reset workspaces when user logs out
      setWorkspaces([]);
      setCurrentWorkspace(null);
    }
  }, [user]);

  const loadWorkspaces = async () => {
    if (!user?.user_id) return;
    
    setLoading(true);
    try {
      const data = await workspaceService.list(user.user_id);
      setWorkspaces(data || []);
      
      // Set first workspace as current if none selected
      if (!currentWorkspace && data && data.length > 0) {
        setCurrentWorkspace(data[0]);
      }
    } catch (error) {
      console.error('Error loading workspaces:', error);
      // Don't show error on homepage - workspaces only needed for authenticated pages
      setWorkspaces([]);
    } finally {
      setLoading(false);
    }
  };

  const createWorkspace = async (name, planTier = 'free') => {
    if (!user?.username) {
      throw new Error('User must be logged in to create workspace');
    }
    
    setLoading(true);
    try {
      const newWorkspace = await workspaceService.create({
        name,
        plan_tier: planTier,
      });
      setWorkspaces((prev) => [...prev, newWorkspace]);
      setCurrentWorkspace(newWorkspace);
      return newWorkspace;
    } catch (error) {
      console.error('Error creating workspace:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const selectWorkspace = (workspace) => {
    setCurrentWorkspace(workspace);
    localStorage.setItem('current_workspace_id', workspace.id);
  };

  const updateWorkspace = async (workspaceId, data) => {
    setLoading(true);
    try {
      const updated = await workspaceService.update(workspaceId, data);
      setWorkspaces((prev) =>
        prev.map((w) => (w.id === workspaceId ? updated : w))
      );
      if (currentWorkspace?.id === workspaceId) {
        setCurrentWorkspace(updated);
      }
      return updated;
    } catch (error) {
      console.error('Error updating workspace:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteWorkspace = async (workspaceId) => {
    setLoading(true);
    try {
      await workspaceService.delete(workspaceId);
      setWorkspaces((prev) => prev.filter((w) => w.id !== workspaceId));
      if (currentWorkspace?.id === workspaceId) {
        setCurrentWorkspace(workspaces.find((w) => w.id !== workspaceId) || null);
      }
    } catch (error) {
      console.error('Error deleting workspace:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    workspaces,
    currentWorkspace,
    loading,
    createWorkspace,
    selectWorkspace,
    updateWorkspace,
    deleteWorkspace,
    loadWorkspaces,
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
};

