import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { 
  RotateCw, 
  X, 
  CheckCircle2,
  Clock,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { COLORS } from '../constants/theme';

const FlashcardReview = ({ flashcards, onReview, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [reviewed, setReviewed] = useState(0);
  const [startTime] = useState(Date.now());
  const [cardStartTime, setCardStartTime] = useState(Date.now());
  const [sessionComplete, setSessionComplete] = useState(false);
  const [reviewResults, setReviewResults] = useState([]);

  useEffect(() => {
    setCardStartTime(Date.now());
  }, [currentIndex]);

  if (flashcards.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Sparkles className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No flashcards due for review</h3>
          <p className="text-gray-600 mb-6">
            Great job! You're all caught up. New cards will appear as they become due.
          </p>
          <Button onClick={onComplete} variant="outline">
            Done
          </Button>
        </CardContent>
      </Card>
    );
  }

  const currentCard = flashcards[currentIndex];
  const progress = ((currentIndex + 1) / flashcards.length) * 100;
  const remaining = flashcards.length - reviewed;

  const handleGrade = async (grade) => {
    if (!currentCard) return;

    const responseTime = Date.now() - cardStartTime;
    
    const result = {
      flashcardId: currentCard.id,
      grade,
      responseTime,
    };

    setReviewResults([...reviewResults, result]);
    
    // Call onReview callback
    if (onReview) {
      await onReview(currentCard.id, {
        grade,
        response_time_ms: responseTime,
      });
    }

    setReviewed(reviewed + 1);

    // Move to next card or complete session
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    } else {
      setSessionComplete(true);
      if (onComplete) {
        onComplete({
          total: flashcards.length,
          reviewed,
          results: reviewResults,
          totalTime: Date.now() - startTime,
        });
      }
    }
  };

  if (sessionComplete) {
    const totalTime = Math.round((Date.now() - startTime) / 1000);
    const averageTime = reviewResults.length > 0
      ? Math.round(reviewResults.reduce((sum, r) => sum + r.responseTime, 0) / reviewResults.length / 1000)
      : 0;

    return (
      <Card className="border-2" style={{ borderColor: COLORS.brand.deepTeal }}>
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div 
              className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: `${COLORS.brand.deepTeal}15` }}
            >
              <CheckCircle2 
                className="h-10 w-10" 
                style={{ color: COLORS.brand.deepTeal }}
              />
            </div>
            <h2 className="text-3xl font-bold mb-2">Review Complete!</h2>
            <p className="text-gray-600 mb-6">
              You've reviewed {flashcards.length} flashcards. Keep up the great work!
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8 max-w-md mx-auto">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold" style={{ color: COLORS.brand.deepTeal }}>
                  {flashcards.length}
                </div>
                <div className="text-sm text-gray-600">Reviewed</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold" style={{ color: COLORS.brand.deepTeal }}>
                  {totalTime}s
                </div>
                <div className="text-sm text-gray-600">Total Time</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold" style={{ color: COLORS.brand.deepTeal }}>
                  {averageTime}s
                </div>
                <div className="text-sm text-gray-600">Avg/Card</div>
              </div>
            </div>

            {/* Performance Message */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left max-w-md mx-auto">
              <h3 className="font-semibold mb-2 flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" style={{ color: COLORS.brand.deepTeal }} />
                Keep Learning!
              </h3>
              <p className="text-sm text-gray-600">
                Regular review helps strengthen your memory. Come back tomorrow for more cards!
              </p>
            </div>

            <Button
              onClick={onComplete}
              style={{ backgroundColor: COLORS.brand.deepTeal, color: 'white' }}
            >
              Done
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Card {currentIndex + 1} of {flashcards.length}</span>
          <span>{remaining} remaining</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: `${progress}%`,
              backgroundColor: COLORS.brand.deepTeal,
            }}
          />
        </div>
      </div>

      {/* Flashcard */}
      <Card 
        className="min-h-[400px] cursor-pointer transition-transform hover:shadow-lg"
        onClick={() => !showAnswer && setShowAnswer(true)}
      >
        <CardContent className="p-8 flex flex-col items-center justify-center min-h-[400px]">
          {!showAnswer ? (
            // Front of card
            <div className="text-center w-full">
              <div className="mb-4">
                <span className="text-sm text-gray-500 uppercase tracking-wide">Question</span>
              </div>
              <h2 className="text-3xl font-semibold mb-6">{currentCard.front}</h2>
              <div className="mt-8">
                <Button
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAnswer(true);
                  }}
                  className="flex items-center gap-2"
                >
                  <RotateCw className="h-4 w-4" />
                  Show Answer
                </Button>
              </div>
            </div>
          ) : (
            // Back of card
            <div className="text-center w-full">
              <div className="mb-4">
                <span className="text-sm text-gray-500 uppercase tracking-wide">Answer</span>
              </div>
              <h2 className="text-3xl font-semibold mb-6">{currentCard.back || currentCard.front}</h2>
              {currentCard.explanation && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg text-left max-w-2xl mx-auto">
                  <p className="text-gray-700">{currentCard.explanation}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Grade Buttons - Only show when answer is revealed */}
      {showAnswer && (
        <div className="space-y-4">
          <p className="text-center text-sm text-gray-600 mb-4">
            How well did you know this?
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              variant="outline"
              onClick={() => handleGrade(0)}
              className="flex flex-col items-center py-4 h-auto"
              style={{ 
                borderColor: '#ef4444',
                color: '#ef4444',
              }}
            >
              <X className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">Again</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleGrade(1)}
              className="flex flex-col items-center py-4 h-auto"
              style={{ 
                borderColor: '#f59e0b',
                color: '#f59e0b',
              }}
            >
              <Clock className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">Hard</span>
            </Button>
            <Button
              onClick={() => handleGrade(2)}
              className="flex flex-col items-center py-4 h-auto"
              style={{ 
                backgroundColor: COLORS.brand.deepTeal,
                color: 'white',
              }}
            >
              <CheckCircle2 className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">Good</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleGrade(3)}
              className="flex flex-col items-center py-4 h-auto"
              style={{ 
                borderColor: '#10b981',
                color: '#10b981',
              }}
            >
              <Sparkles className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">Easy</span>
            </Button>
          </div>
          <p className="text-center text-xs text-gray-500 mt-2">
            Your response helps optimize when this card appears next
          </p>
        </div>
      )}
    </div>
  );
};

export default FlashcardReview;

