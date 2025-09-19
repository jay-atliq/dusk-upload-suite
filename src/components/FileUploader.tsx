import { useState, useCallback, useRef } from 'react';
import { Upload, X, Loader2, Image, FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { UploadedFile } from '@/types';
import { cn } from '@/lib/utils';

interface FileUploaderProps {
  onUpload: (files: File[]) => Promise<void>;
  isUploading: boolean;
}

export const FileUploader = ({ onUpload, isUploading }: FileUploaderProps) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((fileList: FileList) => {
    const validFiles = Array.from(fileList).filter(file => 
      file.type.startsWith('image/')
    );

    const newFiles: UploadedFile[] = validFiles.map(file => ({
      file,
      id: crypto.randomUUID(),
      preview: URL.createObjectURL(file),
    }));

    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles(prev => {
      const updated = prev.filter(f => f.id !== id);
      // Clean up object URLs
      const removed = prev.find(f => f.id === id);
      if (removed?.preview) {
        URL.revokeObjectURL(removed.preview);
      }
      return updated;
    });
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragActive(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  const handleUpload = async () => {
    if (files.length > 0) {
      await onUpload(files.map(f => f.file));
      // Clear files after successful upload
      files.forEach(f => {
        if (f.preview) URL.revokeObjectURL(f.preview);
      });
      setFiles([]);
    }
  };

  return (
    <Card className="p-8 shadow-lg border-border/50 bg-gradient-to-br from-card to-card/50">
      <div className="space-y-8">
        {/* Drop Zone */}
        <div
          className={cn(
            "border-2 border-dashed rounded-xl p-16 transition-all duration-300 cursor-pointer",
            "bg-gradient-accent hover:bg-secondary/30 backdrop-blur-sm",
            "relative overflow-hidden group",
            dragActive 
              ? "border-primary/60 bg-primary/5 shadow-glow scale-[1.02]" 
              : "border-border/40 hover:border-primary/30 hover:shadow-md"
          )}
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-50" />
          
          <div className="flex flex-col items-center justify-center space-y-6 text-center relative z-10">
            <div className={cn(
              "w-20 h-20 rounded-full bg-gradient-primary/20 flex items-center justify-center",
              "transition-all duration-300 group-hover:scale-110 group-hover:shadow-glow",
              dragActive && "scale-125 shadow-glow-strong"
            )}>
              <Upload className={cn(
                "w-10 h-10 text-primary transition-all duration-300",
                dragActive && "scale-125 text-accent-foreground animate-bounce"
              )} />
            </div>
            
            <div className="space-y-3">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                {dragActive ? "Drop Images Here" : "Upload Your Images"}
              </h3>
              <p className="text-muted-foreground text-lg">
                Drag & drop images here, or{" "}
                <span className="text-primary font-medium">click to browse</span>
              </p>
              <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <FileImage className="w-4 h-4" />
                  <span>JPG, PNG, GIF, WEBP</span>
                </div>
                <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                <span>Multiple files supported</span>
              </div>
            </div>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Selected Files Grid */}
        {files.length > 0 && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-foreground">
                Selected Files
              </h4>
              <div className="px-3 py-1 bg-primary/20 text-primary text-sm font-medium rounded-full">
                {files.length} {files.length === 1 ? 'file' : 'files'}
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {files.map((file, index) => (
                <div 
                  key={file.id} 
                  className="relative group animate-in fade-in-0 zoom-in-95 duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Card className="aspect-square overflow-hidden bg-secondary/50 border-border/50 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-primary/30">
                    {file.preview && (
                      <img
                        src={file.preview}
                        alt={file.file.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    )}
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="absolute bottom-2 left-2 right-2">
                        <p className="text-white text-xs font-medium truncate">
                          {file.file.name}
                        </p>
                        <p className="text-white/70 text-xs">
                          {(file.file.size / 1024 / 1024).toFixed(1)} MB
                        </p>
                      </div>
                    </div>
                  </Card>
                  
                  {/* Remove Button */}
                  <Button
                    onClick={() => removeFile(file.id)}
                    size="icon"
                    variant="destructive"
                    className={cn(
                      "absolute -top-2 -right-2 w-7 h-7 rounded-full shadow-lg",
                      "opacity-0 group-hover:opacity-100 transition-all duration-200",
                      "hover:scale-110 active:scale-95"
                    )}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Button */}
        <Button
          onClick={handleUpload}
          disabled={files.length === 0 || isUploading}
          size="lg"
          className={cn(
            "w-full relative overflow-hidden",
            isUploading && "animate-pulse"
          )}
        >
          <div className="flex items-center justify-center space-x-2">
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing {files.length} {files.length === 1 ? 'image' : 'images'}...</span>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                <span>
                  Upload {files.length > 0 ? `${files.length} ` : ''}Image{files.length !== 1 ? 's' : ''}
                </span>
              </>
            )}
          </div>
          
          {/* Button shine effect */}
          {!isUploading && files.length > 0 && (
            <div className="absolute inset-0 -top-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 transition-all duration-1000 translate-x-[-100%] group-hover:translate-x-[100%]" />
          )}
        </Button>
      </div>
    </Card>
  );
};