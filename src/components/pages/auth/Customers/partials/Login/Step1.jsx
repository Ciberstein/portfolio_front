import clsx from 'clsx';
import React from 'react'
import { useForm } from 'react-hook-form';
import isEmailValid from '../../../../../../utils/isEmailValid';


export const Step1 = ({ setValue, setDialog, setStep }) => {

  const { register, handleSubmit, reset } = useForm();

  const submit = async ({ email }) => {

    const errors = [
      !email && 'Email is required',
      email && !isEmailValid(email) && 'Invalid email address'
    ].filter(Boolean);

    if (errors.length) {
      errors.forEach(msg =>
        setDialog(prev => [...prev, {
          type: 'error',
          field: 'email',
          message: msg
        }])
      );
      reset();
      return;
    }

    setDialog(prev => [...prev, {
      type: 'success',
      field: 'email',
      message: email
    }]);

    setValue('email', email);

    setStep(2);
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col">
      <label htmlFor="email" className="flex flex-col sm:flex-row sm:items-center gap-1">
        <span className="text-green-600">
          [insert your email]
        </span>
        <div className="flex items-center gap-1 grow">
          <span>$</span>
          <input
            className="focus-visible:outline-none grow"
            { ...register("email")}
            id="email"
            type="text"
          />
        </div>
      </label>
    </form>
  )
}
