import React, { useEffect, useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { documentService } from '../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { FileText, Upload, Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const Documents = () => {
  const { currentWorkspace, user } = useWorkspace();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: '',
    content: '',
    doc_type: 'text',
  });

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

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!currentWorkspace || !user) return;

    setUploading(true);
    try {
      const newDoc = await documentService.create({
        workspace_id: currentWorkspace.id,
        user_id: user.user_id,
        title: uploadData.title || 'Untitled Document',
        content: uploadData.content,
        doc_type: uploadData.doc_type,
        language: 'en',
        metadata: {},
      });

      toast.success('Document uploaded! Processing will begin shortly.');
      setShowUpload(false);
      setUploadData({ title: '', content: '', doc_type: 'text' });
      loadDocuments();
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error(error.response?.data?.detail || 'Failed to upload document');
    } finally {
      setUploading(false);
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

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Documents</h1>
          <p className="text-gray-600">Manage your study materials</p>
        </div>
        <Button onClick={() => setShowUpload(!showUpload)}>
          <Plus className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </div>

      {showUpload && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Upload New Document</CardTitle>
            <CardDescription>Add a new document to your workspace</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <Input
                  value={uploadData.title}
                  onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                  placeholder="Document title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea
                  className="w-full min-h-[200px] px-3 py-2 border border-input rounded-md"
                  value={uploadData.content}
                  onChange={(e) => setUploadData({ ...uploadData, content: e.target.value })}
                  placeholder="Paste your document content here..."
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={uploading}>
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowUpload(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary-teal" />
        </div>
      ) : documents.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No documents yet</h3>
            <p className="text-gray-600 mb-6">Upload your first document to get started</p>
            <Button onClick={() => setShowUpload(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <Card key={doc.id} className="card-hover">
              <CardHeader>
                <CardTitle className="text-lg">{doc.title || 'Untitled'}</CardTitle>
                <CardDescription>
                  {doc.doc_type} • {doc.status}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {new Date(doc.created_at).toLocaleDateString()}
                  </span>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Documents;

