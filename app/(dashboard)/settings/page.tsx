'use client';

import { useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const profileFormSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

const referenceFormSchema = z.object({
  reference: z.string({
    required_error: "Please select a reference category.",
  }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type ReferenceFormValues = z.infer<typeof referenceFormSchema>;

export default function SettingsPage() {
  const { user, isLoaded } = useUser();
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingReference, setIsUpdatingReference] = useState(false);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
    },
  });

  const referenceForm = useForm<ReferenceFormValues>({
    resolver: zodResolver(referenceFormSchema),
    defaultValues: {
      reference: "",
    },
  });

  // Use useEffect to update form values when user data is loaded
  // This fixes the "Cannot update a component while rendering a different component" error
  useEffect(() => {
    if (isLoaded && user) {
      profileForm.reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        username: user.username || "",
      });
    }
  }, [isLoaded, user, profileForm]);

  const onProfileSubmit = async (data: ProfileFormValues) => {
    setIsUpdatingProfile(true);

    try {
      // Update Clerk user
      await user?.update({
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
      });

      // Update in our database
      await fetch("/api/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          username: data.username,
        }),
      });

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const onReferenceSubmit = async (data: ReferenceFormValues) => {
    setIsUpdatingReference(true);

    try {
      // Update reference in our database
      await fetch("/api/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reference: data.reference,
        }),
      });

      toast.success("Reference updated successfully");
    } catch (error) {
      console.error("Error updating reference:", error);
      toast.error("Error updating reference");
    } finally {
      setIsUpdatingReference(false);
    }
  };

  const handleAvatarChange = async () => {
    // In a real implementation, you would open a file picker
    // and upload the image to your storage service
    toast.info("Avatar change functionality would be implemented here");
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={user?.imageUrl || "/placeholder.svg"}
                    alt={user?.username || ""}
                  />
                  <AvatarFallback>
                    {user?.firstName?.charAt(0) || ""}
                    {user?.lastName?.charAt(0) || ""}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <h3 className="font-medium">{user?.fullName || "User"}</h3>
                  <p className="text-sm text-muted-foreground">
                    {user?.primaryEmailAddress?.emailAddress || ""}
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="ml-auto"
                  onClick={handleAvatarChange}
                >
                  Change Avatar
                </Button>
              </div>

              <Form {...profileForm}>
                <form
                  onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={profileForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={profileForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={isUpdatingProfile}>
                    {isUpdatingProfile ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Profile"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Reference Category</CardTitle>
              <CardDescription>
                Update your reference category to get better recommendations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...referenceForm}>
                <form
                  onSubmit={referenceForm.handleSubmit(onReferenceSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={referenceForm.control}
                    name="reference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reference Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Marketing">Marketing</SelectItem>
                            <SelectItem value="Education">Education</SelectItem>
                            <SelectItem value="Healthcare">
                              Healthcare
                            </SelectItem>
                            <SelectItem value="Legal">Legal</SelectItem>
                            <SelectItem value="Fintech">Fintech</SelectItem>
                            <SelectItem value="Sales">Sales</SelectItem>
                            <SelectItem value="Social Media">
                              Social Media
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          This helps us provide you with more relevant tool
                          recommendations.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={isUpdatingReference}>
                    {isUpdatingReference ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Reference"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Theme</CardTitle>
              <CardDescription>
                Customize the appearance of the application.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Button variant="outline">Light</Button>
                <Button variant="outline">Dark</Button>
                <Button variant="outline">System</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}