<template>
  <i class="c-icon" :class="cls" v-html="html"><slot></slot></i>
</template>

<script>
import entities from './assets/icon-entities'

export default {
  props: {
    cls: {
      type: [String, Array],
      default: ''
    }
  },
  data () {
    return {
      html: ' '
    }
  },

  beforeMount () {
    this.html = this.$slots.default && entities[this.$slots.default[0].text] || ' '
  },

  beforeUpdate () {
    this.html = this.$slots.default && entities[this.$slots.default[0].text] || ' '
  }
}

</script>

<style src="styles/components/core/icon"></style>
