import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

type FormInputs = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  income: number;
  expenses: number;
};

function App() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    console.log(data);
    // Here you would typically send the data to your backend
  };

  return (
    <div className="App">
      <h1>AI-Assisted Form Filling</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="firstName">First Name:</label>
          <input {...register('firstName', { required: 'First name is required' })} />
          {errors.firstName && <span>{errors.firstName.message}</span>}
        </div>
        <div>
          <label htmlFor="lastName">Last Name:</label>
          <input {...register('lastName', { required: 'Last name is required' })} />
          {errors.lastName && <span>{errors.lastName.message}</span>}
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })} />
          {errors.email && <span>{errors.email.message}</span>}
        </div>
        <div>
          <label htmlFor="phone">Phone:</label>
          <input {...register('phone', { required: 'Phone number is required' })} />
          {errors.phone && <span>{errors.phone.message}</span>}
        </div>
        <div>
          <label htmlFor="income">Annual Income:</label>
          <input type="number" {...register('income', { required: 'Income is required' })} />
          {errors.income && <span>{errors.income.message}</span>}
        </div>
        <div>
          <label htmlFor="expenses">Monthly Expenses:</label>
          <input type="number" {...register('expenses', { required: 'Expenses are required' })} />
          {errors.expenses && <span>{errors.expenses.message}</span>}
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
