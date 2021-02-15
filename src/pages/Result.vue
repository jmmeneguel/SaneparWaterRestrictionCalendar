<template>
  <q-page class="q-pa-md row justify-center items-center">
    <div class="column items-center">
      <div class="col q-pb-lg">
        <q-card dark bordered :class="onRestriction ? 'bg-red-9' : 'bg-green-9'" color="primary">
          <q-card-section>
            <div class="text-h6">{{ statusString }}</div>
          </q-card-section>

          <q-separator dark inset />

          <q-card-section>
            <div class="q-pb-sm">
              {{ nextChange }}
            </div>
            <div>
              {{ relativeTime }}
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col">
        <q-btn label="Voltar" color="primary" @click="returnToHome"/>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { getWaterRestrictionData, waterRestrictionType } from '../Sanepar/main'
import moment from 'moment'


export default defineComponent({
  name: 'Result',
  data () {
    const data: { onRestriction: boolean | null, currentWRStatus: waterRestrictionType | null} = {
      onRestriction: null,
      currentWRStatus: null
    }
    return data
  },
  async created () {
    const address = this.$route.params.singleLine
    console.log(address)
    const waterRestrictionData = await getWaterRestrictionData(address)
    const currentWRStatus = <waterRestrictionType> waterRestrictionData[0]

    this.onRestriction = new Date() > new Date(currentWRStatus.attributes.INICIO)
    this.currentWRStatus = <waterRestrictionType> currentWRStatus

  },
  methods: {
    returnToHome () {
      this.$router.push('/')
    }
  },
  computed: {
    statusString: function () { 
      return this.onRestriction ? 'Abastecimento interrompido' : 'Abastecimento normalizado'
    },
    nextChange: function () {
      const timestamp = this.onRestriction ? this.currentWRStatus.attributes.NORMALIZACAO : this.currentWRStatus.attributes.INICIO
      const baseText = this.onRestriction ? "Previsão de normalização: " : "Previsão de interrupção: "
      const timeText = moment(timestamp).format("DD/MM [às] h:mm")
      return baseText + timeText
    },
    relativeTime: function () {
      moment.locale('pt-br')
      const timestamp = this.onRestriction ? this.currentWRStatus.attributes.NORMALIZACAO : this.currentWRStatus.attributes.INICIO
      const baseText = this.onRestriction ? "Normalização " : "Interrupção"
      return baseText + moment(timestamp).fromNow()
    }
  }
});
</script>
