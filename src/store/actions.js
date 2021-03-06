import apiClient from '../partials/api-client.js'

export default {
  async getPersons({ commit }) {
    try {
      const rawPersons = await apiClient.request('getPersons')
      commit('setPersonsCollection', { rawPersons })
      return Promise.resolve(rawPersons)
    } catch (err) {
      return Promise.reject(err)
    }
  },

  async getPerson(personId) {
    try {
      const rawPerson = await apiClient.request('getPerson', {
        args: {
          personId: personId,
        },
      })
      return Promise.resolve(rawPerson)
    } catch (err) {
      return Promise.reject(err)
    }
  },

  async updatePerson({ commit }, { personData, personId }) {
    try {
      const rawPerson = await apiClient.request('updatePerson', {
        data: personData,
        args: {
          personId: personId,
        },
      })
      commit('updatePerson', { rawPerson })
      return Promise.resolve(rawPerson)
    } catch (err) {
      return Promise.reject(err)
    }
  },

  async addPerson({ commit }, { personData, personId }) {
    try {
      const rawPerson = await apiClient.request('addPerson', {
        data: personData,
        args: {
          personId: personId,
        },
      })
      commit('addPerson', { rawPerson })
      return Promise.resolve(rawPerson)
    } catch (err) {
      return Promise.reject(err)
    }
  },

  async deletePerson({ commit }, personId) {
    try {
      await apiClient.request('deletePerson', {
        args: {
          personId: personId,
        },
      })
      commit('deletePerson', { personId })
      return Promise.resolve(true)
    } catch (err) {
      return Promise.reject(err)
    }
  },
}
