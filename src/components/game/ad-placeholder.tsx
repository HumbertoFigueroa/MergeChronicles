import { Card, CardContent } from '@/components/ui/card';
import { Tv } from 'lucide-react';

export default function AdPlaceholder() {
  return (
    <Card className="h-48 flex items-center justify-center bg-muted/30 border-dashed">
      <CardContent className="p-0 text-center text-muted-foreground">
        <Tv className="h-8 w-8 mx-auto mb-2" />
        <p className="text-sm font-semibold">Advertisement</p>
      </CardContent>
    </Card>
  );
}
