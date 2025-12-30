import React, { useEffect, useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { kgService } from '../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Brain, Loader2, ChevronLeft, ChevronRight, Network, List } from 'lucide-react';
import { toast } from 'sonner';
import KnowledgeGraphVisualization from '../components/KnowledgeGraphVisualization';
import { COLORS } from '../constants/theme';

const KnowledgeGraph = () => {
  const { currentWorkspace } = useWorkspace();
  const [concepts, setConcepts] = useState([]);
  const [edges, setEdges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentConceptIndex, setCurrentConceptIndex] = useState(0);
  const [viewMode, setViewMode] = useState('graph'); // 'graph' or 'list'
  const [selectedConcept, setSelectedConcept] = useState(null);

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

  const handleConceptClick = async (concept) => {
    setSelectedConcept(concept);
    // Optionally load neighbors
    try {
      const neighbors = await kgService.getNeighbors(concept.id, 1);
      console.log('Neighbors:', neighbors);
    } catch (error) {
      console.error('Error loading neighbors:', error);
    }
  };

  if (!currentWorkspace) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-600">Please select a workspace to view knowledge graph</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: COLORS.brand.deepTeal }} />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="mb-8 flex-shrink-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: COLORS.brand.deepTeal }}>
              Knowledge Graph
            </h1>
            <p className="text-gray-600 text-lg">
              Visualize concepts and relationships from your documents
            </p>
          </div>
          {concepts.length > 0 && (
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'graph' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('graph')}
                style={viewMode === 'graph' ? { backgroundColor: COLORS.brand.deepTeal, color: 'white' } : {}}
              >
                <Network className="mr-2 h-4 w-4" />
                Graph View
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                style={viewMode === 'list' ? { backgroundColor: COLORS.brand.deepTeal, color: 'white' } : {}}
              >
                <List className="mr-2 h-4 w-4" />
                List View
              </Button>
            </div>
          )}
        </div>
      </div>

      {concepts.length === 0 ? (
        <Card className="border-2 border-dashed border-gray-300 flex-1 flex items-center justify-center">
          <CardContent className="p-12 text-center">
            <div 
              className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
              style={{ backgroundColor: `${COLORS.brand.deepTeal}15` }}
            >
              <Brain 
                className="h-8 w-8" 
                style={{ color: COLORS.brand.deepTeal }}
              />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-gray-900">No concepts yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Upload documents and extract knowledge graphs to visualize concepts and their relationships.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Stats Card */}
          <Card className="mb-6 flex-shrink-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Concepts</h3>
                  <p className="text-sm text-gray-600">{concepts.length} concepts found</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Relationships</h3>
                  <p className="text-sm text-gray-600">{edges.length} relationships</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Graph View */}
          {viewMode === 'graph' && (
            <div className="flex-1 min-h-0">
              <KnowledgeGraphVisualization
                concepts={concepts}
                edges={edges}
                onConceptClick={handleConceptClick}
              />
            </div>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <div className="flex-1 min-h-0 overflow-y-auto">
              {/* Desktop Grid */}
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {concepts.map((concept) => (
                  <Card 
                    key={concept.id} 
                    className="card-hover cursor-pointer"
                    onClick={() => handleConceptClick(concept)}
                  >
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">{concept.name}</h4>
                      {concept.description && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                          {concept.description}
                        </p>
                      )}
                      {concept.type && (
                        <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-primary-teal/10 text-primary-teal">
                          {concept.type}
                        </span>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Mobile Carousel */}
              <div className="md:hidden relative">
                <div className="overflow-hidden">
                  <div 
                    className="flex transition-transform duration-300 ease-in-out"
                    style={{ transform: `translateX(-${currentConceptIndex * 100}%)` }}
                  >
                    {concepts.map((concept) => (
                      <div key={concept.id} className="min-w-full">
                        <Card 
                          className="card-hover cursor-pointer"
                          onClick={() => handleConceptClick(concept)}
                        >
                          <CardContent className="p-4">
                            <h4 className="font-semibold mb-2">{concept.name}</h4>
                            {concept.description && (
                              <p className="text-sm text-gray-600 line-clamp-3 mb-2">
                                {concept.description}
                              </p>
                            )}
                            {concept.type && (
                              <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-primary-teal/10 text-primary-teal">
                                {concept.type}
                              </span>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Carousel Controls */}
                {concepts.length > 1 && (
                  <div className="flex justify-center items-center mt-4 space-x-2">
                    <button
                      onClick={() => setCurrentConceptIndex((prev) => (prev > 0 ? prev - 1 : concepts.length - 1))}
                      className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
                      aria-label="Previous concept"
                    >
                      <ChevronLeft className="h-5 w-5 text-gray-700" />
                    </button>
                    <div className="flex space-x-1">
                      {concepts.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentConceptIndex(index)}
                          className={`h-2 rounded-full transition-all ${
                            index === currentConceptIndex ? 'w-8 bg-primary-teal' : 'w-2 bg-gray-300'
                          }`}
                          aria-label={`Go to concept ${index + 1}`}
                        />
                      ))}
                    </div>
                    <button
                      onClick={() => setCurrentConceptIndex((prev) => (prev < concepts.length - 1 ? prev + 1 : 0))}
                      className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
                      aria-label="Next concept"
                    >
                      <ChevronRight className="h-5 w-5 text-gray-700" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default KnowledgeGraph;

