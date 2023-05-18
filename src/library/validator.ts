export function validateInput(errors: any) {
  if (!errors.length) {
    return null
  }

  const errorMessages = errors.reduce((prev: string[], current: any) => {
    if (current.constraints) {
      for (const key in current.constraints) {
        prev.push(current.constraints[key])
      }
    }
    return prev
  }, [])

  throw new Error(JSON.stringify(errorMessages))
}
