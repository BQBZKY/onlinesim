import { range } from 'lodash'
import FreePhoneNumbersService from '../phone-numbers'

interface PaginationOptions {
  cursor?: number
  // limit?: number
}

export default class FreeMessagesService {
  static getMessages(
    freePhoneNumber: string,
    paginationOptions?: PaginationOptions,
  ) {
    return getFreeMessages(freePhoneNumber, paginationOptions)
  }
}

type RequestParams = {
  country: number
  phone: number
  page?: number
}

type ResponseData = {
  messages: {
    from: number
    // to: number
    total: number

    data: {
      text: string
      in_number: string
      data_humans: string
    }[]
  }
}

async function getFreeMessages(phoneNumber: string, {
  cursor,
  // limit = 50
}: PaginationOptions = {}) {
  const params = await resolveRequestParams(phoneNumber)
  const firstResponse = await request(params)

  const messages = []

  const LIMIT = 50
  const PER_PAGE = 10

  const { total } = parseInfo(firstResponse)

  let start = 0
  let end = LIMIT

  if (cursor) {
    start = total - cursor
    end = start + LIMIT

    if (end > total) {
      end = total
    }
  }

  let startPage = Math.ceil((start + 1) / PER_PAGE)
  const endPage = Math.ceil((end + 1) / PER_PAGE)

  if (startPage === 1) {
    startPage += 1

    const firstMessages = parseMessages(firstResponse)
    messages.push(...firstMessages)
  }

  const pages = range(startPage, endPage)
  const requests = pages.map(page => request({ ...params, page }))
  const responses = await Promise.all(requests)

  const moreMessages = responses.map(parseMessages).flat()
  messages.push(...moreMessages)

  return messages
}

async function resolveRequestParams(phoneNumberArg: string) {
  const phoneNumbers = await FreePhoneNumbersService.getPhoneNumbers()

  const { phoneNumber, callingCode } = phoneNumbers!.find(
    ({ phoneNumber }) => phoneNumber === phoneNumberArg
  )!

  const withoutCode = phoneNumber.replace(callingCode, '')

  return {
    country: parseInt(callingCode),
    phone: parseInt(withoutCode),
  }
}

async function request(params: RequestParams) {
  const url = new URL('https://onlinesim.ru/api/getFreeMessageList?lang=en')

  for (const key in params) {
    url.searchParams.set(key, params[key as keyof typeof params]!.toString())
  }

  const response = await fetch(url)
  const responseData = await response.json() as ResponseData

  return responseData
}

function parseInfo(data: ResponseData) {
  return {
    total: data.messages.total,
    offset: data.messages.from +1,
  }
}

function parseMessages(data: ResponseData) {
  const { total, offset } = parseInfo(data)

  let id = total - offset

  return data.messages.data.map(({
    text,
    in_number,
    data_humans,
  }) => ({
    id: id--,
    message: text.replace(/received from onlinesim.ru/i, '').trimEnd(),
    receivedAt: data_humans,
    receivedFrom: in_number,
  }))
}
