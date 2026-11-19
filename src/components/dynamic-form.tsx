"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { useMemo } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  buildZodSchema,
  type FormDefinition,
  type FormField,
} from "@/lib/schemas"

interface DynamicFormProps {
  definition: FormDefinition
  onSubmit?: (values: Record<string, unknown>) => void
}

export function DynamicForm({
  definition,
  onSubmit,
}: DynamicFormProps) {
  const schema = useMemo(() => buildZodSchema(definition), [definition])
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm({
    resolver: zodResolver(schema),
  })

  function renderField(field: FormField) {
    const error = errors[field.name]?.message
    const errorMessage =
      typeof error === "string" ? error : undefined

    if (field.type === "select") {
      return (
        <div key={field.name} className="grid gap-2">
          <Label htmlFor={field.name}>
            {field.label}
            {field.required ? " *" : ""}
          </Label>
          <Controller
            control={control}
            name={field.name}
            render={({ field: formField }) => (
              <Select
                value={typeof formField.value === "string" ? formField.value : null}
                onValueChange={(value) => formField.onChange(value)}
              >
                <SelectTrigger
                  id={field.name}
                  className="w-full"
                  aria-invalid={Boolean(errorMessage)}
                >
                  <SelectValue placeholder={`Select ${field.label}`} />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errorMessage ? (
            <p className="text-sm text-destructive">{errorMessage}</p>
          ) : null}
        </div>
      )
    }

    if (field.type === "textarea") {
      return (
        <div key={field.name} className="grid gap-2">
          <Label htmlFor={field.name}>
            {field.label}
            {field.required ? " *" : ""}
          </Label>
          <textarea
            id={field.name}
            aria-invalid={Boolean(errorMessage)}
            minLength={field.min}
            maxLength={field.max}
            className="min-h-24 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30"
            {...register(field.name)}
          />
          {errorMessage ? (
            <p className="text-sm text-destructive">{errorMessage}</p>
          ) : null}
        </div>
      )
    }

    return (
      <div key={field.name} className="grid gap-2">
        <Label htmlFor={field.name}>
          {field.label}
          {field.required ? " *" : ""}
        </Label>
        <Input
          id={field.name}
          type={field.type === "number" ? "number" : field.type}
          min={field.type === "number" ? field.min : undefined}
          max={field.type === "number" ? field.max : undefined}
          aria-invalid={Boolean(errorMessage)}
          {...register(
            field.name,
            field.type === "number"
              ? {
                  setValueAs: (value) =>
                    value === "" ? undefined : Number(value),
                }
              : undefined,
          )}
        />
        {errorMessage ? (
          <p className="text-sm text-destructive">{errorMessage}</p>
        ) : null}
      </div>
    )
  }

  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle>{definition.title}</CardTitle>
        {definition.description ? (
          <p className="text-sm text-muted-foreground">
            {definition.description}
          </p>
        ) : null}
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-5"
          onSubmit={handleSubmit((values) => {
            onSubmit?.(values)
          })}
        >
          {definition.fields.map(renderField)}
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-8 rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80 disabled:pointer-events-none disabled:opacity-50"
          >
            Submit
          </button>
        </form>
      </CardContent>
    </Card>
  )
}
