import { PersonsCollection } from '../partials/person.js'

export default {
  setPersonsCollection(state, rowPersons) {
    state.personsCollection = PersonsCollection
        .producePersonsCollection(rowPersons)
  },

  updatePerson(state, rowPerson) {
    const person = state.personsCollection.getPersonById(rowPerson.id)
    person.setFirstName(rowPerson.firstName)
    person.setLastName(rowPerson.lastName)
  },

  addPerson(state, rowPerson) {
    state.personsCollection.push(rowPerson)
  },

  deletePerson(state, personId) {
    state.personsCollection.removePersonById(personId)
  },
}
