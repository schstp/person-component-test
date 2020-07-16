<template>
  <div class="container">
    <div class="container__column">
      <div class="user-icon-wrapper">
        <img src="../assets/img/person.png" alt="edit-icon" style="width: 30px">
      </div>
    </div>
    <div class="container__column">
      <span
        :title="person.getFirstName()"
        class="text-field-wrapper"
      >
        {{ person.getFirstName() }}
      </span>
    </div>
    <div class="container__column">
      <span
        :title="person.getLastName()"
        class="text-field-wrapper"
      >
        {{ person.getLastName() }}
      </span>
    </div>
    <div class="container__column">
      <div class="control-btn-wrapper">
        <button @click="showEditModal = true" class="edit">
          <img src="../assets/img/edit.svg" alt="edit-icon">
        </button>
        <person-edit-modal
          v-if="showEditModal"
          @close="closeEditModal"
          @submit="updatePersonInfo"
        >
          <span slot="header">Редактирование сотрудника</span>
          <div slot="body" class="modal-body">
            <input
              v-model="editModalData.firstName"
              placeholder="Введите имя сотрудника"
            >
            <input
              v-model="editModalData.lastName"
              placeholder="Введите фамилию сотрудника"
            >
          </div>
        </person-edit-modal>
      </div>
      <div class="control-btn-wrapper">
        <button @click="showDeleteModal = true" class="delete">
          <img src="../assets/img/remove.svg" alt="remove-icon">
        </button>
        <person-edit-modal
          v-if="showDeleteModal"
          @close="showDeleteModal = false"
        >
          <span slot="header">Удаление сотрудника</span>
          <div slot="body">
            <span>Вы уверены, что хотите удалить сотрудника
              "{{ person.getFirstName() + ' ' + person.getLastName()}}" ?
            </span>
          </div>
          <div slot="footer" class="delete-modal-footer">
            <button @click="showDeleteModal = false">Отмена</button>
            <button @click="removePerson">Удалить</button>
          </div>
        </person-edit-modal>
      </div>
    </div>
  </div>
</template>

<script>
import { Person } from '../partials/person.js'
import PersonEditModal from './PersonEditModal.vue'

export default {
  name: 'Person',
  components: {
    PersonEditModal,
  },
  props: {
    person: {
      type: Person,
      required: true,
    },
  },
  data() {
    const firstName = this.person.getFirstName()
    const lastName = this.person.getLastName()
    return {
      editModalData: {
        firstName: firstName,
        lastName: lastName,
      },
      cachedPerson: {
        firstName: firstName,
        lastName: lastName,
      },
      editModalContentChanged: false,
      showEditModal: false,
      showDeleteModal: false,
    }
  },
  methods: {
    updatePersonInfo() {
      this.checkIfWasChanged()
      if (this.editModalContentChanged) {
        this.editModalContentChanged = false
        if (this.validateForm()) {
          this.showEditModal = false
          this.$emit('update-person', {
            personData: {
              firstName: this.editModalData.firstName,
              lastName: this.editModalData.lastName,
            },
            personId: this.person.getId(),
          })
        }
      } else {
        this.showEditModal = false
        this.$emit('show-notification', {
          message: 'Никаких изменений не внесено.',
          type: 'info',
          shown: true,
        })
      }
    },
    removePerson() {
      this.showDeleteModal = false
      this.$emit('delete-person', this.person.getId())
    },
    validateForm() {
      this.editModalData.firstName = this.editModalData.firstName.trim()
      this.editModalData.lastName = this.editModalData.lastName.trim()
      const isFirstNameEmpty = this.isEmpty(this.editModalData.firstName)
      const isLastNameEmpty = this.isEmpty(this.editModalData.lastName)
      const isFirstNameTooLong = this.isTooLong(this.editModalData.firstName)
      const isLastNameTooLong = this.isTooLong(this.editModalData.lastName)
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
    closeEditModal() {
      this.showEditModal = false
      this.editModalData = {
        firstName: this.person.getFirstName(),
        lastName: this.person.getLastName(),
      }
    },
    checkIfWasChanged() {
      if (this.editModalData.firstName.trim() !== this.cachedPerson.firstName ||
        this.editModalData.lastName.trim() !== this.cachedPerson.lastName) {
        this.cachedPerson.firstName = this.editModalData.firstName.trim()
        this.cachedPerson.lastName = this.editModalData.lastName.trim()
        this.editModalContentChanged = true
      } else {
        this.editModalContentChanged = false
      }
    },
    handleHttpError(err) {
      if (err.response.status === 404) {
        this.$emit('show-notification', {
          message: 'Не удалось обновить/удалить данные. ' +
            'Сотрудник не найден в системе.',
          type: 'error',
          shown: true,
        })
      }
      if (err.response.status === 400) {
        this.$emit('show-notification', {
          message: 'Не удалось обновить/удалить данные. ' +
            'Обратитесь в службу поддержки.',
          type: 'error',
          shown: true,
        })
      }
      if (err.response.status === 500) {
        this.$emit('show-notification', {
          message: 'Не удалось обновить/удалить данные, ' +
            'на сервере произошла ошибка. Повторите ' +
            'операцию позже.',
          type: 'error',
          shown: true,
        })
      }
    },
  },
}
</script>

<style scoped lang="scss">
  .container {
    display: flex;
    height: 40px;
    padding: 0 15px;
    margin: 0 auto;
    justify-content: space-between;
    align-items: center;

    border-bottom: 1px solid #e7e7e7;

    &__column {
      flex: 1;
      &:first-of-type {
        display: none;
        @media screen and (min-width: 860px){
          display: block;
          flex: 0.2;
        }
      }
      &:last-of-type {
        display: flex;
        justify-content: flex-end;
      }
      .control-btn-wrapper, .user-icon-wrapper {
        width: 25px;
        height: 25px;
        margin: 0 3px;
        @media screen and (min-width: 700px) {
          width: 30px;
          height: 30px;
        }
        button {
          padding: 0;
          border: 1px solid;
          border-radius: 2px;
          outline: none;
          width: inherit;
          height: inherit;
          &.edit {
            background-color: #fff2cc;
            border-color: #dec578;
            &:hover {
              background-color: #fff1b3;
            }
          }
          &.delete {
            background-color: #f8cecc;
            border-color: #c36e6b;
            &:hover {
              background-color: #f8bbb8;
            }
          }
          &:hover {
            cursor: pointer;
          }
        }
        img {
          width: 100%;
        }
      }

      .text-field-wrapper {
        display: block;
        max-width: 70px;
        overflow: hidden;
        text-overflow: ellipsis;
        text-transform: capitalize;
        @media screen and (min-width: 700px){
          max-width: 160px;
        }
        @media screen and (min-width: 1200px){
          max-width: 200px;
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
    }
  }
</style>
