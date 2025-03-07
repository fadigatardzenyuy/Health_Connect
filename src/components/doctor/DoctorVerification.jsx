import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Shield, Unlock, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const verificationCodeSchema = z.object({
  verificationCode: z.string().length(6, {
    message: "Verification code must be 6 digits",
  }),
});

const licenseCodeSchema = z.object({
  licenseCode: z.string().regex(/^[A-Z]{2}\d{6}$/, {
    message:
      "License code must be 2 uppercase letters followed by 6 digits (e.g., AB123456)",
  }),
});

export function DoctorVerification({ onVerificationSuccess }) {
  const {
    user,
    isDoctor,
    verifyDoctorCode,
    checkVerificationCode,
    resetDoctorCode,
  } = useAuth();
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isRequestingCode, setIsRequestingCode] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState("code");

  const codeForm = useForm({
    resolver: zodResolver(verificationCodeSchema),
    defaultValues: {
      verificationCode: "",
    },
  });

  const licenseForm = useForm({
    resolver: zodResolver(licenseCodeSchema),
    defaultValues: {
      licenseCode: "",
    },
  });

  const handleVerificationCodeSubmit = async (values) => {
    try {
      setIsVerifying(true);
      console.log("Submitting verification code:", values.verificationCode);

      if (!user) {
        throw new Error("You must be logged in to verify your account");
      }

      await checkVerificationCode(values.verificationCode);

      toast({
        title: "Verification Successful",
        description: "Your doctor account has been verified.",
      });

      if (onVerificationSuccess) {
        onVerificationSuccess();
      }
    } catch (error) {
      console.error("Error verifying code:", error);
      toast({
        title: "Verification Failed",
        description:
          error instanceof Error
            ? error.message
            : "Invalid verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLicenseCodeSubmit = async (values) => {
    try {
      setIsVerifying(true);
      console.log("Submitting license code:", values.licenseCode);

      if (!user) {
        throw new Error("You must be logged in to verify your account");
      }

      await verifyDoctorCode(values.licenseCode);

      toast({
        title: "Verification Successful",
        description: "Your doctor account has been verified.",
      });

      if (onVerificationSuccess) {
        onVerificationSuccess();
      }
    } catch (error) {
      console.error("Error verifying license:", error);
      toast({
        title: "Verification Failed",
        description:
          error instanceof Error
            ? error.message
            : "Invalid license number. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResetCode = async () => {
    try {
      setIsRequestingCode(true);
      if (!user) {
        throw new Error(
          "You must be logged in to reset your verification code"
        );
      }

      const code = await resetDoctorCode(user.id);
      toast({
        title: "Code Reset Successful",
        description: `Your new verification code is: ${code}`,
      });
    } catch (error) {
      console.error("Error resetting code:", error);
      toast({
        title: "Reset Failed",
        description:
          error instanceof Error
            ? error.message
            : "Unable to reset verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRequestingCode(false);
    }
  };

  if (!isDoctor) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Doctor Verification</CardTitle>
          <CardDescription>
            Only doctor accounts can access verification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            This verification process is only available for healthcare
            providers.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary" />
          Doctor Verification
        </CardTitle>
        <CardDescription>
          Verify your account to access all doctor features
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex space-x-2">
            <Button
              type="button"
              variant={verificationMethod === "code" ? "default" : "outline"}
              className="w-full"
              onClick={() => setVerificationMethod("code")}
            >
              Verification Code
            </Button>
            <Button
              type="button"
              variant={verificationMethod === "license" ? "default" : "outline"}
              className="w-full"
              onClick={() => setVerificationMethod("license")}
            >
              License Number
            </Button>
          </div>

          {verificationMethod === "code" ? (
            <Form {...codeForm}>
              <form
                onSubmit={codeForm.handleSubmit(handleVerificationCodeSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={codeForm.control}
                  name="verificationCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verification Code</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter 6-digit code"
                          maxLength={6}
                          inputMode="numeric"
                          pattern="[0-9]*"
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, "");
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter the 6-digit code provided by the system
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col space-y-2">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isVerifying || !user}
                  >
                    {isVerifying ? (
                      <span className="flex items-center gap-2">
                        <Unlock className="animate-pulse h-4 w-4" />
                        Verifying...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Unlock className="h-4 w-4" />
                        Verify Code
                      </span>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleResetCode}
                    disabled={isRequestingCode || !user}
                  >
                    {isRequestingCode ? (
                      <span className="flex items-center gap-2">
                        <RefreshCw className="animate-spin h-4 w-4" />
                        Requesting...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Request New Code
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <Form {...licenseForm}>
              <form
                onSubmit={licenseForm.handleSubmit(handleLicenseCodeSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={licenseForm.control}
                  name="licenseCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>License Number</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Example: AB123456"
                          maxLength={8}
                          className="uppercase"
                          onChange={(e) => {
                            const value = e.target.value.toUpperCase();
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter your medical license number (2 letters followed by
                        6 digits)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isVerifying || !user}
                >
                  {isVerifying ? (
                    <span className="flex items-center gap-2">
                      <Unlock className="animate-pulse h-4 w-4" />
                      Verifying...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Unlock className="h-4 w-4" />
                      Verify License
                    </span>
                  )}
                </Button>
              </form>
            </Form>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-4">
        <p className="text-xs text-muted-foreground text-center">
          {verificationMethod === "code"
            ? "If you've lost your verification code, you can request a new one."
            : "You can also verify using the code sent to you during sign up."}
        </p>
      </CardFooter>
    </Card>
  );
}
