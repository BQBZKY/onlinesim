import { defineStore } from 'pinia'
import useFreePhoneNumbersStore from '../phone-numbers'

interface Message {
  message: string
  receivedAt: string
  receivedFrom: string
}

export default defineStore('free/messages', () => {
  let phoneNumberParam = $ref<string | undefined>()
  let messages = $shallowRef<Message[] | undefined>()

  async function loadMessages() {
    const { phoneNumbers, loadPhoneNumbers } = $(useFreePhoneNumbersStore())

    if (!phoneNumbers) await loadPhoneNumbers()

    const { phoneNumber, callingCode } = phoneNumbers!.find(
      ({ phoneNumber }) => phoneNumber === phoneNumberParam
    )!

    const params = {
      country: parseInt(callingCode).toString(),
      phone: phoneNumber.replace(callingCode, ''),
    }

    const url = 'https://onlinesim.ru/api/getFreeMessageList?lang=en'
      + `&country=${params.country}`
        + `&phone=${params.phone}`

    type ResponseData = {
      messages: {
        data: {
          text: string
          in_number: string
          data_humans: string
        }[]
      }
    }

    const response = await fetch(url)
    const responseData = await response.json() as ResponseData

    messages = responseData.messages.data.map(({
      text,
      in_number,
      data_humans,
    }) => ({
      message: text.replace(/received from onlinesim.ru/i, '').trimEnd(),
      receivedAt: data_humans,
      receivedFrom: in_number,
    }))
  }

  return $$({
    phoneNumberParam,
    messages,
    loadMessages,
  })
})
