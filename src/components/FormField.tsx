import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  Icon: LucideIcon;
  isTextarea?: boolean;
}

export function FormField({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  Icon,
  isTextarea = false,
}: FormFieldProps) {
  const commonProps = {
    name,
    required: true,
    value,
    onChange,
    className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors",
    placeholder,
  };

  return (
    <div>
      <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
        <Icon size={18} className="mr-2 text-orange-500" />
        {label}
      </label>
      {isTextarea ? (
        <textarea {...commonProps} rows={3} />
      ) : (
        <input {...commonProps} type={type} />
      )}
    </div>
  );
}