import { ExternalLink, Calendar, Image as ImageIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ApiResponse } from '@/types';
import { cn } from '@/lib/utils';

interface ResponseDisplayProps {
  response: ApiResponse;
  className?: string;
}

export const ResponseDisplay = ({ response, className }: ResponseDisplayProps) => {
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const renderJsonData = (data: Record<string, any>) => {
    if (!data || Object.keys(data).length === 0) {
      return (
        <p className="text-muted-foreground italic text-sm">No additional data</p>
      );
    }

    return (
      <div className="space-y-2">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex flex-col sm:flex-row sm:justify-between gap-1">
            <span className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              {key.replace(/[_-]/g, ' ')}:
            </span>
            <span className="font-mono text-sm bg-secondary px-2 py-1 rounded truncate max-w-xs">
              {typeof value === 'object' ? JSON.stringify(value) : String(value)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className={cn("p-6 space-y-4 transition-all duration-300 hover:shadow-md", className)}>
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
          <Badge variant={response.success ? "default" : "destructive"} className="text-xs">
            {response.success ? "Success" : "Failed"}
          </Badge>
          <div className="flex items-center text-xs text-muted-foreground space-x-1">
            <Calendar className="w-3 h-3" />
            <span>{formatTimestamp(response.timestamp)}</span>
          </div>
        </div>
      </div>

      {response.imageUrls && response.imageUrls.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <ImageIcon className="w-4 h-4 text-primary" />
            <h4 className="font-medium text-sm">Returned Images ({response.imageUrls.length})</h4>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {response.imageUrls.map((url, index) => (
              <div key={index} className="group relative">
                <div className="aspect-square rounded-lg overflow-hidden bg-secondary border">
                  <img
                    src={url}
                    alt={`Response image ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                </div>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "absolute inset-0 bg-black/50 flex items-center justify-center",
                    "opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"
                  )}
                >
                  <ExternalLink className="w-5 h-5 text-white" />
                </a>
              </div>
            ))}
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Image URLs:</p>
            {response.imageUrls.map((url, index) => (
              <a
                key={index}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xs font-mono bg-secondary px-2 py-1 rounded hover:bg-secondary/80 transition-colors truncate"
              >
                {url}
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h4 className="font-medium text-sm flex items-center space-x-2">
          <span>Response Data</span>
        </h4>
        {renderJsonData(response.data)}
      </div>
    </Card>
  );
};