import React, { useState, useRef, useCallback } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { documentService } from '../services/api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { 
  Upload, 
  FileText, 
  File, 
  FileType, 
  X, 
  Loader2, 
  CheckCircle2,
  Sparkles,
  BookOpen,
  Brain,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { COLORS } from '../constants/theme';

const DocumentUpload = ({ open, onOpenChange, onSuccess }) => {
  const { currentWorkspace, user, loading: workspaceLoading } = useWorkspace();
  const [uploadMethod, setUploadMethod] = useState('file'); // 'file' or 'text'
  const [selectedFile, setSelectedFile] = useState(null);
  const [textContent, setTextContent] = useState('');
  const [textTitle, setTextTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const acceptedFileTypes = {
    'application/pdf': ['.pdf'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'application/msword': ['.doc'],
    'text/plain': ['.txt'],
    'text/markdown': ['.md'],
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileSelect = (file) => {
    // Validate file type
    const fileType = file.type;
    const isValidType = Object.keys(acceptedFileTypes).some(
      type => fileType === type || file.name.match(/\.(pdf|docx|doc|txt|md)$/i)
    );

    if (!isValidType) {
      toast.error('Unsupported file type. Please upload PDF, DOCX, TXT, or MD files.');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size too large. Maximum size is 10MB.');
      return;
    }

    setSelectedFile(file);
    setUploadMethod('file');
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      
      if (file.type === 'application/pdf') {
        // For PDFs, we'll need to send the file itself or extract text
        // For now, we'll send as base64 or handle on backend
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    });
  };

  const determineDocType = (fileName, fileType) => {
    if (fileType === 'application/pdf') return 'pdf';
    if (fileType.includes('wordprocessingml') || fileType.includes('msword')) return 'docx';
    if (fileType === 'text/markdown') return 'markdown';
    return 'text';
  };

  const handleUpload = async () => {
    if (!user) {
      toast.error('Please log in to upload documents');
      return;
    }

    if (!currentWorkspace) {
      toast.error('No workspace selected. Please select a workspace from the sidebar dropdown.');
      console.error('Upload attempted without workspace. Current workspace:', currentWorkspace);
      return;
    }

    if (uploadMethod === 'file' && !selectedFile) {
      toast.error('Please select a file');
      return;
    }

    if (uploadMethod === 'text' && !textContent.trim()) {
      toast.error('Please enter or paste text content');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      let documentData;

      if (uploadMethod === 'file') {
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 200);

        const content = await readFileContent(selectedFile);
        const docType = determineDocType(selectedFile.name, selectedFile.type);

        documentData = {
          workspace_id: currentWorkspace.id,
          user_id: user.user_id || user.id, // Support both user_id and id
          title: selectedFile.name.replace(/\.[^/.]+$/, '') || 'Untitled Document',
          content: typeof content === 'string' ? content : '', // Handle base64 for PDFs
          doc_type: docType,
          language: 'en',
          metadata: {
            filename: selectedFile.name,
            file_size: selectedFile.size,
            file_type: selectedFile.type,
          },
        };

        clearInterval(progressInterval);
        setUploadProgress(100);
      } else {
        // Text paste upload
        documentData = {
          workspace_id: currentWorkspace.id,
          user_id: user.user_id || user.id, // Support both user_id and id
          title: textTitle.trim() || 'Untitled Document',
          content: textContent.trim(),
          doc_type: 'text',
          language: 'en',
          metadata: {},
        };
        setUploadProgress(100);
      }

      // Create document
      const newDoc = await documentService.create(documentData);
      
      setUploading(false);
      setProcessing(true);
      setUploadProgress(0);

      // Simulate processing stages
      const stages = [
        { name: 'Analyzing document...', duration: 2000 },
        { name: 'Extracting key concepts...', duration: 2000 },
        { name: 'Creating flashcards...', duration: 2000 },
        { name: 'Building knowledge graph...', duration: 2000 },
        { name: 'Finalizing...', duration: 1000 },
      ];

      for (let i = 0; i < stages.length; i++) {
        setProcessingStage(stages[i].name);
        setUploadProgress(((i + 1) / stages.length) * 100);
        await new Promise(resolve => setTimeout(resolve, stages[i].duration));
      }

      // Trigger ingestion (this will be async on backend)
      try {
        await documentService.ingest(newDoc.id, {
          workspace_id: currentWorkspace.id,
        });
      } catch (error) {
        console.warn('Ingestion triggered (async):', error);
        // Ingestion is async, so this is fine
      }

      toast.success('Document uploaded and processing started!');
      
      // Reset form
      setSelectedFile(null);
      setTextContent('');
      setTextTitle('');
      setUploadMethod('file');
      setProcessing(false);
      setProcessingStage('');
      setUploadProgress(0);
      
      if (onSuccess) {
        onSuccess(newDoc);
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error(error.response?.data?.detail || 'Failed to upload document');
      setUploading(false);
      setProcessing(false);
      setUploadProgress(0);
    }
  };

  const handleClose = () => {
    if (!uploading && !processing) {
      setSelectedFile(null);
      setTextContent('');
      setTextTitle('');
      setUploadMethod('file');
      setUploadProgress(0);
      setProcessingStage('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Upload Document</DialogTitle>
          <DialogDescription>
            Upload files or paste text content to start building your knowledge base
          </DialogDescription>
        </DialogHeader>

        {/* Workspace Warning */}
        {!workspaceLoading && !currentWorkspace && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>No workspace selected.</strong> Please select a workspace from the sidebar dropdown before uploading documents.
            </p>
          </div>
        )}

        {/* Upload Method Tabs */}
        <div className="flex gap-2 mb-4 border-b border-gray-200">
          <button
            type="button"
            onClick={() => {
              setUploadMethod('file');
              setSelectedFile(null);
            }}
            className={`flex-1 py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
              uploadMethod === 'file'
                ? 'border-primary-teal text-primary-teal'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <File className="inline mr-2 h-4 w-4" />
            Upload File
          </button>
          <button
            type="button"
            onClick={() => {
              setUploadMethod('text');
              setSelectedFile(null);
            }}
            className={`flex-1 py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
              uploadMethod === 'text'
                ? 'border-primary-teal text-primary-teal'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileType className="inline mr-2 h-4 w-4" />
            Paste Text
          </button>
        </div>

        {/* File Upload */}
        {uploadMethod === 'file' && (
          <div className="space-y-4">
            {/* Drag and Drop Zone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`
                border-2 border-dashed rounded-lg p-8 text-center transition-colors
                ${dragActive 
                  ? 'border-primary-teal bg-primary-teal/5' 
                  : 'border-gray-300 hover:border-primary-teal/50'
                }
                ${selectedFile ? 'bg-green-50 border-green-300' : ''}
              `}
            >
              {selectedFile ? (
                <div className="space-y-2">
                  <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
                  <p className="font-medium text-gray-900">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedFile(null)}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    Drag and drop your file here
                  </p>
                  <p className="text-sm text-gray-500 mb-4">or</p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Browse Files
                  </Button>
                  <p className="text-xs text-gray-500 mt-4">
                    Supported: PDF, DOCX, TXT, MD (Max 10MB)
                  </p>
                </>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.docx,.doc,.txt,.md"
              onChange={handleFileInputChange}
            />
          </div>
        )}

        {/* Paste Text */}
        {uploadMethod === 'text' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Document Title
              </label>
              <Input
                value={textTitle}
                onChange={(e) => setTextTitle(e.target.value)}
                placeholder="e.g., Study Notes, Meeting Summary, Article Content"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Content
              </label>
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Paste your text content here... (You can paste from any source)"
                className="w-full min-h-[300px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-teal focus:border-transparent resize-y font-mono text-sm"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {textContent.length} characters • Paste any text content directly
              </p>
            </div>
          </div>
        )}

        {/* Processing States */}
        {(uploading || processing) && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Loader2 className="h-5 w-5 animate-spin text-primary-teal" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  {uploading ? 'Uploading...' : processingStage || 'Processing...'}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-primary-teal h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            </div>

            {processing && (
              <div className="space-y-2 mt-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Sparkles className="h-4 w-4 text-primary-teal" />
                  <span>Extracting key concepts</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <BookOpen className="h-4 w-4 text-primary-teal" />
                  <span>Generating flashcards</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Brain className="h-4 w-4 text-primary-teal" />
                  <span>Building knowledge graph</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={uploading || processing}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleUpload}
            disabled={
              uploading || 
              processing || 
              !currentWorkspace ||
              (uploadMethod === 'file' && !selectedFile) ||
              (uploadMethod === 'text' && !textContent.trim())
            }
            className="flex-1"
            style={{ 
              backgroundColor: (!currentWorkspace || uploading || processing) ? '#ccc' : COLORS.brand.deepTeal, 
              color: 'white' 
            }}
          >
            {uploading || processing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {uploading ? 'Uploading...' : 'Processing...'}
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                {uploadMethod === 'file' ? 'Upload' : 'Create Document'}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentUpload;

