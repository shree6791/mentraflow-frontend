import React, { useEffect, useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { flashcardService, documentService } from '../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { BookOpen, Play, FileText, Loader2, Sparkles, RotateCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import QuizInterface from '../components/QuizInterface';
import FlashcardReview from '../components/FlashcardReview';
import { COLORS } from '../constants/theme';

const ITEMS_PER_PAGE = 12;

const Flashcards = () => {
  const { currentWorkspace, user } = useWorkspace();
  const [flashcards, setFlashcards] = useState([]);
  const [dueFlashcards, setDueFlashcards] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [mode, setMode] = useState('selection'); // 'selection', 'quiz', 'review'
  const [loading, setLoading] = useState(true);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [loadingReview, setLoadingReview] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (currentWorkspace && user) {
      loadDocuments();
      loadFlashcards();
      loadDueFlashcards();
    }
  }, [currentWorkspace, user]);

  const loadDocuments = async () => {
    if (!currentWorkspace) return;
    
    try {
      const data = await documentService.list(currentWorkspace.id);
      setDocuments(data);
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  };

  const loadFlashcards = async (documentId = null) => {
    if (!currentWorkspace || !user) return;

    setLoading(true);
    try {
      const filters = { limit: 100 }; // Increased limit for better coverage
      if (documentId) {
        filters.document_id = documentId;
      }
      const data = await flashcardService.list(currentWorkspace.id, filters);
      setFlashcards(data);
    } catch (error) {
      console.error('Error loading flashcards:', error);
      toast.error('Failed to load flashcards');
    } finally {
      setLoading(false);
    }
  };

  const loadDueFlashcards = async () => {
    if (!currentWorkspace || !user) return;

    try {
      const data = await flashcardService.getDue(currentWorkspace.id, user.user_id, 100);
      setDueFlashcards(data || []);
    } catch (error) {
      console.error('Error loading due flashcards:', error);
      setDueFlashcards([]);
    }
  };

  const handleStartQuiz = async (documentId = null) => {
    setLoadingQuiz(true);
    try {
      await loadFlashcards(documentId);
      setSelectedDocument(documentId);
      setMode('quiz');
    } catch (error) {
      toast.error('Failed to start quiz');
    } finally {
      setLoadingQuiz(false);
    }
  };

  const handleStartReview = async () => {
    // Use already loaded dueFlashcards instead of making another API call
    if (!dueFlashcards || dueFlashcards.length === 0) {
      toast.info('No flashcards due for review right now. Check back later!');
      return;
    }
    setMode('review');
  };

  const handleReviewCard = async (flashcardId, data) => {
    try {
      await flashcardService.review(flashcardId, {
        user_id: user.user_id,
        workspace_id: currentWorkspace.id,
        ...data,
      });
    } catch (error) {
      console.error('Error reviewing flashcard:', error);
      toast.error('Failed to record review');
    }
  };

  const handleReviewComplete = async (results) => {
    toast.success(`Review complete! You reviewed ${results.total} flashcards.`);
    setMode('selection');
    setSelectedDocument(null);
    loadDueFlashcards(); // Reload due cards
  };

  const handleQuizComplete = async (results) => {
    try {
      for (const answer of results.answers) {
        await flashcardService.review(answer.flashcardId, {
          user_id: user.user_id,
          workspace_id: currentWorkspace.id,
          grade: answer.isCorrect ? 3 : 0,
          response_time_ms: answer.responseTime,
        });
      }
      toast.success(`Quiz completed! Score: ${results.score}%`);
    } catch (error) {
      console.error('Error recording quiz results:', error);
      toast.error('Quiz completed, but failed to save some results');
    }
    
    setMode('selection');
    setSelectedDocument(null);
    loadFlashcards();
    loadDueFlashcards();
  };

  // Pagination calculations
  const totalPages = Math.ceil(documents.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedDocuments = documents.slice(startIndex, endIndex);

  if (!currentWorkspace) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-600">Please select a workspace to view quizzes</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Quiz Mode - Show Quiz Interface
  if (mode === 'quiz') {
    const mcqFlashcards = flashcards.filter(card => 
      card.card_type === 'mcq' && card.options && card.options.length > 0
    );

    return (
      <div className="p-6 md:p-8">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => {
              setMode('selection');
              setSelectedDocument(null);
            }}
            className="mb-4"
          >
            ← Back
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: COLORS.brand.deepTeal }}>
            Quiz Mode
          </h1>
          <p className="text-gray-600 text-lg">
            Test your knowledge with interactive multiple-choice questions
          </p>
        </div>
        <QuizInterface
          flashcards={mcqFlashcards}
          onComplete={handleQuizComplete}
          onClose={() => {
            setMode('selection');
            setSelectedDocument(null);
          }}
        />
      </div>
    );
  }

  // Review Mode - Show Flashcard Review Interface
  if (mode === 'review') {
    return (
      <div className="p-6 md:p-8">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => {
              setMode('selection');
            }}
            className="mb-4"
          >
            ← Back
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: COLORS.brand.deepTeal }}>
            Flashcard Review
          </h1>
          <p className="text-gray-600 text-lg">
            Review flashcards using spaced repetition for optimal retention
          </p>
        </div>
        <FlashcardReview
          flashcards={dueFlashcards}
          onReview={handleReviewCard}
          onComplete={handleReviewComplete}
        />
      </div>
    );
  }

  // Main View - Quiz Selection
  if (loading) {
    return (
      <div className="p-6 md:p-8 flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: COLORS.brand.deepTeal }} />
      </div>
    );
  }

  // Get MCQ flashcards count
  const mcqFlashcards = flashcards.filter(card => 
    card.card_type === 'mcq' && card.options && card.options.length > 0
  );

  if (mcqFlashcards.length === 0 && documents.length === 0) {
    return (
      <div className="p-6 md:p-8">
        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="p-12 text-center">
            <div 
              className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
              style={{ backgroundColor: `${COLORS.brand.deepTeal}15` }}
            >
              <BookOpen 
                className="h-8 w-8" 
                style={{ color: COLORS.brand.deepTeal }}
              />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-gray-900">No quiz questions available</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Upload documents to generate quiz questions. We'll automatically create multiple-choice questions from your content.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="mb-8 flex-shrink-0">
        <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: COLORS.brand.deepTeal }}>
          Flashcards
        </h1>
        <p className="text-gray-600 text-lg">
          Review flashcards with spaced repetition and test your knowledge with interactive quizzes
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="border-l-4" style={{ borderLeftColor: COLORS.brand.deepTeal }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Cards Due</p>
                <p className="text-3xl font-bold" style={{ color: COLORS.brand.deepTeal }}>
                  {dueFlashcards.length}
                </p>
              </div>
              <div 
                className="p-3 rounded-full"
                style={{ backgroundColor: `${COLORS.brand.deepTeal}15` }}
              >
                <RotateCw className="h-6 w-6" style={{ color: COLORS.brand.deepTeal }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4" style={{ borderLeftColor: COLORS.primary.ocean }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Questions</p>
                <p className="text-3xl font-bold" style={{ color: COLORS.primary.ocean }}>
                  {mcqFlashcards.length}
                </p>
              </div>
              <div 
                className="p-3 rounded-full"
                style={{ backgroundColor: `${COLORS.primary.ocean}15` }}
              >
                <Sparkles className="h-6 w-6" style={{ color: COLORS.primary.ocean }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4" style={{ borderLeftColor: COLORS.secondary.yellow }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Documents</p>
                <p className="text-3xl font-bold" style={{ color: COLORS.secondary.yellow }}>
                  {documents.length}
                </p>
              </div>
              <div 
                className="p-3 rounded-full"
                style={{ backgroundColor: `${COLORS.secondary.yellow}15` }}
              >
                <FileText className="h-6 w-6" style={{ color: COLORS.secondary.yellow }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto pb-6">
        {/* Review Due Cards - Spaced Repetition */}
        {dueFlashcards.length > 0 && (
        <Card className="mb-8 overflow-hidden border-2 hover:shadow-lg transition-shadow" 
              style={{ borderColor: COLORS.brand.deepTeal + '40' }}>
          <div className="md:flex">
            <div 
              className="md:w-1/3 p-6 md:p-8 flex items-center justify-center"
              style={{ backgroundColor: `${COLORS.brand.deepTeal}08` }}
            >
              <div className="text-center">
                <div 
                  className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: `${COLORS.brand.deepTeal}20` }}
                >
                  <RotateCw className="h-10 w-10" style={{ color: COLORS.brand.deepTeal }} />
                </div>
                <h3 className="text-xl font-bold mb-2">Spaced Repetition</h3>
                <p className="text-sm text-gray-600">Optimal retention</p>
              </div>
            </div>
            <div className="md:w-2/3 p-6 md:p-8">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-2xl mb-2">Review Due Cards</CardTitle>
                <CardDescription className="text-base">
                  Review flashcards that are due based on your forgetting curve. 
                  You have {dueFlashcards.length} cards ready for review.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Button
                  onClick={handleStartReview}
                  size="lg"
                  className="w-full md:w-auto"
                  style={{ 
                    backgroundColor: COLORS.brand.deepTeal,
                    color: 'white'
                  }}
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  Start Review ({dueFlashcards.length} cards)
                </Button>
              </CardContent>
            </div>
          </div>
        </Card>
      )}

      {/* Document Quizzes List with Pagination */}
      {documents.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" style={{ color: COLORS.brand.deepTeal }} />
                  Document Quizzes
                </CardTitle>
                <CardDescription>
                  Select a document to take a quiz based on its content ({documents.length} total)
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* All Documents Quiz Option */}
            {mcqFlashcards.length > 0 && (
              <div className="mb-6 p-4 border-2 border-dashed border-primary-teal rounded-lg bg-primary-teal/5 hover:bg-primary-teal/10 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold mb-1 flex items-center gap-2">
                      <Sparkles className="h-5 w-5" style={{ color: COLORS.primary.ocean }} />
                      All Documents Quiz
                    </h3>
                    <p className="text-sm text-gray-600">
                      Comprehensive quiz with all {mcqFlashcards.length} questions from all documents
                    </p>
                  </div>
                  <Button
                    onClick={() => handleStartQuiz(null)}
                    disabled={loadingQuiz}
                    size="lg"
                    style={{ backgroundColor: COLORS.primary.ocean, color: 'white' }}
                  >
                    {loadingQuiz ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Start Quiz
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {paginatedDocuments.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No documents found</p>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {paginatedDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-primary-teal hover:shadow-md transition-all cursor-pointer group"
                      onClick={() => handleStartQuiz(doc.id)}
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold mb-1 group-hover:text-primary-teal transition-colors truncate">
                          {doc.title || 'Untitled Document'}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span className="capitalize">{doc.doc_type}</span>
                          <span>•</span>
                          <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartQuiz(doc.id);
                        }}
                        disabled={loadingQuiz}
                        variant="outline"
                        className="ml-4 group-hover:border-primary-teal group-hover:text-primary-teal"
                      >
                        {loadingQuiz ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Play className="mr-2 h-4 w-4" />
                            Start
                          </>
                        )}
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                      Showing {startIndex + 1}-{Math.min(endIndex, documents.length)} of {documents.length} documents
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                          // Show first page, last page, current page, and pages around current
                          if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                          ) {
                            return (
                              <Button
                                key={page}
                                variant={currentPage === page ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setCurrentPage(page)}
                                style={currentPage === page ? { backgroundColor: COLORS.brand.deepTeal, color: 'white' } : {}}
                                className="min-w-[40px]"
                              >
                                {page}
                              </Button>
                            );
                          } else if (page === currentPage - 2 || page === currentPage + 2) {
                            return <span key={page} className="px-2">...</span>;
                          }
                          return null;
                        })}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
        )}
      </div>
    </div>
  );
};

export default Flashcards;
