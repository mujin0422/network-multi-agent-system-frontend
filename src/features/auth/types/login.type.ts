export type LoginCredentials = {
  email: string
  password: string
}

export type AuthRedirectState = {
  from?: string
}

export type LoginCopy = {
  title: string
  description: string
  demoNotice: string
  invalidCredentials: string
  submitLabel: string
}
