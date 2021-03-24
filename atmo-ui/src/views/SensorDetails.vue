<template>
  <v-container fluid pa-2>
    <v-col cols="12" class="pa-0">
      <div class="subtitle-1 pa-2 d-flex justify-center align-center mt-1">
        Detail Informationen
      </div>
    </v-col>
    <v-card class="ma-2" v-for="sensor in Data" :key="sensor.Sensor" outlined>
      <v-container fluid class="pt-3 pb-3">
        <v-row>
          <v-col cols="12" class="pa-0">
            <v-card-subtitle
              class="pa-0 d-flex justify-center align-center mt-1"
            >
              {{ getSensorValues(sensor.Sensor).displayName }}
            </v-card-subtitle>
          </v-col>
        </v-row>
        <v-row class="mx-1">
          <v-col cols="2" class="d-flex justify-center align-center ma-0">
            <v-btn icon>
              <v-icon large class="d-flex justify-center align-center">
                {{ getSensorValues(sensor.Sensor).icon }}
              </v-icon>
            </v-btn>
          </v-col>
          <v-col>
            <div cols="12" class="caption">
              <v-icon class="mr-1 mb-1">mdi-identifier</v-icon>
              Sensor ID:
              {{ getSensorValues(sensor.Sensor).id }}
            </div>
            <div cols="11" class="caption">
              <v-icon class="mr-1 mb-1">mdi-clock-outline</v-icon>
              Aktualisiert:
              {{ formatTime(sensor.Timestamp) }} Uhr
            </div>
            <div class="caption">
              <v-icon
                v-if="getLinkquality(sensor.Linkquality) == 'sehr schwach'"
                class="mr-1 mb-1"
                color="orange darken-4"
                >mdi-signal-cellular-outline
              </v-icon>
              <v-icon
                v-if="getLinkquality(sensor.Linkquality) == 'schwach'"
                class="mr-1 mb-1"
                color="orange darken-4"
                >mdi-signal-cellular-1
              </v-icon>
              <v-icon
                v-if="getLinkquality(sensor.Linkquality) == 'mäßig'"
                class="mr-1 mb-1"
                color="orange lighten-1"
                >mdi-signal-cellular-2
              </v-icon>
              <v-icon
                v-if="getLinkquality(sensor.Linkquality) == 'gut'"
                class="mr-1 mb-1"
                color="green darken-3"
                >mdi-signal-cellular-3
              </v-icon>
              Linkqualität: {{ getLinkquality(sensor.Linkquality) }}
            </div>
            <div class="caption">
              <v-icon
                v-if="sensor.Battery > 0 && sensor.Battery <= 20"
                class="mr-1 mb-1"
                color="orange darken-4"
                >mdi-battery-20</v-icon
              >
              <v-icon
                v-if="sensor.Battery > 20 && sensor.Battery <= 30"
                class="mr-1 mb-1"
                color="orange darken-1"
                >mdi-battery-40</v-icon
              >
              <v-icon
                v-if="sensor.Battery > 30 && sensor.Battery <= 50"
                class="mr-1 mb-1"
                color="light-green lighten-1"
                >mdi-battery-50</v-icon
              >
              <v-icon
                v-if="sensor.Battery > 50 && sensor.Battery <= 80"
                class="mr-1 mb-1"
                color="green darken-3"
                >mdi-battery-90</v-icon
              >
              <v-icon
                v-if="sensor.Battery > 80"
                class="mr-1 mb-1"
                color="green darken-3"
                >mdi-battery</v-icon
              >
              Batteriezustand:
              {{ sensor.Battery }} %
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
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
  name: "SensorDetails",
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
    getLinkquality: function getLinkQuality(Linkquality) {
      var quality = null;
      if (Linkquality <= 20 && Linkquality > 10) {
        quality = "mäßig";
      } else if (Linkquality > 20) {
        quality = "gut";
      } else if (Linkquality < 5) {
        quality = "sehr schwach";
      } else if (Linkquality <= 10 && Linkquality > 5) {
        quality = "schwach";
      }
      return quality;
    },
    formatTime: function formatTime(Timestring) {
      let timestamp = Date.parse(Timestring);
      let dateObject = new Date(timestamp);
      return dateObject.toLocaleString("de-DE");
    },
  },
};
</script>
