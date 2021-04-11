<template>
  <transition
    appear
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
  >
    <div
      v-if="showNotificationsBanner && pushNotificationsSupported"
      class="banner-container"
    >
      <div class="constrain">
        <q-banner class="bg-grey-3">
          <div class="row items-center">
            <q-icon
              name="fas fa-bell"
              color="primary"
              size="sm"
              class="q-pr-md"
            />
            <span style="width: 70%">
              Gostaria de receber notificações sobre o status do rodízio?
            </span>
          </div>

          <template v-slot:action>
            <q-btn
              @click="enableNotifications"
              label="Sim"
              color="primary"
              class="q-px-sm"
              dense
              flat
            />
            <q-btn
              @click="showNotificationsBanner = false"
              label="Mais tarde"
              color="primary"
              class="q-px-sm"
              dense
              flat
            />
            <q-btn
              @click="neverShowNotificationsBanner"
              label="Nunca"
              color="primary"
              class="q-px-sm"
              dense
              flat
            />
          </template>
        </q-banner>
      </div>
    </div>
  </transition>
</template>
<script lang="ts">
// @ts-nocheck
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  name: "NotificationsBanner",
  data() {
    return {
      showNotificationsBanner: true
    };
  },
  computed: {
    serviceWorkerSupported() {
      if ("serviceWorker" in navigator) return true;
      return false;
    },
    pushNotificationsSupported() {
      if ("PushManager" in window) return true;
      return false;
    }
  },
  created() {
    this.initNotificationsBanner();
    // this.simulateNotification();
    this.scheduledNotification();
  },
  methods: {
    initNotificationsBanner() {
      let neverShowNotificationsBanner = this.$q.localStorage.getItem(
        "neverShowNotificationsBanner"
      );

      if (!neverShowNotificationsBanner) {
        this.showNotificationsBanner = true;
      }
    },
    enableNotifications() {
      if (this.pushNotificationsSupported) {
        Notification.requestPermission(result => {
          console.log("result: ", result);
          this.neverShowNotificationsBanner();
          if (result == "granted") {
            this.displayGrantedNotification();
          }
        });
      }
    },
    simulateNotification() {
      console.log("Init notification");
      new Notification("You're subscribed to notifications!", {
        body: "Thanks for subscribing!",
        // icon: "icons/icon-128x128.png",
        badge: "icons/icon-128x128.png",
        dir: "ltr",
        lang: "en-US",
        vibrate: [100, 50, 200],
        tag: "confirm-notification",
        renotify: true
      });

      console.log("end notification");
    },

    scheduledNotification() {
      console.log("Init scheduled notification");
      const createScheduledNotification = async (tag, title, timestamp) => {
        const registration = await navigator.serviceWorker.getRegistration();
        registration.showNotification(title, {
          tag: tag,
          body: "This notification was scheduled 30 seconds ago",
          showTrigger: new TimestampTrigger(timestamp + 30 * 1000)
        });
      };

      console.log("End scheduled notification");
    },
    displayGrantedNotification() {
      if (this.serviceWorkerSupported && this.pushNotificationsSupported) {
        navigator.serviceWorker.ready.then(swreg => {
          swreg.showNotification("You're subscribed to notifications!", {
            body: "Thanks for subscribing!",
            icon: "icons/icon-128x128.png",
            image: "icons/icon-128x128.png",
            badge: "icons/icon-128x128.png",
            dir: "ltr",
            lang: "en-US",
            vibrate: [100, 50, 200],
            tag: "confirm-notification",
            renotify: true,
            actions: [
              {
                action: "hello",
                title: "Hello",
                icon: "icons/icon-128x128.png"
              },
              {
                action: "goodbye",
                title: "Goodbye",
                icon: "icons/icon-128x128.png"
              }
            ]
          });
        });
      }
    },
    neverShowNotificationsBanner() {
      this.showNotificationsBanner = false;
      this.$q.localStorage.set("neverShowNotificationsBanner", true);
    }
  }
});
</script>
