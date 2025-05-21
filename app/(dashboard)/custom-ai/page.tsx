"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  companyName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  industry: z.string().min(2, {
    message: "Industry must be at least 2 characters.",
  }),
  projectDescription: z.string().min(10, {
    message: "Project description must be at least 10 characters.",
  }),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  additionalInfo: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CustomAIPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUser();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      industry: "",
      projectDescription: "",
      budget: "",
      timeline: "",
      additionalInfo: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/custom-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          firstName: user?.firstName || "",
          lastName: user?.lastName || "",
          email: user?.primaryEmailAddress?.emailAddress || "",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit request");
      }
      toast.success("Request submitted succesfully...");

      form.reset();
    } catch (error) {
      toast.error("Error submitting request...");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 p-6">
        <div className="container max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Custom AI Solutions</h1>
              <p className="text-muted-foreground mb-6">
                Need a specialized AI solution for your business? Let us know
                what you're looking for, and our team will create a custom
                solution tailored to your needs.
              </p>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Acme Inc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Industry</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Technology, Healthcare, Finance, etc."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="projectDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the AI solution you're looking for..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Please provide as much detail as possible about your
                          requirements.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="budget"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Budget Range (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., $5,000 - $10,000"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="timeline"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Timeline (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 2-3 months" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="additionalInfo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Information (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any other details you'd like to share..."
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Request"
                    )}
                  </Button>
                </form>
              </Form>
            </div>

            <div className="hidden md:block">
              <div className="h-full flex items-center justify-center">
                <div className="space-y-6 max-w-md">
                  <Card>
                    <CardHeader>
                      <CardTitle>Why Choose Promptly AI?</CardTitle>
                      <CardDescription>
                        We specialize in creating custom AI solutions for
                        businesses of all sizes.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="font-medium">Expertise</h3>
                        <p className="text-sm text-muted-foreground">
                          Our team has extensive experience in AI development
                          across various industries.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-medium">Tailored Solutions</h3>
                        <p className="text-sm text-muted-foreground">
                          We create custom AI tools designed specifically for
                          your business needs.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-medium">Ongoing Support</h3>
                        <p className="text-sm text-muted-foreground">
                          We provide continuous support and updates for all our
                          custom solutions.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">Email:</span>{" "}
                        contact@promptly.co.in
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Phone:</span> +91
                        8004553490
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Address:</span>{" "}
                        Doomanganj, Prayagraj, Uttar Pradesh, India - 211011
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
