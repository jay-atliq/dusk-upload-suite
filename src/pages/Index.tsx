import { useState, useEffect } from 'react';
import { Upload as UploadIcon, Sparkles } from 'lucide-react';
import { FileUploader } from '@/components/FileUploader';
import { ResponseHistory } from '@/components/ResponseHistory';
import { uploadImages } from '@/services/api';
import { getStoredResponses, addResponseToStorage } from '@/utils/storage';
import { ApiResponse, UploadResponse } from '@/types';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [responses, setResponses] = useState<ApiResponse[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load stored responses on component mount
    const storedResponses = getStoredResponses();
    setResponses(storedResponses);
  }, []);

  const handleUpload = async (files: File[]) => {
    setIsUploading(true);
    
    try {
      // Upload files to API
      const uploadResponse: UploadResponse = await uploadImages(files);
      
      // Process the response and store it
      const processedResponse = {
        imageUrls: uploadResponse.imageUrls || [],
        data: { ...uploadResponse },
        success: true,
      };

      // Remove imageUrls from data to avoid duplication
      delete processedResponse.data.imageUrls;

      // Add to storage and update state
      const storedResponse = addResponseToStorage(processedResponse);
      setResponses(prev => [storedResponse, ...prev]);

      toast({
        title: "Upload successful!",
        description: `Successfully uploaded ${files.length} image${files.length !== 1 ? 's' : ''}.`,
      });

    } catch (error) {
      console.error('Upload failed:', error);
      
      // Store failed response
      const failedResponse = {
        imageUrls: [],
        data: { 
          error: error instanceof Error ? error.message : 'Unknown error occurred',
          files: files.map(f => ({ name: f.name, size: f.size, type: f.type }))
        },
        success: false,
      };

      const storedResponse = addResponseToStorage(failedResponse);
      setResponses(prev => [storedResponse, ...prev]);

      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleClearHistory = () => {
    setResponses([]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-gradient-secondary">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <UploadIcon className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Image Upload Hub
              </h1>
              <p className="text-muted-foreground mt-1">
                Upload, process, and manage your images with ease
              </p>
            </div>
            <div className="ml-auto hidden sm:flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">
                Powered by modern APIs
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Upload Section */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">Upload Images</h2>
              <p className="text-muted-foreground">
                Select or drag & drop your images to upload them to the server.
              </p>
            </div>
            
            <FileUploader 
              onUpload={handleUpload}
              isUploading={isUploading}
            />
          </section>

          {/* History Section */}
          <section>
            <ResponseHistory 
              responses={responses}
              onClear={handleClearHistory}
            />
          </section>

        </div>
      </div>
    </div>
  );
};

export default Index;