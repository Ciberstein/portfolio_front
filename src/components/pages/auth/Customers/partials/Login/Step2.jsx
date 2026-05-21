import React from 'react'
import { useForm } from 'react-hook-form';
import api from '../../../../../../api/axios';
import { API_ROUTES } from '../../../../../../api/routes';

export const Step2 = ({ setDialog, setStep, setData, watch }) => {

  const { register, handleSubmit, reset } = useForm();


  const submit = async (password) => {

    const email = watch('email');

    const url = `${API_ROUTES.AUTH}/login`;

    await api.post(url, { email, password })
      .then(res => { 
        setData(res.data);
        setStep(3);
      })
      .catch(err => {
        setStep(1);
        setDialog(prev => [...prev, {
          type: 'error',
          field: 'server',
          message: err.response?.data?.message || 'An error occurred'
        }]);
        reset();
      });
  };

  const validation = async ({ password }) => {

    const errors = [
      !password && 'Password is required',
      password && password.length < 8 && 'Password must be at least 8 characters long'
    ].filter(Boolean);

    if (errors.length) {
      errors.forEach(msg =>
        setDialog(prev => [...prev, {
          type: 'error',
          field: 'password',
          message: msg
        }])
      );
      reset();
      return;
    }

    setDialog(prev => [...prev, {
      type: 'success',
      field: 'password',
      message: '********'
    }]);

    await submit(password);
  }


  return (
    <form onSubmit={handleSubmit(validation)} className="flex flex-col">
      <label htmlFor="password" className="flex flex-col sm:flex-row sm:items-center gap-1">
        <span className="text-green-600">
          [insert your password]
        </span>
        <div className="flex items-center gap-1 grow">
          <span>$</span>
          <input
            className="focus-visible:outline-none grow"
            { ...register("password")}
            id="password"
            type="password"
          />
        </div>
      </label>
    </form>
  )
}
