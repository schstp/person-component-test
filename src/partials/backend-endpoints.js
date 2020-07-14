export const BACKEND_ENDPOINTS = {
  getPersons: { method: 'get', url: 'persons' },
  getPerson: { method: 'get', url: 'person/{personId}' },
  updatePerson: { method: 'put', url: 'person' },
  addPerson: { method: 'post', url: 'person/{personId}' },
  deletePerson: { method: 'delete', url: 'person/{personId}' },
}
