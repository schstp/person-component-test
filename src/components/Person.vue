<template>
  <div class="container">
    <div class="container__column">
      <div class="user-icon-wrapper">
        <img src="../assets/img/person.png" alt="edit-icon" style="width: 30px">
      </div>
    </div>
    <div class="container__column">
      {{ person.getFirstName() }}
    </div>
    <div class="container__column">
      {{ person.getLastName() }}
    </div>
    <div class="container__column">
      <div class="control-btn-wrapper">
        <button @click="showEditModal = true" class="edit">
          <img src="../assets/img/edit.svg" alt="edit-icon">
        </button>
        <person-edit-modal
          v-if="showEditModal"
          @close="showEditModal = false"
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
import { mapActions } from 'vuex'
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
      showEditModal: false,
      showDeleteModal: false,
    }
  },
  methods: {
    ...mapActions(['updatePerson', 'deletePerson']),
    updatePersonInfo() {
      this.showEditModal = false
      this.updatePerson({
        personData: {
          firstName: this.editModalData.firstName,
          lastName: this.editModalData.lastName,
        },
        personId: this.person.getId(),
      })
          .then(() => {
            this.$emit('show-notification', {
              message: 'Информация о сотруднике успешно обновлена.',
              type: 'success',
              shown: true,
            })
          })
    },
    removePerson() {
      this.showDeleteModal = false
      const notificationContent = this.person.getFullName()
      this.deletePerson(this.person.getId())
          .then(() => {
            this.$emit('show-notification', {
              message: `Сотрудник "${notificationContent}" удален.`,
              type: 'success',
              shown: true,
            })
            this.$store.commit('deletePerson', {
              personId: this.person.getId(),
            })
          })
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
