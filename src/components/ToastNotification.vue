<template>
  <transition name="toast">
    <div class="toast-mask">
      <div class="toast-wrapper">
        <div id="toast" class="toast-container">
          <p>
            <slot name="message">
              default message
            </slot>
          </p>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ToastNotification',
  props: {
    bgColor: {
      type: String,
      default: 'info',
    },
  },
  data() {
    let bgType = '#c9e7fd'
    if (this.bgColor === 'error') {
      bgType = '#fedadc'
    } else if (this.bgColor === 'success') {
      bgType = '#d0eddd'
    }
    return {
      toastBgColor: bgType,
    }
  },
  mounted() {
    const toast = document.getElementById('toast')
    toast.style.backgroundColor = this.toastBgColor
  },
}
</script>

<style scoped lang="scss">
  .toast-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 70px;
    transition: opacity 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .toast-wrapper {
    display: flex;
    justify-content: center;
  }
  .toast-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 90vw;
    height: 50px;
    border-radius: 5px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all 0.3s ease;
    @media screen and (min-width: 430px){
      width: 400px;
    }
    p {
      margin: 0;
      padding: 0 10px;
      font-family: Roboto, sans-serif;
      font-style: normal;
      font-weight: bold;
      font-size: 14px;
      line-height: 150%;
      color: #292929;
    }
  }
  .toast-enter-active {
    opacity: 0;
  }
  .toast-leave-active {
    opacity: 0;
  }
  .toast-enter-active .toast-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }
  .toast-leave-active  .toast-container {
    -webkit-transform: scale(0);
    transform: scale(0);
  }
</style>
