export const move = (...args: any[]) => args

export const spawn = (movedArgs: any[], fn: (...args: any[]) => any) => {
  return {
    join: async () => ({
      ok: true,
      value: fn(...movedArgs),
    }),
  }
}
