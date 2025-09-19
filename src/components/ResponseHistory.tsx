import { Trash2, History, Database, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ResponseDisplay } from './ResponseDisplay';
import { ApiResponse } from '@/types';
import { clearStoredResponses } from '@/utils/storage';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ResponseHistoryProps {
  responses: ApiResponse[];
  onClear: () => void;
}

export const ResponseHistory = ({ responses, onClear }: ResponseHistoryProps) => {
  const { toast } = useToast();

  const handleClear = () => {
    try {
      clearStoredResponses();
      onClear();
      toast({
        title: "History cleared successfully",
        description: "All upload history has been removed from storage.",
      });
    } catch (error) {
      toast({
        title: "Error clearing history",
        description: "Failed to clear history. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (responses.length === 0) {
    return (
      <Card className="relative overflow-hidden bg-gradient-to-br from-card to-card/50 border-border/50">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-30" />
        
        <div className="relative p-12 text-center">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-accent flex items-center justify-center shadow-lg">
                <Database className="w-10 h-10 text-primary" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary/20 rounded-full animate-pulse" />
            </div>
            
            <div className="space-y-3">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                No Upload History Yet
              </h3>
              <p className="text-muted-foreground text-lg max-w-md">
                Upload some images to start building your processing history. 
                All results will appear here for easy access.
              </p>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span>Waiting for your first upload...</span>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Card */}
      <Card className="p-6 bg-gradient-to-r from-card to-card/50 border-border/50 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-primary/20 flex items-center justify-center shadow-md">
                <History className="w-6 h-6 text-primary" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-primary-foreground">
                  {responses.length > 99 ? '99+' : responses.length}
                </span>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Upload History
              </h2>
              <p className="text-muted-foreground">
                {responses.length} processing result{responses.length !== 1 ? 's' : ''} stored locally
              </p>
            </div>
          </div>
          
          <Button
            onClick={handleClear}
            variant="outline"
            size="sm"
            className={cn(
              "group border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground",
              "transition-all duration-300 hover:shadow-md hover:scale-105"
            )}
          >
            <RotateCcw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-300" />
            Clear All History
          </Button>
        </div>
      </Card>

      {/* Floating Clear Button for Mobile */}
      <div className="fixed bottom-6 right-6 z-50 sm:hidden">
        <Button
          onClick={handleClear}
          size="icon"
          variant="destructive"
          className="w-14 h-14 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110"
        >
          <Trash2 className="w-6 h-6" />
        </Button>
      </div>

      {/* Results Grid */}
      <div className="space-y-6">
        {responses.map((response, index) => (
          <div
            key={response.id}
            className="animate-in fade-in-0 slide-in-from-bottom-4"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <ResponseDisplay response={response} />
          </div>
        ))}
      </div>
      
      {/* Bottom Spacer for Mobile FAB */}
      <div className="h-20 sm:hidden" />
    </div>
  );
};