<template>
  <transition name="slide">
    <div
      :class="['c-message', cls]"
      :key="id"
      v-if="show">
      <span class="message">{{message}}</span>
    </div>
  </transition>
</template>

<script>
export default {
  data () {
    return {
      message: '',
      type: '',
      show: false,
      id: ''
    }
  },
  computed: {
    cls () {
      return `c-message-${this.type}`
    }
  }
}
</script>
<style lang="postcss">
.c-message {
  position: fixed;
  z-index: 10001;
  top: 2rem;
  left: 0;
  right: 0;
  margin: 0 auto;
  max-width: 50%;
  padding: 0.5rem;
  line-height: 1.2rem;
  text-align: center;
  border-radius: 0.6rem;
  background: #20A0FF;
  opacity: 0.5;

  & .message {
    max-height: 16rem;
    overflow-wrap: break-word;
    color: #fff;
    font-size: 0.8rem;
  }

  &-success {
    background-color: #13CE66;
  }

  &-error {
    background-color: #FF4949;
  }

  &-warn {
    background-color: #F7BA2A;
  }
}

</style>
