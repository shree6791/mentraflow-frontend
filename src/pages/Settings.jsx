import React, { useEffect, useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { useAuth } from '../context/AuthContext';
import { preferencesService } from '../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { User, BookOpen, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { COLORS } from '../constants/theme';

const Settings = () => {
  const { user } = useAuth();
  const { currentWorkspace } = useWorkspace();
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // User profile fields
  const [profileData, setProfileData] = useState({
    display_name: '',
    learning_goal: '',
    experience_level: '',
    preferred_language: 'en',
    bio: '',
  });

  // Study preferences
  const [studyPreferences, setStudyPreferences] = useState({
    daily_target_minutes: 30,
    preferred_study_mode: 'adaptive',
    reminders_enabled: true,
    difficulty_adaptive: true,
    gamification_enabled: true,
    quiet_hours_start: '22:00',
    quiet_hours_end: '07:00',
  });


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
      
      // Populate profile data
      if (data) {
        setProfileData({
          display_name: data.display_name || user?.display_name || user?.full_name || '',
          learning_goal: data.learning_goal || '',
          experience_level: data.experience_level || 'intermediate',
          preferred_language: data.preferred_language || 'en',
          bio: data.bio || '',
        });

        setStudyPreferences({
          daily_target_minutes: data.daily_target_minutes || 30,
          preferred_study_mode: data.preferred_study_mode || 'adaptive',
          reminders_enabled: data.reminders_enabled !== undefined ? data.reminders_enabled : true,
          difficulty_adaptive: data.difficulty_adaptive !== undefined ? data.difficulty_adaptive : true,
          gamification_enabled: data.gamification_enabled !== undefined ? data.gamification_enabled : true,
          quiet_hours_start: data.quiet_hours_start || '22:00',
          quiet_hours_end: data.quiet_hours_end || '07:00',
        });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
      toast.error('Failed to load preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user?.user_id) return;

    setSaving(true);
    try {
      const allPreferences = {
        ...preferences,
        ...profileData,
        ...studyPreferences,
      };

      const updated = await preferencesService.update(
        user.user_id,
        allPreferences,
        currentWorkspace?.id
      );
      setPreferences(updated);
      toast.success('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const updateProfileField = (key, value) => {
    setProfileData(prev => ({ ...prev, [key]: value }));
  };

  const updateStudyPreference = (key, value) => {
    setStudyPreferences(prev => ({ ...prev, [key]: value }));
  };


  if (loading) {
    return (
      <div className="p-6 md:p-8 flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: COLORS.brand.deepTeal }} />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between flex-shrink-0">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: COLORS.brand.deepTeal }}>
            Settings
          </h1>
          <p className="text-gray-600 text-lg">Manage your preferences and account settings</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          size="lg"
          style={{ backgroundColor: COLORS.brand.deepTeal, color: 'white' }}
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save All Settings
            </>
          )}
        </Button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" style={{ color: COLORS.brand.deepTeal }} />
              <CardTitle>Profile Information</CardTitle>
            </div>
            <CardDescription>
              Personalize your learning experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Display Name
              </label>
              <Input
                value={profileData.display_name}
                onChange={(e) => updateProfileField('display_name', e.target.value)}
                placeholder="Your display name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Learning Goal
              </label>
              <Input
                value={profileData.learning_goal}
                onChange={(e) => updateProfileField('learning_goal', e.target.value)}
                placeholder="e.g., Master machine learning, Pass certification exam"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Experience Level
              </label>
              <select
                value={profileData.experience_level}
                onChange={(e) => updateProfileField('experience_level', e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-teal"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Preferred Language
              </label>
              <select
                value={profileData.preferred_language}
                onChange={(e) => updateProfileField('preferred_language', e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-teal"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="zh">Chinese</option>
                <option value="ja">Japanese</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Bio
              </label>
              <textarea
                value={profileData.bio}
                onChange={(e) => updateProfileField('bio', e.target.value)}
                placeholder="Tell us about yourself..."
                rows={4}
                className="w-full px-3 py-2 border border-input rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-teal resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Study Preferences */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" style={{ color: COLORS.brand.deepTeal }} />
              <CardTitle>Study Preferences</CardTitle>
            </div>
            <CardDescription>
              Customize your learning schedule and experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Daily Target (minutes)
              </label>
              <Input
                type="number"
                min="5"
                max="480"
                step="5"
                value={studyPreferences.daily_target_minutes}
                onChange={(e) => updateStudyPreference('daily_target_minutes', parseInt(e.target.value) || 30)}
                placeholder="30"
              />
              <p className="text-xs text-gray-500 mt-1">Recommended: 20-60 minutes</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Preferred Study Mode
              </label>
              <select
                value={studyPreferences.preferred_study_mode}
                onChange={(e) => updateStudyPreference('preferred_study_mode', e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-teal"
              >
                <option value="adaptive">Adaptive (Spaced Repetition)</option>
                <option value="linear">Linear (Sequential)</option>
                <option value="random">Random</option>
                <option value="difficulty">By Difficulty</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-sm">Reminders Enabled</p>
                <p className="text-xs text-gray-600">Get notifications for due reviews</p>
              </div>
              <button
                onClick={() => updateStudyPreference('reminders_enabled', !studyPreferences.reminders_enabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  studyPreferences.reminders_enabled ? 'bg-primary-teal' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    studyPreferences.reminders_enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-sm">Difficulty Adaptive</p>
                <p className="text-xs text-gray-600">Adjust difficulty based on performance</p>
              </div>
              <button
                onClick={() => updateStudyPreference('difficulty_adaptive', !studyPreferences.difficulty_adaptive)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  studyPreferences.difficulty_adaptive ? 'bg-primary-teal' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    studyPreferences.difficulty_adaptive ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-sm">Gamification</p>
                <p className="text-xs text-gray-600">Enable streaks and achievements</p>
              </div>
              <button
                onClick={() => updateStudyPreference('gamification_enabled', !studyPreferences.gamification_enabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  studyPreferences.gamification_enabled ? 'bg-primary-teal' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    studyPreferences.gamification_enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Quiet Hours Start
                </label>
                <Input
                  type="time"
                  value={studyPreferences.quiet_hours_start}
                  onChange={(e) => updateStudyPreference('quiet_hours_start', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Quiet Hours End
                </label>
                <Input
                  type="time"
                  value={studyPreferences.quiet_hours_end}
                  onChange={(e) => updateStudyPreference('quiet_hours_end', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>
            Your account details (read-only)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Email</p>
              <p className="font-medium">{user?.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Username</p>
              <p className="font-medium">{user?.username || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Full Name</p>
              <p className="font-medium">{user?.full_name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">User ID</p>
              <p className="font-medium text-xs font-mono text-gray-500">{user?.user_id || user?.id || 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default Settings;
