import { stations, connections, Station } from "@/lib/gameMap";

interface GameMapProps {
  playerPositions: { [playerId: string]: { position: number; role: 'mr_x' | 'detective' } };
  currentPosition?: number;
  availableMoves?: number[];
  onStationClick?: (stationId: number) => void;
  showMrX?: boolean;
}

export const GameMap = ({ 
  playerPositions, 
  currentPosition, 
  availableMoves = [], 
  onStationClick,
  showMrX = false 
}: GameMapProps) => {
  const getConnectionColor = (type: string) => {
    switch (type) {
      case 'taxi': return 'hsl(var(--taxi))';
      case 'bus': return 'hsl(var(--bus))';
      case 'underground': return 'hsl(var(--underground))';
      default: return 'hsl(var(--muted))';
    }
  };

  const isStationOccupied = (stationId: number, role: 'mr_x' | 'detective') => {
    return Object.values(playerPositions).some(
      p => p.position === stationId && p.role === role
    );
  };

  return (
    <svg
      viewBox="0 0 600 1000"
      className="w-full h-full border border-border rounded-lg bg-card/30 backdrop-blur"
    >
      {/* Draw connections */}
      {connections.map((conn, idx) => {
        const fromStation = stations.find(s => s.id === conn.from);
        const toStation = stations.find(s => s.id === conn.to);
        if (!fromStation || !toStation) return null;

        return (
          <line
            key={idx}
            x1={fromStation.x}
            y1={fromStation.y}
            x2={toStation.x}
            y2={toStation.y}
            stroke={getConnectionColor(conn.type)}
            strokeWidth="2"
            opacity="0.3"
          />
        );
      })}

      {/* Draw stations */}
      {stations.map((station) => {
        const isAvailable = availableMoves.includes(station.id);
        const isCurrent = currentPosition === station.id;
        const hasMrX = isStationOccupied(station.id, 'mr_x');
        const hasDetective = isStationOccupied(station.id, 'detective');

        return (
          <g key={station.id}>
            <circle
              cx={station.x}
              cy={station.y}
              r={isCurrent ? 14 : isAvailable ? 12 : 8}
              fill={
                isCurrent
                  ? 'hsl(var(--primary))'
                  : isAvailable
                  ? 'hsl(var(--secondary))'
                  : 'hsl(var(--muted))'
              }
              stroke={isCurrent ? 'hsl(var(--primary))' : 'hsl(var(--border))'}
              strokeWidth={isCurrent ? 3 : 1}
              className={isAvailable ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}
              onClick={() => isAvailable && onStationClick?.(station.id)}
              style={{
                filter: isCurrent ? 'drop-shadow(0 0 8px hsl(var(--primary)))' : 'none'
              }}
            />
            
            {/* Show Mr. X if revealed or if showMrX is true */}
            {hasMrX && showMrX && (
              <text
                x={station.x}
                y={station.y + 5}
                textAnchor="middle"
                fill="hsl(var(--accent-foreground))"
                fontSize="14"
                fontWeight="bold"
              >
                X
              </text>
            )}
            
            {/* Show detective */}
            {hasDetective && (
              <circle
                cx={station.x}
                cy={station.y}
                r={6}
                fill="hsl(var(--detective))"
                stroke="hsl(var(--foreground))"
                strokeWidth="2"
              />
            )}
            
            {/* Station label on hover */}
            <title>{station.name}</title>
          </g>
        );
      })}
    </svg>
  );
};