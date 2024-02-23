import { Fragment, useRef } from 'react';
import {
  Dialog,
  Transition,
} from '@headlessui/react';
import { CancelIcon } from '../../../public/icons/Svg';
import { useSelector } from 'react-redux';

export default function Modal({
  children,
  open = false,
  setOpen,
  title = null,
  className = '',
  confirmButton = null
}) {
  const cancelButtonRef = useRef(null);

  const darkMode = useSelector(state => state.darkMode)

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto font-mono">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className={`relative transform border border-light-primary-500 dark:border-dark-primary-500 dark:text-dark-primary-500 bg-light-secondary-700 dark:bg-dark-primary-700 text-left shadow-xl transition-all sm:m-8 sm:w-full sm:max-w-lg`}>
                <header className="flex justify-between items-center gap-4 p-4">
                  <span className="font-semibold text-sm flex-grow">
                    {title}
                  </span>
                  <button
                    className="hover:rotate-180 transition-all duration-200"
                    onClick={() => setOpen(false)}
                  >
                    <CancelIcon color={darkMode ? "#00ffff" : "#292929"}/>
                  </button>
                </header>
                <div className={`p-4 ${className}`} >
                  {children}
                </div>
                { confirmButton && <div className="p-4">{confirmButton}</div> }
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
