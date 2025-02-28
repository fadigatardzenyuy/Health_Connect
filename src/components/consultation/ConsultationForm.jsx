import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stethoscope, Activity, Pill, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  symptoms: z.string().min(10, "Please describe your symptoms in more detail"),
  medicalHistory: z
    .string()
    .min(10, "Please provide more details about your medical history"),
  allergies: z.string().optional(),
  currentMedications: z.string().optional(),
});

export function ConsultationForm({ onSubmit }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symptoms: "",
      medicalHistory: "",
      allergies: "",
      currentMedications: "",
    },
  });

  return (
    <Card className="border-t-4 border-t-primary shadow-sm">
      <CardHeader className="bg-primary/5 pb-2">
        <CardTitle className="text-lg text-primary flex items-center gap-2">
          <Stethoscope className="h-5 w-5" />
          Medical Information
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="symptoms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" />
                    Current Symptoms
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please describe your symptoms in detail (e.g., headache, fever, when they started)"
                      className="min-h-[100px] resize-none focus:border-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="medicalHistory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" />
                    Medical History
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please share any relevant medical history (e.g., chronic conditions, previous surgeries)"
                      className="min-h-[100px] resize-none focus:border-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="allergies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      Allergies (if any)
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="List any allergies"
                        className="focus:border-primary"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currentMedications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Pill className="h-4 w-4 text-blue-500" />
                      Current Medications
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="List current medications"
                        className="focus:border-primary"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full gap-2">
                <Stethoscope className="w-4 h-4" />
                Book Consultation
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
