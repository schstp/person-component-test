import apiClient from '../partials/api-client.js'

export default {
  async getPersons({ commit }) {
    try {
      const rawPersons = await apiClient.getPersons()
      commit('setPersonsCollection', { rawPersons })
      return Promise.resolve(rawPersons)
    } catch (err) {
      return Promise.resolve(err)
    }
  },

  async getPerson(personId) {
    try {
      const rawPerson = await apiClient.getPerson({
        args: {
          personId: personId,
        },
      })
      return Promise.resolve(rawPerson)
    } catch (err) {
      return Promise.resolve(err)
    }
  },

  async updatePerson({ commit }, { personData, personId }) {
    try {
      const rawPerson = await apiClient.updatePerson({
        data: personData,
        args: {
          personId: personId,
        },
      })
      commit('updatePerson', { rawPerson })
      return Promise.resolve(rawPerson)
    } catch (err) {
      return Promise.resolve(err)
    }
  },

  async addPerson({ commit }, { personData, personId }) {
    try {
      const rawPerson = await apiClient.addPerson({
        data: personData,
        args: {
          personId: personId,
        },
      })
      commit('addPerson', { rawPerson })
      return Promise.resolve(rawPerson)
    } catch (err) {
      return Promise.resolve(err)
    }
  },

  async deletePerson({ commit }, personId) {
    try {
      await apiClient.deletePerson({
        args: {
          personId: personId,
        },
      })
      commit('deletePerson', { personId })
      return Promise.resolve(true)
    } catch (err) {
      return Promise.resolve(err)
    }
  },
}
