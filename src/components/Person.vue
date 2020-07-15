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
        <button class="edit">
          <img src="../assets/img/edit.svg" alt="edit-icon">
        </button>
      </div>
      <div class="control-btn-wrapper">
        <button class="delete">
          <img src="../assets/img/remove.svg" alt="remove-icon">
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { Person } from '../partials/person.js'

export default {
  name: 'Person',
  props: {
    person: {
      type: Person,
      required: true,
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
    }
  }
</style>
