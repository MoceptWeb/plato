import Vue from 'vue'
import CMessage from 'components/core/message'

const MessageConstructor = Vue.extend(CMessage)

const createMessage = options => {
  const vm = new MessageConstructor({
    data: options
  })

  vm.id = `message_${Date.now()}`
  vm.$mount()
  document.body.appendChild(vm.$el)
  vm.show = true

  setTimeout(() => {
    vm.show = false
  }, 1500)
}

const info = message => {
  createMessage({
    message,
    type: 'info'
  })
}

const error = message => {
  createMessage({
    message,
    type: 'error'
  })
}

const warn = message => {
  createMessage({
    message,
    type: 'warn'
  })
}

const success = message => {
  createMessage({
    message,
    type: 'success'
  })
}

export default {
  info,
  error,
  warn,
  success
}
