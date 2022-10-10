import { defineStore } from 'pinia'
import Service from '@/services/free/messages'

interface Message {
  id: number
  message: string
  receivedAt: string
  receivedFrom: string
}

export default defineStore('free/messages', () => {
  let phoneNumberParam = $ref<string | undefined>()
  let messages = $shallowRef<Message[] | undefined>()
  const cursor = $computed(() => (
    messages && messages.at(-1)!.id - 1
  ))

  async function loadMessages() {
    messages = await Service.getMessages(phoneNumberParam!)
  }

  async function loadMoreMessages() {
    const moreMessages = await Service.getMessages(phoneNumberParam!, { cursor })

    messages = [...messages!, ...moreMessages]
  }

  return $$({
    phoneNumberParam,
    messages,
    cursor,
    loadMessages,
    loadMoreMessages,
  })
})
