export interface Dialog {
  text: string
  choices?: Array<{ text: string; next: number; action?: () => void }>
}

export interface IDialogSystem {
  show(dialog: Dialog): void
  hide(): void
  processChoice(choice: number): void
}

export interface DialogOptions {
  text: string
  choices?: string[] | null
  callback?: ((choice: number) => void) | null
  onClose?: (() => void) | null
}
