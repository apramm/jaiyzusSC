'use client';

import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  icon?: React.ReactNode;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger',
  icon
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const typeStyles = {
    danger: {
      iconBg: 'bg-red-50 dark:bg-red-950/30',
      iconColor: 'text-red-400 dark:text-red-400',
      confirmBtn: 'bg-red-500 hover:bg-red-600 focus:ring-red-400',
      border: 'border-red-100 dark:border-red-900/50'
    },
    warning: {
      iconBg: 'bg-yellow-50 dark:bg-yellow-950/30',
      iconColor: 'text-yellow-400 dark:text-yellow-400',
      confirmBtn: 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-400',
      border: 'border-yellow-100 dark:border-yellow-900/50'
    },
    info: {
      iconBg: 'bg-blue-50 dark:bg-blue-950/30',
      iconColor: 'text-blue-400 dark:text-blue-400',
      confirmBtn: 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-400',
      border: 'border-blue-100 dark:border-blue-900/50'
    }
  };

  const styles = typeStyles[type];
  const defaultIcon = type === 'danger' ? <Trash2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className={`relative transform overflow-hidden rounded-2xl bg-white dark:bg-[#212121] px-4 pb-4 pt-5 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 border ${styles.border}`}>
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="sm:flex sm:items-start">
            {/* Icon */}
            <div className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10 ${styles.iconBg}`}>
              <div className={styles.iconColor}>
                {icon || defaultIcon}
              </div>
            </div>
            
            {/* Content */}
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left flex-1">
              <h3 className="text-lg font-semibold leading-6 text-gray-900 dark:text-white">
                {title}
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {message}
                </p>
              </div>
            </div>
          </div>
          
          {/* Buttons */}
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
            <button
              type="button"
              onClick={onConfirm}
              className={`inline-flex w-full justify-center rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:w-auto transition-colors ${styles.confirmBtn}`}
            >
              {confirmText}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 inline-flex w-full justify-center rounded-lg bg-white dark:bg-gray-700 px-4 py-2 text-sm font-semibold text-gray-900 dark:text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 sm:mt-0 sm:w-auto transition-colors"
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
