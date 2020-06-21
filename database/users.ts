import { database } from './mod.ts'

export interface UserSchema {
  _id: { $oid: string }
  userId: number
  username: string
  password: string
}

export const setupUsers = () => {
  return database.collection<UserSchema>('users')
}