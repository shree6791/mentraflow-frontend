import React, { useEffect, useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { flashcardService } from '../services/api';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { BookOpen, ChevronRight, ChevronLeft, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const Flashcards = () => {
  const { currentWorkspace, user } = useWorkspace();
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentWorkspace && user) {
      loadFlashcards();
    }
  }, [currentWorkspace, user]);

  const loadFlashcards = async () => {
    if (!currentWorkspace || !user) return;

    setLoading(true);
    try {
      const data = await flashcardService.list(currentWorkspace.id, { limit: 50 });
      setFlashcards(data);
      if (data.length > 0) {
        setCurrentIndex(0);
      }
    } catch (error) {
      console.error('Error loading flashcards:', error);
      toast.error('Failed to load flashcards');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answerIndex) => {
    if (showAnswer) return;
    setSelectedAnswer(answerIndex);
    setShowAnswer(true);
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
      setSelectedAnswer(null);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowAnswer(false);
      setSelectedAnswer(null);
    }
  };

  const handleReview = async (grade) => {
    if (!currentWorkspace || !user || !flashcards[currentIndex]) return;

    try {
      await flashcardService.review(flashcards[currentIndex].id, {
        user_id: user.user_id,
        workspace_id: currentWorkspace.id,
        grade,
        response_time_ms: 5000,
      });
      toast.success('Review recorded!');
      handleNext();
    } catch (error) {
      console.error('Error reviewing flashcard:', error);
      toast.error('Failed to record review');
    }
  };

  if (!currentWorkspace) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="p-8 text-center">
            <p>Please select a workspace</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No recall sessions yet</h3>
            <p className="text-gray-600">
              Upload documents to generate adaptive recall sessions for long-term retention
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];
  const isMCQ = currentCard.card_type === 'mcq' && currentCard.options;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Adaptive Recall</h1>
        <p className="text-gray-600">
          Reinforcing knowledge at optimal intervals. Card {currentIndex + 1} of {flashcards.length}
        </p>
      </div>

      <Card className="mb-6 min-h-[400px]">
        <CardContent className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">{currentCard.front}</h2>
          </div>

          {isMCQ ? (
            <div className="space-y-3">
            {currentCard.options.map((option, index) => {
              const letter = String.fromCharCode(65 + index);
              const isSelected = selectedAnswer === index;
              const isCorrect = letter === currentCard.correct_answer;
              
              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    showAnswer
                      ? isCorrect
                        ? 'border-green-500 bg-green-50'
                        : isSelected && !isCorrect
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200'
                      : isSelected
                      ? 'border-primary-teal bg-primary-teal/10'
                      : 'border-gray-200 hover:border-primary-teal'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="font-semibold mr-3">{letter}.</span>
                    <span>{option}</span>
                    {showAnswer && isCorrect && (
                      <CheckCircle2 className="ml-auto h-5 w-5 text-green-500" />
                    )}
                    {showAnswer && isSelected && !isCorrect && (
                      <XCircle className="ml-auto h-5 w-5 text-red-500" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          ) : (
            <div>
              {showAnswer ? (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-lg">{currentCard.back}</p>
                </div>
              ) : (
                <Button onClick={() => setShowAnswer(true)}>Show Answer</Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {showAnswer && !isMCQ && (
        <div className="flex gap-2 mb-6">
          <Button variant="outline" onClick={() => handleReview(0)}>
            Again
          </Button>
          <Button variant="outline" onClick={() => handleReview(1)}>
            Hard
          </Button>
          <Button onClick={() => handleReview(2)}>Good</Button>
          <Button variant="secondary" onClick={() => handleReview(3)}>
            Easy
          </Button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={handlePrevious} disabled={currentIndex === 0}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button onClick={handleNext} disabled={currentIndex === flashcards.length - 1}>
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Flashcards;

