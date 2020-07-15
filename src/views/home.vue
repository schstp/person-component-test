<template>
  <div v-if="!loadingState" class="container">
    <toast-notification
      v-if="notificationToastState.shown"
      :bg-color="notificationToastState.type"
    >
      <span slot="message">
        {{ notificationToastState.message }}
      </span>
    </toast-notification>
    <div class="table">
      <div class="table__header">
        <div class="table__header__column"></div>
        <div class="table__header__column">Имя</div>
        <div class="table__header__column">Фамилия</div>
        <div class="table__header__column"></div>
      </div>
      <div class="table__body">
        <person
          v-for="person in personsCollection"
          :key="person.id"
          :person="person"
          @show-notification="showNotification"
        />
      </div>
      <div class="table__footer">
        <div class="table__footer__column">
        </div>
        <div class="table__footer__column">
          <button @click="showModal = true">Добавить сотрудника</button>
          <person-edit-modal
            v-if="showModal"
            @close="showModal = false"
            @submit="createNewPerson"
          >
            <span slot="header">Создание сотрудника</span>
            <div slot="body" class="modal-body">
              <input
                v-model="modalData.firstName"
                placeholder="Введите имя сотрудника"
              >
              <input
                v-model="modalData.lastName"
                placeholder="Введите фамилию сотрудника"
              >
            </div>
          </person-edit-modal>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import Person from '../components/Person.vue'
import PersonEditModal from '../components/PersonEditModal.vue'
import ToastNotification from '../components/ToastNotification.vue'

export default {
  name: 'home',
  components: {
    Person,
    PersonEditModal,
    ToastNotification,
  },
  data() {
    return {
      loadingState: true,
      showModal: false,
      modalData: {
        firstName: '',
        lastName: '',
      },
      notificationToastState: {
        message: '',
        type: '',
        shown: false,
      },
    }
  },
  computed: {
    ...mapState(['personsCollection']),
  },
  methods: {
    ...mapActions(['getPersons', 'addPerson']),
    createNewPerson() {
      this.showModal = false
      this.addPerson({
        personData: {
          firstName: this.modalData.firstName,
          lastName: this.modalData.lastName,
        },
        personId: null,
      }).then((rawPerson) => {
        const newPersonFullName = `${rawPerson.firstName} ${rawPerson.lastName}`
        this.showNotification({
          message: `Сотрудник "${newPersonFullName}" добавлен в список.`,
          type: 'success',
          shown: true,
        })
      })
      this.clearModal()
    },
    clearModal() {
      this.modalData.firstName = ''
      this.modalData.lastName = ''
    },
    showNotification(args) {
      this.notificationToastState = args
      const context = this
      setTimeout(function() {
        context.notificationToastState = {
          message: '',
          type: '',
          shown: false,
        }
      }, 1500)
    },
  },
  beforeMount() {
    this.getPersons()
        .then(() => {
          this.loadingState = false
        })
        .catch((err) => {
          console.log(err)
        })
  },
}
</script>

<style scoped lang="scss">
  .container {
    width: 100%;
    margin: 0 auto;
    padding: 0 15px;
    max-width: 1270px;
    font-size: 14px;
    @media screen and (min-width: 700px){
      width: 95%;
      font-size: 16px;
    }
    @media screen and (min-width: 1200px){
      width: 85%;
    }
    @media screen and (min-width: 1600px){
      width: 80%;
    }
    @media screen and (min-width: 2100px){
      width: 75%;
    }
  }

  .table {
    width: inherit;
    margin: 70px auto;

    &__header {
      display: flex;
      height: 40px;
      width: inherit;
      padding: 0 15px;
      margin: 0 auto;
      justify-content: space-between;
      align-items: center;

      background-color: #f8f8f8;
      border: 1px solid #e7e7e7;
      border-left: none;
      border-right: none;
      font-weight: bold;

      &__column {
        flex: 1;
        &:first-of-type {
          display: none;
          @media screen and (min-width: 860px){
            display: block;
            flex: 0.2;
          }
        }
      }
    }

    &__footer {
      display: flex;
      height: 50px;
      width: inherit;
      padding: 0 15px;
      margin: 0 auto;
      justify-content: flex-end;
      align-items: center;

      &__column {
        flex: 3;
        &:first-of-type {
          display: none;
          @media screen and (min-width: 860px){
            display: block;
            flex: 0.2;
          }
        }
        display: flex;
        justify-content: center;
        @media screen and (min-width: 425px){
          display: block;
        }
        button {
          width: 210px;
        }
      }
      .modal-body {
        input {
          width: 100%;
          height: 35px;
          outline: none;
          border: 1px solid #999999;
          border-radius: 3px;
          margin-bottom: 10px;
          font-size: 14px;
        }
      }
    }
  }


</style>
