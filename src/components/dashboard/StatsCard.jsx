import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatsCard({ title, value, icon: Icon, className }) {
  return (
    <Card className={cn("transition-all hover:shadow-md", className)}>
      <CardContent className="flex items-center p-6">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mr-4">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );
}
