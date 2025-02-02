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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="symptoms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Symptoms</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Please describe your symptoms in detail"
                  className="min-h-[100px] resize-none"
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
              <FormLabel>Medical History</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any relevant medical history"
                  className="min-h-[100px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="allergies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Allergies (if any)</FormLabel>
              <FormControl>
                <Input placeholder="List any allergies" {...field} />
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
              <FormLabel>Current Medications (if any)</FormLabel>
              <FormControl>
                <Input placeholder="List current medications" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Book Consultation
        </Button>
      </form>
    </Form>
  );
}
