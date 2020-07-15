<template>
  <div v-if="!loadingState" class="container">
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
        />
      </div>
      <div class="table__footer">
        <div class="table__footer__column">
        </div>
        <div class="table__footer__column">
          <button>Добавить сотрудника</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import Person from '../components/Person.vue'
export default {
  name: 'home',
  components: {
    Person,
  },
  data() {
    return {
      loadingState: true,
    }
  },
  computed: {
    ...mapState(['personsCollection']),
  },
  methods: {
    ...mapActions(['getPersons']),
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
    margin: 50px auto;

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
          height: 40px;
          background-color: #3d8bcd;
          color: #ffffff;
          border: none;
          border-radius: 5px;
          outline: none;
          font-size: inherit;
          font-weight: bold;
        }
      }
    }
  }


</style>
