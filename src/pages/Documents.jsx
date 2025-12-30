import React, { useEffect, useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { documentService } from '../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { FileText, Plus, Loader2, ChevronLeft, ChevronRight, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import DocumentUpload from '../components/DocumentUpload';
import DocumentDetail from '../components/DocumentDetail';
import { COLORS } from '../constants/theme';

const Documents = () => {
  const { currentWorkspace, user } = useWorkspace();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showDocumentDetail, setShowDocumentDetail] = useState(false);
  const [currentDocIndex, setCurrentDocIndex] = useState(0);

  useEffect(() => {
    if (currentWorkspace) {
      loadDocuments();
    }
  }, [currentWorkspace]);

  const loadDocuments = async () => {
    if (!currentWorkspace) return;

    setLoading(true);
    try {
      const data = await documentService.list(currentWorkspace.id);
      setDocuments(data);
    } catch (error) {
      console.error('Error loading documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = (newDoc) => {
    // Reload documents to show the new one
    loadDocuments();
  };

  if (!currentWorkspace) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-600">Please select a workspace to view documents</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-shrink-0">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: COLORS.brand.deepTeal }}>
            Documents
          </h1>
          <p className="text-gray-600 text-lg">Upload and manage your study materials</p>
        </div>
        <Button 
          onClick={() => setShowUpload(true)}
          style={{ backgroundColor: COLORS.brand.deepTeal, color: 'white' }}
          className="hidden md:flex"
        >
          <Plus className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </div>

      {/* Mobile Upload Button */}
      <div className="md:hidden mb-6">
        <Button 
          onClick={() => setShowUpload(true)}
          style={{ backgroundColor: COLORS.brand.deepTeal, color: 'white' }}
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </div>

      <DocumentUpload
        open={showUpload}
        onOpenChange={setShowUpload}
        onSuccess={handleUploadSuccess}
      />

      <DocumentDetail
        document={selectedDocument}
        open={showDocumentDetail}
        onOpenChange={setShowDocumentDetail}
      />

      <div className="flex-1 min-h-0 overflow-y-auto pb-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-teal" />
          </div>
        ) : documents.length === 0 ? (
          <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="p-12 text-center">
            <div 
              className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
              style={{ backgroundColor: `${COLORS.brand.deepTeal}15` }}
            >
              <FileText 
                className="h-8 w-8" 
                style={{ color: COLORS.brand.deepTeal }}
              />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-gray-900">No documents yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Upload your first document to start building your knowledge base. We'll automatically create flashcards and build a knowledge graph for you.
            </p>
            <Button 
              onClick={() => setShowUpload(true)}
              size="lg"
              style={{ backgroundColor: COLORS.brand.deepTeal, color: 'white' }}
            >
              <Plus className="mr-2 h-5 w-5" />
              Upload Your First Document
            </Button>
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-4">Supported formats:</p>
              <div className="flex flex-wrap justify-center gap-3">
                <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">PDF</span>
                <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">DOCX</span>
                <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">TXT</span>
                <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">Markdown</span>
                <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">Notes</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop Grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => {
              const getStatusIcon = () => {
                if (doc.status === 'processed' || doc.status === 'completed') {
                  return <CheckCircle2 className="h-4 w-4 text-green-500" />;
                }
                if (doc.status === 'processing' || doc.status === 'ingesting') {
                  return <Loader2 className="h-4 w-4 animate-spin text-primary-teal" />;
                }
                return <Clock className="h-4 w-4 text-yellow-500" />;
              };

              const getStatusText = () => {
                if (doc.status === 'processed' || doc.status === 'completed') {
                  return 'Ready';
                }
                if (doc.status === 'processing' || doc.status === 'ingesting') {
                  return 'Processing';
                }
                return 'Pending';
              };

              return (
                <Card key={doc.id} className="card-hover transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate">{doc.title || 'Untitled'}</CardTitle>
                      </div>
                      {getStatusIcon()}
                    </div>
                    <CardDescription className="flex items-center gap-2">
                      <span className="capitalize">{doc.doc_type}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        {getStatusText()}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">
                          {new Date(doc.created_at).toLocaleDateString()}
                        </span>
                        {(doc.status === 'processed' || doc.status === 'completed') && (
                          <div className="flex items-center gap-1 text-primary-teal">
                            <Sparkles className="h-3 w-3" />
                            <span className="text-xs">Ready</span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => {
                            setSelectedDocument(doc);
                            setShowDocumentDetail(true);
                          }}
                        >
                          View
                        </Button>
                        {(doc.status === 'processed' || doc.status === 'completed') && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setSelectedDocument(doc);
                              setShowDocumentDetail(true);
                            }}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Mobile Carousel */}
          <div className="md:hidden relative">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentDocIndex * 100}%)` }}
              >
                {documents.map((doc) => {
                  const getStatusIcon = () => {
                    if (doc.status === 'processed' || doc.status === 'completed') {
                      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
                    }
                    if (doc.status === 'processing' || doc.status === 'ingesting') {
                      return <Loader2 className="h-4 w-4 animate-spin text-primary-teal" />;
                    }
                    return <Clock className="h-4 w-4 text-yellow-500" />;
                  };

                  const getStatusText = () => {
                    if (doc.status === 'processed' || doc.status === 'completed') {
                      return 'Ready';
                    }
                    if (doc.status === 'processing' || doc.status === 'ingesting') {
                      return 'Processing';
                    }
                    return 'Pending';
                  };

                  return (
                    <div key={doc.id} className="min-w-full">
                      <Card className="card-hover">
                        <CardHeader>
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-lg truncate">{doc.title || 'Untitled'}</CardTitle>
                            </div>
                            {getStatusIcon()}
                          </div>
                          <CardDescription className="flex items-center gap-2">
                            <span className="capitalize">{doc.doc_type}</span>
                            <span>•</span>
                            <span>{getStatusText()}</span>
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500">
                                {new Date(doc.created_at).toLocaleDateString()}
                              </span>
                              {(doc.status === 'processed' || doc.status === 'completed') && (
                                <div className="flex items-center gap-1 text-primary-teal">
                                  <Sparkles className="h-3 w-3" />
                                  <span className="text-xs">Ready</span>
                                </div>
                              )}
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full"
                              onClick={() => {
                                setSelectedDocument(doc);
                                setShowDocumentDetail(true);
                              }}
                            >
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Carousel Controls */}
            {documents.length > 1 && (
              <div className="flex justify-center items-center mt-4 space-x-2">
                <button
                  onClick={() => setCurrentDocIndex((prev) => (prev > 0 ? prev - 1 : documents.length - 1))}
                  className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
                  aria-label="Previous document"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-700" />
                </button>
                <div className="flex space-x-1">
                  {documents.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentDocIndex(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === currentDocIndex ? 'w-8 bg-primary-teal' : 'w-2 bg-gray-300'
                      }`}
                      aria-label={`Go to document ${index + 1}`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setCurrentDocIndex((prev) => (prev < documents.length - 1 ? prev + 1 : 0))}
                  className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
                  aria-label="Next document"
                >
                  <ChevronRight className="h-5 w-5 text-gray-700" />
                </button>
              </div>
            )}
          </div>
        </>
        )}
      </div>
    </div>
  );
};

export default Documents;


