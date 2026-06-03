export interface CardDraft {
  number: string
  expMonth: string
  expYear: string
  holder: string
}

export interface CardDraftErrors {
  number?: string
  expMonth?: string
  expYear?: string
  holder?: string
}
