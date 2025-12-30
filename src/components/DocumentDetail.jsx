import React, { useEffect, useState } from 'react';
import { documentService, flashcardService, kgService } from '../services/api';
import { useWorkspace } from '../context/WorkspaceContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { 
  FileText, 
  BookOpen, 
  Brain, 
  Sparkles,
  Loader2,
  Calendar,
  CheckCircle2,
  Clock,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';
import { COLORS } from '../constants/theme';
import { useNavigate } from 'react-router-dom';

const DocumentDetail = ({ document, open, onOpenChange }) => {
  const { currentWorkspace } = useWorkspace();
  const [documentDetails, setDocumentDetails] = useState(null);
  const [summary, setSummary] = useState(null);
  const [flashcardCount, setFlashcardCount] = useState(null);
  const [kgConceptCount, setKgConceptCount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (open && document) {
      loadDocumentDetails();
      loadSummary();
      loadProcessingStats();
    }
  }, [open, document, currentWorkspace]);

  const loadDocumentDetails = async () => {
    if (!document?.id) return;

    setLoading(true);
    try {
      const details = await documentService.get(document.id);
      setDocumentDetails(details);
    } catch (error) {
      console.error('Error loading document details:', error);
      toast.error('Failed to load document details');
    } finally {
      setLoading(false);
    }
  };

  const loadSummary = async () => {
    if (!document?.id) return;

    setLoadingSummary(true);
    try {
      const summaryData = await documentService.getSummary(document.id);
      setSummary(summaryData);
    } catch (error) {
      console.error('Error loading summary:', error);
      // Summary might not be available yet, that's okay
      setSummary(null);
    } finally {
      setLoadingSummary(false);
    }
  };

  const loadProcessingStats = async () => {
    if (!document?.id || !currentWorkspace?.id) return;

    setLoadingStats(true);
    try {
      // Load flashcard count
      try {
        const flashcards = await flashcardService.list(currentWorkspace.id, {
          document_id: document.id,
        });
        setFlashcardCount(Array.isArray(flashcards) ? flashcards.length : 0);
      } catch (error) {
        console.error('Error loading flashcards:', error);
        setFlashcardCount(0);
      }

      // Load knowledge graph concept count
      try {
        const concepts = await kgService.listConcepts(currentWorkspace.id, {
          document_id: document.id,
        });
        setKgConceptCount(Array.isArray(concepts) ? concepts.length : 0);
      } catch (error) {
        console.error('Error loading KG concepts:', error);
        setKgConceptCount(0);
      }
    } catch (error) {
      console.error('Error loading processing stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  const getStatusIcon = () => {
    if (document?.status === 'processed' || document?.status === 'completed') {
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    }
    if (document?.status === 'processing' || document?.status === 'ingesting') {
      return <Loader2 className="h-5 w-5 animate-spin text-primary-teal" />;
    }
    return <Clock className="h-5 w-5 text-yellow-500" />;
  };

  const getStatusText = () => {
    if (document?.status === 'processed' || document?.status === 'completed') {
      return 'Ready';
    }
    if (document?.status === 'processing' || document?.status === 'ingesting') {
      return 'Processing';
    }
    return 'Pending';
  };

  if (!document) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">{document.title || 'Untitled Document'}</DialogTitle>
              <DialogDescription className="flex items-center gap-4 mt-2">
                <span className="flex items-center gap-1">
                  {getStatusIcon()}
                  <span className="capitalize">{document.doc_type}</span>
                  <span>•</span>
                  <span>{getStatusText()}</span>
                </span>
                <span className="flex items-center gap-1 text-gray-500">
                  <Calendar className="h-4 w-4" />
                  {new Date(document.created_at).toLocaleDateString()}
                </span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" style={{ color: COLORS.brand.deepTeal }} />
          </div>
        ) : (
          <div className="space-y-6 mt-4">
            {/* Processing Status Section */}
            <div className="bg-gradient-to-r from-primary-teal/5 to-deep-teal/5 rounded-lg p-4 border border-primary-teal/20">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-5 w-5" style={{ color: COLORS.brand.deepTeal }} />
                <h3 className="font-semibold">Processing Status</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center gap-2 mb-1">
                    <BookOpen className="h-4 w-4 text-primary-teal" />
                    <span className="text-sm font-medium text-gray-700">Flashcards</span>
                  </div>
                  {loadingStats ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-3 w-3 animate-spin text-gray-400" />
                      <span className="text-xs text-gray-500">Loading...</span>
                    </div>
                  ) : (
                    <p className="text-2xl font-bold" style={{ color: COLORS.brand.deepTeal }}>
                      {flashcardCount !== null ? flashcardCount : '-'}
                    </p>
                  )}
                </div>
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Brain className="h-4 w-4 text-primary-teal" />
                    <span className="text-sm font-medium text-gray-700">KG Concepts</span>
                  </div>
                  {loadingStats ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-3 w-3 animate-spin text-gray-400" />
                      <span className="text-xs text-gray-500">Loading...</span>
                    </div>
                  ) : (
                    <p className="text-2xl font-bold" style={{ color: COLORS.brand.deepTeal }}>
                      {kgConceptCount !== null ? kgConceptCount : '-'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Summary Section */}
            {summary && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-5 w-5" style={{ color: COLORS.brand.deepTeal }} />
                  <h3 className="font-semibold">Summary</h3>
                </div>
                {loadingSummary ? (
                  <div className="flex items-center gap-2 text-gray-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading summary...</span>
                  </div>
                ) : summary.summary ? (
                  <div className="text-sm text-gray-700 whitespace-pre-wrap">
                    {typeof summary.summary === 'string' 
                      ? summary.summary 
                      : summary.summary?.bullets?.join('\n• ') || 'No summary available'}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Summary not available yet</p>
                )}
              </div>
            )}

            {/* Content Section */}
            {documentDetails?.content && (
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <FileText className="h-5 w-5" style={{ color: COLORS.brand.deepTeal }} />
                  Content
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 max-h-96 overflow-y-auto">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                    {documentDetails.content}
                  </pre>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
              {(document.status === 'processed' || document.status === 'completed') && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigate('/flashcards', { state: { documentId: document.id } });
                      onOpenChange(false);
                    }}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    View Flashcards
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigate('/knowledge-graph', { state: { documentId: document.id } });
                      onOpenChange(false);
                    }}
                  >
                    <Brain className="mr-2 h-4 w-4" />
                    View Knowledge Graph
                  </Button>
                </>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentDetail;

