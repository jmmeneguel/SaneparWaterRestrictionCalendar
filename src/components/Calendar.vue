<template>
  <div class="row full-height justify-center items-center">
    <q-list separator class="full-width">
      <q-item v-ripple v-for="item in data">
        <q-item-section>
          <div>Início:
            <span class="text-weight-bold">
              {{ formatTimestamp(item.attributes.INICIO) }}
            </span>
          </div>
          <div>Normalização:
            <span class="text-weight-bold">
              {{ formatTimestamp(item.attributes.NORMALIZACAO) }}
            </span>
          </div>
        </q-item-section>
        <q-separator dark inset />
      </q-item>
    </q-list>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import moment from "moment";

export default defineComponent({
  name: "Calendar",
  props: ['data'],
  methods: {
    formatTimestamp(val: number) {
      return moment(val).format("DD/MM [às] HH:mm")
    }
  }
});
</script>
