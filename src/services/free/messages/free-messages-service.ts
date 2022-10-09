import FreePhoneNumbersService from '../phone-numbers'

export default class FreeMessagesService {
  static getMessages(freePhoneNumber: string) { return getFreeMessages(freePhoneNumber) }
}

async function getFreeMessages(phoneNumberArg: string) {
  const { phoneNumber, callingCode } =

    await FreePhoneNumbersService.getPhoneNumbers().then(
      phoneNumbers => phoneNumbers!.find(
        ({ phoneNumber }) => phoneNumber === phoneNumberArg
      )!
    )

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

  return responseData.messages.data.map(({
    text,
    in_number,
    data_humans,
  }) => ({
    message: text.replace(/received from onlinesim.ru/i, '').trimEnd(),
    receivedAt: data_humans,
    receivedFrom: in_number,
  }))
}
