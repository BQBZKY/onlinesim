export default class FreePhoneNumbersService {
  static getPhoneNumbers() { return getFreePhoneNumbers() }
}

async function getFreePhoneNumbers() {
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
