export const env = Deno.env.toObject()

export function missingEnv (envVariables: string[]): string[] {
  return envVariables.filter(
    (variable) => !((env[variable] ?? false) || env[variable] === '')
  )
}