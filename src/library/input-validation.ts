import bcrypt from 'bcrypt'

export async function compare(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}
