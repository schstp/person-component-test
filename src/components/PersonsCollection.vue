<template>
  <div class="container">
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
          @update-person="propagatePersonUpdateRequest"
          @delete-person="propagatePersonDeleteRequest"
          @show-notification="propagateNotification"
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
import { PersonsCollection } from '../partials/person.js'
import Person from '../components/Person.vue'
import PersonEditModal from '../components/PersonEditModal.vue'

export default {
  name: 'PersonsCollection',
  components: {
    Person,
    PersonEditModal,
  },
  props: {
    personsCollection: {
      type: PersonsCollection,
      required: true,
    },
  },
  data() {
    return {
      showModal: false,
      modalData: {
        firstName: '',
        lastName: '',
      },
    }
  },
  methods: {
    createNewPerson() {
      if (this.validateForm()) {
        this.showModal = false
        this.$emit('create-person', {
          personData: {
            firstName: this.modalData.firstName,
            lastName: this.modalData.lastName,
          },
          personId: null,
        })
        this.clearModal()
      }
    },
    validateForm() {
      this.modalData.firstName = this.modalData.firstName.trim()
      this.modalData.lastName = this.modalData.lastName.trim()
      const isFirstNameEmpty = this.isEmpty(this.modalData.firstName)
      const isLastNameEmpty = this.isEmpty(this.modalData.lastName)
      const isFirstNameTooLong = this.isTooLong(this.modalData.firstName)
      const isLastNameTooLong = this.isTooLong(this.modalData.lastName)
      let errorMessage = null
      if (isFirstNameEmpty && isLastNameEmpty) {
        errorMessage = 'Имя и фамилия обязательны для заполнения.'
      } else if (isFirstNameEmpty) {
        errorMessage = 'Имя обязательно для заполнения.'
      } else if (isLastNameEmpty) {
        errorMessage = 'Фамилия обязательна для заполнения.'
      }
      if (isFirstNameTooLong && isLastNameTooLong) {
        errorMessage = 'Имя и фамилия слишком длинные.'
      } else if (isFirstNameTooLong) {
        errorMessage = 'Слишком длинное имя.'
      } else if (isLastNameTooLong) {
        errorMessage = 'Слишком длинная фамилия.'
      }
      if (errorMessage) {
        this.$emit('show-notification', {
          message: errorMessage,
          type: 'error',
          shown: true,
        })
        return false
      } else {
        return true
      }
    },
    isEmpty(value) {
      return value === ''
    },
    isTooLong(value) {
      return value.length > 30
    },
    clearModal() {
      this.modalData.firstName = ''
      this.modalData.lastName = ''
    },
    propagateNotification(args) {
      this.$emit('show-notification', args)
    },
    propagatePersonUpdateRequest(personData) {
      this.$emit('update-person', personData)
    },
    propagatePersonDeleteRequest(personId) {
      this.$emit('delete-person', personId)
    },
  },
}
</script>

<style scoped lang="scss">
  .container {
    width: 100%;
    margin: 0 auto;
    padding: 0 15px;
    max-width: 1270px;
    font-size: 12px;
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
