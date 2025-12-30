import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  ChevronLeft,
  Trophy,
  TrendingUp,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { COLORS } from '../constants/theme';

const QuizInterface = ({ flashcards, onComplete, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answers, setAnswers] = useState([]); // Track all answers
  const [startTime] = useState(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [quizComplete, setQuizComplete] = useState(false);

  // Filter only MCQ flashcards
  const mcqFlashcards = flashcards.filter(card => 
    card.card_type === 'mcq' && card.options && card.options.length > 0
  );

  useEffect(() => {
    if (mcqFlashcards.length === 0) {
      onComplete && onComplete({ score: 0, total: 0, answers: [] });
      setQuizComplete(true);
    }
  }, [mcqFlashcards.length, onComplete]);

  useEffect(() => {
    setQuestionStartTime(Date.now());
  }, [currentIndex]);

  const currentCard = mcqFlashcards[currentIndex];
  const progress = ((currentIndex + 1) / mcqFlashcards.length) * 100;
  const correctCount = answers.filter(a => a.correct).length;
  const score = Math.round((correctCount / answers.length) * 100) || 0;

  const handleAnswerSelect = (answerIndex) => {
    if (showFeedback) return;
    
    setSelectedAnswer(answerIndex);
    const letter = String.fromCharCode(65 + answerIndex);
    const isCorrect = letter === currentCard.correct_answer;
    const responseTime = Date.now() - questionStartTime;

    const answerData = {
      flashcardId: currentCard.id,
      selectedAnswer: letter,
      correctAnswer: currentCard.correct_answer,
      isCorrect,
      responseTime,
      questionIndex: currentIndex,
    };

    setAnswers([...answers, answerData]);
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentIndex < mcqFlashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      // Quiz complete
      const finalScore = Math.round((correctCount / mcqFlashcards.length) * 100);
      const totalTime = Date.now() - startTime;
      
      const quizResults = {
        score: finalScore,
        total: mcqFlashcards.length,
        correct: correctCount,
        incorrect: mcqFlashcards.length - correctCount,
        answers: answers,
        totalTime,
        averageResponseTime: answers.reduce((sum, a) => sum + a.responseTime, 0) / answers.length,
      };

      setQuizComplete(true);
      onComplete && onComplete(quizResults);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      // Restore previous answer
      const prevAnswer = answers[currentIndex - 1];
      if (prevAnswer) {
        const answerIndex = prevAnswer.selectedAnswer.charCodeAt(0) - 65;
        setSelectedAnswer(answerIndex);
        setShowFeedback(true);
      } else {
        setSelectedAnswer(null);
        setShowFeedback(false);
      }
    }
  };

  if (mcqFlashcards.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Sparkles className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No quiz questions available</h3>
          <p className="text-gray-600 mb-6">
            Upload documents to generate quiz questions
          </p>
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (quizComplete) {
    const finalScore = Math.round((correctCount / mcqFlashcards.length) * 100);
    const getScoreColor = () => {
      if (finalScore >= 80) return 'text-green-600';
      if (finalScore >= 60) return 'text-yellow-600';
      return 'text-red-600';
    };

    const getScoreMessage = () => {
      if (finalScore >= 90) return 'Outstanding! You have excellent mastery!';
      if (finalScore >= 80) return 'Great job! You have strong understanding!';
      if (finalScore >= 60) return 'Good effort! Keep practicing!';
      return 'Keep studying! You\'ll improve with practice!';
    };

    return (
      <Card className="border-2" style={{ borderColor: COLORS.brand.deepTeal }}>
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div 
              className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: `${COLORS.brand.deepTeal}15` }}
            >
              <Trophy 
                className="h-10 w-10" 
                style={{ color: COLORS.brand.deepTeal }}
              />
            </div>
            <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
            <p className="text-gray-600 mb-6">{getScoreMessage()}</p>
            
            {/* Score Display */}
            <div className="mb-8">
              <div className={`text-6xl font-bold mb-2 ${getScoreColor()}`}>
                {finalScore}%
              </div>
              <div className="text-lg text-gray-600">
                {correctCount} out of {mcqFlashcards.length} correct
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8 max-w-md mx-auto">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{correctCount}</div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {mcqFlashcards.length - correctCount}
                </div>
                <div className="text-sm text-gray-600">Incorrect</div>
              </div>
            </div>

            {/* Performance Insights */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
              <h3 className="font-semibold mb-4 flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" style={{ color: COLORS.brand.deepTeal }} />
                Performance Insights
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Average response time:</span>
                  <span className="font-medium">
                    {answers.length > 0 
                      ? `${Math.round(answers.reduce((sum, a) => sum + a.responseTime, 0) / answers.length / 1000)}s`
                      : 'N/A'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total time:</span>
                  <span className="font-medium">
                    {Math.round((Date.now() - startTime) / 1000)}s
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Mastery level:</span>
                  <span className="font-medium">
                    {finalScore >= 80 ? 'Advanced' : finalScore >= 60 ? 'Intermediate' : 'Beginner'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => {
                  setCurrentIndex(0);
                  setAnswers([]);
                  setSelectedAnswer(null);
                  setShowFeedback(false);
                  setQuizComplete(false);
                }}
                variant="outline"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Retake Quiz
              </Button>
              <Button
                onClick={onClose}
                style={{ backgroundColor: COLORS.brand.deepTeal, color: 'white' }}
              >
                Done
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const letter = selectedAnswer !== null ? String.fromCharCode(65 + selectedAnswer) : null;
  const isCorrect = letter === currentCard.correct_answer;

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Question {currentIndex + 1} of {mcqFlashcards.length}</span>
          <span>Score: {score}% ({correctCount}/{answers.length || 1})</span>
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

      {/* Question Card */}
      <Card className="min-h-[400px]">
        <CardContent className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">{currentCard.front}</h2>
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {currentCard.options.map((option, index) => {
              const optionLetter = String.fromCharCode(65 + index);
              const isSelected = selectedAnswer === index;
              const isCorrectOption = optionLetter === currentCard.correct_answer;

              let buttonClass = 'w-full text-left p-4 rounded-lg border-2 transition-all ';
              
              if (showFeedback) {
                if (isCorrectOption) {
                  buttonClass += 'border-green-500 bg-green-50 text-green-900';
                } else if (isSelected && !isCorrectOption) {
                  buttonClass += 'border-red-500 bg-red-50 text-red-900';
                } else {
                  buttonClass += 'border-gray-200 bg-gray-50 text-gray-500';
                }
              } else {
                if (isSelected) {
                  buttonClass += 'border-primary-teal bg-primary-teal/10 text-gray-900';
                } else {
                  buttonClass += 'border-gray-200 hover:border-primary-teal/50 hover:bg-gray-50 text-gray-900';
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showFeedback}
                  className={buttonClass}
                >
                  <div className="flex items-center">
                    <span 
                      className="font-semibold mr-3 w-8 h-8 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: isSelected 
                          ? COLORS.brand.deepTeal 
                          : 'transparent',
                        color: isSelected ? 'white' : 'inherit',
                      }}
                    >
                      {optionLetter}
                    </span>
                    <span className="flex-1">{option}</span>
                    {showFeedback && isCorrectOption && (
                      <CheckCircle2 className="ml-auto h-5 w-5 text-green-500" />
                    )}
                    {showFeedback && isSelected && !isCorrectOption && (
                      <XCircle className="ml-auto h-5 w-5 text-red-500" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feedback Message */}
          {showFeedback && (
            <div className={`mt-6 p-4 rounded-lg ${
              isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center gap-2">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-900">Correct! Well done!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-red-600" />
                    <span className="font-medium text-red-900">
                      Incorrect. The correct answer is {currentCard.correct_answer}.
                    </span>
                  </>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        
        <div className="text-sm text-gray-500">
          {currentIndex + 1} / {mcqFlashcards.length}
        </div>

        <Button
          onClick={handleNext}
          disabled={!showFeedback}
          style={{ 
            backgroundColor: showFeedback ? COLORS.brand.deepTeal : '#ccc',
            color: 'white'
          }}
        >
          {currentIndex === mcqFlashcards.length - 1 ? 'Finish Quiz' : 'Next'}
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default QuizInterface;

