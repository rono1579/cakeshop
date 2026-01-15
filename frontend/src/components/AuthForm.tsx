import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle } from 'lucide-react';

interface AuthFormProps {
  mode: 'login' | 'register';
  onSubmit: (data: AuthFormData) => Promise<void>;
  loading: boolean;
  error: string | null;
  canRegisterAsAdmin?: boolean;
}

export interface AuthFormData {
  email: string;
  password: string;
  full_name?: string;
  isAdmin?: boolean;
}

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const registerSchema = loginSchema.extend({
  full_name: z.string().min(2, { message: "Full name must be at least 2 characters" }),
  isAdmin: z.boolean().optional().default(false),
});

export const AuthForm = ({ mode, onSubmit, loading, error, canRegisterAsAdmin = true }: AuthFormProps) => {
  const { toast } = useToast();

  const schema = mode === 'login' ? loginSchema : registerSchema;
  const form = useForm<AuthFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      full_name: '',
      isAdmin: false,
    },
  });

  const handleSubmit = async (data: AuthFormData) => {
    try {
      await onSubmit(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {error && (
          <div className="bg-destructive/15 text-destructive p-3 rounded-md flex items-center gap-2 text-sm">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
        
        {mode === 'register' && (
          <>
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isAdmin"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Account Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value ? 'admin' : 'customer'}
                      onValueChange={(value) => field.onChange(value === 'admin')}
                      disabled={!canRegisterAsAdmin}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="customer" id="customer" />
                        <FormLabel htmlFor="customer" className="font-normal cursor-pointer">
                          Customer
                        </FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="admin"
                          id="admin"
                          disabled={!canRegisterAsAdmin}
                        />
                        <FormLabel
                          htmlFor="admin"
                          className={`font-normal cursor-pointer ${!canRegisterAsAdmin ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          Admin
                          {!canRegisterAsAdmin && <span className="text-xs text-muted-foreground ml-2">(Not available)</span>}
                        </FormLabel>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="your@email.com" {...field} />
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
                <Input type="password" placeholder="******" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Sign Up'}
        </Button>
      </form>
    </Form>
  );
};
