import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWorkspace } from '../context/WorkspaceContext';
import { documentService, flashcardService, kgService } from '../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { FileText, BookOpen, Brain, MessageSquare, Plus, ChevronLeft, ChevronRight, FolderPlus, Sparkles, Target, Award, Zap } from 'lucide-react';
import { toast } from 'sonner';
import WorkspaceCreateModal from '../components/WorkspaceCreateModal';
import { COLORS } from '../constants/theme';

const Dashboard = () => {
  const { currentWorkspace, user, workspaces } = useWorkspace();
  const [stats, setStats] = useState({
    documents: 0,
    flashcards: 0,
    concepts: 0,
  });
  const [insights, setInsights] = useState({
    totalFlashcards: 0,
    dueFlashcards: 0,
    processedDocuments: 0,
    averageMastery: 0,
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);
  const [loadingInsights, setLoadingInsights] = useState(true);
  const [currentStatIndex, setCurrentStatIndex] = useState(0);
  const [currentActionIndex, setCurrentActionIndex] = useState(0);
  const [workspaceModalOpen, setWorkspaceModalOpen] = useState(false);

  useEffect(() => {
    if (currentWorkspace) {
      loadStats();
      loadInsights();
    }
  }, [currentWorkspace]);

  const loadStats = async () => {
    if (!currentWorkspace) return;

    setLoading(true);
    try {
      const [documents, flashcards, concepts] = await Promise.all([
        documentService.list(currentWorkspace.id).catch(() => []),
        flashcardService.list(currentWorkspace.id, { limit: 1 }).catch(() => []),
        kgService.listConcepts(currentWorkspace.id, { limit: 1 }).catch(() => []),
      ]);

      setStats({
        documents: documents.length || 0,
        flashcards: flashcards.length || 0,
        concepts: concepts.length || 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
      toast.error('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const loadInsights = async () => {
    if (!currentWorkspace || !user) return;

    setLoadingInsights(true);
    try {
      const [allFlashcards, dueFlashcards, documents, concepts] = await Promise.all([
        flashcardService.list(currentWorkspace.id, { limit: 100 }).catch(() => []),
        flashcardService.getDue(currentWorkspace.id, user.user_id, 100).catch(() => []),
        documentService.list(currentWorkspace.id).catch(() => []),
        kgService.listConcepts(currentWorkspace.id, { limit: 100 }).catch(() => []),
      ]);

      // Calculate insights
      const processedDocs = documents.filter(doc => 
        doc.status === 'processed' || doc.status === 'completed'
      ).length;

      // Calculate average mastery (based on flashcard ease/interval if available)
      let totalMastery = 0;
      let masteryCount = 0;
      allFlashcards.forEach(card => {
        if (card.ease_factor) {
          // Convert ease factor to mastery percentage (0-100)
          const mastery = Math.min(100, (card.ease_factor / 2.5) * 100);
          totalMastery += mastery;
          masteryCount++;
        }
      });
      const averageMastery = masteryCount > 0 ? Math.round(totalMastery / masteryCount) : 0;

      // Get recent activity (last 7 days of document uploads)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const recentDocs = documents.filter(doc => 
        new Date(doc.created_at) >= sevenDaysAgo
      );

      setInsights({
        totalFlashcards: allFlashcards.length,
        dueFlashcards: dueFlashcards.length || 0,
        processedDocuments: processedDocs,
        averageMastery,
        recentActivity: recentDocs.length,
      });
    } catch (error) {
      console.error('Error loading insights:', error);
    } finally {
      setLoadingInsights(false);
    }
  };

  if (!currentWorkspace) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto">
          <Card className="border-2 border-dashed border-gray-300">
            <CardContent className="p-12 text-center">
              <div 
                className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
                style={{ backgroundColor: `${COLORS.brand.deepTeal}15` }}
              >
                <FolderPlus 
                  className="h-8 w-8" 
                  style={{ color: COLORS.brand.deepTeal }}
                />
              </div>
              <h2 className="text-3xl font-bold mb-3 text-gray-900">
                {workspaces.length === 0 ? 'Create Your First Workspace' : 'No Workspace Selected'}
              </h2>
              <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
                {workspaces.length === 0 
                  ? 'Organize your learning materials in dedicated workspaces. Create one to get started!'
                  : 'Please create or select a workspace to get started with MentraFlow.'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  onClick={() => setWorkspaceModalOpen(true)}
                  size="lg"
                  style={{ backgroundColor: COLORS.brand.deepTeal, color: 'white' }}
                  className="min-w-[200px]"
                >
                  <FolderPlus className="mr-2 h-5 w-5" />
                  Create Workspace
                </Button>
                {workspaces.length > 0 && (
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => window.location.reload()}
                    className="min-w-[200px]"
                  >
                    Refresh
                  </Button>
                )}
              </div>
              {workspaces.length === 0 && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-4">What are workspaces?</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <Sparkles className="h-5 w-5 mb-2" style={{ color: COLORS.brand.deepTeal }} />
                      <p className="font-medium text-sm mb-1">Organize by Topic</p>
                      <p className="text-xs text-gray-600">Group related documents together</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <Brain className="h-5 w-5 mb-2" style={{ color: COLORS.brand.deepTeal }} />
                      <p className="font-medium text-sm mb-1">Build Knowledge Graphs</p>
                      <p className="text-xs text-gray-600">See connections between concepts</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <BookOpen className="h-5 w-5 mb-2" style={{ color: COLORS.brand.deepTeal }} />
                      <p className="font-medium text-sm mb-1">Track Progress</p>
                      <p className="text-xs text-gray-600">Monitor your learning journey</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <WorkspaceCreateModal
          open={workspaceModalOpen}
          onOpenChange={setWorkspaceModalOpen}
          onSuccess={(workspace) => {
            toast.success(`Welcome to "${workspace.name}"!`);
          }}
        />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Documents',
      value: stats.documents,
      icon: FileText,
      color: COLORS.primary.teal,
      bgGradient: 'from-teal-50 to-cyan-50',
      borderColor: 'border-teal-200',
      href: '/documents',
    },
    {
      title: 'Flashcards',
      value: stats.flashcards,
      icon: BookOpen,
      color: COLORS.secondary.yellow,
      bgGradient: 'from-yellow-50 to-amber-50',
      borderColor: 'border-yellow-200',
      href: '/flashcards',
    },
    {
      title: 'Concepts',
      value: stats.concepts,
      icon: Brain,
      color: COLORS.primary.ocean,
      bgGradient: 'from-blue-50 to-indigo-50',
      borderColor: 'border-blue-200',
      href: '/knowledge-graph',
    },
  ];

  return (
    <div className="p-6 md:p-8 h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="mb-8 flex-shrink-0">
        <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: COLORS.brand.deepTeal }}>
          Dashboard
        </h1>
        <p className="text-gray-600 text-lg">Your knowledge retention overview. Track what's sticking and what needs reinforcement.</p>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto pb-6">
        {/* Stats Grid - Desktop */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <Link key={index} to={stat.href}>
            <Card className={`card-hover border-2 ${stat.borderColor} bg-gradient-to-br ${stat.bgGradient} hover:shadow-xl transition-all duration-300`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">{stat.title}</p>
                    <p className="text-4xl font-bold" style={{ color: stat.color }}>
                      {loading ? '...' : stat.value}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl shadow-sm" style={{ backgroundColor: `${stat.color}15` }}>
                    <stat.icon className="h-8 w-8" style={{ color: stat.color }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Stats Carousel - Mobile */}
      <div className="md:hidden mb-8 relative">
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentStatIndex * 100}%)` }}
          >
            {statCards.map((stat, index) => (
              <Link key={index} to={stat.href} className="min-w-full px-2">
                <Card className={`card-hover border-2 ${stat.borderColor} bg-gradient-to-br ${stat.bgGradient} hover:shadow-xl transition-all duration-300`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">{stat.title}</p>
                        <p className="text-4xl font-bold" style={{ color: stat.color }}>
                          {loading ? '...' : stat.value}
                        </p>
                      </div>
                      <div className="p-4 rounded-xl shadow-sm" style={{ backgroundColor: `${stat.color}15` }}>
                        <stat.icon className="h-8 w-8" style={{ color: stat.color }} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Carousel Controls */}
        <div className="flex justify-center items-center mt-4 space-x-2">
          <button
            onClick={() => setCurrentStatIndex((prev) => (prev > 0 ? prev - 1 : statCards.length - 1))}
            className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
            aria-label="Previous stat"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>
          <div className="flex space-x-1">
            {statCards.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStatIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentStatIndex ? 'w-8 bg-primary-teal' : 'w-2 bg-gray-300'
                }`}
                aria-label={`Go to stat ${index + 1}`}
              />
            ))}
          </div>
          <button
            onClick={() => setCurrentStatIndex((prev) => (prev < statCards.length - 1 ? prev + 1 : 0))}
            className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
            aria-label="Next stat"
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="mb-8 border-2 border-gray-200 bg-gradient-to-br from-white to-gray-50 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Zap className="h-5 w-5" style={{ color: COLORS.brand.deepTeal }} />
            Quick Actions
          </CardTitle>
          <CardDescription>Jump right into your learning journey</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Desktop Grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/documents">
              <Button 
                variant="outline" 
                className="w-full h-auto py-4 flex flex-col items-center justify-center gap-2 border-2 hover:border-teal-300 hover:bg-teal-50 transition-all"
              >
                <div className="p-2 rounded-lg bg-teal-100">
                  <Plus className="h-5 w-5 text-teal-600" />
                </div>
                <span className="font-semibold">Upload Document</span>
                <span className="text-xs text-gray-500">Add new materials</span>
              </Button>
            </Link>
            <Link to="/flashcards">
              <Button 
                variant="outline" 
                className="w-full h-auto py-4 flex flex-col items-center justify-center gap-2 border-2 hover:border-yellow-300 hover:bg-yellow-50 transition-all"
              >
                <div className="p-2 rounded-lg bg-yellow-100">
                  <BookOpen className="h-5 w-5 text-yellow-600" />
                </div>
                <span className="font-semibold">Study Flashcards</span>
                <span className="text-xs text-gray-500">Review & practice</span>
              </Button>
            </Link>
            <Link to="/knowledge-graph">
              <Button 
                variant="outline" 
                className="w-full h-auto py-4 flex flex-col items-center justify-center gap-2 border-2 hover:border-blue-300 hover:bg-blue-50 transition-all"
              >
                <div className="p-2 rounded-lg bg-blue-100">
                  <Brain className="h-5 w-5 text-blue-600" />
                </div>
                <span className="font-semibold">View Knowledge Graph</span>
                <span className="text-xs text-gray-500">Explore concepts</span>
              </Button>
            </Link>
            <Link to="/chat">
              <Button 
                variant="outline" 
                className="w-full h-auto py-4 flex flex-col items-center justify-center gap-2 border-2 hover:border-purple-300 hover:bg-purple-50 transition-all"
              >
                <div className="p-2 rounded-lg bg-purple-100">
                  <MessageSquare className="h-5 w-5 text-purple-600" />
                </div>
                <span className="font-semibold">Ask Questions</span>
                <span className="text-xs text-gray-500">Get AI assistance</span>
              </Button>
            </Link>
          </div>

          {/* Mobile Carousel */}
          <div className="md:hidden relative">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentActionIndex * 100}%)` }}
              >
                <div className="min-w-full px-2">
                  <Link to="/documents">
                    <Button 
                      variant="outline" 
                      className="w-full h-auto py-4 flex flex-col items-center justify-center gap-2 border-2"
                    >
                      <div className="p-2 rounded-lg bg-teal-100">
                        <Plus className="h-5 w-5 text-teal-600" />
                      </div>
                      <span className="font-semibold">Upload Document</span>
                    </Button>
                  </Link>
                </div>
                <div className="min-w-full px-2">
                  <Link to="/flashcards">
                    <Button 
                      variant="outline" 
                      className="w-full h-auto py-4 flex flex-col items-center justify-center gap-2 border-2"
                    >
                      <div className="p-2 rounded-lg bg-yellow-100">
                        <BookOpen className="h-5 w-5 text-yellow-600" />
                      </div>
                      <span className="font-semibold">Study Flashcards</span>
                    </Button>
                  </Link>
                </div>
                <div className="min-w-full px-2">
                  <Link to="/knowledge-graph">
                    <Button 
                      variant="outline" 
                      className="w-full h-auto py-4 flex flex-col items-center justify-center gap-2 border-2"
                    >
                      <div className="p-2 rounded-lg bg-blue-100">
                        <Brain className="h-5 w-5 text-blue-600" />
                      </div>
                      <span className="font-semibold">Knowledge Graph</span>
                    </Button>
                  </Link>
                </div>
                <div className="min-w-full px-2">
                  <Link to="/chat">
                    <Button 
                      variant="outline" 
                      className="w-full h-auto py-4 flex flex-col items-center justify-center gap-2 border-2"
                    >
                      <div className="p-2 rounded-lg bg-purple-100">
                        <MessageSquare className="h-5 w-5 text-purple-600" />
                      </div>
                      <span className="font-semibold">Ask Questions</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Carousel Controls */}
            <div className="flex justify-center items-center mt-4 space-x-2">
              <button
                onClick={() => setCurrentActionIndex((prev) => (prev > 0 ? prev - 1 : 3))}
                className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
                aria-label="Previous action"
              >
                <ChevronLeft className="h-5 w-5 text-gray-700" />
              </button>
              <div className="flex space-x-1">
                {[0, 1, 2, 3].map((index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentActionIndex(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentActionIndex ? 'w-8 bg-primary-teal' : 'w-2 bg-gray-300'
                    }`}
                    aria-label={`Go to action ${index + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={() => setCurrentActionIndex((prev) => (prev < 3 ? prev + 1 : 0))}
                className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
                aria-label="Next action"
              >
                <ChevronRight className="h-5 w-5 text-gray-700" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights Dashboard */}
      {stats.documents > 0 && (
        <div className="mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2" style={{ color: COLORS.brand.deepTeal }}>
              Learning Insights
            </h2>
            <p className="text-gray-600">Track your progress and performance metrics</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Due Cards - Featured */}
            {insights.dueFlashcards > 0 ? (
              <Link to="/flashcards" className="md:col-span-2 lg:col-span-1">
                <Card className="border-2 border-red-300 hover:shadow-lg transition-all cursor-pointer bg-gradient-to-br from-red-50 to-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-lg bg-red-100">
                        <Target className="h-6 w-6 text-red-600" />
                      </div>
                      <span className="px-3 py-1 text-sm font-bold rounded-full bg-red-500 text-white animate-pulse">
                        {insights.dueFlashcards}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Cards Due for Review</p>
                      <p className="text-3xl font-bold text-red-600 mb-3">
                        {loadingInsights ? '...' : insights.dueFlashcards}
                      </p>
                      <Button 
                        size="sm" 
                        className="w-full"
                        style={{ backgroundColor: COLORS.secondary.coral, color: 'white' }}
                      >
                        Start Review →
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ) : (
              <Card className="md:col-span-2 lg:col-span-1">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-lg" style={{ backgroundColor: `${COLORS.secondary.coral}15` }}>
                      <Target className="h-6 w-6" style={{ color: COLORS.secondary.coral }} />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Cards Due</p>
                    <p className="text-2xl font-bold">
                      {loadingInsights ? '...' : 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">All caught up! 🎉</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Total Flashcards */}
            <Card className="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-50 hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl shadow-sm bg-yellow-100">
                    <BookOpen className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Total Flashcards</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {loadingInsights ? '...' : insights.totalFlashcards}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Average Mastery */}
            <Card className="border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50 hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl shadow-sm bg-teal-100">
                    <Award className="h-6 w-6 text-teal-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Average Mastery</p>
                  <p className="text-3xl font-bold text-teal-600 mb-2">
                    {loadingInsights ? '...' : `${insights.averageMastery}%`}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-2.5 rounded-full transition-all shadow-sm"
                      style={{
                        width: `${insights.averageMastery}%`,
                        background: `linear-gradient(90deg, ${COLORS.brand.deepTeal}, ${COLORS.primary.ocean})`,
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl shadow-sm bg-blue-100">
                    <Zap className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">This Week</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {loadingInsights ? '...' : insights.recentActivity}
                  </p>
                  <p className="text-xs text-gray-600 mt-1 font-medium">documents uploaded</p>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

