<template>
  <div>
    <line-chart v-if="loaded" :chartdata="chartdata" :options="options" />
  </div>
</template>

<script>
import axios from "axios";
import LineChart from "../components/LineChart.vue";

export default {
  name: "HumidityTrend",
  components: { LineChart },
  data: () => ({
    loaded: false,
    HumidityData: [],
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
          .then((response) => (this.HumidityData = response.data))
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
        labels: this.getTimesArray(this.HumidityData),
        datasets: [
          {
            label: "Luftfeuchte in %",
            fill: false,
            data: this.getHumidArray(this.HumidityData),

            borderColor: ["rgba(3, 107, 252)"],
          },
        ],
      };

      return dataObj;
    },

    getHumidArray: function (HumidData) {
      var HumidArray = [];

      HumidData.forEach((element) => {
        HumidArray.push(element.Humidity);
      });

      return HumidArray;
    },

    getTimesArray: function (HumidData) {
      var TimesArray = [];

      HumidData.forEach((element) => {
        TimesArray.push(element.Timestamp);
      });

      return TimesArray;
    },
  },
};
</script>
