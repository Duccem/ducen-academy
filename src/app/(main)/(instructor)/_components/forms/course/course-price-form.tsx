'use client'
import { Button } from "@/lib/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/lib/ui/form";
import { Input } from "@/lib/ui/input";
import { cn } from "@/lib/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2, Pencil, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface CoursePriceFormProps {
  courseId: string;
  initialData: {
    price: number;
  };
}
const formSchema = z.object({
  price: z.coerce.number().optional(),
});
const CoursePriceForm = ({ courseId, initialData }: CoursePriceFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });
  const { isSubmitting, isValid } = form.formState;
  const router = useRouter();
  const toggleEdit = () => setIsEditing((current) => !current);
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.put(`/api/course/${courseId}`, values);
      toast.success('Course updated successfully');
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error('Failed to update course title');
    }
  };
  return (
    <div className="mt-6 border rounded-md p-4">
      <div className="font-bold flex items-center justify-between">
        Course Price
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing ? (
            <>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>
      {!isEditing ? (
        <p className={cn('text-sm mt-2', !initialData.price && 'text-slate-500')}>${initialData.price || 0}</p>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input disabled={isSubmitting} placeholder="29.99" {...field} type="number" step='0.01' className="max-sm:w-full w-1/4"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex items-center gap-x-2'>
              <Button disabled={!isValid || isSubmitting} type='submit'>
                { isSubmitting ? (<Loader2 className='h-4 w-4 animate-spin'/>) : 'Save' }
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}

export default CoursePriceForm;
