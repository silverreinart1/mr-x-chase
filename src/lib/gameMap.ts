// Scotland Yard game map with stations and connections
export interface Station {
  id: number;
  x: number;
  y: number;
  name: string;
}

export interface Connection {
  from: number;
  to: number;
  type: 'taxi' | 'bus' | 'underground';
}

// Simplified London map with 50 stations positioned in a grid-like pattern
export const stations: Station[] = [
  { id: 1, x: 100, y: 100, name: "Camden" },
  { id: 2, x: 200, y: 100, name: "King's Cross" },
  { id: 3, x: 300, y: 100, name: "Islington" },
  { id: 4, x: 400, y: 100, name: "Hackney" },
  { id: 5, x: 500, y: 100, name: "Stratford" },
  
  { id: 6, x: 100, y: 200, name: "Regent's Park" },
  { id: 7, x: 200, y: 200, name: "Euston" },
  { id: 8, x: 300, y: 200, name: "Angel" },
  { id: 9, x: 400, y: 200, name: "Bethnal Green" },
  { id: 10, x: 500, y: 200, name: "Mile End" },
  
  { id: 11, x: 100, y: 300, name: "Marylebone" },
  { id: 12, x: 200, y: 300, name: "Warren Street" },
  { id: 13, x: 300, y: 300, name: "Old Street" },
  { id: 14, x: 400, y: 300, name: "Shoreditch" },
  { id: 15, x: 500, y: 300, name: "Bow" },
  
  { id: 16, x: 100, y: 400, name: "Paddington" },
  { id: 17, x: 200, y: 400, name: "Oxford Circus" },
  { id: 18, x: 300, y: 400, name: "Liverpool St" },
  { id: 19, x: 400, y: 400, name: "Whitechapel" },
  { id: 20, x: 500, y: 400, name: "Canary Wharf" },
  
  { id: 21, x: 100, y: 500, name: "Notting Hill" },
  { id: 22, x: 200, y: 500, name: "Bond Street" },
  { id: 23, x: 300, y: 500, name: "St Paul's" },
  { id: 24, x: 400, y: 500, name: "Tower Hill" },
  { id: 25, x: 500, y: 500, name: "Greenwich" },
  
  { id: 26, x: 100, y: 600, name: "Kensington" },
  { id: 27, x: 200, y: 600, name: "Piccadilly" },
  { id: 28, x: 300, y: 600, name: "Bank" },
  { id: 29, x: 400, y: 600, name: "Monument" },
  { id: 30, x: 500, y: 600, name: "Rotherhithe" },
  
  { id: 31, x: 100, y: 700, name: "South Ken" },
  { id: 32, x: 200, y: 700, name: "Westminster" },
  { id: 33, x: 300, y: 700, name: "London Bridge" },
  { id: 34, x: 400, y: 700, name: "Bermondsey" },
  { id: 35, x: 500, y: 700, name: "Deptford" },
  
  { id: 36, x: 100, y: 800, name: "Chelsea" },
  { id: 37, x: 200, y: 800, name: "Pimlico" },
  { id: 38, x: 300, y: 800, name: "Elephant" },
  { id: 39, x: 400, y: 800, name: "Peckham" },
  { id: 40, x: 500, y: 800, name: "New Cross" },
  
  { id: 41, x: 100, y: 900, name: "Fulham" },
  { id: 42, x: 200, y: 900, name: "Battersea" },
  { id: 43, x: 300, y: 900, name: "Kennington" },
  { id: 44, x: 400, y: 900, name: "Camberwell" },
  { id: 45, x: 500, y: 900, name: "Lewisham" },
];

