/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExternalLink, Calendar, Image as ImageIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
      { img: response.file_details.main_img_name, type: "Uploaded" },
      { img: response.file_details.car_detection, type: "Car Detection" },
      { img: response.file_details.part_detection, type: "Part detection" },
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
    return new Date(timestamp).toLocaleString();
  };

  const renderDetectedViews = (
    data: {
      view: any;
      score: any;
    }[]
  ) => {
    if (!data || Object.keys(data).length === 0) {
      return (
        <p className="text-muted-foreground italic text-sm">
          No additional data
        </p>
      );
    }

    return (
      <div className="space-y-2">
        {data.map((each, key) => {
          return (
            <>
              <div
                key={key}
                className="flex flex-col sm:flex-row 
                sm:justify-between
                gap-1"
              >
                <span className="font-medium text-muted-foreground bg-secondary px-2 py-1 rounded tracking-wide">
                  {each.view}
                </span>

                <span className="font-mono text-sm bg-secondary px-2 py-1 rounded truncate max-w-xs">
                  {each.score}
                </span>
              </div>
            </>
          );
        })}
      </div>
    );
  };

  return (
    <Card
      className={cn(
        "p-6 space-y-4 transition-all duration-300 hover:shadow-md",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
          <Badge
            variant={!response.error ? "default" : "destructive"}
            className="text-xs"
          >
            {!response.error ? "Success" : "Failed"}
          </Badge>
          <div className="flex items-center text-xs text-muted-foreground space-x-1">
            <Calendar className="w-3 h-3" />
            <span>{formatTimestamp(response.timestamp)}</span>
          </div>
        </div>
      </div>

      {(imgUrls && imgUrls.length > 0 && !response.error && (
        <>
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {imgUrls.map((url, index) => (
                <div key={index} className="group relative">
                  <span>{url.type}</span>
                  <div className="aspect-square rounded-lg overflow-hidden bg-secondary border">
                    <img
                      src={getUrl(url.img)}
                      alt={`Response image ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                  </div>
                  <a
                    href={getUrl(url.img)}
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
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-sm flex items-center space-x-2">
              <span>Detected Views</span>
            </h4>

            {renderDetectedViews(data)}
          </div>
        </>
      )) || (
        <p className="text-muted-foreground italic text-sm">
          No Detected Views
        </p>
      )}
    </Card>
  );
};
