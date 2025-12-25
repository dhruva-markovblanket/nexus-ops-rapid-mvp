import React, { useState, useMemo, useEffect } from 'react';
import { Building, MapPoint, Ticket, TicketPriority, TicketStatus, UserRole } from '../types';
import { CAMPUS_BUILDINGS, MAP_POINTS, CAMPUS_ROADS } from '../constants';
import { MapPin, Navigation, Layers, RotateCcw, ZoomIn, ZoomOut, AlertTriangle, AlertCircle, Eye, Box, X, ChevronRight, Info } from 'lucide-react';

interface CampusMapProps {
  tickets: Ticket[];
  userRole?: UserRole;
}

const CampusMap: React.FC<CampusMapProps> = ({ tickets, userRole = UserRole.GUEST }) => {
  const [viewMode, setViewMode] = useState<'2D' | '3D'>('2D');
  
  // Navigation State
  const [startNodeId, setStartNodeId] = useState<string>('');
  const [endNodeId, setEndNodeId] = useState<string>('');
  const [routePath, setRoutePath] = useState<string[]>([]); // Array of node IDs

  // 3D View Controls
  const [rotationX, setRotationX] = useState(60);
  const [rotationZ, setRotationZ] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selected3DBuildingId, setSelected3DBuildingId] = useState<string | null>(null);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  // --- Helpers ---

  // Aggregate tickets per building
  const buildingIssues = useMemo(() => {
    const issues: Record<string, { count: number, maxPriority: TicketPriority }> = {};
    
    tickets.forEach(t => {
       if(t.status === TicketStatus.RESOLVED) return;
       
       let bId = '';
       const loc = t.location.toLowerCase();
       // Simple inclusion check to map ticket location string to building ID
       if(loc.includes('admin') || loc.includes('hr') || loc.includes('office')) bId = 'b-admin';
       else if(loc.includes('academic block a') || loc.includes('block a') || loc.includes('cs')) bId = 'b-academic-a';
       else if(loc.includes('academic block b') || loc.includes('block b') || loc.includes('mechanical')) bId = 'b-academic-b';
       else if(loc.includes('library')) bId = 'b-library';
       else if(loc.includes('audit')) bId = 'b-audit';
       else if(loc.includes('cafeteria') || loc.includes('canteen')) bId = 'b-cafe';
       else return; 

       if(!issues[bId]) {
           issues[bId] = { count: 0, maxPriority: TicketPriority.LOW };
       }
       issues[bId].count++;
       
       // Update max priority
       const currentP = issues[bId].maxPriority;
       if(t.priority === TicketPriority.CRITICAL) issues[bId].maxPriority = TicketPriority.CRITICAL;
       else if(t.priority === TicketPriority.HIGH && currentP !== TicketPriority.CRITICAL) issues[bId].maxPriority = TicketPriority.HIGH;
       else if(t.priority === TicketPriority.MEDIUM && currentP === TicketPriority.LOW) issues[bId].maxPriority = TicketPriority.MEDIUM;
    });
    return issues;
  }, [tickets]);

  const getPriorityColor = (priority: TicketPriority) => {
      switch(priority) {
          case TicketPriority.CRITICAL: return '#ef4444'; // Red-500
          case TicketPriority.HIGH: return '#f97316'; // Orange-500
          case TicketPriority.MEDIUM: return '#eab308'; // Yellow-500
          default: return '#3b82f6'; // Blue-500
      }
  };

  const getPriorityClass = (priority: TicketPriority) => {
      switch(priority) {
          case TicketPriority.CRITICAL: return 'bg-red-500 animate-pulse'; 
          case TicketPriority.HIGH: return 'bg-orange-500'; 
          case TicketPriority.MEDIUM: return 'bg-yellow-400'; 
          default: return 'bg-blue-400'; 
      }
  };

  // Helper to place ticket inside 3D building based on description
  const getTicket3DPosition = (ticket: Ticket, building: Building) => {
    const hash = ticket.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // Determine floor from text
    let floor = 0;
    const loc = ticket.location.toLowerCase();
    if (loc.includes('1st') || loc.includes('first')) floor = 1;
    else if (loc.includes('2nd') || loc.includes('second')) floor = 2;
    else if (loc.includes('3rd') || loc.includes('third')) floor = 3;
    else if (loc.includes('4th') || loc.includes('fourth')) floor = 4;
    
    // Clamp floor
    floor = Math.min(floor, building.floors - 1);

    // Randomize Position within building bounds (inset by 20px)
    // Using hash to ensure the position persists between renders
    const relX = (hash * 17) % (building.width - 40) + 20;
    const relY = (hash * 23) % (building.height - 40) + 20;
    const relZ = (floor * 40) + 20; // 20px above floor

    return { x: relX, y: relY, z: relZ, floor };
  };

  // --- Pathfinding Logic (BFS) ---
  useEffect(() => {
    if (!startNodeId || !endNodeId) {
        setRoutePath([]);
        return;
    }

    const queue: string[][] = [[startNodeId]];
    const visited = new Set<string>();
    let foundPath: string[] = [];

    while(queue.length > 0) {
        const path = queue.shift()!;
        const node = path[path.length - 1];

        if (node === endNodeId) {
            foundPath = path;
            break;
        }

        if (!visited.has(node)) {
            visited.add(node);
            const mapPoint = MAP_POINTS.find(p => p.id === node);
            if (mapPoint && mapPoint.connections) {
                for (const neighborId of mapPoint.connections) {
                    queue.push([...path, neighborId]);
                }
            }
        }
    }
    setRoutePath(foundPath);
  }, [startNodeId, endNodeId]);


  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 relative">
        
        {/* --- Top Bar Controls --- */}
        <div className="absolute top-4 left-4 right-4 z-20 flex flex-col md:flex-row justify-between items-start md:items-center pointer-events-none">
            {/* Navigation Input */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 pointer-events-auto flex gap-2 items-center">
                <div className="flex flex-col gap-2">
                    <select 
                        value={startNodeId} 
                        onChange={(e) => setStartNodeId(e.target.value)}
                        className="text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md px-2 py-1 focus:ring-2 focus:ring-indigo-500 outline-none w-40"
                    >
                        <option value="">Start: Select...</option>
                        {MAP_POINTS.filter(p => p.type === 'ENTRANCE').map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                    <select 
                        value={endNodeId} 
                        onChange={(e) => setEndNodeId(e.target.value)}
                        className="text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md px-2 py-1 focus:ring-2 focus:ring-indigo-500 outline-none w-40"
                    >
                         <option value="">End: Select...</option>
                        {MAP_POINTS.filter(p => p.type === 'ENTRANCE').map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>
                <div className="h-16 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>
                <button 
                    onClick={() => { setStartNodeId(''); setEndNodeId(''); }}
                    className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                    title="Clear Route"
                >
                    <RotateCcw className="w-5 h-5" />
                </button>
            </div>

            {/* Admin Toggle */}
            {userRole === UserRole.ADMIN && (
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-1.5 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 pointer-events-auto mt-4 md:mt-0 flex items-center">
                     <span className="text-[10px] font-bold text-gray-400 uppercase mr-2 ml-1">Visualization</span>
                    <button
                        onClick={() => { setViewMode('2D'); setSelected3DBuildingId(null); }}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center transition-colors ${viewMode === '2D' ? 'bg-indigo-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                    >
                        <MapPin className="w-3 h-3 mr-1.5" /> 2D Map
                    </button>
                    <button
                        onClick={() => setViewMode('3D')}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center transition-colors ml-1 ${viewMode === '3D' ? 'bg-indigo-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                    >
                        <Box className="w-3 h-3 mr-1.5" /> 3D Infra
                    </button>
                </div>
            )}
        </div>

        {/* --- 2D MAP VIEW (SVG) --- */}
        {viewMode === '2D' && (
            <div className="w-full h-full bg-[#f0f4f8] dark:bg-[#1a202c] overflow-auto flex items-center justify-center p-8">
                <div className="relative shadow-2xl rounded-xl overflow-hidden bg-[#e2e8f0] dark:bg-[#2d3748] border-4 border-white dark:border-gray-600" style={{ width: '1000px', height: '800px' }}>
                    
                    <svg viewBox="0 0 1000 800" className="w-full h-full">
                        <defs>
                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeOpacity="0.1" className="text-gray-400" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />

                        {/* Roads */}
                        {CAMPUS_ROADS.map(road => (
                            <line 
                                key={road.id}
                                x1={road.x1} y1={road.y1}
                                x2={road.x2} y2={road.y2}
                                stroke="#94a3b8"
                                strokeWidth="20"
                                strokeLinecap="round"
                            />
                        ))}

                        {/* Route Path Highlighting */}
                        {routePath.length > 1 && (
                            <polyline 
                                points={routePath.map(id => {
                                    const p = MAP_POINTS.find(mp => mp.id === id);
                                    return p ? `${p.x},${p.y}` : '';
                                }).join(' ')}
                                fill="none"
                                stroke="#3b82f6"
                                strokeWidth="8"
                                strokeLinecap="round"
                                strokeDasharray="12 6"
                                className="animate-[dash_1s_linear_infinite]"
                            />
                        )}

                        {/* Buildings */}
                        {CAMPUS_BUILDINGS.map(b => {
                            const issueData = buildingIssues[b.id];
                            const hasIssues = issueData && issueData.count > 0;
                            return (
                                <g key={b.id}>
                                    <rect 
                                        x={b.mapX} y={b.mapY} width={b.width} height={b.height}
                                        rx="8"
                                        fill={b.id === 'b-admin' ? '#cbd5e1' : '#e2e8f0'}
                                        stroke="#475569"
                                        strokeWidth="4"
                                        className="fill-white dark:fill-gray-700 stroke-gray-400 dark:stroke-gray-500"
                                    />
                                    <text 
                                        x={b.mapX + b.width / 2} 
                                        y={b.mapY + b.height / 2} 
                                        textAnchor="middle" 
                                        className="text-sm font-bold fill-gray-600 dark:fill-gray-300 pointer-events-none"
                                        style={{ fontSize: '14px' }}
                                    >
                                        {b.name}
                                    </text>

                                    {/* Issue Marker (2D) */}
                                    {hasIssues && (
                                        <circle 
                                            cx={b.mapX + b.width - 15} 
                                            cy={b.mapY + 15} 
                                            r="10" 
                                            fill={getPriorityColor(issueData.maxPriority)}
                                            className="animate-pulse"
                                        />
                                    )}
                                </g>
                            )
                        })}

                        {/* Start/End Markers */}
                        {startNodeId && (
                            <g transform={`translate(${MAP_POINTS.find(p => p.id === startNodeId)?.x || 0}, ${MAP_POINTS.find(p => p.id === startNodeId)?.y || 0})`}>
                                <circle r="8" fill="#10b981" stroke="white" strokeWidth="2" />
                            </g>
                        )}
                         {endNodeId && (
                            <g transform={`translate(${MAP_POINTS.find(p => p.id === endNodeId)?.x || 0}, ${MAP_POINTS.find(p => p.id === endNodeId)?.y || 0})`}>
                                <circle r="8" fill="#ef4444" stroke="white" strokeWidth="2" />
                            </g>
                        )}
                    </svg>
                    
                    {/* Map Legend 2D */}
                    <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-800/90 p-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow text-xs">
                        <div className="flex items-center mb-1">
                            <span className="w-8 h-1 bg-gray-400 mr-2"></span> Road
                        </div>
                        <div className="flex items-center mb-1">
                            <span className="w-8 h-1 bg-blue-500 border-dashed border-b mr-2"></span> Route
                        </div>
                        <div className="flex items-center">
                            <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span> Active Issue
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* --- 3D INFRASTRUCTURE VIEW (CSS 3D) --- */}
        {viewMode === '3D' && userRole === UserRole.ADMIN && (
            <div className="w-full h-full bg-gradient-to-b from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800 overflow-hidden relative flex items-center justify-center">
                
                {/* 3D Controls */}
                <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-20">
                    <button onClick={() => setZoomLevel(z => Math.min(z + 0.1, 2))} className="p-2 bg-white dark:bg-gray-700 rounded-full shadow hover:bg-gray-100"><ZoomIn className="w-5 h-5" /></button>
                    <button onClick={() => setZoomLevel(z => Math.max(z - 0.1, 0.5))} className="p-2 bg-white dark:bg-gray-700 rounded-full shadow hover:bg-gray-100"><ZoomOut className="w-5 h-5" /></button>
                    <div className="h-px bg-gray-300 w-full my-1"></div>
                     <input 
                        type="range" min="0" max="360" value={rotationZ} 
                        onChange={(e) => setRotationZ(parseInt(e.target.value))}
                        className="w-24"
                     />
                </div>

                {/* 3D Scene Container */}
                <div 
                    className="relative transition-transform duration-100 ease-linear"
                    style={{
                        transform: `perspective(1000px) rotateX(${rotationX}deg) rotateZ(${rotationZ}deg) scale(${zoomLevel})`,
                        transformStyle: 'preserve-3d',
                        width: '1000px',
                        height: '800px'
                    }}
                >
                    {/* Ground Plane */}
                    <div 
                        className="absolute inset-0 bg-gray-200 dark:bg-gray-800 border-4 border-gray-300 dark:border-gray-700 shadow-2xl"
                        style={{ transform: 'translateZ(0px)' }}
                    >
                         {/* Grid Pattern */}
                         <div className="w-full h-full opacity-20" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
                    </div>

                    {/* 3D Buildings */}
                    {CAMPUS_BUILDINGS.map(b => {
                        const issueData = buildingIssues[b.id];
                        const hasIssues = issueData && issueData.count > 0;
                        const depth = b.floors * 40; // Height of building based on floors
                        const isSelected = selected3DBuildingId === b.id;
                        const isOthersDimmed = selected3DBuildingId && !isSelected;
                        
                        // Get tickets for this building
                        const buildingTickets = tickets.filter(t => t.status !== TicketStatus.RESOLVED && (
                            t.location.toLowerCase().includes(b.name.toLowerCase().split(' ')[0].toLowerCase()) || // Rough match
                            (b.id === 'b-admin' && t.location.toLowerCase().includes('admin')) ||
                            (b.id === 'b-library' && t.location.toLowerCase().includes('library'))
                        ));

                        return (
                            <div 
                                key={b.id}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelected3DBuildingId(isSelected ? null : b.id);
                                    setSelectedTicketId(null);
                                }}
                                className={`absolute group transition-all duration-500 cursor-pointer ${isOthersDimmed ? 'opacity-30 grayscale' : 'opacity-100'}`}
                                style={{
                                    left: `${b.mapX}px`,
                                    top: `${b.mapY}px`,
                                    width: `${b.width}px`,
                                    height: `${b.height}px`,
                                    transformStyle: 'preserve-3d',
                                    transform: `translateZ(0px)`
                                }}
                            >
                                {/* Building Body */}
                                <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
                                    
                                    {/* Roof */}
                                    <div 
                                        className={`absolute inset-0 border border-indigo-200 dark:border-indigo-900 flex items-center justify-center text-center p-2 shadow-inner transition-colors duration-500
                                            ${isSelected ? 'bg-indigo-500/10 border-indigo-500' : hasIssues ? 'bg-opacity-90' : 'bg-white dark:bg-gray-700'}
                                        `}
                                        style={{ 
                                            transform: `translateZ(${depth}px)`,
                                            backgroundColor: !isSelected && hasIssues ? getPriorityColor(issueData.maxPriority) : undefined,
                                            backfaceVisibility: 'hidden'
                                        }}
                                    >
                                        <div style={{ transform: `rotateZ(${-rotationZ}deg)` }}> {/* Counter rotate text */}
                                            <p className={`font-bold text-xs ${!isSelected && hasIssues ? 'text-white' : 'text-gray-700 dark:text-gray-200'}`}>{b.name}</p>
                                            {hasIssues && !isSelected && (
                                                <div className="mt-1 flex items-center justify-center bg-black/20 rounded-full px-2 py-0.5 text-[10px] text-white animate-pulse">
                                                    <AlertTriangle className="w-3 h-3 mr-1" />
                                                    {issueData.count} Issues
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Walls - If selected, become glass/wireframe */}
                                    {[
                                        { rotate: 'rotateX(-90deg)', origin: 'top', dim: `w-full h-[${depth}px]`, bg: isSelected ? 'bg-indigo-500/5 border-indigo-500/30' : 'bg-gray-300 dark:bg-gray-600' }, // Top wall (visually back)
                                        { rotate: 'rotateX(90deg)', origin: 'bottom', dim: `w-full h-[${depth}px]`, bg: isSelected ? 'bg-indigo-500/5 border-indigo-500/30' : 'bg-gray-400 dark:bg-gray-700' }, // Bottom wall (visually front)
                                        { rotate: 'rotateY(-90deg)', origin: 'left', dim: `h-full w-[${depth}px]`, bg: isSelected ? 'bg-indigo-500/5 border-indigo-500/30' : 'bg-gray-300 dark:bg-gray-600' }, // Left wall
                                        { rotate: 'rotateY(90deg)', origin: 'right', dim: `h-full w-[${depth}px]`, bg: isSelected ? 'bg-indigo-500/5 border-indigo-500/30' : 'bg-gray-400 dark:bg-gray-700' }, // Right wall
                                    ].map((wall, idx) => (
                                        <div 
                                            key={idx}
                                            className={`absolute ${wall.origin === 'top' ? 'top-0 left-0' : wall.origin === 'bottom' ? 'bottom-0 left-0' : wall.origin === 'left' ? 'top-0 left-0' : 'top-0 right-0'} 
                                            border border-gray-400/50 transition-colors duration-500 ${wall.bg}`}
                                            style={{ 
                                                width: wall.rotate.includes('Y') ? `${depth}px` : '100%', 
                                                height: wall.rotate.includes('X') ? `${depth}px` : '100%',
                                                transformOrigin: wall.origin,
                                                transform: wall.rotate
                                            }}
                                        ></div>
                                    ))}

                                    {/* Internal Glow for Issues (When NOT selected) */}
                                    {hasIssues && !isSelected && (
                                        <div 
                                            className="absolute inset-0 z-10 opacity-50 pointer-events-none"
                                            style={{ 
                                                transform: `translateZ(${depth / 2}px)`,
                                                boxShadow: `0 0 40px 20px ${getPriorityColor(issueData.maxPriority)}`
                                            }}
                                        ></div>
                                    )}

                                    {/* INTERNALS (When Selected) */}
                                    {isSelected && (
                                        <>
                                            {/* Floors */}
                                            {Array.from({ length: b.floors }).map((_, floorIdx) => (
                                                <div 
                                                    key={`floor-${floorIdx}`}
                                                    className="absolute inset-0 bg-white/20 border border-white/30"
                                                    style={{ transform: `translateZ(${floorIdx * 40}px)` }}
                                                >
                                                    <span className="absolute bottom-1 right-1 text-[8px] text-white bg-black/50 px-1 rounded">
                                                        {floorIdx === 0 ? 'G' : `L${floorIdx}`}
                                                    </span>
                                                </div>
                                            ))}

                                            {/* Specific Issue Locations */}
                                            {buildingTickets.map(ticket => {
                                                const pos = getTicket3DPosition(ticket, b);
                                                const isTicketSelected = selectedTicketId === ticket.id;

                                                return (
                                                    <div 
                                                        key={ticket.id}
                                                        className="absolute w-4 h-4"
                                                        style={{
                                                            left: `${pos.x}px`,
                                                            top: `${pos.y}px`,
                                                            transform: `translateZ(${pos.z}px) rotateX(${-rotationX}deg) rotateZ(${-rotationZ}deg)`, // Billboard effect
                                                            transformStyle: 'preserve-3d'
                                                        }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedTicketId(ticket.id);
                                                        }}
                                                    >
                                                        {/* Pulsating Orb */}
                                                        <div className={`w-3 h-3 rounded-full shadow-lg ${getPriorityClass(ticket.priority)} border border-white cursor-pointer hover:scale-150 transition-transform`}></div>
                                                        
                                                        {/* Hover Tooltip (Basic) */}
                                                        <div className="absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/70 text-white text-[8px] px-1 py-0.5 rounded opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                                                            {ticket.category}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Admin Overlay Panels */}
                
                {/* 1. General Monitor (Hidden if building selected) */}
                {!selected3DBuildingId && (
                    <div className="absolute top-20 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur p-4 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 w-64 animate-in slide-in-from-right-10 pointer-events-auto">
                        <h3 className="font-bold text-gray-800 dark:text-white mb-3 flex items-center">
                            <Eye className="w-4 h-4 mr-2 text-indigo-500" />
                            Advanced Admin View
                        </h3>
                        <p className="text-xs text-gray-500 mb-3">Infrastructure X-Ray mode enabled. Click buildings to locate internal issues.</p>
                        <div className="space-y-3">
                            {Object.entries(buildingIssues).map(([bId, data]) => {
                                const buildingName = CAMPUS_BUILDINGS.find(b => b.id === bId)?.name;
                                return (
                                    <div key={bId} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                        <span className="text-xs font-medium dark:text-gray-300">{buildingName}</span>
                                        <div className="flex items-center">
                                            <div className={`w-2 h-2 rounded-full mr-2 ${
                                                data.maxPriority === TicketPriority.CRITICAL ? 'bg-red-500 animate-pulse' :
                                                data.maxPriority === TicketPriority.HIGH ? 'bg-orange-500' : 'bg-yellow-400'
                                            }`}></div>
                                            <span className="text-xs font-bold">{data.count}</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* 2. Building Detail Panel (Visible when building selected) */}
                {selected3DBuildingId && (
                    <div className="absolute top-20 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur p-4 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 w-72 animate-in slide-in-from-right-10 pointer-events-auto">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-gray-800 dark:text-white flex items-center">
                                    {CAMPUS_BUILDINGS.find(b => b.id === selected3DBuildingId)?.name}
                                </h3>
                                <p className="text-xs text-gray-500">Internal Issue View</p>
                            </div>
                            <button onClick={() => setSelected3DBuildingId(null)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Selected Ticket Detail */}
                        {selectedTicketId ? (
                            <div className="bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 rounded-lg p-3 animate-in fade-in zoom-in-95">
                                {(() => {
                                    const t = tickets.find(ticket => ticket.id === selectedTicketId);
                                    if (!t) return null;
                                    return (
                                        <>
                                            <div className="flex justify-between items-start mb-2">
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${getPriorityClass(t.priority).split(' ')[0]} text-white`}>
                                                    {t.priority}
                                                </span>
                                                <button onClick={() => setSelectedTicketId(null)} className="text-indigo-400 hover:text-indigo-600">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                            <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-1">{t.title}</h4>
                                            <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">{t.description}</p>
                                            <div className="text-[10px] text-gray-500 flex items-center">
                                                <MapPin className="w-3 h-3 mr-1" />
                                                {t.location}
                                            </div>
                                            <div className="mt-2 text-xs font-semibold text-indigo-600">
                                                Status: {t.status.replace('_', ' ')}
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>
                        ) : (
                            <div className="text-sm text-gray-500 italic bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg text-center">
                                <Info className="w-4 h-4 mx-auto mb-1 opacity-50" />
                                Click on a pulsing orb inside the building to view issue details.
                            </div>
                        )}
                        
                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                             <h5 className="text-xs font-bold text-gray-500 uppercase mb-2">Floor Key</h5>
                             <div className="grid grid-cols-2 gap-2 text-xs">
                                 <div className="flex items-center"><div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div> Critical</div>
                                 <div className="flex items-center"><div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div> High</div>
                                 <div className="flex items-center"><div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div> Medium</div>
                                 <div className="flex items-center"><div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div> Low</div>
                             </div>
                        </div>
                    </div>
                )}
            </div>
        )}
    </div>
  );
};

export default CampusMap;