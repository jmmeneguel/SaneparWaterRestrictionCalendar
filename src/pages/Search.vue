<template>
  <q-page class="q-pa-md row justify-center items-center">
    <div class="column items-center">
      <div class="col q-pb-lg">
        <div class="text-h5 text-left text-raleway">
          <span>Rodízio</span><br />
          <span>Sanepar</span><br />
          <span>Curitiba</span>
        </div>
      </div>
      <div class="column items-center" v-show="!loading">
        <div class="col q-pb-lg">
          <SelectAddress @changeAddress="changeAddress" />
        </div>
        <div class="col">
          <q-btn label="Pesquisar" color="primary" @click="search" />
        </div>
      </div>
    </div>
    <q-dialog v-model="dialog" position="bottom">
      <q-card style="width: 50%">
        <q-card-section class="row items-center no-wrap bg-red-9">
          <div class="full-width text-white text-center">
            Não foi possível encontrar dados para esse endereço
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
// @ts-nocheck
import { defineComponent } from "@vue/composition-api";
import SelectAddress from "components/SelectAddress.vue";
import { getWaterRestrictionData, waterRestrictionType } from "../Sanepar/main";

export default defineComponent({
  name: "Search",
  components: { SelectAddress },
  data() {
    return {
      address: "",
      loading: true,
      dialog: false
    };
  },
  async created() {
    if (localStorage.address !== undefined) {
      this.address = localStorage.address;
      const waterRestrictionData = JSON.parse(
        localStorage.waterRestrictionData
      );
      let containValidWRData;
      if (waterRestrictionData !== undefined) {
        containValidWRData = waterRestrictionData.some(
          (item: waterRestrictionType) => {
            new Date(item.attributes.NORMALIZACAO) > new Date();
          }
        );
      } else {
        containValidWRData = false;
      }
      if (containValidWRData) {
        const filteredData = waterRestrictionData.filter(
          (entry: waterRestrictionType) => {
            const today = new Date();
            return today < new Date(entry.attributes.NORMALIZACAO);
          }
        );
        localStorage.waterRestrictionData = JSON.stringify(filteredData);

        this.$router.push({ name: "result" });
        this.search();
      } else {
        await this.search();
        this.$router.push({ name: "result" });
      }
    } else {
      this.loading = false;
    }
  },
  methods: {
    async search() {
      try {
        const waterRestrictionData = await getWaterRestrictionData(
          this.address
        );
        if (waterRestrictionData.length === 0) throw new Error('Invalid address')
        console.log('WR', waterRestrictionData)
        localStorage.waterRestrictionData = JSON.stringify(
          waterRestrictionData
        );
        localStorage.address = this.address;
        this.$root.$emit("wrDataUpdate");
        this.$router.push({ name: "result" });
      } catch {
        this.dialog = true
      }
    },
    changeAddress(val: string) {
      this.address = val;
    }
  }
});
</script>
