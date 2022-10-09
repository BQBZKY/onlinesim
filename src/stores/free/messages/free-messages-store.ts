import { defineStore } from 'pinia'
import Service from '@/services/free/messages'

interface Message {
  message: string
  receivedAt: string
  receivedFrom: string
}

export default defineStore('free/messages', () => {
  let phoneNumberParam = $ref<string | undefined>()
  let messages = $shallowRef<Message[] | undefined>()

  async function loadMessages() {
    messages = await Service.getMessages(phoneNumberParam!)
  }

  return $$({
    phoneNumberParam,
    messages,
    loadMessages,
  })
})
