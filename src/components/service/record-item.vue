<template lang="html">
  <div
    class="record-item"
    @touchstart="dragStart(id, $event)"
    @touchmove="dragMove(id, $event)"
    @touchend="dragEnd(id, $event)"
    :data-id="id">
    <div :style="style" :class="['slot-container', {animation}]">
      <slot></slot>
    </div>
    <div
      v-show="offset !== 0"
      :class="['delete', {posting}, {animation}, {done}]"
      @click.stop.prevent="clickDelete(id)">
      <span>
        <c-loading v-if="posting"></c-loading>
        <span v-else>{{deleteDone ? __('已删除') : __('删除')}}</span>
      </span>
    </div>
  </div>
</template>

<script>
import CLoading from 'components/core/loading'
import { getNetStatus } from 'utils/helpers'
import message from 'utils/message'
export default {
  props: {
    id: {
      type: null,
      default: ''
    },
    done: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      deleteDone: false,
      animation: false,
      offset: 0,
      posting: false,
      scrollOffset: 0
    }
  },
  computed: {
    style () {
      return {
        transform: `translateX(${this.offset}px)`
      }
    }
  },
  watch: {
    done (val) {
      this.reset()
    },
    offset (val) {
      this.$emit('change', this.id, val)
    }
  },
  methods: {
    dragStart (id, e) {
      if (this.posting || this.disabled) {
        return false
      }
      if (!getNetStatus()) {
        message.info(this.__('网络异常'))
        return false
      }
      this.deleteDone = false
      this.animation = false
      const { touches = [] } = e
      this.startX = touches[0].clientX
      this.startY = touches[0].clientY
      this.target = e.currentTarget
    },
    dragMove (id, e) {
      const { touches = [] } = e
      this.endX = touches[0].clientX
      this.endY = touches[0].clientY
      const { startX, endX, startY, endY } = this
      this.draging = startX && startY && !this.posting && Math.abs(endX.toFixed() - startX.toFixed()) > 5 && (Math.abs(endX.toFixed() - startX.toFixed()) > Math.abs(endY.toFixed() - startY.toFixed()))
      if (!this.draging) {
        // this.startX = undefined
        // this.startY = undefined
        this.endX = undefined
        this.endY = undefined
        this.offset = 0
        this.scrollOffset = this.offset
        this.animation = true
        return
      } else {
        e.preventDefault()
        e.stopPropagation()
      }
      // if (Math.abs(endY - startY) > 30) {
      //   this.startX = undefined
      //   this.startY = undefined
      //   this.endX = undefined
      //   this.endY = undefined
      //   this.offset = 0
      //   this.scrollOffset = this.offset
      //   this.animation = true
      //   return
      // }
      let offset
      if (Math.abs(endX - startX) < 10) {
        offset = this.scrollOffset
      } else {
        offset = endX - startX + this.scrollOffset
      }
      if (offset < -200) {
        offset = -200
      }

      if (offset > 0) {
        offset = 0
      }
      this.offset = offset
    },
    dragEnd (id, e) {
      if (!this.draging) {
        return
      } else {
        e.preventDefault()
        e.stopPropagation()
      }
      if (this.offset > -200) {
        this.offset = 0
        this.animation = true
      }
      this.scrollOffset = this.offset
      this.startX = undefined
      this.startY = undefined
      this.endX = undefined
      this.endY = undefined
      this.draging = false
    },
    reset () {
      this.posting = false
      this.deleteDone = true
      setTimeout(() => {
        this.offset = 0
        this.animation = true
      }, 500)
    },
    clickDelete (id) {
      this.posting = true
      this.$emit('delete', id)
    }
  },
  components: {
    CLoading
  }
}
</script>

<style lang="css">
.record-item {
  position: relative;

  & .slot-container {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    z-index: 2;
    box-sizing: border-box;
    background-color: #fff;
  }
}

.animation {
  transition: all 0.3s linear;
}

.delete {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: dpr(200px);
  height: 100%;
  background-color: #ff4949;
  color: #fff;
  transition: all 0.3s ease;

  &.done {
    background-color: #13ce66;
  }

  &.posting {
    background-color: #38adff;

    & .c-loading {
      border-color: #fff;
      background-color: transparent;
      margin: 0;
    }
  }
}
</style>
