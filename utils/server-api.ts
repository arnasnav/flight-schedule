const SITE = `http://localhost:3000`

export const getApi = async <T>(
  url: string,
  options: Record<string, RequestInit> = {}
): Promise<T | undefined> => {
  const response = await fetch(`${SITE}${url}`, options)
  try {
    return await response.json()
  } catch (error) {
    console.log(error)
    return undefined
  }
}

export const postApi = async (url: string, body: object, method = "POST") => {
  const response = await fetch(`${SITE}${url}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  })
  return await response.json()
}

export const putApi = async (url: string, body: object) => {
  await postApi(url, body, "PUT")
}

export const deleteApi = async (url: string, id: string) => {
  await postApi(`${url}/${id}`, { id }, "DELETE")
}