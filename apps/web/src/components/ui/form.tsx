'use client'

import * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import { Slot } from '@radix-ui/react-slot'
import { Controller, ControllerProps, FieldPath, FieldValues, UseFormRegisterReturn } from 'react-hook-form'
import { cn } from '@/lib/utils'

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      className
    )}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

interface FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null)

interface FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  name: TName
}

function FormFieldComponent({
  name,
  children,
  ...props
}: FormFieldProps & React.ComponentPropsWithoutRef<typeof Slot>) {
  return (
    <FormFieldContext.Provider value={{ name }}>
      <Slot {...props}>{children}</Slot>
    </FormFieldContext.Provider>
  )
}

interface UseFormFieldReturn<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  id: string
  name: TName
  formItemId: string
  formDescriptionId: string
  formMessageId: string
  errorMessage?: string
  invalid?: boolean
  isDirty?: boolean
  isTouched?: boolean
  register: UseFormRegisterReturn<TName>
}

function useFormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(): UseFormFieldReturn<TFieldValues, TName> {
  const fieldContext = React.useContext(FormFieldContext)

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>')
  }

  const { name } = fieldContext

  return {
    id: name as string,
    name: name as TName,
    formItemId: `${name as string}-item`,
    formDescriptionId: `${name as string}-description`,
    formMessageId: `${name as string}-message`,
    errorMessage: undefined,
    invalid: false,
    isDirty: false,
    isTouched: false,
    register: {} as UseFormRegisterReturn<TName>,
  }
}

interface FormProps<TFieldValues extends FieldValues> extends Omit<React.ComponentPropsWithoutRef<'form'>, 'onSubmit'> {
  onSubmit?: (values: TFieldValues) => void | Promise<void>
}

function Form<TFieldValues extends FieldValues>({
  onSubmit,
  children,
  ...props
}: FormProps<TFieldValues>) {
  return (
    <form
      {...props}
      onSubmit={(e) => {
        e.preventDefault()
        if (onSubmit) {
          onSubmit(e.currentTarget as unknown as TFieldValues)
        }
      }}
    >
      {children}
    </form>
  )
}

interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {}

const FormItem = React.forwardRef<HTMLDivElement, FormItemProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('space-y-2', className)} {...props} />
  )
)
FormItem.displayName = 'FormItem'

const FormLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  React.ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }, ref) => (
  <Label ref={ref} className={cn('', className)} {...props} />
))
FormLabel.displayName = 'FormLabel'

interface FormControlProps extends React.ComponentPropsWithoutRef<typeof Slot> {}

const FormControl = React.forwardRef<HTMLDivElement, FormControlProps>(
  ({ className, ...props }, ref) => (
    <Slot ref={ref} className={cn('', className)} {...props} />
  )
)
FormControl.displayName = 'FormControl'

interface FormDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const FormDescription = React.forwardRef<HTMLParagraphElement, FormDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
  )
)
FormDescription.displayName = 'FormDescription'

interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const FormMessage = React.forwardRef<HTMLParagraphElement, FormMessageProps>(
  ({ className, children, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm font-medium text-destructive', className)}
      {...props}
    >
      {children}
    </p>
  )
)
FormMessage.displayName = 'FormMessage'

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormFieldComponent as FormField,
}