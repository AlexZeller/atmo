<template>
  <div>
    <line-chart v-if="loaded" :chartdata="chartdata" :options="options" />
  </div>
</template>

<script>
import axios from "axios";
import LineChart from "../components/LineChart.vue";

export default {
  name: "TemperatureTrend",
  components: { LineChart },
  data: () => ({
    loaded: false,
    TemperatureData: [],
    chartdata: null,
    options: {
      scales: {
        xAxes: [
          {
            type: "time",
            ticks: {
              maxTicksLimit: 10,
            },
            time: {
              displayFormats: {
                minute: "HH:mm",
                hour: "HH:mm",
                day: "dd D.M",
              },
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
      responsive: true,
      maintainAspectRatio: false,
    },
  }),
  mounted() {
    this.loaded = false;
  },
  methods: {
    getChartData: function (room, hours) {
      this.loaded = false;
      try {
        axios
          .get(process.env.VUE_APP_ROOT_API + `/${room}/temptrend/${hours}`)
          .then((response) => (this.TemperatureData = response.data))
          .then(
            () => (
              (this.chartdata = this.formatChartData()), (this.loaded = true)
            )
          );
      } catch (e) {
        console.error(e);
      }
    },
    formatChartData: function () {
      var dataObj = {
        labels: this.getTimesArray(this.TemperatureData),
        datasets: [
          {
            label: "Lufttemperatur in °C",
            fill: false,
            data: this.getTempArray(this.TemperatureData),

            borderColor: ["rgba(255, 139, 128)"],
          },
        ],
      };

      return dataObj;
    },

    getTempArray: function (TempData) {
      var TempsArray = [];

      TempData.forEach((element) => {
        TempsArray.push(element.Temperature);
      });

      return TempsArray;
    },

    getTimesArray: function (TempData) {
      var TimesArray = [];

      TempData.forEach((element) => {
        TimesArray.push(element.Timestamp);
      });

      return TimesArray;
    },
  },
};
</script>
