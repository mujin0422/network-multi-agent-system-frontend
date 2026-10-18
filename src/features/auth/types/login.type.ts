export type LoginCredentials = {
  email: string
  password: string
}

export type AuthRedirectState = {
  from?: string
}

export type LoginCopy = {
  productName: string
  productDescription: string
  title: string
  description: string
  demoNotice: string
  invalidCredentials: string
  submitLabel: string
  footer: string
}
