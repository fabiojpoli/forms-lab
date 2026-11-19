"use client"

import { useState } from "react"

import { DynamicForm } from "@/components/dynamic-form"
import { Button } from "@/components/ui/button"
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
import type { FormFieldType } from "@/lib/schemas"
import { useFormStore } from "@/store/use-form-store"

export default function DesignerPage() {
  const [submittedValues, setSubmittedValues] = useState<Record<string, unknown> | null>(null)
  const draft = useFormStore((state) => state.draft)
  const addField = useFormStore((state) => state.addField)
  const removeField = useFormStore((state) => state.removeField)
  const moveField = useFormStore((state) => state.moveField)
  const updateField = useFormStore((state) => state.updateField)
  const updateDraftTitle = useFormStore((state) => state.updateDraftTitle)
  const updateDraftDescription = useFormStore((state) => state.updateDraftDescription)
  const resetDraft = useFormStore((state) => state.resetDraft)
  const saveDraft = useFormStore((state) => state.saveDraft)
  const fieldTypes: FormFieldType[] = ["text", "email", "number", "select", "textarea"]

  if (!draft) return null

  return (
    <main className="min-h-full px-4 py-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Card className="h-fit">
          <CardHeader><CardTitle>Form Designer</CardTitle></CardHeader>
          <CardContent className="grid gap-5">
            <div className="grid gap-2">
              <Label htmlFor="form-title">Form title</Label>
              <Input id="form-title" value={draft.title} onChange={(event) => updateDraftTitle(event.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="form-description">Description</Label>
              <Input id="form-description" value={draft.description} onChange={(event) => updateDraftDescription(event.target.value)} />
            </div>
            <div className="grid gap-3">
              {draft.fields.map((field, index) => (
                <Card key={index} size="sm" className="gap-3">
                  <CardContent className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Field {index + 1}</span>
                      <div className="flex gap-1">
                        <Button type="button" variant="outline" size="xs" disabled={index === 0} onClick={() => moveField(index, -1)}>Up</Button>
                        <Button type="button" variant="outline" size="xs" disabled={index === draft.fields.length - 1} onClick={() => moveField(index, 1)}>Down</Button>
                        <Button type="button" variant="destructive" size="xs" onClick={() => removeField(index)}>Remove</Button>
                      </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="grid gap-2">
                        <Label htmlFor={`label-${index}`}>Label</Label>
                        <Input id={`label-${index}`} value={field.label} onChange={(event) => updateField(index, { label: event.target.value })} />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor={`name-${index}`}>Name</Label>
                        <Input id={`name-${index}`} value={field.name} onChange={(event) => updateField(index, { name: event.target.value })} />
                      </div>
                      <div className="grid gap-2">
                        <Label>Type</Label>
                        <Select value={field.type} onValueChange={(value) => updateField(index, { type: value as FormFieldType })}>
                          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                          <SelectContent>{fieldTypes.map((type) => <SelectItem key={type} value={type}>{type}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <label className="flex items-center gap-2 text-sm font-medium">
                        <input type="checkbox" checked={field.required} onChange={(event) => updateField(index, { required: event.target.checked })} />
                        Required
                      </label>
                    </div>
                    {(field.type === "text" || field.type === "textarea" || field.type === "number") && (
                      <div className="grid grid-cols-2 gap-3">
                        <div className="grid gap-2">
                          <Label htmlFor={`min-${index}`}>Min</Label>
                          <Input id={`min-${index}`} type="number" value={field.min ?? ""} onChange={(event) => updateField(index, { min: event.target.value === "" ? undefined : Number(event.target.value) })} />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor={`max-${index}`}>Max</Label>
                          <Input id={`max-${index}`} type="number" value={field.max ?? ""} onChange={(event) => updateField(index, { max: event.target.value === "" ? undefined : Number(event.target.value) })} />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" onClick={addField}>Add field</Button>
              <Button type="button" variant="outline" onClick={resetDraft}>Reset</Button>
              <Button type="button" variant="secondary" onClick={saveDraft}>Save</Button>
            </div>
          </CardContent>
        </Card>
        <div className="flex h-fit flex-col gap-4 lg:sticky lg:top-8">
          <DynamicForm key={`${draft.title}-${draft.fields.map((field) => `${field.name}:${field.type}`).join("|")}`} definition={draft} onSubmit={(values) => setSubmittedValues(values)} />
          {submittedValues ? <pre className="rounded-lg border p-4 text-sm">{JSON.stringify(submittedValues, null, 2)}</pre> : null}
        </div>
      </div>
    </main>
  )
}
