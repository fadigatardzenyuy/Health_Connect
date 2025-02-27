import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.1";
import { Resend } from "npm:resend@2.0.0";

// Initialize Supabase client with admin privileges
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Resend client for email sending
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// CORS headers
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req) => {
    // Handle CORS preflight requests
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        console.log("Received request to send verification email");

        const { doctorId, email, licenseNumber, verificationCode } = await req.json();

        if (!doctorId || !email || !verificationCode) {
            throw new Error("Missing required fields");
        }

        console.log(`Sending verification email to ${email} with code ${verificationCode}`);

        // Send email with verification code
        const emailResponse = await resend.emails.send({
            from: "Health Connect <verification@healthconnect.app>",
            to: [email],
            subject: "Doctor Verification Code - Health Connect",
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h1 style="color: #3b82f6; text-align: center;">Health Connect</h1>
          <h2 style="text-align: center;">Doctor Verification</h2>
          <p>Thank you for registering as a healthcare provider with Health Connect.</p>
          <p>To verify your doctor account, please use the following verification code:</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px;">${verificationCode}</span>
          </div>
          <p>This code will expire in 1 hour.</p>
          <p>If you did not request this verification code, please ignore this email.</p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #666; font-size: 12px;">
            <p>Health Connect - Connecting Patients with Quality Healthcare</p>
          </div>
        </div>
      `,
        });

        if (emailResponse.error) {
            throw new Error(`Failed to send email: ${emailResponse.error}`);
        }

        console.log("Email sent successfully:", emailResponse);

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                ...corsHeaders,
            },
        });
    } catch (error) {
        console.error("Error in send-verification-email function:", error);
        return new Response(
            JSON.stringify({
                error: error.message || "An error occurred while sending the verification email"
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json", ...corsHeaders },
            }
        );
    }
};

serve(handler);