// Connections between stations with transport types
export const connections: Connection[] = [
  // Horizontal taxi connections
  { from: 1, to: 2, type: 'taxi' },
  { from: 2, to: 3, type: 'taxi' },
  { from: 3, to: 4, type: 'taxi' },
  { from: 4, to: 5, type: 'taxi' },
  { from: 6, to: 7, type: 'taxi' },
  { from: 7, to: 8, type: 'taxi' },
  { from: 8, to: 9, type: 'taxi' },
  { from: 9, to: 10, type: 'taxi' },
  { from: 11, to: 12, type: 'taxi' },
  { from: 12, to: 13, type: 'taxi' },
  { from: 13, to: 14, type: 'taxi' },
  { from: 14, to: 15, type: 'taxi' },
  { from: 16, to: 17, type: 'taxi' },
  { from: 17, to: 18, type: 'taxi' },
  { from: 18, to: 19, type: 'taxi' },
  { from: 19, to: 20, type: 'taxi' },
  { from: 21, to: 22, type: 'taxi' },
  { from: 22, to: 23, type: 'taxi' },
  { from: 23, to: 24, type: 'taxi' },
  { from: 24, to: 25, type: 'taxi' },
  { from: 26, to: 27, type: 'taxi' },
  { from: 27, to: 28, type: 'taxi' },
  { from: 28, to: 29, type: 'taxi' },
  { from: 29, to: 30, type: 'taxi' },
  { from: 31, to: 32, type: 'taxi' },
  { from: 32, to: 33, type: 'taxi' },
  { from: 33, to: 34, type: 'taxi' },
  { from: 34, to: 35, type: 'taxi' },
  { from: 36, to: 37, type: 'taxi' },
  { from: 37, to: 38, type: 'taxi' },
  { from: 38, to: 39, type: 'taxi' },
  { from: 39, to: 40, type: 'taxi' },
  { from: 41, to: 42, type: 'taxi' },
  { from: 42, to: 43, type: 'taxi' },
  { from: 43, to: 44, type: 'taxi' },
  { from: 44, to: 45, type: 'taxi' },
  
  // Vertical taxi connections
  { from: 1, to: 6, type: 'taxi' },
  { from: 6, to: 11, type: 'taxi' },
  { from: 11, to: 16, type: 'taxi' },
  { from: 16, to: 21, type: 'taxi' },
  { from: 21, to: 26, type: 'taxi' },
  { from: 26, to: 31, type: 'taxi' },
  { from: 31, to: 36, type: 'taxi' },
  { from: 36, to: 41, type: 'taxi' },
  { from: 2, to: 7, type: 'taxi' },
  { from: 7, to: 12, type: 'taxi' },
  { from: 12, to: 17, type: 'taxi' },
  { from: 17, to: 22, type: 'taxi' },
  { from: 22, to: 27, type: 'taxi' },
  { from: 27, to: 32, type: 'taxi' },
  { from: 32, to: 37, type: 'taxi' },
  { from: 37, to: 42, type: 'taxi' },
  { from: 3, to: 8, type: 'taxi' },
  { from: 8, to: 13, type: 'taxi' },
  { from: 13, to: 18, type: 'taxi' },
  { from: 18, to: 23, type: 'taxi' },
  { from: 23, to: 28, type: 'taxi' },
  { from: 28, to: 33, type: 'taxi' },
  { from: 33, to: 38, type: 'taxi' },
  { from: 38, to: 43, type: 'taxi' },
  { from: 4, to: 9, type: 'taxi' },
  { from: 9, to: 14, type: 'taxi' },
  { from: 14, to: 19, type: 'taxi' },
  { from: 19, to: 24, type: 'taxi' },
  { from: 24, to: 29, type: 'taxi' },
  { from: 29, to: 34, type: 'taxi' },
  { from: 34, to: 39, type: 'taxi' },
  { from: 39, to: 44, type: 'taxi' },
  { from: 5, to: 10, type: 'taxi' },
  { from: 10, to: 15, type: 'taxi' },
  { from: 15, to: 20, type: 'taxi' },
  { from: 20, to: 25, type: 'taxi' },
  { from: 25, to: 30, type: 'taxi' },
  { from: 30, to: 35, type: 'taxi' },
  { from: 35, to: 40, type: 'taxi' },
  { from: 40, to: 45, type: 'taxi' },
  
  // Bus connections (every 2 stations)
  { from: 1, to: 3, type: 'bus' },
  { from: 3, to: 5, type: 'bus' },
  { from: 6, to: 8, type: 'bus' },
  { from: 8, to: 10, type: 'bus' },
  { from: 11, to: 13, type: 'bus' },
  { from: 13, to: 15, type: 'bus' },
  { from: 16, to: 18, type: 'bus' },
  { from: 18, to: 20, type: 'bus' },
  { from: 21, to: 23, type: 'bus' },
  { from: 23, to: 25, type: 'bus' },
  { from: 26, to: 28, type: 'bus' },
  { from: 28, to: 30, type: 'bus' },
  { from: 31, to: 33, type: 'bus' },
  { from: 33, to: 35, type: 'bus' },
  { from: 36, to: 38, type: 'bus' },
  { from: 38, to: 40, type: 'bus' },
  { from: 41, to: 43, type: 'bus' },
  { from: 43, to: 45, type: 'bus' },
  { from: 1, to: 11, type: 'bus' },
  { from: 11, to: 21, type: 'bus' },
  { from: 21, to: 31, type: 'bus' },
  { from: 31, to: 41, type: 'bus' },
  { from: 2, to: 12, type: 'bus' },
  { from: 12, to: 22, type: 'bus' },
  { from: 22, to: 32, type: 'bus' },
  { from: 32, to: 42, type: 'bus' },
  { from: 3, to: 13, type: 'bus' },
  { from: 13, to: 23, type: 'bus' },
  { from: 23, to: 33, type: 'bus' },
  { from: 33, to: 43, type: 'bus' },
  { from: 4, to: 14, type: 'bus' },
  { from: 14, to: 24, type: 'bus' },
  { from: 24, to: 34, type: 'bus' },
  { from: 34, to: 44, type: 'bus' },
  { from: 5, to: 15, type: 'bus' },
  { from: 15, to: 25, type: 'bus' },
  { from: 25, to: 35, type: 'bus' },
  { from: 35, to: 45, type: 'bus' },
  
  // Underground connections (major stations)
  { from: 2, to: 7, type: 'underground' },
  { from: 7, to: 17, type: 'underground' },
  { from: 17, to: 27, type: 'underground' },
  { from: 27, to: 32, type: 'underground' },
  { from: 17, to: 22, type: 'underground' },
  { from: 22, to: 27, type: 'underground' },
  { from: 18, to: 23, type: 'underground' },
  { from: 23, to: 28, type: 'underground' },
  { from: 28, to: 33, type: 'underground' },
  { from: 11, to: 16, type: 'underground' },
  { from: 16, to: 21, type: 'underground' },
  { from: 21, to: 26, type: 'underground' },
  { from: 26, to: 31, type: 'underground' },
  { from: 3, to: 8, type: 'underground' },
  { from: 8, to: 13, type: 'underground' },
  { from: 13, to: 18, type: 'underground' },
  { from: 18, to: 28, type: 'underground' },
  { from: 5, to: 10, type: 'underground' },
  { from: 10, to: 20, type: 'underground' },
  { from: 20, to: 25, type: 'underground' },
];

export const getAvailableMoves = (from: number, transportType: 'taxi' | 'bus' | 'underground'): number[] => {
  return connections
    .filter(conn => 
      (conn.from === from || conn.to === from) && conn.type === transportType
    )
    .map(conn => conn.from === from ? conn.to : conn.from);
};

export const getAllAvailableMoves = (from: number): { taxi: number[], bus: number[], underground: number[] } => {
  return {
    taxi: getAvailableMoves(from, 'taxi'),
    bus: getAvailableMoves(from, 'bus'),
    underground: getAvailableMoves(from, 'underground'),
  };
};