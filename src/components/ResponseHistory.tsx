import { Trash2, History, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ResponseDisplay } from './ResponseDisplay';
import { ApiResponse } from '@/types';
import { clearStoredResponses } from '@/utils/storage';
import { useToast } from '@/hooks/use-toast';

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
        title: "History cleared",
        description: "All upload history has been removed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear history. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (responses.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
            <Database className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">No Upload History</h3>
            <p className="text-muted-foreground">
              Upload some images to see your response history here.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <History className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Upload History</h2>
              <p className="text-sm text-muted-foreground">
                {responses.length} response{responses.length !== 1 ? 's' : ''} stored
              </p>
            </div>
          </div>
          
          <Button
            onClick={handleClear}
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear History
          </Button>
        </div>
      </Card>

      <div className="space-y-4">
        {responses.map((response) => (
          <ResponseDisplay 
            key={response.id} 
            response={response} 
          />
        ))}
      </div>
    </div>
  );
};