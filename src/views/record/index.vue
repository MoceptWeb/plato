<template lang="html">
  <div class="home-content">
    <c-scroller
      :height="height"
      :threshold="threshold"
      @ready="scrollReady"
      @touchmove.native.prevent="touchMove"
      @touchend.native="touchEnd">
      <div
        class="record"
        ref="list">
        <c-loading v-if="fetchLog"></c-loading>
        <div class="no-data" v-if="!fetchLog && items.length === 0">
          <img src="images/no-data.png" :alt="__('无数据')" />
          <p class="no-data-prompt">{{!isOwn ? __('咦，TA 什么都没有。') : __('咦，什么都没有。赶快运动起来吧！')}}</p>
        </div>
        <ul class="date-group" v-if="!fetchLog">
          <li v-for="(items, date) in logs" class="group-item">
            <p class="record-date">{{date | formatDate}}</p>
            <ul class="record-list">
              <record-item
                v-for="item in items"
                :id="item.id"
                :disabled="(deleteId && deleteId !== item.id)"
                :done="deleteDone && deleteId === item.id"
                @click.native="_golog(item['id'])"
                @change="triggerMove"
                @delete="delRecord">
                <div class="record-icon">
                    <c-icon cls='icon'>{{item.category && item.category.icon}}</c-icon>
                    <p class="sport-name">{{item.category && __(item.category.name)}}</p>
                </div>
                <div class="record-info">
                  <ul class="record-data">
                    <li v-for="unitItem in item.unitItems" class="data-item">
                      <span class="data-value">{{unitItem | formatNum}}</span>
                      <span class="data-unit" v-if="showUnit(unitItem.unit)">{{__(unitItem.unitLabel)}}</span>
                    </li>
                  </ul>
                  <div v-if="item.remark" class="record-remark">{{item.remark}}</div>
                </div>
                <div class="record-award">
                  <div class="record-award-content">
                    <div class="appraise" v-if="item.appraise">
                      <span>{{item.appraise}}</span>
                      <c-icon cls="ribbon"></c-icon>
                    </div>
                    <div class="recorderInfo">
<!--                      <img class="userImg" :src="avatar(item.recorder)" @error="avatarLoadError"/>
                      <span>{{formatUser(item.recorder)}}{{__('记录')}}</span>-->
                    </div>
                  </div>
                </div>
              </record-item>
            </ul>
          </li>
        </ul>
      </div>
      <div class="scroll-footer" slot="footer" v-if="showMore">
        <div class="fetch-more" v-if="!noMore">
          <c-loading></c-loading>
          <p>{{fetchMore ? __('正在加载') : __('松开加载更多')}}</p>
        </div>
        <div class="no-more" v-else>
          <p>{{__('没有更多了')}}</p>
        </div>
      </div>
    </c-scroller>
  </div>
</template>

<script>
import CRow from 'components/core/row'
import CLoading from 'components/core/loading'
import CIcon from 'components/core/icon'
import RecordItem from 'components/service/record-item'
import CScroller from 'components/core/iscroller'
import { mapActions, mapGetters } from 'vuex'
import datetime from 'nd-datetime'
import { UNITS } from 'utils/config'
import { formatLog, setTimeByUnit } from 'utils/helpers'

export default {
  data () {
    return {
      userId: this.$route.params.userId,
      fetchLog: true,
      firstLoad: true,
      showMore: false,
      noMore: false,
      fetchMore: false,
      _page: 0,
      _limit: 10,
      items: [],
      isOwn: !this.$route.params.userId,
      deleteDone: false,
      deleteId: undefined,
      threshold: 200
    }
  },

  created () {
    this.reset()
  },
  beforeDestroy () {
  },
  computed: {
    ...mapGetters(['logList', 'logInfo']),
    logs () {
      return formatLog(this.items)
    },
    height () {
      return document.querySelector('#content').clientHeight
    }
  },
  watch: {
    'logList' (newVal, oldVal) {
      this.fetchLog = false
      this.loading = false
      if (this.items.length === 0) {
        this.noData = true
      }
      this.items = !this.firstLoad ? this.items.concat(newVal.items) : newVal.items
      if (this.items.length === newVal.count && newVal.count !== 0) {
        this.noMore = true
        this.showMore = true
      }
      this.firstLoad = false
    },
    'logInfo.time' () {
      const _this = this
      if (_this.logInfo.delete) {
        const deleteId = _this.deleteId
        _this.deleteDone = true
        setTimeout(() => {
          _this.items = _this.items.filter(item => {
            return item.id !== deleteId
          })
          _this.deleteDone = false
          _this.deleteId = undefined
          if (_this.items.length === 0) {
            _this.reset()
          }
        }, 1000)
      }
    }
  },
  methods: {
    ...mapActions(['fetchLogList', 'deleteLog']),
    _golog (id) {
      this.$router.push(`/records/${id}`)
    },
    delRecord (id) {
      this.deleteId = id
      this.deleteLog({
        id
      })
    },
    reset () {
      if (!this.logList.count) {
        this.fetchLog = true
      } else {
        this.items = this.logList.items
      }
      this.firstLoad = true
      this.fetchLogList({
        user_id: this.userId
      })
    },
    showUnit (unit) {
      const { SECOND, MINUTE, HOUR } = UNITS
      switch (unit) {
        case SECOND:
        case MINUTE:
        case HOUR:
          return false
        default:
          return true
      }
    },
    scrollReady (scroller) {
      this.scroller = scroller
    },
    touchMove () {
      const { threshold, scroller } = this
      const { y, maxScrollY } = scroller
      if (y <= maxScrollY - threshold) {
        this.showMore = true
      }
    },
    touchEnd () {
      if (this.showMore && !this.noMore && !this.fetchMore) {
        this.offset = this.offset + this.limit
        this.fetchMore = true
        setTimeout(() => {
          this.reqId = Date.now()
          this.fetchLogList({
            user_id: this.userId,
            _limit: this.offset
          })
        }, 500)
      }
    },
    triggerMove (id, offset) {
      if (Math.abs(offset) === 200) {
        this.deleteId = id
      } else {
        this.deleteId = undefined
      }
    }
  },
  filters: {
    formatDate (date) {
      if (datetime(date).yyyy() !== datetime(Date.now()).yyyy()) {
        return datetime(date).format(this ? this.__('yyyy年MM月dd日') : 'yyyy年MM月dd日')
      }
      return datetime(date).format(this ? this.__('MM月dd日') : 'MM月dd日')
    },
    formatNum ({ unit, number }) {
      return setTimeByUnit(number, unit)
    }
  },
  components: {
    CRow,
    CIcon,
    CLoading,
    RecordItem,
    CScroller
  }
}
</script>

<style src="styles/views/record"></style>
