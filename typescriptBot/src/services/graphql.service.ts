export async function handleResponse(response: Response) {
  const json = await response.json();
  return response.ok ? json : Promise.reject(json);
}

export function handleData<T>(data: T) {
  //TODO: Sanitize data
  return data;
}

export function handleError(error: Error) {
  //TODO: Handle Errors
}

export async function executeQuery<T = unknown>(params: {
  options: RequestInit;
}) {
  return fetch(process.env.ANILIST_GQL, params.options)
    .then(handleResponse)
    .then(handleData<T>)
    .catch(handleError);
}
