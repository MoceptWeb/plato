<template lang="html">
<!--https://github.com/cubiq/iscroll-->
  <div class="scroll-wrapper" :style="style">
    <div class="scroll-container">
      <slot name="header"></slot>
      <slot class="slot-container"></slot>
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
import IScroll from 'iscroll'
export default {
  props: {
    height: {
      type: Number,
      default: document.body.clientHeight
    },
    width: {
      type: Number,
      default: document.body.clientWidth
    },
    options: {
      type: Object,
      default: () => ({
        click: true
      })
    },
    threshold: {
      type: Number,
      default: 200
    },
    horizontal: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    style () {
      if (this.horizontal) {
        return {
          width: `${this.width}px`
        }
      }
      return {
        height: `${this.height}px`
      }
    }
  },
  watch: {
    height () {
      this.refresh()
    },
    width () {
      this.refresh()
    }
  },
  mounted () {
    this.initial()
  },
  updated () {
    this.refresh()
  },
  beforeDestroy () {
    this.scroller.destroy()
    this.$emit('destroy')
  },
  methods: {
    // scrollMove (e) {
    //   const { threshold, scroller } = this
    //   const { x, y, maxScrollY, maxScrollX, options } = scroller
    //   const { startX, startY } = options
    //   // console.log(scroller)
    //   // console.log(threshold)
    //   // console.log(x)
    //   // console.log(y)
    //   // console.log(startX)
    //   // console.log(startY)
    //   // console.log(maxScrollX)
    //   // console.log(maxScrollY)
    //   // console.log('---------------------------')
    //   if (y > (startY + threshold) || x < startX - threshold) {
    //     this.$emit('scrollTop')
    //   } else if (y < maxScrollY - threshold || x > maxScrollX + threshold) {
    //     this.$emit('scrollBottom')
    //   }
    // },
    initial () {
      this.scroller = new IScroll(this.$el, this.options)
      this.$emit('ready', this.scroller, IScroll)
    },
    refresh () {
      this.scroller && this.scroller.refresh()
      this.$emit('updated', this.scroller, IScroll)
    }
  },
  components: {}
}
</script>

<style lang="css">
.scroll-wrapper {
  position: relative;
}

.scroll-container {
  height: auto;
  width: auto;
}
</style>

