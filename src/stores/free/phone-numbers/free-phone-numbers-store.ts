import { defineStore } from 'pinia'

export interface PhoneNumber {
  phoneNumber: string
  activatedAt: string
}

export default defineStore('free/phone-numbers', () => {
  let phoneNumbers = $shallowRef<PhoneNumber[] | undefined>()

  async function loadPhoneNumbers() {
    type ResponseData = {
      numbers: {
        full_number: string
        data_humans: string
      }[]
    }

    const response = await fetch('https://onlinesim.ru/api/getFreePhoneList?lang=en')
    const responseData = await response.json() as ResponseData

    phoneNumbers = responseData.numbers.map(({
      full_number,
      data_humans,
    }) => ({
      phoneNumber: full_number,
      activatedAt: data_humans,
    }))
  }

  return $$({
    phoneNumbers,
    loadPhoneNumbers,
  })
})
