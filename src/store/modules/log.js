// import axios from 'axios'
import request from 'plato-request'
import { createAction, handleAction } from 'vuex-actions'
import { LOC_RES } from 'utils/config'
import {
  // PROMISE_SUCCESS,
  FETCH_LOG_LIST,
  DELETE_LOG,
} from '../constants'

const { base } = LOC_RES

const state = {
  logList: {
    time: null,
    items: []
  }
}

const getters = {
  logList: state => state.logList
}

const actions = {
  fetchLogList: createAction(FETCH_LOG_LIST, payload => {
    return request(`${base}/records`, {
      params: payload
    }).then(response => {
      return {
        count: 28,
        items: response
      }
    })
  }),
  deleteLog: createAction(DELETE_LOG, payload => {
    const { id } = payload
    return request(`${base}/records/${id}`, {
      method: 'delete'
    })
  })
/*  fetchLogList1 ({ commit }, {
    _page = 0,
    _limit = 10,
    user_id,
    day,
    category_id: categoryId
  }) {
    const query = {
      user_id,
      _page,
      _limit
    }
    if (day) {
      query.day = day
    }
    if (categoryId) {
      query['category_id'] = categoryId
    }
    commit(FETCH_LOG_LIST, axios.get(`${base}/records`, {
      params: query
    }))
    commit(FETCH_LOG_LIST, request(`${base}/records`, {
      query
    }))
    commit(FETCH_LOG_LIST, axios.get(`${base}/records`, {
      params: query
    }).then(response => {
      return {
        count: 27,
        logList: response.data
      }
    }))
    commit(FETCH_LOG_LIST, request(`${base}/records`, {
      params: query
    }).then(response => {
      return {
        count: 27,
        logList: response.data
      }
    }))
    commit(FETCH_LOG_LIST, axios.post(`${base}/faq`, {
      items: {
        'title': 'dzm2017',
        'content': 'dzm2017 for the world'
      }
    }))
  }*/
}

const mutations = {
  [FETCH_LOG_LIST]: handleAction({
    success: (state, mutation) => {
      state.logList = mutation
      state.logList.time = Date.now()
    },
    error: state => {
      state.logList.time = Date.now()
    }
  })
}

export default {
  state,
  getters,
  actions,
  mutations
}

