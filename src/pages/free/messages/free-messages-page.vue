<script setup lang="ts">
import {
  IonPage,
  IonTitle,
  IonHeader,
  IonToolbar,
  IonContent,
  IonList,
  IonItem,

  IonRefresher,
  IonRefresherContent,
  type RefresherCustomEvent,

  IonInfiniteScroll,
  IonInfiniteScrollContent,
  type InfiniteScrollCustomEvent,
} from '@ionic/vue'

import { useRoute } from 'vue-router'
import useStore from '@/stores/free/messages'

const store = useStore()
const route = useRoute()

let { phoneNumberParam } = $(store)

phoneNumberParam = route.params.phoneNumber as string

const {
  messages,
  cursor,
  loadMessages,
  loadMoreMessages
} = $(store)

loadMessages()

let enabledInfiniteScroll = $ref(true)

async function handleRefresher(event: RefresherCustomEvent) {
  await loadMessages()
  event.target.complete()
}

async function handleInfiniteScroll(event: InfiniteScrollCustomEvent) {
  await loadMoreMessages()
  event.target.complete()

  if (cursor === 0) enabledInfiniteScroll = false
}
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
      <IonRefresher slot="fixed" @ionRefresh="handleRefresher">
        <IonRefresherContent />
      </IonRefresher>

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

      <IonInfiniteScroll
        :disabled="!enabledInfiniteScroll"
        @ionInfinite="handleInfiniteScroll">
        <IonInfiniteScrollContent />
      </IonInfiniteScroll>
    </IonContent>
  </IonPage>
</template>
