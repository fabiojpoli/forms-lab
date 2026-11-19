import { create } from "zustand"

import {
  formSchema,
  type FormDefinition,
  type FormField,
} from "@/lib/schemas"

function cloneDefinition(definition: FormDefinition): FormDefinition {
  return {
    ...definition,
    fields: definition.fields.map((field) => ({
      ...field,
      options: field.options?.map((option) => ({ ...option })),
    })),
  }
}

interface FormStore {
  definitions: FormDefinition[]
  selectedDefinition: FormDefinition | null
  draft: FormDefinition | null
  setDefinitions: (definitions: FormDefinition[]) => void
  selectDefinition: (definition: FormDefinition | null) => void
  setDraft: (draft: FormDefinition | null) => void
  updateDraft: (patch: Partial<FormDefinition>) => void
  resetDraft: () => void
  saveDraft: () => void
  addField: () => void
  removeField: (index: number) => void
  moveField: (index: number, direction: -1 | 1) => void
  updateField: (index: number, patch: Partial<FormField>) => void
  updateDraftTitle: (title: string) => void
  updateDraftDescription: (description: string) => void
}

let draftFieldId = 1

function createDraftField(): FormField {
  const fieldId = draftFieldId++

  return {
    name: `field${fieldId}`,
    type: "text",
    label: `Field ${fieldId}`,
    required: false,
  }
}

export const useFormStore = create<FormStore>((set) => ({
  definitions: [formSchema],
  selectedDefinition: formSchema,
  draft: cloneDefinition(formSchema),

  setDefinitions: (definitions) =>
    set((state) => {
      const firstDefinition = definitions[0] ?? null
      const selectedDefinition =
        state.selectedDefinition &&
        definitions.includes(state.selectedDefinition)
          ? state.selectedDefinition
          : firstDefinition

      return {
        definitions,
        selectedDefinition,
        draft: selectedDefinition
          ? cloneDefinition(selectedDefinition)
          : null,
      }
    }),

  selectDefinition: (definition) =>
    set({
      selectedDefinition: definition,
      draft: definition ? cloneDefinition(definition) : null,
    }),

  setDraft: (draft) =>
    set({ draft: draft ? cloneDefinition(draft) : null }),

  updateDraft: (patch) =>
    set((state) => ({
      draft: state.draft
        ? {
            ...state.draft,
            ...patch,
          }
        : null,
    })),

  resetDraft: () =>
    set((state) => ({
      draft: state.selectedDefinition
        ? cloneDefinition(state.selectedDefinition)
        : null,
    })),

  saveDraft: () =>
    set((state) => {
      if (!state.draft) {
        return state
      }

      const draft = cloneDefinition(state.draft)
      const selectedIndex = state.selectedDefinition
        ? state.definitions.indexOf(state.selectedDefinition)
        : -1

      const definitions =
        selectedIndex >= 0
          ? state.definitions.map((definition, index) =>
              index === selectedIndex ? draft : definition,
            )
          : [...state.definitions, draft]

      return {
        definitions,
        selectedDefinition: draft,
        draft: cloneDefinition(draft),
      }
    }),

  addField: () =>
    set((state) => {
      if (!state.draft) {
        return state
      }

      return {
        draft: {
          ...state.draft,
          fields: [...state.draft.fields, createDraftField()],
        },
      }
    }),

  removeField: (index) =>
    set((state) => {
      if (!state.draft) {
        return state
      }

      return {
        draft: {
          ...state.draft,
          fields: state.draft.fields.filter((_, fieldIndex) => fieldIndex !== index),
        },
      }
    }),

  moveField: (index, direction) =>
    set((state) => {
      if (!state.draft) {
        return state
      }

      const targetIndex = index + direction
      if (targetIndex < 0 || targetIndex >= state.draft.fields.length) {
        return state
      }

      const fields = [...state.draft.fields]
      const [field] = fields.splice(index, 1)
      fields.splice(targetIndex, 0, field)

      return {
        draft: {
          ...state.draft,
          fields,
        },
      }
    }),

  updateField: (index, patch) =>
    set((state) => {
      if (!state.draft) {
        return state
      }

      return {
        draft: {
          ...state.draft,
          fields: state.draft.fields.map((field, fieldIndex) =>
            fieldIndex === index ? { ...field, ...patch } : field,
          ),
        },
      }
    }),

  updateDraftTitle: (title) =>
    set((state) => ({
      draft: state.draft ? { ...state.draft, title } : null,
    })),

  updateDraftDescription: (description) =>
    set((state) => ({
      draft: state.draft ? { ...state.draft, description } : null,
    })),
}))
