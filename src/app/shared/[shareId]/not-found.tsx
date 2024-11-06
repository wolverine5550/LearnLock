import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SharedMemoNotFound() {
  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <h2 className="text-xl font-semibold mb-2">Memo Not Found</h2>
          <p className="text-muted-foreground text-center mb-4">
            This shared memo may have expired or been removed.
          </p>
          <Button asChild>
            <Link href="/">
              Return Home
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 