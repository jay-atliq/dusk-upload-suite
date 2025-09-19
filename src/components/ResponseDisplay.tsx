/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExternalLink, Calendar, Image as ImageIcon, Eye, Database, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ApiResponse } from "@/types";
import { cn } from "@/lib/utils";
import { getUrl } from "@/utils/constants";

interface ResponseDisplayProps {
  response: ApiResponse;
  className?: string;
}

export const ResponseDisplay = ({
  response,
  className,
}: ResponseDisplayProps) => {
  const imgUrls =
    (!response.error && [
      { img: response.file_details.main_img_name, type: "Original Upload", icon: ImageIcon },
      { img: response.file_details.car_detection, type: "Car Detection", icon: Eye },
      { img: response.file_details.part_detection, type: "Part Detection", icon: Database },
    ]) ||
    [];

  const data =
    (!response.error &&
      response.rule_based_view_type.map((item, i) => ({
        view: item,
        score: response.final_scores[i],
      }))) ||
    [];

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderDetectedViews = (
    data: {
      view: any;
      score: any;
    }[]
  ) => {
    if (!data || Object.keys(data).length === 0) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="text-center space-y-2">
            <Database className="w-8 h-8 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground text-sm">No detection data available</p>
          </div>
        </div>
      );
    }

    return (
      <div className="grid gap-3">
        {data.map((each, key) => {
          return (
            <Card key={key} className="p-4 bg-secondary/30 border-border/50 hover:bg-secondary/50 transition-all duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <span className="font-medium text-foreground">
                    {each.view}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="font-mono text-xs">
                    Score: {each.score}
                  </Badge>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <Card
      className={cn(
        "p-6 space-y-6 bg-gradient-to-br from-card to-card/50 border-border/50",
        "hover:shadow-lg hover:border-primary/20 transition-all duration-300",
        "animate-in fade-in-0 slide-in-from-bottom-4",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className={cn(
            "w-3 h-3 rounded-full animate-pulse",
            !response.error ? "bg-emerald-500" : "bg-red-500"
          )} />
          <Badge
            variant={!response.error ? "default" : "destructive"}
            className={cn(
              "text-xs font-medium px-3 py-1",
              !response.error && "bg-gradient-success"
            )}
          >
            <CheckCircle2 className="w-3 h-3 mr-1" />
            {!response.error ? "Processing Complete" : "Processing Failed"}
          </Badge>
        </div>
        
        <div className="flex items-center text-xs text-muted-foreground space-x-2">
          <Calendar className="w-3 h-3" />
          <span>{formatTimestamp(response.timestamp)}</span>
        </div>
      </div>

      {/* Images Section */}
      {(imgUrls && imgUrls.length > 0 && !response.error && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <ImageIcon className="w-4 h-4 text-primary" />
            <h4 className="font-semibold text-foreground">Processing Results</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {imgUrls.map((url, index) => {
              const IconComponent = url.icon;
              return (
                <div key={index} className="group space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <IconComponent className="w-4 h-4" />
                    <span className="font-medium">{url.type}</span>
                  </div>
                  
                  <Card className="relative overflow-hidden bg-secondary/30 border-border/50 hover:shadow-md transition-all duration-300 group-hover:scale-[1.02]">
                    <div className="aspect-square">
                      <img
                        src={getUrl(url.img)}
                        alt={`${url.type} result`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg";
                        }}
                      />
                    </div>
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <Button
                        asChild
                        size="sm"
                        variant="secondary"
                        className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/20"
                      >
                        <a
                          href={getUrl(url.img)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      )) || (
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mx-auto">
              <ImageIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-1">No Images Available</h4>
              <p className="text-muted-foreground text-sm">
                Processing failed or no images were generated
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Detection Results */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Database className="w-4 h-4 text-primary" />
          <h4 className="font-semibold text-foreground">Detection Analysis</h4>
        </div>
        
        {renderDetectedViews(data)}
      </div>
    </Card>
  );
};
