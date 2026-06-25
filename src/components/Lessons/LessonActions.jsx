"use client";

import { Heart, Bookmark, Share2, Flag } from "lucide-react";

import { Button } from "@heroui/react";

export default function LessonActions() {
  return (
    <div className="flex flex-wrap gap-3 border-t border-divider pt-5 mt-8">
      <Button size="sm" color="success" startContent={<Heart size={16} />}>
        Liked
      </Button>

      <Button
        size="sm"
        variant="bordered"
        startContent={<Bookmark size={16} />}
      >
        Save to Favorites
      </Button>

      <Button size="sm" variant="light" startContent={<Share2 size={16} />}>
        Share
      </Button>

      <Button size="sm" variant="light" startContent={<Flag size={16} />}>
        Report
      </Button>
    </div>
  );
}
