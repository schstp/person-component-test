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
        <template v-if="personsCollection.getLength() > 0">
          <person
            v-for="person in personsCollection.persons_"
            :key="person.id"
            :person="person"
            @update-person-request="showUpdatePersonModal"
            @delete-person-request="showDeletePersonModal"
          />
        </template>
        <template v-else>
          <div class="info-msg">
            <span class="msg-wrapper">
              Список сотрудников пуст.
              Кликните по кнопке "Добавить сотрудинка",
              чтобы добавить сотрудника в список.
            </span>
          </div>
        </template>
      </div>

      <div class="table__footer">
        <div class="table__footer__column">
        </div>
        <div class="table__footer__column">
          <button @click="showCreatePersonModal">
            Добавить сотрудника
          </button>
        </div>
      </div>

    </div>

    <person-edit-modal
      v-if="showModal"
      @close="closeModal"
      @submit="applyChanges"
    >
      <template #header>
        {{ modalState.title }}
      </template>
      <template #body>
        <div
          v-if="modalState.mode === 'create' || modalState.mode === 'update'"
          class="modal-body"
        >
          <input
            v-model="modalData.firstName"
            placeholder="Введите имя сотрудника"
          >
          <input
            v-model="modalData.lastName"
            placeholder="Введите фамилию сотрудника"
          >
        </div>
        <div v-else-if="modalState.mode === 'delete'">
          <span>
            Вы уверены, что хотите удалить сотрудника
            "{{ modalData.firstName + ' ' + modalData.lastName }}" ?
          </span>
        </div>
      </template>
      <template #footer>
        <div
          v-if="modalState.mode === 'delete'"
          class="delete-modal-footer"
        >
          <button @click="closeModal">Отмена</button>
          <button @click="applyChanges">Удалить</button>
        </div>
      </template>
    </person-edit-modal>

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
        person: null,
      },
      modalState: {
        title: '',
        mode: '',
      },
      cachedPerson: {
        firstName: null,
        lastName: null,
      },
      editModalContentChanged: false,
    }
  },
  methods: {
    showCreatePersonModal() {
      this.modalState = {
        title: 'Создание сотрудника',
        mode: 'create',
      }
      this.modalData = {
        firstName: '',
        lastName: '',
      }
      this.showModal = true
    },
    showUpdatePersonModal(person) {
      this.modalState = {
        title: 'Редактирование сотрудника',
        mode: 'update',
      }
      this.cachedPerson = {
        firstName: person.getFirstName(),
        lastName: person.getLastName(),
      }
      this.modalData = {
        firstName: person.getFirstName(),
        lastName: person.getLastName(),
        person: person,
      }
      this.showModal = true
    },
    showDeletePersonModal(person) {
      this.modalState = {
        title: 'Удаление сотрудника',
        mode: 'delete',
      }
      this.modalData = {
        firstName: person.getFirstName(),
        lastName: person.getLastName(),
        person: person,
      }
      this.showModal = true
    },
    clearModal() {
      this.modalData = {
        firstName: '',
        lastName: '',
        person: null,
      }
      this.modalState = {
        title: '',
        mode: '',
      }
    },
    closeModal() {
      this.showModal = false
    },
    applyChanges() {
      if (this.modalState.mode === 'create') {
        this.requestPersonCreate()
      } else if (this.modalState.mode === 'update') {
        this.requestPersonUpdate()
      } else if (this.modalState.mode === 'delete') {
        this.requestPersonDelete()
      }
    },
    requestPersonCreate() {
      if (this.validateForm()) {
        this.$emit('create-person', {
          personData: {
            firstName: this.modalData.firstName,
            lastName: this.modalData.lastName,
          },
          personId: null,
        })
        this.closeModal()
        this.clearModal()
      }
    },
    requestPersonUpdate() {
      this.checkIfWasChanged()
      if (this.editModalContentChanged) {
        this.editModalContentChanged = false
        if (this.validateForm()) {
          this.closeModal()
          this.$emit('update-person', {
            personData: {
              firstName: this.modalData.firstName,
              lastName: this.modalData.lastName,
            },
            personId: this.modalData.person.getId(),
          })
        }
      } else {
        this.$emit('show-notification', {
          message: 'Никаких изменений не внесено.',
          type: 'info',
          shown: true,
        })
        this.closeModal()
        this.clearModal()
      }
    },
    requestPersonDelete() {
      this.$emit('delete-person', this.modalData.person.getId())
      this.closeModal()
      this.clearModal()
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
    checkIfWasChanged() {
      if (this.modalData.firstName.trim() !== this.cachedPerson.firstName ||
        this.modalData.lastName.trim() !== this.cachedPerson.lastName) {
        this.cachedPerson.firstName = this.modalData.firstName.trim()
        this.cachedPerson.lastName = this.modalData.lastName.trim()
        this.editModalContentChanged = true
      } else {
        this.editModalContentChanged = false
      }
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

  .delete-modal-footer {
    button {
      height: 35px;
      width: 100px;
      margin-left: 5px;
      color: #ffffff;
      border: none;
      border-radius: 5px;
      outline: none;
      font-size: inherit;
      font-weight: bold;
      &:hover {
        cursor: pointer;
      }
      &:first-of-type {
        background-color: #3d8bcd;
        &:hover {
          background-color: #3a80ba;
        }
      }
      &:last-of-type {
        background-color: #c36e6b;
        &:hover {
          background-color: #b16360;
        }
      }
    }
  }

  .info-msg {
    display: flex;
    padding: 0 15px;
    max-width: 500px;
    margin: 10px auto;
    justify-content: center;
    .msg-wrapper {
    }
  }
</style>
