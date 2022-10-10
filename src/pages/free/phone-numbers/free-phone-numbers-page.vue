<script setup lang="ts">
import {
  IonPage,
  IonTitle,
  IonHeader,
  IonToolbar,
  IonContent,

  IonList,
  IonItem,
  IonAccordion,
  IonAccordionGroup
} from '@ionic/vue'

import useStore from '@/stores/free/phone-numbers'

const { phoneNumberGroups, loadPhoneNumberGroups } = $(useStore())

loadPhoneNumberGroups()
</script>

<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle> Free Phone Numbers </IonTitle>
      </IonToolbar>
    </IonHeader>

    <IonContent>
      <template v-if="phoneNumberGroups">
        <IonAccordionGroup expand="inset">
          <template v-for="{
            country,
            countryCode,
            callingCode,
            phoneNumbers,
          } of phoneNumberGroups">
            <IonAccordion >
              <IonItem slot="header">
                <div class="w-full flex items-center space-x-3">
                  <img class="w-8 h-6 rounded shadow"
                    :src="`/flags/4x3/${countryCode.toLowerCase()}.svg`" />
                  <div class="">{{ country }}</div>
                  <div class="text-sm text-gray-500">{{ callingCode }}</div>
                </div>
              </IonItem>

              <IonList slot="content">
                <template v-for="{
                  phoneNumber,
                  activatedAt
                } of phoneNumbers">
                  <IonItem :routerLink="`/free/messages/${phoneNumber}`">
                    <div class="w-full flex justify-between">
                      <div>{{ phoneNumber }}</div>
                      <div>{{ activatedAt }}</div>
                    </div>
                  </IonItem>
                </template>
              </IonList>
            </IonAccordion>
          </template>
        </IonAccordionGroup>
      </template>
    </IonContent>
  </IonPage>
</template>
