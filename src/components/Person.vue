<template>
  <div class="container">
    <div class="container__column">
      {{ person.getFirstName() }}
    </div>
    <div class="container__column">
      {{ person.getLastName() }}
    </div>
    <div class="container__column">
      <span>Edit</span>
      <span>Delete</span>
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
    height: 30px;
    padding: 0 15px;
    margin: 0 auto;
    justify-content: space-between;
    align-items: center;

    &__column {
      flex: 1;
      &:last-of-type {
        text-align: end;
      }
    }
  }
</style>
