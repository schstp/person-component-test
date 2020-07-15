<template>
  <div v-if="!loadingState" class="container">
    <div class="table">
      <div class="table__header">
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
      <div class="table__footer"></div>
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
    @media screen and (min-width: 500px){
      width: 90%;
    }
    @media screen and (min-width: 800px){
      width: 80%;
    }
    @media screen and (min-width: 1200px){
      width: 85%;
    }
    @media screen and (min-width: 1500px){
      width: 70%;
    }
    @media screen and (min-width: 1800px){
      width: 65%;
    }
    @media screen and (min-width: 2100px){
      width: 55%;
    }
  }

  .table {
    width: inherit;
    margin: 50px auto;

    &__header {
      display: flex;
      height: 30px;
      width: inherit;
      padding: 0 15px;
      margin: 0 auto;
      justify-content: space-between;
      align-items: center;

      background-color: #ececec;
      border: 1px solid #979797;
      border-left: none;
      border-right: none;
      font-weight: bold;

      &__column {
        flex: 1;
      }
    }
  }


</style>
