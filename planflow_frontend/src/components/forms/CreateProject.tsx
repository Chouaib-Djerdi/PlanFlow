import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { projectSchema } from "@/lib/validations";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { priority, status } from "@/lib/constants";

export function CreateProject({ edit = false }) {
  const navigate = useNavigate();
  const { fetchWithAuth } = useApi();
  const { id } = useParams(); // Assuming we pass `projectId` via the URL
  const [isLoading, setIsLoading] = useState(false);

  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(Date.now()),
    to: addDays(new Date(Date.now()), 7),
  });

  // ...
  // 1. Define your form.
  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      start_date: date?.from ? format(date.from, "yyyy-MM-dd") : undefined,
      end_date: date?.to ? format(date.to, "yyyy-MM-dd") : undefined,
      priority: "low",
      category: "",
      status: "not_started",
    },
  });

  // Fetch project data in edit mode
  useEffect(() => {
    if (edit && id) {
      setIsLoading(true);
      fetchWithAuth(`/projects/${id}/`)
        .then((response) => {
          if (response) {
            const {
              title,
              description,
              start_date,
              end_date,
              priority,
              category,
              status,
            } = response;
            setDate({
              from: new Date(start_date),
              to: new Date(end_date),
            });
            form.reset({
              title,
              description,
              start_date,
              end_date,
              priority,
              category,
              status,
            });
          }
        })
        .catch((error) => console.error("Failed to fetch project data", error))
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof projectSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    try {
      const url = edit
        ? `/projects/${id}/` // Update project endpoint
        : "/projects/"; // Create project endpoint
      const method = edit ? "PUT" : "POST";

      const response = await fetchWithAuth(url, {
        method,
        body: values,
      });

      if (response) {
        console.log(response);
        navigate("/");
      } else {
        console.error(
          edit ? "Project update failed" : "Project creation failed"
        );
      }
    } catch (error) {
      console.error(
        edit ? "Failed to update project" : "Failed to create project",
        error
      );
    }
  }

  if (isLoading) {
    return <p>Loading...</p>; // Optionally replace with a spinner
  }
  return (
    <Form {...form}>
      <div className="space-y-8">
        <h1 className="text-4xl font-bold">
          {edit ? "Edit Project" : "Create a Project"}
        </h1>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-4"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Hmmmm..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className={cn("grid gap-2")}>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-[300px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="eg. Development" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a verified email to display" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {priority.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a verified email to display" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {status.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="col-span-2">
            {edit ? "Update Project" : "Create Project"}
          </Button>
        </form>
      </div>
    </Form>
  );
}
