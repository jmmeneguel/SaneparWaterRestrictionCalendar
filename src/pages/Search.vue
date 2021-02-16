<template>
  <q-page class="q-pa-md row justify-center items-center">
    <div class="column items-center">
      <div class="col q-pb-lg">
        <div class="text-h5 text-left text-raleway">
          <span>Rodízio</span><br />
          <span>Sanepar</span><br />
          <span>CURITIBA</span>
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
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import SelectAddress from "components/SelectAddress.vue";

export default defineComponent({
  name: "Search",
  components: { SelectAddress },
  data() {
    return {
      address: "",
      loading: true
    };
  },
  created() {
    if (localStorage.address !== undefined) {
      this.address = localStorage.address
      this.search()
    } else {
      this.loading = false
    }
  },
  methods: {
    async search() {
      localStorage.address = this.address;
      this.$router.push({
        name: "result",
        params: { singleLine: this.address }
      });
    },
    changeAddress(val: string) {
      this.address = val;
    }
  }
});
</script>
