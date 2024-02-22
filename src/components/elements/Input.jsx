import React from 'react';
import { Link } from 'react-router-dom';

export const Input = ({
  label = null,
  type = 'text',
  variant = 'normal',
  className = '',
  size = 'md',
  icon = null,
  element = null,
  helperLink = { url: null, text: null },
  register = {
    function: null,
    errors: { function: null, rules: {} },
  },
  ...props
}) => {
  const variants = {
    sm: 'text-sm p-1',
    md: 'text-md p-2',
    lg: 'text-lg p-3',
    xl: 'text-xl p-4',
  };

  return (
    <div className="flex flex-col w-full gap-2">
      { label || helperLink.url || helperLink.text ?
        <div className="flex gap-2 justify-between">
          { label &&
            <label
              htmlFor={props.id || null}
              className="text-sm text-gray-500"
            >
              {label || null}
            </label>        
          }
          {
            helperLink.url || helperLink.text ?
            <Link
              to={helperLink.url || null}
              className="text-sm text-blue-400 ml-auto hover:underline"
            >
              {helperLink.text || null}
            </Link>      
            : null    
          }
        </div> : null 
      }
      <div
        className={`flex gap-2 items-center border ${
          register.errors.function &&
          register.errors.function[props.name]
            ? 'border-red-400'
            : 'border-light-primary-500 dark:border-dark-primary-500'
        } ${variants[size]} ${className}`}
      >
        <label
          htmlFor={props.id || null}
          className="flex flex-grow gap-2 items-center"
        >
          {icon && icon}
          <input
            id={props.id || null}
            name={props.name || null}
            type={type}
            className={`bg-transparent w-full dark:text-dark-primary-500 placeholder:text-light-primary-500/30 dark:placeholder:text-dark-primary-500/30 focus-visible:outline-none`}
            { ...register.function &&
              {...register.function(
                props.name,
                register.errors.rules,
              )}
            }
            {...props}
          />
        </label>
        {element && element}
      </div>
      { register.errors.function &&
        register.errors.function[props.name] && (
          <label
            htmlFor={props.id || null}
            className="text-xs text-red-400"
          >
            {
              register.errors.function[props.name]
                .message
            }
          </label>
      )}
    </div>
  );
};
