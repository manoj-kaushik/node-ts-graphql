import bcrypt from 'bcrypt'

/**
 * compare user password with hash
 * @param password string
 * @param hash string
 * @returns boolean
 */
export async function compare(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}
