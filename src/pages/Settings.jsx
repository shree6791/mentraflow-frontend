import React, { useEffect, useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { useAuth } from '../context/AuthContext';
import { preferencesService } from '../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Settings as SettingsIcon } from 'lucide-react';
import { toast } from 'sonner';

const Settings = () => {
  const { user } = useAuth();
  const { currentWorkspace } = useWorkspace();
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && currentWorkspace) {
      loadPreferences();
    }
  }, [user, currentWorkspace]);

  const loadPreferences = async () => {
    if (!user?.user_id) return;

    setLoading(true);
    try {
      const data = await preferencesService.get(
        user.user_id,
        currentWorkspace?.id
      );
      setPreferences(data);
    } catch (error) {
      console.error('Error loading preferences:', error);
      toast.error('Failed to load preferences');
    } finally {
      setLoading(false);
    }
  };

  const updatePreference = async (key, value) => {
    if (!user?.user_id || !preferences) return;

    try {
      const updated = await preferencesService.update(
        user.user_id,
        { ...preferences, [key]: value },
        currentWorkspace?.id
      );
      setPreferences(updated);
      toast.success('Preferences updated');
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Failed to update preferences');
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="spinner mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600">Manage your preferences and account settings</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>User Preferences</CardTitle>
          <CardDescription>
            Configure how MentraFlow processes your documents
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {preferences && (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto-ingest on upload</p>
                  <p className="text-sm text-gray-600">
                    Automatically process documents when uploaded
                  </p>
                </div>
                <Button
                  variant={preferences.auto_ingest_on_upload ? 'default' : 'outline'}
                  onClick={() =>
                    updatePreference(
                      'auto_ingest_on_upload',
                      !preferences.auto_ingest_on_upload
                    )
                  }
                >
                  {preferences.auto_ingest_on_upload ? 'Enabled' : 'Disabled'}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto-generate summary</p>
                  <p className="text-sm text-gray-600">
                    Automatically create summaries after ingestion
                  </p>
                </div>
                <Button
                  variant={preferences.auto_summary_after_ingest ? 'default' : 'outline'}
                  onClick={() =>
                    updatePreference(
                      'auto_summary_after_ingest',
                      !preferences.auto_summary_after_ingest
                    )
                  }
                >
                  {preferences.auto_summary_after_ingest ? 'Enabled' : 'Disabled'}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto-generate flashcards</p>
                  <p className="text-sm text-gray-600">
                    Automatically create flashcards after ingestion
                  </p>
                </div>
                <Button
                  variant={preferences.auto_flashcards_after_ingest ? 'default' : 'outline'}
                  onClick={() =>
                    updatePreference(
                      'auto_flashcards_after_ingest',
                      !preferences.auto_flashcards_after_ingest
                    )
                  }
                >
                  {preferences.auto_flashcards_after_ingest ? 'Enabled' : 'Disabled'}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Default flashcard mode</p>
                  <p className="text-sm text-gray-600">
                    Preferred flashcard type (MCQ or Q&A)
                  </p>
                </div>
                <select
                  value={preferences.default_flashcard_mode || 'mcq'}
                  onChange={(e) => updatePreference('default_flashcard_mode', e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="mcq">MCQ</option>
                  <option value="qa">Q&A</option>
                </select>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Display Name</p>
              <p className="font-medium">{user?.display_name || user?.full_name || 'N/A'}</p>
            </div>
            {user?.username && (
              <div>
                <p className="text-sm text-gray-600">Username</p>
                <p className="font-medium">{user.username}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;

