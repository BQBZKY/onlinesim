<script setup lang="ts">
import {watch} from 'vue'

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

    country,
  }) => ({
    phoneNumber: full_number,
    activatedAt: data_humans,

    callingCode: '+' + country,
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
    country,
    country_text,
  }) => ({
    country: country_text,
    callingCode: '+' + country,
  }))
}

async function getGroupedPhoneNumbers() {
  const [phoneNumbers, countries] = await Promise.all([
    getPhoneNumbers(),
    getCountries(),
  ])

  return countries.map((country) => ({
    ...country,
    phoneNumbers: phoneNumbers.filter((phoneNumber) => (
      phoneNumber.callingCode === country.callingCode
    ))
  }))
}

type PhoneNumberGroup = {
  country: string
  callingCode: string
  phoneNumbers: {
    phoneNumber: string
    activatedAt: string
  }[]
}

let groupedPhoneNumbers = $shallowRef<PhoneNumberGroup[] | undefined>()
let pickedPhoneNumber = $ref<string | undefined>()

async function getMessages(phoneNumberArg: string) {
  type ResponseData = {
    messages: {
      data: {
        text: string
        in_number: string
        data_humans: string
      }[]
    }
  }

  const {callingCode} = groupedPhoneNumbers?.find(({phoneNumbers}) => (
    phoneNumbers.some(({phoneNumber}) => (
      phoneNumber === phoneNumberArg
    ))
  ))!

  const response = await fetch('https://onlinesim.ru/api/getMessageList?lang=en'
    + `&country=${parseInt(callingCode)}`
      + `&phone=${phoneNumberArg.replace(callingCode, '')}`
  )

  const responseData = await response.json() as ResponseData

  return responseData.messages.data.map(({
    text,
    in_number,
    data_humans,
  }) => ({
    text: text.replace(/received from onlinesim.ru/i, '').trimEnd(),
    sender: in_number,
    recievedAt: data_humans,
  }))
}

type Message = {
  text: string
  sender: string
  recievedAt: string
}

let messages  = $ref<Message[] | undefined>()

getGroupedPhoneNumbers().then((response) => {
  groupedPhoneNumbers = response
})

watch($$(pickedPhoneNumber), () => {
  getMessages(pickedPhoneNumber!).then((response) => {
    messages = response
  })
})
</script>

<template>
  <div class="grid grid-cols-2 place-content-center">

    <template v-if="groupedPhoneNumbers">
      <div class="phone-number-list w-60">

        <!-- <div class="border-b-2 border-dashed"></div> -->

        <template v-for="group of groupedPhoneNumbers">
          <div class="phone-number-group">

            <div class="font-bold">{{group.country}}</div>

            <template v-for="{
              phoneNumber,
              activatedAt,
            } of group.phoneNumbers">
              <div
                class="phone-number-item w-full flex justify-between"
                @click="pickedPhoneNumber = phoneNumber"
               ><div>{{phoneNumber}}</div>
                <div>{{activatedAt}}</div>
              </div>
            </template>

          </div>
        </template>
      </div>
    </template>

    <div v-if="messages" class="message-list space-y-3">
      <template v-for="message of messages">
        <div class="message-item">

          <div class="w-full flex space-x-2">
            <div class="font-bold">{{message.sender}}</div>
            <div>{{message.recievedAt}}</div>
          </div>

          <div>{{message.text}}</div>

        </div>
      </template>
    </div>

  </div>
</template>
