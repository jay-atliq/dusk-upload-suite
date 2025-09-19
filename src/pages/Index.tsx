import { useState, useEffect } from "react";
import { Upload as UploadIcon, Sparkles, Zap, TrendingUp } from "lucide-react";
import { FileUploader } from "@/components/FileUploader";
import { ResponseHistory } from "@/components/ResponseHistory";
import { uploadImages } from "@/services/api";
import { getStoredResponses, addResponseToStorage } from "@/utils/storage";
import { ApiResponse } from "@/types";
import { useToast } from "@/hooks/use-toast";

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
      const uploadResponse = await uploadImages(files);

      // Add to storage and update state
      const newResponse = addResponseToStorage(uploadResponse);
      setResponses((prev) => [...newResponse, ...prev]);

      toast({
        title: "Upload completed successfully!",
        description: `Processed ${files.length} image${files.length !== 1 ? "s" : ""} with advanced AI analysis.`,
      });
    } catch (error) {
      console.error("Upload failed:", error);

      toast({
        title: "Upload failed",
        description:
          error instanceof Error ? error.message : "An unexpected error occurred during processing.",
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
      {/* Enhanced Header */}
      <div className="relative border-b border-border/50 bg-gradient-to-br from-card via-card/80 to-background overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-3xl" />
        
        <div className="relative container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-8 lg:space-y-0">
            {/* Main Header Content */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
                  <UploadIcon className="w-8 h-8 text-primary-foreground" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full animate-pulse" />
              </div>
              
              <div className="space-y-2">
                <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
                  Image Analysis Hub
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl">
                  Advanced AI-powered image processing with real-time analysis, 
                  detection algorithms, and comprehensive result tracking.
                </p>
              </div>
            </div>
            
            {/* Stats/Features */}
            <div className="grid grid-cols-3 gap-6 lg:gap-8">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-accent flex items-center justify-center">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">Fast</div>
                  <div className="text-xs text-muted-foreground">Processing</div>
                </div>
              </div>
              
              <div className="text-center space-y-2">
                <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-accent flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">Smart</div>
                  <div className="text-xs text-muted-foreground">AI Analysis</div>
                </div>
              </div>
              
              <div className="text-center space-y-2">
                <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-accent flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{responses.length}</div>
                  <div className="text-xs text-muted-foreground">Results</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Upload Section */}
          <section className="space-y-6">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-bold text-foreground">
                Start Your Analysis
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Upload your images and let our advanced AI algorithms process them 
                with cutting-edge computer vision technology.
              </p>
            </div>

            <FileUploader onUpload={handleUpload} isUploading={isUploading} />
          </section>

          {/* History Section */}
          <section className="space-y-6">
            <ResponseHistory
              responses={responses}
              onClear={handleClearHistory}
            />
          </section>
        </div>
      </div>
      
      {/* Footer Gradient */}
      <div className="h-32 bg-gradient-to-t from-primary/5 to-transparent" />
    </div>
  );
};

export default Index;
