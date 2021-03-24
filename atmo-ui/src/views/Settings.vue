<template>
  <v-container fluid pa-2>
    <v-col cols="12" class="pa-0">
      <div class="subtitle-1 pa-2 d-flex justify-center align-center mt-1">
        Einstellungen
      </div>
    </v-col>
    <v-row>
      <v-col cols="12" class="d-flex pl-4 pt-10 pb-10">
        <v-subheader class="pa-0 pb-2 caption"
          ><v-icon small class="pr-2 pb-5">mdi-information-outline</v-icon>
          <p>
            Hier können der Anzeigename und das Icon geändert werden. Dazu
            einfach auf den jeweiligen Wert klicken, nach belieben ändern und
            anschließend speichern. Eine Liste mit kompatiblen Icons findet sich
            <a
              href="https://materialdesignicons.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              hier</a
            >.
          </p></v-subheader
        >
      </v-col>
    </v-row>
    <v-data-table
      v-if="!failedConnection & !loading"
      :headers="headers"
      :items="sensors"
      :hide-default-footer="true"
      disable-sort
      :mobile-breakpoint="0"
      class="elevation-1"
      :loading="this.loaded"
    >
      <template v-slot:[`item.displayName`]="props">
        <v-edit-dialog :return-value.sync="props.item.displayName">
          {{ props.item.displayName }}
          <template v-slot:input>
            <div class="mt-4 title">Anzeigenamen anpassen</div>
            <v-text-field
              v-model="props.item.displayName"
              :rules="[max15chars]"
              label="Edit"
              single-line
              counter
            ></v-text-field>
          </template>
        </v-edit-dialog>
      </template>
      <template v-slot:[`item.icon`]="props">
        <v-edit-dialog :return-value.sync="props.item.icon">
          <div>{{ props.item.icon }}</div>
          <template v-slot:input>
            <div class="mt-4 title">Icon anpassen</div>
            <v-text-field
              v-model="props.item.icon"
              :rules="[max15chars]"
              label="Edit"
              single-line
              counter
            ></v-text-field>
          </template>
        </v-edit-dialog> </template
    ></v-data-table>
    <v-row v-if="!failedConnection & !loading">
      <v-col class="d-flex justify-end">
        <v-btn
          class="ma-2"
          :loading="save_button_loader"
          color="primary"
          @click="sendSettings()"
        >
          Speichern
        </v-btn>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog">
      <v-card>
        <v-card-title v-if="this.save_success == 'success'" class="subtitle-2"
          >Ihre Einstellungen wurden erfolgreich übertragen.</v-card-title
        >
        <v-card-title
          v-if="this.save_success == 'server_failed'"
          class="subtitle-2"
          >Fehler beim Übertragen der Einstellungen (Interner Server
          Fehler).</v-card-title
        >
        <v-card-title v-if="this.save_success == 'failed'" class="subtitle-2"
          >Fehler beim Übertragen der Einstellungen
          (Verbindungsfehler)</v-card-title
        >

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialog = false">
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
  name: "Settings",
  data: () => {
    return {
      loading: true,
      failedConnection: false,
      max15chars: (v) => v.length <= 15 || "Input too long!",
      headers: [
        {
          text: "ID",
          align: "start",
          sortable: false,
          value: "id",
        },
        { text: "Anzeigename", value: "displayName" },
        { text: "Icon", value: "icon" },
      ],
      loaded: false,
      sensors: [],
      save_button_loader: false,
      dialog: false,
      save_success: "success",
    };
  },
  mounted() {
    axios
      .get(process.env.VUE_APP_ROOT_API + "/settings")
      .then((response) => {
        this.loading = false;
        response.data.sensors.forEach((sensor) => {
          let arr = sensor.icon.split("-");
          sensor.icon = arr[1];
        });
        this.sensors = response.data.sensors;
      })
      .catch(() => {
        this.loading = false;
        this.failedConnection = true;
      });
  },
  methods: {
    constructJSON() {
      let settings_data = JSON.parse(JSON.stringify(this.sensors));
      settings_data.forEach((sensor) => {
        sensor.icon = "mdi-" + sensor.icon;
      });
      let settings = { sensors: settings_data };
      return JSON.stringify(settings);
    },
    sendSettings() {
      this.save_button_loader = true;
      let settings = this.constructJSON();
      console.log(settings);
      axios
        .post(process.env.VUE_APP_ROOT_API + "/settings", settings, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          if (response.status == 200) {
            (this.save_button_loader = false),
              (this.dialog = true),
              (this.save_success = "success");
          } else if (response.status == 500) {
            (this.save_button_loader = false),
              (this.dialog = true),
              (this.save_success = "server_failed");
          }
        })
        .catch((error) => {
          console.log(error);
          (this.save_button_loader = false),
            (this.dialog = true),
            (this.save_success = "failed");
        });
    },
  },
};
</script>
