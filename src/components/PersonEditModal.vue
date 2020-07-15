<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">

          <div class="modal-header">
            <slot name="header">
              default header
            </slot>
          </div>

          <div class="modal-body">
            <a href="#" @click="$emit('close')">Назад к списку</a>
            <slot name="body">
            </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              <button class="modal-default-button" @click="$emit('submit')">
                Сохранить
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'PersonEditModal',
}
</script>

<style scoped lang="scss">
  .modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: table;
    transition: opacity 0.3s ease;
  }

  .modal-wrapper {
    display: table-cell;
    vertical-align: middle;
  }

  .modal-container {
    width: 300px;
    margin: 0 auto;
    padding-bottom: 20px;
    background-color: #fff;
    border-radius: 3px;
    border-color: #999999;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all 0.3s ease;
    font-family: Helvetica, Arial, sans-serif;
    @media screen and (min-width: 321px){
      width: 95%;
    }
    @media screen and (min-width: 700px){
      width: 85%;
    }
    @media screen and (min-width: 900px){
      width: 75%;
    }
    @media screen and (min-width: 1000px){
      width: 70%;
    }
    @media screen and (min-width: 1100px){
      width: 740px;
    }
  }

  .modal-header {
    display: flex;
    align-items: center;
    padding: 10px;
    background-color: #999999;
    color: #ffffff;
    border-radius: 3px 3px 0 0;
    height: 40px;
    h3 {
      margin-top: 0;
      color: #42b983;
    }
  }

  .modal-body {
    margin: 10px 0;
    padding: 0 20px;

    a {
      display: block;
      font-size: 14px;
      margin-bottom: 10px;
    }
  }

  .modal-footer{
    display: flex;
    justify-content: flex-end;
    padding: 0 20px;

    .modal-default-button {
      width: 130px;
    }
  }

  .modal-enter {
    opacity: 0;
  }

  .modal-leave-active {
    opacity: 0;
  }

  .modal-enter .modal-container,
  .modal-leave-active .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }

</style>
