export interface UserInterface {
  _id?: string
  userName: string
  email: string
  password: string
  createdAt?: Date
  updatedAt?: Date
}

export interface GeneralRequest {
  user: UserInterface
  file: object
  params: object
  query: object
  path: object
}

export interface RegisterInterface {
  fullName: string
  email: string
  password: string
  retypePassword: string
}

export interface LoginInterface {
  email: string
  password: string
  remember: boolean
}

export interface NoteUpdateInterface {
  heading?: string
  noteField: string
}

export interface NoteInterface extends NoteUpdateInterface {
  _id?: string
  owner: string
  createdAt?: Date
  updatedAt?: Date
}
