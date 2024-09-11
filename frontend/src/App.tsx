import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

// Define the Zod schema
const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  income: z.number().min(0, 'Income must be a positive number'),
  expenses: z.number().min(0, 'Expenses must be a positive number'),
});

// Infer the TypeScript type from the schema
type FormInputs = z.infer<typeof formSchema>;

// Generate JSON schema using zod-to-json-schema
const jsonSchema = zodToJsonSchema(formSchema, { name: 'FormSchema' });

function App() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormInputs) => {
    console.log(data);
    console.log('JSON Schema:', JSON.stringify(jsonSchema, null, 2));
    // Here you would typically send the data to your backend
  };

  return (
    <div className="App">
      <h1>AI-Assisted Form Filling</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="firstName">First Name:</label>
          <input {...register('firstName')} />
          {errors.firstName && <span>{errors.firstName.message}</span>}
        </div>
        <div>
          <label htmlFor="lastName">Last Name:</label>
          <input {...register('lastName')} />
          {errors.lastName && <span>{errors.lastName.message}</span>}
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input {...register('email')} />
          {errors.email && <span>{errors.email.message}</span>}
        </div>
        <div>
          <label htmlFor="phone">Phone:</label>
          <input {...register('phone')} />
          {errors.phone && <span>{errors.phone.message}</span>}
        </div>
        <div>
          <label htmlFor="income">Annual Income:</label>
          <input type="number" {...register('income', { valueAsNumber: true })} />
          {errors.income && <span>{errors.income.message}</span>}
        </div>
        <div>
          <label htmlFor="expenses">Monthly Expenses:</label>
          <input type="number" {...register('expenses', { valueAsNumber: true })} />
          {errors.expenses && <span>{errors.expenses.message}</span>}
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
