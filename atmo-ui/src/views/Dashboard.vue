<template>
  <v-container fluid pa-2>
    <v-row v-for="sensor in Data" :key="sensor.Sensor">
      <v-col cols="12">
        <v-card
          :to="'trend/' + sensor.Sensor"
          v-bind:class="getColor(sensor.Temperature)"
        >
          <v-container fluid class="ma-1">
            <v-row class="justify-center">
              <v-card-subtitle class="text-center pt-2 pa-0">
                {{ getSensorValues(sensor.Sensor).displayName }}
              </v-card-subtitle>
            </v-row>
            <v-row class="pa-0">
              <v-col cols="4" class="d-flex justify-center align-center ma-0">
                <v-btn icon>
                  <v-icon x-large class="d-flex justify-center align-center">
                    {{ getSensorValues(sensor.Sensor).icon }}
                  </v-icon>
                </v-btn>
              </v-col>
              <v-col cols="4" class="pa-0 pr-4">
                <v-card-title class="pl-0 d-flex justify-space-between">
                  <div>{{ sensor.Temperature }} °C</div>
                </v-card-title>
              </v-col>
              <v-col cols="4" class="pa-0 pr-4">
                <v-card-title class="pl-0 d-flex justify-space-between">
                  <div>{{ sensor.Humidity }} %</div>
                </v-card-title>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
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
// @ is an alias to /src
import axios from "axios";

export default {
  name: "Dashboard",
  data: () => {
    return {
      loading: true,
      failedConnection: false,
      Data: [],
      sensors: [],
    };
  },
  mounted() {
    axios
      .get(process.env.VUE_APP_ROOT_API + "/settings")
      .then((response) => this.getSensorData(response.data))
      .catch(() => {
        this.loading = false;
        this.failedConnection = true;
      });
  },
  methods: {
    getSensorData: function getSensorData(data) {
      this.loading = false;
      this.sensors = data.sensors;
      let promises = [];
      data.sensors.forEach((sensor) => {
        promises.push(
          axios.get(process.env.VUE_APP_ROOT_API + `/${sensor.id}/currenttemp`)
        );
      });
      Promise.all(promises).then((responses) => {
        responses.forEach((response) => {
          this.Data.push(response.data);
        });
      });
    },
    getSensorValues: function getSensorValues(DataID) {
      let index = this.sensors.findIndex((x) => x.id === DataID);
      return this.sensors[index];
    },
    getColor(temperature) {
      var color = null;
      if (temperature <= 17.5 && temperature > 10) {
        color = "blue-grey lighten-1";
      } else if (temperature <= 19.5 && temperature > 17.5) {
        color = "blue-grey lighten-5";
      } else if (temperature <= 10 && temperature > 0) {
        color = "blue-grey darken-1";
      } else if (temperature <= 0) {
        color = "blue-grey darken-2";
      } else if (temperature <= 22 && temperature > 19.5) {
        color = "deep-orange lighten-5";
      } else if (temperature <= 26 && temperature > 22) {
        color = "deep-orange lighten-3";
      } else if (temperature <= 30 && temperature > 26) {
        color = "deep-orange lighten-1";
      } else if (temperature > 30) {
        color = "deep-orange darken-4";
      }
      return color;
    },
  },
};
</script>
