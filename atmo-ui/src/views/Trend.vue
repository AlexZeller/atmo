<template>
  <v-container>
    <v-select
      label="Raum"
      item-text="displayName"
      item-value="id"
      :items="rooms"
      v-model="room"
      v-on:change="getData"
    >
    </v-select>
    <v-tabs
      @click="getData(room)"
      v-model="activeTab"
      grow
      icons-and-text
      class="mt-2"
    >
      <v-tab @click="getData(room)">
        <v-icon small>mdi-temperature-celsius</v-icon>
        Lufttemperatur
      </v-tab>
      <v-tab @click="getData(room)">
        <v-icon small>mdi-water-percent</v-icon>
        Luftfeuchte
      </v-tab>
      <v-tab-item :eager="true">
        <v-container fluid>
          <TemperatureTrend ref="TempChart" />
        </v-container>
      </v-tab-item>
      <v-tab-item :eager="true">
        <v-container fluid>
          <HumidityTrend ref="HumidChart" />
        </v-container>
      </v-tab-item>
    </v-tabs>
    <v-row v-if="!failedConnection & !loading" class="justify-center pt-4">
      <v-btn-toggle
        v-model="hours"
        v-on:change="reloadTempChart"
        mandatory
        borderless
        color="primary"
      >
        <v-btn small value="6"> 6 </v-btn>
        <v-btn small value="12"> 12 </v-btn>
        <v-btn small value="24"> 24 </v-btn>
        <v-btn small value="168"> 7T </v-btn>
      </v-btn-toggle>
    </v-row>
    <v-row v-if="loading">
      <v-col>
        <div class="text-center">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </div>
      </v-col>
    </v-row>
    <v-row v-if="failedConnection">
      <v-col>
        <div class="text-center">
          <v-icon large> mdi-wifi-strength-alert-outline </v-icon>
        </div>
        <div class="text-center caption">
          Es konnte keine Verbindung zur API hergestellt werden.
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
//import axios from 'axios';
import TemperatureTrend from "../components/TemperatureTrend.vue";
import HumidityTrend from "../components/HumidityTrend.vue";
import axios from "axios";

export default {
  name: "Trend",
  components: { TemperatureTrend, HumidityTrend },
  data() {
    return {
      loading: true,
      failedConnection: false,
      activeTab: null,
      Data: "",
      room: parseInt(this.$route.params.initialRoom),
      hours: "12",
      rooms: [],
    };
  },
  mounted() {
    this.getData(this.room);
    axios
      .get(process.env.VUE_APP_ROOT_API + "/settings")
      .then((response) => {
        this.rooms = response.data.sensors;
        this.loading = false;
      })
      .catch(() => {
        this.loading = false;
        this.failedConnection = true;
      });
  },
  methods: {
    getData: function getSensorData(room) {
      axios
        .get(process.env.VUE_APP_ROOT_API + `/${room}/currenttemp`)
        .then((response) => (this.Data = response.data))
        .then((this.room = room))
        .then(this.reloadTempChart());
    },
    reloadTempChart: function () {
      this.$refs.TempChart.getChartData(this.room, this.hours);
      this.$refs.HumidChart.getChartData(this.room, this.hours);
    },
  },
};
</script>
