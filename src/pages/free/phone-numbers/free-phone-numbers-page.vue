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

import useStore from '@/stores/free/phone-numbers'

const { phoneNumbers, loadPhoneNumbers } = $(useStore())

loadPhoneNumbers()
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
          <IonItem :routerLink="`/free/messages/${phoneNumber}`">
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
