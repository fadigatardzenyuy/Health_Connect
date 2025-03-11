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
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Stethoscope,
  Activity,
  Pill,
  AlertTriangle,
  HeartPulse,
  Cigarette,
  Wine,
  Scale,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { z } from "zod";

const formSchema = z.object({
  symptoms: z.string().min(10, "Please describe your symptoms in more detail"),
  medicalHistory: z
    .string()
    .min(10, "Please provide more details about your medical history"),
  allergies: z.string().optional(),
  currentMedications: z.string().optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
  bloodPressure: z.string().optional(),
  smoker: z.enum(["yes", "no", "former"]).optional(),
  alcoholConsumption: z
    .enum(["none", "occasional", "moderate", "heavy"])
    .optional(),
  chronicConditions: z.array(z.string()).optional(),
  visitReason: z.string().min(5, "Please provide a reason for your visit"),
  preferredLanguage: z.string().optional(),
  emergencyContact: z.string().optional(),
  previousTreatments: z.string().optional(),
});

export function ConsultationForm({ onSubmit }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symptoms: "",
      medicalHistory: "",
      allergies: "",
      currentMedications: "",
      height: "",
      weight: "",
      bloodPressure: "",
      smoker: undefined,
      alcoholConsumption: undefined,
      chronicConditions: [],
      visitReason: "",
      preferredLanguage: "",
      emergencyContact: "",
      previousTreatments: "",
    },
  });

  const chronicConditionOptions = [
    { id: "diabetes", label: "Diabetes" },
    { id: "hypertension", label: "Hypertension" },
    { id: "asthma", label: "Asthma" },
    { id: "heart-disease", label: "Heart Disease" },
    { id: "arthritis", label: "Arthritis" },
    { id: "cancer", label: "Cancer History" },
  ];

  return (
    <Card className="border-t-4 border-t-primary shadow-sm">
      <CardHeader className="bg-primary/5 pb-2">
        <CardTitle className="text-lg text-primary flex items-center gap-2">
          <Stethoscope className="h-5 w-5" />
          Consultation Information
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <Tabs defaultValue="required" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="required">Required Information</TabsTrigger>
                <TabsTrigger value="additional">Additional Details</TabsTrigger>
              </TabsList>

              <TabsContent value="required" className="space-y-5 pt-4">
                <FormField
                  control={form.control}
                  name="visitReason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 font-medium">
                        <Stethoscope className="h-4 w-4 text-primary" />
                        Primary Reason for Visit
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Annual check-up, Follow-up, Specific concern"
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
                  name="symptoms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 font-medium">
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
                      <FormLabel className="flex items-center gap-2 font-medium">
                        <Activity className="h-4 w-4 text-primary" />
                        Brief Medical History
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
                        <FormLabel className="flex items-center gap-2 font-medium">
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
                        <FormLabel className="flex items-center gap-2 font-medium">
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
              </TabsContent>

              <TabsContent value="additional" className="space-y-5 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 font-medium">
                          <Scale className="h-4 w-4 text-primary" />
                          Height
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., 5ft10in or 178cm"
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
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 font-medium">
                          <Scale className="h-4 w-4 text-primary" />
                          Weight
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., 165lbs or 75kg"
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
                    name="bloodPressure"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 font-medium">
                          <HeartPulse className="h-4 w-4 text-red-500" />
                          Blood Pressure
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., 120/80"
                            className="focus:border-primary"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="smoker"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="flex items-center gap-2 font-medium">
                          <Cigarette className="h-4 w-4 text-gray-600" />
                          Smoking Status
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="no" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Non-smoker
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="yes" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Current smoker
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="former" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Former smoker
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="alcoholConsumption"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="flex items-center gap-2 font-medium">
                          <Wine className="h-4 w-4 text-purple-600" />
                          Alcohol Consumption
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="none" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                None
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="occasional" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Occasional
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="moderate" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Moderate
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="heavy" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Heavy
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="chronicConditions"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="flex items-center gap-2 font-medium">
                          <HeartPulse className="h-4 w-4 text-red-500" />
                          Chronic Conditions
                        </FormLabel>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {chronicConditionOptions.map((option) => (
                          <FormField
                            key={option.id}
                            control={form.control}
                            name="chronicConditions"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={option.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(option.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...(field.value || []),
                                              option.id,
                                            ])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== option.id
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {option.label}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="previousTreatments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 font-medium">
                        <Pill className="h-4 w-4 text-blue-500" />
                        Previous Treatments/Procedures
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="List any previous treatments or procedures relevant to your current visit"
                          className="min-h-[80px] resize-none focus:border-primary"
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
                    name="preferredLanguage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 font-medium">
                          Preferred Language
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., English"
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
                    name="emergencyContact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 font-medium">
                          Emergency Contact
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Name and phone number"
                            className="focus:border-primary"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="pt-4">
              <Button
                id="consultation-form-submit"
                type="submit"
                className="w-full gap-2"
              >
                <Stethoscope className="w-4 h-4" />
                Proceed to Book Appointment
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
