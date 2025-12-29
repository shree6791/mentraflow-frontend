import React, { useEffect, useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { kgService } from '../services/api';
import { Card, CardContent } from '../components/ui/card';
import { Brain, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const KnowledgeGraph = () => {
  const { currentWorkspace } = useWorkspace();
  const [concepts, setConcepts] = useState([]);
  const [edges, setEdges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentWorkspace) {
      loadKnowledgeGraph();
    }
  }, [currentWorkspace]);

  const loadKnowledgeGraph = async () => {
    if (!currentWorkspace) return;

    setLoading(true);
    try {
      const [conceptsData, edgesData] = await Promise.all([
        kgService.listConcepts(currentWorkspace.id, { limit: 100 }),
        kgService.listEdges(currentWorkspace.id, { limit: 100 }),
      ]);
      setConcepts(conceptsData);
      setEdges(edgesData);
    } catch (error) {
      console.error('Error loading knowledge graph:', error);
      toast.error('Failed to load knowledge graph');
    } finally {
      setLoading(false);
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
        <Loader2 className="h-8 w-8 animate-spin text-primary-teal" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Knowledge Graph</h1>
        <p className="text-gray-600">
          Visualize concepts and relationships from your documents
        </p>
      </div>

      {concepts.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No concepts yet</h3>
            <p className="text-gray-600">
              Upload documents and extract knowledge graphs to see concepts here
            </p>
          </CardContent>
        </Card>
      ) : (
        <div>
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Concepts</h3>
                  <p className="text-sm text-gray-600">{concepts.length} concepts found</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Relationships</h3>
                  <p className="text-sm text-gray-600">{edges.length} relationships</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {concepts.map((concept) => (
              <Card key={concept.id} className="card-hover">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">{concept.name}</h4>
                  {concept.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {concept.description}
                    </p>
                  )}
                  {concept.type && (
                    <span className="inline-block mt-2 px-2 py-1 text-xs bg-primary-teal/10 text-primary-teal rounded">
                      {concept.type}
                    </span>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8">
            <p className="text-sm text-gray-600 mb-4">
              Note: Full graph visualization coming soon. For now, you can browse concepts above.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeGraph;

