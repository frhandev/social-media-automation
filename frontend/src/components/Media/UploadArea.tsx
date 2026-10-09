"use client";

import { cn } from "@/lib/utils";
import { ArrowUpRight, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "../ui/button";

function UploadArea({
  onDone,
  compact = false,
}: {
  onDone?: () => void;
  compact?: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const accept = (files: File[]) => {
    console.log("Media upload will be available after backend integration.");
    if (files.length) onDone?.();
  };
  return (
    <div
      className={cn(
        "drop-zone",
        compact && "drop-compact",
        dragging && "dragging",
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        accept(Array.from(e.dataTransfer.files));
      }}
    >
      <Upload size={compact ? 22 : 30} strokeWidth={1.4} />
      <div>
        <p className="font-display text-lg font-bold">DROP MEDIA HERE</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Images & videos · Up to 1 GB per file
        </p>
      </div>
      <Button variant="outline" onClick={() => input.current?.click()}>
        Browse files <ArrowUpRight size={14} />
      </Button>
      <input
        ref={input}
        type="file"
        accept="image/*,video/*"
        multiple
        className="sr-only"
        aria-label="Upload media files"
        onChange={(e) => {
          accept(Array.from(e.target.files || []));
          e.target.value = "";
        }}
      />
    </div>
  );
}

export default UploadArea;
