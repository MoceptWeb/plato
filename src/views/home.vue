<template>
  <div class="v-home">
    <c-modal
      :show="show_modal"
      @cancel="callback('cancel')"
      @submit="callback('submit')">{{ __('views.home.confirm') }}</c-modal>
    <c-scroller
      :transition="transition"
      :height="height"
      :loading="faq_is_fetching"
      :drained="drained"
      @pulldown="faqList">
      <c-row
        v-for="item in faq_items"
        :key="item.id"
        :flex="true">
        <c-swiper>
          <c-button
            slot="left"
            class="primary squared">{{ __('views.home.nothing') }}</c-button>
          <article class="padding">
            <h3>{{ item.title }}</h3>
            <p>{{ item.content }}</p>
          </article>
          <c-button
            slot="right"
            v-if="authorized"
            class="warning squared"
            v-tap @tap.native="_delete(item.id)">{{ __('views.home.delete') }}</c-button>
        </c-swiper>
      </c-row>
    </c-scroller>
  </div>
</template>

<script>
import CModal from 'components/core/modal'
import CScroller from 'components/core/scroller'
import CSpinner from 'components/core/spinner'
import CRow from 'components/core/row'
import CSwiper from 'components/core/swiper'
import CButton from 'components/core/button'
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      show_modal: false,
      drained: true,
      height: 0,
      id: 0
    }
  },

  computed: mapGetters(['transition', 'authorized', 'faq_items', 'faq_is_fetching']),

  created () {
    this.faqList()
  },

  mounted () {
    this.height =
      document.documentElement.clientHeight -
      document.getElementById('header').clientHeight
    this.addToast('Pull down to reload')
    this.addToast('Swiper left/right to show buttons')
  },

  methods: {
    _delete (id) {
      this.id = id
      this.show_modal = true
    },
    callback (key) {
      this.show_modal = false
      if (key === 'submit') {
        this.faqDelete(this.id)
      }
      delete this.id
    },
    ...mapActions(['faqList', 'faqDelete', 'addToast'])
  },

  components: {
    CModal,
    CScroller,
    CSpinner,
    CRow,
    CSwiper,
    CButton
  }
}
</script>

<style src="styles/views/home"></style>
