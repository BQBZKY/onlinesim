import { findCountryCode } from '@/utils'

export default class FreePhoneNumbersService {
  static getPhoneNumbers() { return getPhoneNumbers() }
  static getPhoneNumberGroups() { return getPhoneNumberGroups() }
}

async function getPhoneNumberGroups() {
  const [countries, phoneNumbers] = await Promise.all([
    getCountries(),
    getPhoneNumbers()
  ])

  return countries.map((country) => ({
    ...country,
    phoneNumbers: phoneNumbers.filter((phoneNumber) => (
      phoneNumber.callingCode = country.callingCode
    ))
  }))
}

async function getPhoneNumbers() {
  type ResponseData = {
    numbers: {
      full_number: string
      data_humans: string
      country: number
    }[]
  }

  const response = await fetch('https://onlinesim.ru/api/getFreePhoneList?lang=en')
  const responseData = await response.json() as ResponseData

  return responseData.numbers.map(({
    full_number,
    data_humans,
    country: codeInt,
  }) => ({
    phoneNumber: full_number,
    activatedAt: data_humans,
    callingCode: `+${codeInt}`
  }))
}

async function getCountries() {
  type ResponseData = {
    countries: {
      country: number
      country_text: string
    }[]
  }

  const response = await fetch('https://onlinesim.ru/api/getFreeCountryList?lang=en')
  const responseData = await response.json() as ResponseData

  return responseData.countries.map(({
    country:  callingCode,
    country_text: country,
  }) => ({
    country,
    countryCode: findCountryCode(country)!,
    callingCode: '+' + callingCode,
  }))
}

