import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search, X, ZoomIn, ZoomOut, RotateCcw, Info } from 'lucide-react';
import { COLORS } from '../constants/theme';

const KnowledgeGraphVisualization = ({ concepts, edges, onConceptClick }) => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const simulationRef = useRef(null);
  const tooltipRef = useRef(null);
  const zoomRef = useRef(null);
  const [selectedConcept, setSelectedConcept] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedNodes, setHighlightedNodes] = useState(new Set());
  const [zoomLevel, setZoomLevel] = useState(1);
  const [hoveredConcept, setHoveredConcept] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!concepts.length || !svgRef.current) return;

    // Clear previous visualization
    d3.select(svgRef.current).selectAll('*').remove();

    // Debug: log edges and concepts
    console.log('Rendering Knowledge Graph - Concepts:', concepts.length, concepts);
    console.log('Rendering Knowledge Graph - Edges:', edges.length, edges);
    if (edges.length > 0) {
      console.log('First edge structure:', JSON.stringify(edges[0], null, 2));
      console.log('First concept structure:', JSON.stringify(concepts[0], null, 2));
    }

    // Filter concepts based on search
    const filteredConcepts = searchQuery
      ? concepts.filter(c => 
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      : concepts;

    // Filter edges to only include connections between filtered concepts
    const conceptIds = new Set(filteredConcepts.map(c => c.id));
    
    // Debug: log first edge to see structure
    if (edges.length > 0) {
      console.log('Sample edge structure:', JSON.stringify(edges[0], null, 2));
      console.log('All edge keys:', Object.keys(edges[0]));
      console.log('Sample concept structure:', JSON.stringify(filteredConcepts[0], null, 2));
      console.log('Concept IDs set (first 5):', Array.from(conceptIds).slice(0, 5));
    }
    
    const filteredEdges = edges
      .map(e => {
        // Use src_id and dst_id (backend API format) - check these FIRST
        const sourceId = e.src_id || 
                         e.source_id || 
                         e.source_concept_id || 
                         e.concept_source_id ||
                         e.from_concept_id ||
                         e.from_id ||
                         (typeof e.source === 'object' && e.source ? (e.source.id || e.source.concept_id) : null) ||
                         (typeof e.source === 'string' ? e.source : null) ||
                         e.source;
                         
        const targetId = e.dst_id || 
                         e.target_id || 
                         e.target_concept_id || 
                         e.concept_target_id ||
                         e.to_concept_id ||
                         e.to_id ||
                         (typeof e.target === 'object' && e.target ? (e.target.id || e.target.concept_id) : null) ||
                         (typeof e.target === 'string' ? e.target : null) ||
                         e.target;
        
        return {
          ...e,
          source_id: sourceId,
          target_id: targetId,
        };
      })
      .filter(e => {
        // Only include edges where both nodes exist in filtered concepts
        const sourceId = e.source_id;
        const targetId = e.target_id;
        const hasSource = sourceId && conceptIds.has(sourceId);
        const hasTarget = targetId && conceptIds.has(targetId);
        
        if (!hasSource || !hasTarget) {
          console.log('Filtered out edge:', { 
            sourceId, 
            targetId, 
            hasSource, 
            hasTarget,
            sourceInSet: sourceId ? conceptIds.has(sourceId) : false,
            targetInSet: targetId ? conceptIds.has(targetId) : false,
            edgeKeys: Object.keys(e)
          });
        }
        
        return hasSource && hasTarget;
      });
    
    console.log('After filtering, filteredEdges:', filteredEdges.length, filteredEdges);

    if (filteredConcepts.length === 0) return;

    // Set up SVG
    const svg = d3.select(svgRef.current);
    const container = d3.select(containerRef.current);
    const width = container.node()?.getBoundingClientRect().width || 800;
    const height = Math.max(600, window.innerHeight - 300);

    svg.attr('width', width).attr('height', height);

    // Create zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
        setZoomLevel(event.transform.k);
      });

    svg.call(zoom);
    zoomRef.current = zoom; // Store zoom behavior reference

    // Create main group for zoom/pan
    const g = svg.append('g');

    // Prepare edges for D3 - use IDs for forceLink to match
    const edgesForSimulation = filteredEdges.map(e => ({
      ...e,
      source: e.source_id || (typeof e.source === 'object' ? e.source.id : e.source),
      target: e.target_id || (typeof e.target === 'object' ? e.target.id : e.target),
    }));

    console.log('Filtered edges for simulation:', edgesForSimulation.length, edgesForSimulation);
    console.log('Filtered concepts:', filteredConcepts.length, filteredConcepts.map(c => c.id));

    // Create force simulation
    const simulation = d3.forceSimulation(filteredConcepts)
      .force('link', d3.forceLink(edgesForSimulation)
        .id(d => d.id)
        .distance(150)
        .strength(0.7)
      )
      .force('charge', d3.forceManyBody().strength(-500))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(50));

    simulationRef.current = simulation;

    // Create edges (lines) - render FIRST so they appear behind nodes
    const link = g.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(edgesForSimulation)
      .enter()
      .append('line')
      .attr('stroke', COLORS.brand.deepTeal)
      .attr('stroke-opacity', 0.7)
      .attr('stroke-width', 4)
      .style('pointer-events', 'none'); // Allow clicks to pass through to nodes

    // Create nodes (circles)
    const node = g.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(filteredConcepts)
      .enter()
      .append('circle')
      .attr('r', d => {
        // Size based on connections - larger base size
        const connections = filteredEdges.filter(e => {
          const sourceId = e.source_id || (typeof e.source === 'object' ? e.source?.id : e.source);
          const targetId = e.target_id || (typeof e.target === 'object' ? e.target?.id : e.target);
          return sourceId === d.id || targetId === d.id;
        }).length;
        return Math.max(15, Math.min(35, 15 + connections * 3));
      })
      .attr('fill', d => {
        if (highlightedNodes.has(d.id)) {
          return COLORS.secondary.yellow;
        }
        if (selectedConcept?.id === d.id) {
          return COLORS.brand.deepTeal;
        }
        return COLORS.primary.ocean;
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 3)
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        event.stopPropagation();
        // Toggle selection - if clicking the same node, deselect it
        if (selectedConcept?.id === d.id) {
          setSelectedConcept(null);
          setHighlightedNodes(new Set());
        } else {
          setSelectedConcept(d);
          if (onConceptClick) {
            onConceptClick(d);
          }
          // Highlight connected nodes
          const connectedIds = new Set([d.id]);
          filteredEdges.forEach(e => {
            const sourceId = e.source_id || (typeof e.source === 'object' ? e.source?.id : e.source);
            const targetId = e.target_id || (typeof e.target === 'object' ? e.target?.id : e.target);
            if (sourceId === d.id) {
              connectedIds.add(targetId);
            }
            if (targetId === d.id) {
              connectedIds.add(sourceId);
            }
          });
          setHighlightedNodes(connectedIds);
        }
      })
      .on('mouseover', function(event, d) {
        // Increase size on hover
        const connections = filteredEdges.filter(e => {
          const sourceId = e.source_id || (typeof e.source === 'object' ? e.source?.id : e.source);
          const targetId = e.target_id || (typeof e.target === 'object' ? e.target?.id : e.target);
          return sourceId === d.id || targetId === d.id;
        }).length;
        const baseRadius = Math.max(15, Math.min(35, 15 + connections * 3));
        d3.select(this).attr('r', baseRadius + 5);
        
        // Show tooltip - get position relative to container
        setHoveredConcept(d);
        const containerRect = container.node()?.getBoundingClientRect();
        if (containerRect) {
          const [x, y] = d3.pointer(event, container.node());
          setTooltipPosition({ x, y });
        }
      })
      .on('mousemove', function(event, d) {
        // Update tooltip position as mouse moves
        const containerRect = container.node()?.getBoundingClientRect();
        if (containerRect) {
          const [x, y] = d3.pointer(event, container.node());
          setTooltipPosition({ x, y });
        }
      })
      .on('mouseout', function(event, d) {
        // Reset size on mouseout
        const connections = filteredEdges.filter(e => {
          const sourceId = e.source_id || (typeof e.source === 'object' ? e.source?.id : e.source);
          const targetId = e.target_id || (typeof e.target === 'object' ? e.target?.id : e.target);
          return sourceId === d.id || targetId === d.id;
        }).length;
        const baseRadius = Math.max(15, Math.min(35, 15 + connections * 3));
        d3.select(this).attr('r', baseRadius);
        
        // Hide tooltip
        setHoveredConcept(null);
      });

    // Create labels
    const label = g.append('g')
      .attr('class', 'labels')
      .selectAll('text')
      .data(filteredConcepts)
      .enter()
      .append('text')
      .text(d => d.name)
      .attr('font-size', '14px')
      .attr('font-weight', '600')
      .attr('fill', '#1F2937')
      .attr('text-anchor', 'middle')
      .attr('dy', d => {
        const connections = filteredEdges.filter(e => {
          const sourceId = e.source_id || (typeof e.source === 'object' ? e.source?.id : e.source);
          const targetId = e.target_id || (typeof e.target === 'object' ? e.target?.id : e.target);
          return sourceId === d.id || targetId === d.id;
        }).length;
        const radius = Math.max(15, Math.min(35, 15 + connections * 3));
        return radius + 18;
      })
      .style('pointer-events', 'none')
      .style('user-select', 'none');

    // Track if we've done initial zoom
    let hasInitialZoomed = false;

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => {
          // d.source is now an ID, find the actual node
          const sourceNode = typeof d.source === 'object' ? d.source : filteredConcepts.find(c => c.id === d.source);
          return sourceNode?.x || 0;
        })
        .attr('y1', d => {
          const sourceNode = typeof d.source === 'object' ? d.source : filteredConcepts.find(c => c.id === d.source);
          return sourceNode?.y || 0;
        })
        .attr('x2', d => {
          const targetNode = typeof d.target === 'object' ? d.target : filteredConcepts.find(c => c.id === d.target);
          return targetNode?.x || 0;
        })
        .attr('y2', d => {
          const targetNode = typeof d.target === 'object' ? d.target : filteredConcepts.find(c => c.id === d.target);
          return targetNode?.y || 0;
        });

      node
        .attr('cx', d => d.x || 0)
        .attr('cy', d => d.y || 0);

      label
        .attr('x', d => d.x || 0)
        .attr('y', d => {
        const connections = filteredEdges.filter(e => {
          const sourceId = e.source_id || (typeof e.source === 'object' ? e.source.id : e.source);
          const targetId = e.target_id || (typeof e.target === 'object' ? e.target.id : e.target);
          return sourceId === d.id || targetId === d.id;
        }).length;
        const radius = Math.max(15, Math.min(35, 15 + connections * 3));
        return (d.y || 0) + radius + 18;
        });

      // Initial zoom to fit - wait for simulation to position nodes
      if (!hasInitialZoomed && simulation.alpha() < 0.3) {
        // Simulation is settling, calculate bounds and zoom
        setTimeout(() => {
          const bounds = g.node()?.getBBox();
          if (bounds && bounds.width > 0 && bounds.height > 0) {
            const fullWidth = bounds.width;
            const fullHeight = bounds.height;
            const scale = Math.min(width / fullWidth, height / fullHeight, 1) * 0.8;
            const translate = [
              (width - fullWidth * scale) / 2 - bounds.x * scale,
              (height - fullHeight * scale) / 2 - bounds.y * scale
            ];
            svg.call(zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale));
            hasInitialZoomed = true;
          }
        }, 100);
      }
    });

    // Cleanup
    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };
  }, [concepts, edges, searchQuery, onConceptClick]); // Removed selectedConcept and highlightedNodes to prevent graph reset

  // Separate effect to update node colors when selection changes (without recreating the graph)
  useEffect(() => {
    if (!svgRef.current) return;
    
    const svg = d3.select(svgRef.current);
    const node = svg.selectAll('.nodes circle');
    
    node.attr('fill', d => {
      if (highlightedNodes.has(d.id)) {
        return COLORS.secondary.yellow;
      }
      if (selectedConcept?.id === d.id) {
        return COLORS.brand.deepTeal;
      }
      return COLORS.primary.ocean;
    });
  }, [selectedConcept, highlightedNodes]);

  const handleZoomIn = () => {
    const svg = d3.select(svgRef.current);
    if (!svg.node() || !zoomRef.current) return;
    
    // Use scaleBy with the stored zoom behavior
    svg.transition()
      .duration(200)
      .call(zoomRef.current.scaleBy, 1.5);
  };

  const handleZoomOut = () => {
    const svg = d3.select(svgRef.current);
    if (!svg.node() || !zoomRef.current) return;
    
    // Use scaleBy with the stored zoom behavior
    svg.transition()
      .duration(200)
      .call(zoomRef.current.scaleBy, 1 / 1.5);
  };

  const handleReset = () => {
    const svg = d3.select(svgRef.current);
    const container = d3.select(containerRef.current);
    const width = container.node()?.getBoundingClientRect().width || 800;
    const height = Math.max(600, window.innerHeight - 300);
    
    if (!zoomRef.current) {
      // Fallback if zoom not initialized
      svg.transition().call(
        d3.zoom().transform,
        d3.zoomIdentity.translate(width / 2, height / 2).scale(1)
      );
    } else {
      // Get the graph group to calculate bounds
      const g = svg.select('g');
      if (g.node()) {
        const bounds = g.node().getBBox();
        if (bounds.width > 0 && bounds.height > 0) {
          const fullWidth = bounds.width;
          const fullHeight = bounds.height;
          const scale = Math.min(width / fullWidth, height / fullHeight, 1) * 0.8;
          const translate = [
            (width - fullWidth * scale) / 2 - bounds.x * scale,
            (height - fullHeight * scale) / 2 - bounds.y * scale
          ];
          
          svg.transition()
            .duration(300)
            .call(
              zoomRef.current.transform,
              d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)
            );
        } else {
          svg.transition()
            .duration(300)
            .call(
              zoomRef.current.transform,
              d3.zoomIdentity.translate(width / 2, height / 2).scale(1)
            );
        }
      }
    }
    setSelectedConcept(null);
    setHighlightedNodes(new Set());
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && selectedConcept) {
        setSelectedConcept(null);
        setHighlightedNodes(new Set());
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [selectedConcept]);

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 w-full sm:max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search concepts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            title="Reset View"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Graph Visualization */}
      <Card>
        <CardContent className="p-0 relative">
          <div 
            ref={containerRef} 
            className="w-full overflow-hidden rounded-lg bg-gray-50"
            onClick={(e) => {
              // Close modal when clicking on the graph background (not on nodes or edges)
              // Check if click is on SVG background, not on nodes (circles) or edges (lines)
              const target = e.target;
              if (target && (target.tagName === 'svg' || 
                            (target.tagName === 'g' && !target.classList.contains('nodes') && !target.classList.contains('links')) ||
                            target === e.currentTarget)) {
                setSelectedConcept(null);
                setHighlightedNodes(new Set());
              }
            }}
          >
            <svg
              ref={svgRef}
              className="w-full"
              style={{ minHeight: '600px' }}
            />
          </div>
          
          {/* Tooltip on hover */}
          {hoveredConcept && (
            <div
              ref={tooltipRef}
              className="absolute bg-white border border-gray-200 rounded-lg shadow-xl p-4 z-50 pointer-events-none max-w-xs"
              style={{
                left: `${Math.min(tooltipPosition.x + 15, containerRef.current?.offsetWidth - 250 || tooltipPosition.x + 15)}px`,
                top: `${Math.max(tooltipPosition.y - 10, 10)}px`,
                transform: tooltipPosition.y < 150 ? 'translateY(0)' : 'translateY(-100%)',
              }}
            >
              <h4 className="font-bold text-lg mb-2" style={{ color: COLORS.brand.deepTeal }}>
                {hoveredConcept.name}
              </h4>
              {hoveredConcept.type && (
                <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-primary-teal/10 text-primary-teal mb-2">
                  {hoveredConcept.type}
                </span>
              )}
              {hoveredConcept.description && (
                <p className="text-sm text-gray-600 line-clamp-3">
                  {hoveredConcept.description}
                </p>
              )}
              {hoveredConcept.metadata && Object.keys(hoveredConcept.metadata).length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    {Object.keys(hoveredConcept.metadata).length} metadata fields
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selected Concept Details */}
      {selectedConcept && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold mb-2">{selectedConcept.name}</h3>
                {selectedConcept.type && (
                  <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-primary-teal/10 text-primary-teal">
                    {selectedConcept.type}
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedConcept(null);
                  setHighlightedNodes(new Set());
                }}
                title="Close"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {selectedConcept.description && (
              <p className="text-gray-600 mb-4">{selectedConcept.description}</p>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Info className="h-4 w-4" />
              <span>
                Click on other nodes to explore connections
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info */}
      <div className="text-sm text-gray-500 flex items-center gap-2">
        <Info className="h-4 w-4" />
        <span>
          {concepts.length} concepts, {edges.length} relationships. 
          Click nodes to explore, drag to pan, scroll to zoom.
        </span>
      </div>
    </div>
  );
};

export default KnowledgeGraphVisualization;

