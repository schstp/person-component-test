<template>
  <div>
    <toast-notification
      v-if="notificationToastState.shown"
      :bg-color="notificationToastState.type"
    >
      <span slot="message">
        {{ notificationToastState.message }}
      </span>
    </toast-notification>
    <persons-collection
      v-if="!loadingState"
      :persons-collection="personsCollection"
      @create-person="createPerson"
      @update-person="updatePersonInfo"
      @delete-person="removePerson"
      @show-notification="showNotification"
    />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import PersonsCollection from '../components/PersonsCollection.vue'
import ToastNotification from '../components/ToastNotification.vue'

export default {
  name: 'home',
  components: {
    PersonsCollection,
    ToastNotification,
  },
  data() {
    return {
      loadingState: true,
      notificationToastState: {
        message: '',
        type: '',
        shown: false,
        timerId: null,
      },
    }
  },
  computed: {
    ...mapState(['personsCollection']),
  },
  methods: {
    ...mapActions(['getPersons', 'addPerson', 'updatePerson', 'deletePerson']),
    createPerson(personData) {
      this.addPerson(personData).then(() => {
        this.showNotification({
          message: 'Сотрудник добавлен в список.',
          type: 'success',
          shown: true,
        })
      }).catch((err) => {
        this.handleHttpError(err)
      })
    },
    updatePersonInfo(personData) {
      this.updatePerson(personData).then(() => {
        this.showNotification({
          message: 'Информация о сотруднике успешно обновлена.',
          type: 'success',
          shown: true,
        })
      }).catch((err) => {
        this.handleHttpError(err)
      })
    },
    removePerson(personId) {
      this.deletePerson(personId).then(() => {
        this.showNotification({
          message: `Сотрудник удален.`,
          type: 'success',
          shown: true,
        })
      }).catch((err) => {
        this.handleHttpError(err)
      })
    },
    handleHttpError(err) {
      let message = null
      if (err.response.status === 404) {
        message = 'Не удалось выполнить операцию. ' +
          'Сотрудник не найден.'
      }
      if (err.response.status === 400) {
        message = 'Не удалось выполнить операцию. ' +
          'Обратитесь в службу поддержки.'
      }
      if (err.response.status === 500) {
        message = 'Не удалось выполнить операцию. ' +
          'На сервере произошла ошибка. Повторите ' +
          'операцию позже.'
      }
      if (message) {
        this.showNotification({
          message: message,
          type: 'error',
          shown: true,
        })
      }
    },
    showNotification(args) {
      if (this.notificationToastState.timerId) {
        clearTimeout(this.notificationToastState.timerId)
      }
      this.notificationToastState = args
      const context = this
      this.notificationToastState.timerId = setTimeout(function() {
        context.notificationToastState = {
          message: '',
          type: '',
          shown: false,
          timerId: null,
        }
      }, 2000)
    },
  },
  beforeMount() {
    this.getPersons()
        .then(() => {
          this.loadingState = false
        })
        .catch((err) => {
          this.handleHttpError(err)
        })
  },
}
</script>
