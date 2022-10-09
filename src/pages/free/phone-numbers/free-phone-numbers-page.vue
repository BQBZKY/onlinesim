<script setup lang="ts">
import {
  IonPage,
  IonTitle,
  IonHeader,
  IonToolbar,
  IonContent,
  IonList,
  IonItem,
} from '@ionic/vue'

interface PhoneNumber {
  phoneNumber: string
  activatedAt: string
}

let phoneNumbers = $shallowRef<PhoneNumber[] | undefined>()

async function fetchPhoneNumbers() {
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

fetchPhoneNumbers()
</script>

<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle> Free Phone Numbers </IonTitle>
      </IonToolbar>
    </IonHeader>

    <IonContent>
      <IonList v-if="phoneNumbers">
        <template v-for="{
          phoneNumber,
          activatedAt
        } of phoneNumbers">
          <IonItem>
            <div class="w-full flex justify-between">
              <div>{{ phoneNumber }}</div>
              <div>{{ activatedAt }}</div>
            </div>
          </IonItem>
        </template>
      </IonList>
    </IonContent>
  </IonPage>
</template>
