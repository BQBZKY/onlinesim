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

import { useRoute } from 'vue-router'
import useStore from '@/stores/free/messages'

const store = useStore()
const route = useRoute()

let { phoneNumberParam } = $(store)

phoneNumberParam = route.params.phoneNumber as string

const { messages, loadMessages } = $(store)

loadMessages()
</script>

<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>
          {{ phoneNumberParam }}
        </IonTitle>
      </IonToolbar>
    </IonHeader>

    <IonContent>
      <IonList v-if="messages">
        <IonItem v-for="{
          message,
          receivedAt,
          receivedFrom
        } of messages">
          <div class="w-full">
            <div class="flex justify-between">
              <div>{{ receivedFrom }}</div>
              <div>{{ receivedAt }}</div>
            </div>
            <div>{{ message }}</div>
          </div>
        </IonItem>
      </IonList>
    </IonContent>
  </IonPage>
</template>
