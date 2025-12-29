import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWorkspace } from '../context/WorkspaceContext';
import { documentService, flashcardService, kgService } from '../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { FileText, BookOpen, Brain, MessageSquare, Plus, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const Dashboard = () => {
  const { currentWorkspace, user } = useWorkspace();
  const [stats, setStats] = useState({
    documents: 0,
    flashcards: 0,
    concepts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentWorkspace) {
      loadStats();
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

  if (!currentWorkspace) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">No Workspace Selected</h2>
            <p className="text-gray-600 mb-6">
              Please create or select a workspace to get started.
            </p>
            <Button onClick={() => window.location.reload()}>Refresh</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Documents',
      value: stats.documents,
      icon: FileText,
      color: 'text-primary-teal',
      bgColor: 'bg-primary-teal/10',
      href: '/documents',
    },
    {
      title: 'Flashcards',
      value: stats.flashcards,
      icon: BookOpen,
      color: 'text-secondary-yellow',
      bgColor: 'bg-secondary-yellow/10',
      href: '/flashcards',
    },
    {
      title: 'Concepts',
      value: stats.concepts,
      icon: Brain,
      color: 'text-primary-ocean',
      bgColor: 'bg-primary-ocean/10',
      href: '/knowledge-graph',
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">Your knowledge retention overview. Track what's sticking and what needs reinforcement.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <Link key={index} to={stat.href}>
            <Card className="card-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold">{loading ? '...' : stat.value}</p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started with these common tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/documents">
              <Button variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
            </Link>
            <Link to="/flashcards">
              <Button variant="outline" className="w-full">
                <BookOpen className="mr-2 h-4 w-4" />
                Study Flashcards
              </Button>
            </Link>
            <Link to="/knowledge-graph">
              <Button variant="outline" className="w-full">
                <Brain className="mr-2 h-4 w-4" />
                View Knowledge Graph
              </Button>
            </Link>
            <Link to="/chat">
              <Button variant="outline" className="w-full">
                <MessageSquare className="mr-2 h-4 w-4" />
                Ask Questions
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Getting Started */}
      {stats.documents === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              Upload your first document to begin your learning journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/documents">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Upload Your First Document
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;

