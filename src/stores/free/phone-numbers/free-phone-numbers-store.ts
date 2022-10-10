import { defineStore } from 'pinia'
import Service from '@/services/free/phone-numbers'

interface PhoneNumber {
  phoneNumber: string
  activatedAt: string
}

interface PhoneNumberGroup {
  country: string
  countryCode: string
  callingCode: string
  phoneNumbers: PhoneNumber[]
}

export default defineStore('free/phone-numbers', () => {
  let phoneNumberGroups = $shallowRef<PhoneNumberGroup[] | undefined>()

  async function loadPhoneNumberGroups() {
    phoneNumberGroups = await Service.getPhoneNumberGroups()
  }

  return $$({
    phoneNumberGroups,
    loadPhoneNumberGroups,
  })
})
