import { PersonsCollection } from '../partials/person.js'

export default {
  setPersonsCollection(state, { rawPersons }) {
    state.personsCollection = PersonsCollection
        .producePersonsCollection(rawPersons)
  },

  updatePerson(state, { rawPerson }) {
    const person = state.personsCollection.getPersonById(rawPerson.id)
    person.setFirstName(rawPerson.firstName)
    person.setLastName(rawPerson.lastName)
  },

  addPerson(state, { rawPerson }) {
    state.personsCollection.push(rawPerson)
  },

  deletePerson(state, { personId }) {
    state.personsCollection.removePersonById(personId)
  },
}
