export const POKE_API = "https://pokeapi.co/api/v2/"

export function mockFetch(data: any) {
  return jest.fn().mockImplementation(() =>
    Promise.resolve({
      ok: true,
      json: () => data,
    }),
  )
}

