<template>
  <q-page class="q-pa-md row justify-center items-center">
    <div class="column items-center">
      <div class="col q-pb-lg">
        <div class="text-h4 text-uppercase text-center">
          rodízio <br> sanepar <br> curitiba
        </div>
      </div>
      <div class="col q-pb-lg">
        <SelectAddress @changeAddress="changeAddress"/>      
      </div>
      <div class="col">
        <q-btn label="Pesquisar" color="primary" @click="search"/>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import SelectAddress from 'components/SelectAddress.vue'

export default defineComponent({
  name: 'Search',
  components: { SelectAddress },
  data () {
    return {
      address: ''
    }
  },
  methods: {
    async search() {
      this.$router.push({ name: 'result', params: { singleLine: this.address } })
    },
    changeAddress(val: string) {
      this.address = val
    }
  }
});
</script>
