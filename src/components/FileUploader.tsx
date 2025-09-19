import { useState, useCallback, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
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
    <Card className="p-8">
      <div className="space-y-6">
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-12 transition-all duration-300 cursor-pointer",
            "bg-gradient-accent hover:bg-secondary/50",
            dragActive ? "border-primary bg-primary/10" : "border-border",
            "group relative overflow-hidden"
          )}
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className={cn(
              "w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center transition-all duration-300",
              "group-hover:bg-primary/30 group-hover:scale-110"
            )}>
              <Upload className={cn(
                "w-8 h-8 text-primary transition-all duration-300",
                dragActive && "scale-125 text-accent-foreground"
              )} />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {dragActive ? "Drop images here" : "Upload Images"}
              </h3>
              <p className="text-muted-foreground">
                Drag & drop images here, or click to select files
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Supports: JPG, PNG, GIF, WEBP
              </p>
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

        {files.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">
              Selected Files ({files.length})
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {files.map((file) => (
                <div key={file.id} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-secondary border">
                    {file.preview && (
                      <img
                        src={file.preview}
                        alt={file.file.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <button
                    onClick={() => removeFile(file.id)}
                    className={cn(
                      "absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground",
                      "flex items-center justify-center shadow-md transition-all duration-200",
                      "opacity-0 group-hover:opacity-100 hover:scale-110"
                    )}
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <div className="mt-2 text-xs text-muted-foreground truncate">
                    {file.file.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={files.length === 0 || isUploading}
          size="lg"
          className="w-full bg-gradient-primary hover:opacity-90 transition-all duration-300 disabled:opacity-50"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5 mr-2" />
              Upload {files.length > 0 ? `${files.length} ` : ''}Image{files.length !== 1 ? 's' : ''}
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};