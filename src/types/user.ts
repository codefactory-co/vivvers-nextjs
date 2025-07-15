export interface User {
  id: string
  username: string
  email: string
  avatarUrl?: string
  bio?: string
  websiteUrl?: string
  createdAt: Date
  updatedAt: Date
}