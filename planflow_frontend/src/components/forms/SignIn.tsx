import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signInSchema } from "@/lib/validations";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export function SignIn() {
  const navigate = useNavigate();
  const { login } = useAuth();
  // ...
  // 1. Define your form.
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof signInSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    try {
      const response = await fetch("http://localhost:8000/api/auth/login/", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        login(data.key); // Log in the user with the returned token
        navigate("/"); // Redirect to the home page
      } else {
        console.error("User Login failed");
      }
    } catch (error) {
      console.error("API call failed", error);
    }
  }
  return (
    <Form {...form}>
      <div className="space-y-8">
        <h1 className="text-4xl font-bold">Log in PlanFlow</h1>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="johndoe@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Log In
          </Button>
          <p>
            Don't have an account ?{" "}
            <Link to="/sign-up" className="underline font-semibold">
              Register
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
}
