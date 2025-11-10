import { ChangeEventHandler } from "react";

interface Props {
  label: string
  value: HTMLInputElement['value']
  onChange: ChangeEventHandler<HTMLInputElement>
  type?: 'checkbox' | 'number'
  className?: string;
  labelClassName?: string;
}
export const LabeledInput = ({ label, value, onChange, type = 'checkbox', className, labelClassName }: Props) => {
  const isCheckbox = type === 'checkbox'
  const checked = isCheckbox ? value === 'true' : undefined
  
  return (
    <label className={`flex items-center gap-2 cursor-pointer text-sm pl-6 ${labelClassName}`}>
      <input
        type={type}
        {...(isCheckbox ? { checked } : { value })}
        onChange={onChange}
        className={`cursor-pointer text-center accent-green-400 ${className}`}
      />
      <span>{label}</span>
    </label>
  )
}
