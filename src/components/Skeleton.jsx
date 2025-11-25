import { Card, Skeleton } from "@heroui/react";

export default function SkeletonCard() {
  return (
    <Card className="w-[200px] space-y-5 p-4" radius="lg">
      <Skeleton className="rounded-lg">
        <div className="h-24 rounded-lg bg-default-300" />
      </Skeleton>
    </Card>
  );
}
