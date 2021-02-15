<template>
  <q-select
    filled
    v-model="address"
    use-input
    input-debounce="0"
    label="Endereço"
    :options="options"
    style="width: 250px"
    @input-value="getSuggestions"
    @input="getAddress"
    ref="selectComponent"
  >
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey">
          No results
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { getSuggestions } from '../Sanepar/main'

export default defineComponent({
  name: 'SelectAddress',
  props: ['title'],
  data () {
    return {
      address: null,
      options: null
    }
  },
  methods: {
    async getSuggestions(val: string) {
      try {
        const options = await getSuggestions(val)
        console.log(options)
        this.options = options.map((entry: { text: any; }) => entry.text.trim())
        this.$refs['selectComponent'].showPopup()
        this.$refs['selectComponent'].refresh()
      } catch {
        this.options = null
        this.$refs['selectComponent'].showPopup()
        this.$refs['selectComponent'].refresh()
      }
    },
    getAddress (val: string) {
      this.$emit('changeAddress', val)
    }
  }
})
</script>
