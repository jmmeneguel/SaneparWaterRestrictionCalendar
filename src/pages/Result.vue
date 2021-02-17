<template>
  <div class="column window-height justify-center">
    <!-- <NotificationsBanner class="col" style="max-height: 200px"/> -->
    <div class="col-auto window-width column justify-center items-center q-ma-lg">
      <q-card class="q-mb-lg" style="width: 50%; min-width: 300px">
        <q-card-section>
          <div class="text-h6">Rodízio Sanepar</div>
          <div class="text-subtitle2 text-grey-9">{{ address }}</div>
        </q-card-section>

        <q-tabs v-model="tab" class="text-teal">
          <q-tab label="Status" name="status" class="text-grey-9" />
          <q-tab label="Calendário" name="calendar" class="text-grey-9" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel
            name="status"
            :class="onRestriction ? 'bg-red-9' : 'bg-green-9'"
          >
            <q-card-section class="row items-center">
              <q-icon
                :name="onRestriction ? 'fas fa-tint-slash' : 'fas fa-tint'"
                size="sm"
                color="white"
                class="q-pa-sm"
              />
              <span class="text-h6 text-white">{{ statusString }}</span>
            </q-card-section>

            <q-separator dark inset />

            <q-card-section>
              <div class="q-pb-sm text-white">
                {{ nextChange }}
              </div>
              <div class="text-white">
                {{ relativeTime }}
              </div>
            </q-card-section>
          </q-tab-panel>

          <q-tab-panel name="calendar">
            <Calendar v-bind:data="allWRStatus" />
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
      <q-btn flat label="Mudar endereço" @click="changeAddress" />
    </div>
  </div>
</template>
<script lang="ts">
// @ts-nocheck
import { defineComponent } from "@vue/composition-api";
import { waterRestrictionType } from "../Sanepar/main";
import moment from "moment";
import Calendar from "../components/Calendar.vue";
// import NotificationsBanner from "../components/NotificationsBanner.vue";

export default defineComponent({
  name: "Result",
  components: { Calendar },
  data() {
    const data: {
      onRestriction: boolean | null;
      currentWRStatus: waterRestrictionType | undefined;
      allWRStatus: waterRestrictionType[];
      tab: string;
      address: string;
    } = {
      onRestriction: null,
      currentWRStatus: undefined,
      allWRStatus: [],
      tab: "status",
      address: ""
    };
    return data;
  },
  async created() {
    const wrDataUpdate = () => {
      this.allWRStatus = JSON.parse(localStorage.waterRestrictionData);
      const currentWRStatus = <waterRestrictionType>this.allWRStatus[0];
      this.onRestriction =
        new Date() > new Date(currentWRStatus.attributes.INICIO);
      this.currentWRStatus = <waterRestrictionType>currentWRStatus;
    };

    wrDataUpdate();
    this.address = localStorage.address;
    this.$root.$on("wrDataUpdate", wrDataUpdate);
  },
  methods: {
    changeAddress() {
      localStorage.clear();
      this.$router.push("/");
    }
  },
  computed: {
    statusString: function() {
      return this.onRestriction
        ? "Abastecimento interrompido"
        : "Abastecimento normalizado";
    },
    nextChange: function() {
      const timestamp = this.onRestriction
        ? this.currentWRStatus.attributes.NORMALIZACAO
        : this.currentWRStatus.attributes.INICIO;
      const baseText = this.onRestriction
        ? "Previsão de normalização: "
        : "Previsão de interrupção: ";
      const timeText = moment(timestamp).format("DD/MM [às] HH:mm");
      return baseText + timeText;
    },
    relativeTime: function() {
      moment.locale("pt-br");
      const timestamp = this.onRestriction
        ? this.currentWRStatus.attributes.NORMALIZACAO
        : this.currentWRStatus.attributes.INICIO;
      const baseText = this.onRestriction ? "Normalização " : "Interrupção ";
      return baseText + moment(timestamp).fromNow();
    }
  }
});
</script>
