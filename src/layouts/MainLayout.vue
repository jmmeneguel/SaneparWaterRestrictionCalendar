<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white">
      <transition
        appear
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
      >
        <div v-if="showAppInstallBanner" class="banner-container bg-primary">
          <div class="constrain">
            <q-banner class="bg-primary text-white" dense>
              <q-icon
                name="fas fa-tint"
                size="xxs"
                color="white"
                class="q-pa-sm"
              />

              <b>Instalar aplicativo?</b>

              <template v-slot:action>
                <q-btn
                  @click="installApp"
                  label="Sim"
                  class="q-px-sm"
                  dense
                  flat
                />
                <q-btn
                  @click="showAppInstallBanner = false"
                  label="Mais tarde"
                  class="q-px-sm"
                  dense
                  flat
                />
                <q-btn
                  @click="neverShowAppInstallBanner"
                  label="Nunca"
                  class="q-px-sm"
                  dense
                  flat
                />
              </template>
            </q-banner>
          </div>
        </div>
      </transition>
    </q-footer>
  </q-layout>
</template>

<script>
let deferredPrompt;

export default {
  data() {
    return {
      showAppInstallBanner: false
    };
  },
  methods: {
    installApp() {
      // Hide the app provided install promotion
      this.showAppInstallBanner = false;
      // Show the install prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then(choiceResult => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
          this.neverShowAppInstallBanner();
        } else {
          console.log("User dismissed the install prompt");
        }
      });
    },
    neverShowAppInstallBanner() {
      this.showAppInstallBanner = false;
      this.$q.localStorage.set("neverShowAppInstallBanner", true);
    }
  },
  mounted() {
    let neverShowAppInstallBanner = this.$q.localStorage.getItem(
      "neverShowAppInstallBanner"
    );
    if (!neverShowAppInstallBanner) {
      window.addEventListener("beforeinstallprompt", e => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        // Update UI notify the user they can install the PWA
        setTimeout(() => {
          this.showAppInstallBanner = true;
        }, 3000);
      });
    }
  }
};
</script>
