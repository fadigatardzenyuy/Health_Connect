import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        info: "border-primary/20 bg-primary/5 text-primary [&>svg]:text-primary",
        warning:
          "border-yellow-500/50 bg-yellow-50 text-yellow-800 [&>svg]:text-yellow-500",
        success:
          "border-green-500/50 bg-green-50 text-green-800 [&>svg]:text-green-500",
        emergency:
          "border-red-500/50 bg-red-50 text-red-800 [&>svg]:text-red-500",
        appointment:
          "border-indigo-500/50 bg-indigo-50 text-indigo-800 [&>svg]:text-indigo-500",
        healthcare:
          "border-teal-500/50 bg-teal-50 text-teal-800 [&>svg]:text-teal-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Alert = React.forwardRef(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
