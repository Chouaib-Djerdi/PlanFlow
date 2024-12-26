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
import { FormValues } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "../ui/toast";

export function CreateProject({ edit = false }) {
  const navigate = useNavigate();
  const { fetchWithAuth } = useApi();
  const { id } = useParams(); // Assuming we pass `projectId` via the URL
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<{ image1?: string; image2?: string }>(
    {}
  );
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(Date.now()),
    to: addDays(new Date(Date.now()), 7),
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

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
              image1,
              image2,
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

            setImages({ image1, image2 });
          }
        })
        .catch((error) => {
          console.error("Failed to fetch project data", error);
        })
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  async function generateDescription(title: string) {
    if (!title) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "You must provide a title to generate a description.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetchWithAuth("/projects/generate-description/", {
        method: "POST",
        body: { title: title },
      });

      if (response && response.description) {
        form.setValue("description", response.description);
      } else {
        console.error("Failed to generate description:", response);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "Could not generate a description for the provided title.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
    } catch (error) {
      console.error("Error calling API:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Failed to generate description.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    } finally {
      setIsGenerating(false);
    }
  }

  // 2. Define a submit handler.
  async function onSubmit(values: FormValues) {
    const url = edit ? `/projects/${id}/` : "/projects/";
    const method = edit ? "PUT" : "POST";

    try {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (values[key as keyof FormValues]) {
          formData.append(
            key,
            values[key as keyof FormValues] as string | Blob
          );
        }
      });

      // Append images
      const image1 = (
        document.querySelector('input[name="image1"]') as HTMLInputElement
      ).files?.[0];
      const image2 = (
        document.querySelector('input[name="image2"]') as HTMLInputElement
      ).files?.[0];
      if (image1) formData.append("image1", image1);
      if (image2) formData.append("image2", image2);

      const response = await fetchWithAuth(url, {
        method,
        body: formData,
      });

      if (response) {
        toast({
          title: "Success!",
          description: `Project ${edit ? "updated" : "created"} successfully.`,
        });
        if (!edit) {
          navigate("/");
        } else {
          navigate(`/projects/${id}`);
        }
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
          className="grid sm:grid-cols-2 grid-cols-1 gap-4"
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
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Hmmmm..."
                      {...field}
                      disabled={isGenerating}
                    />
                    <Button
                      type="button"
                      onClick={() =>
                        generateDescription(form.getValues("title"))
                      }
                      disabled={isGenerating}
                    >
                      {isGenerating ? "Generating..." : "Generate"}
                    </Button>
                  </div>
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
                    "w-[300px] justify-start text-left font-normal sm:col-span-1 col-span-2",
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
                  onSelect={(selectedDate) => {
                    setDate(selectedDate);
                    if (selectedDate?.from) {
                      form.setValue(
                        "start_date",
                        format(selectedDate.from, "yyyy-MM-dd")
                      );
                    }
                    if (selectedDate?.to) {
                      form.setValue(
                        "end_date",
                        format(selectedDate.to, "yyyy-MM-dd")
                      );
                    }
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem className="sm:col-span-1 col-span-2">
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
              <FormItem className="sm:col-span-1 col-span-2">
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
              <FormItem className="sm:col-span-1 col-span-2">
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
          <FormField
            control={form.control}
            name="image1"
            render={({ field }) => (
              <FormItem className="sm:col-span-1 col-span-2">
                <FormLabel>Image 1</FormLabel>
                {images.image1 && (
                  <img
                    src={images.image1}
                    alt="Current Image 1"
                    className="w-20 h-20 object-cover"
                  />
                )}
                <FormControl>
                  <Input type="file" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image2"
            render={({ field }) => (
              <FormItem className="sm:col-span-1 col-span-2">
                <FormLabel>Image 2</FormLabel>
                {images.image2 && (
                  <img
                    src={images.image2}
                    alt="Current Image 1"
                    className="w-20 h-20 object-cover"
                  />
                )}
                <FormControl>
                  <Input type="file" {...field} />
                </FormControl>
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
