import { defineStore } from 'pinia'
import Service from '@/services/free/phone-numbers'

interface PhoneNumber {
  phoneNumber: string
  callingCode: string
  activatedAt: string
}

export default defineStore('free/phone-numbers', () => {
  let phoneNumbers = $shallowRef<PhoneNumber[] | undefined>()

  async function loadPhoneNumbers() {
    phoneNumbers = await Service.getPhoneNumbers()
  }

  return $$({
    phoneNumbers,
    loadPhoneNumbers,
  })
})
