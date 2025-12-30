import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { FolderPlus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { COLORS } from '../constants/theme';

const WorkspaceCreateModal = ({ open, onOpenChange, onSuccess }) => {
  const { createWorkspace, loading } = useWorkspace();
  const [workspaceName, setWorkspaceName] = useState('');
  const [creating, setCreating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!workspaceName.trim()) {
      toast.error('Please enter a workspace name');
      return;
    }

    setCreating(true);
    try {
      // plan_tier is always 'free' by default (handled in WorkspaceContext)
      const newWorkspace = await createWorkspace(workspaceName.trim());
      toast.success(`Workspace "${newWorkspace.name}" created successfully!`);
      setWorkspaceName('');
      onOpenChange(false);
      if (onSuccess) {
        onSuccess(newWorkspace);
      }
    } catch (error) {
      console.error('Error creating workspace:', error);
      toast.error(error.response?.data?.detail || 'Failed to create workspace');
    } finally {
      setCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${COLORS.brand.deepTeal}15` }}
            >
              <FolderPlus 
                className="h-5 w-5" 
                style={{ color: COLORS.brand.deepTeal }}
              />
            </div>
            <DialogTitle className="text-2xl">Create New Workspace</DialogTitle>
          </div>
          <DialogDescription>
            Organize your documents and learning materials in a dedicated workspace.
            You can create multiple workspaces for different subjects or projects.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div>
              <label htmlFor="workspace-name" className="block text-sm font-medium mb-2 text-gray-700">
                Workspace Name
              </label>
              <Input
                id="workspace-name"
                placeholder="e.g., Machine Learning Course, Finance Exam Prep"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                disabled={creating}
                autoFocus
                maxLength={100}
              />
              <p className="text-xs text-gray-500 mt-1">
                Choose a name that helps you organize your learning materials
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={creating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={creating || !workspaceName.trim()}
              style={{ backgroundColor: COLORS.brand.deepTeal, color: 'white' }}
            >
              {creating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <FolderPlus className="mr-2 h-4 w-4" />
                  Create Workspace
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WorkspaceCreateModal;

