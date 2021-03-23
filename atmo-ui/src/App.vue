<template>
  <v-app>
    <v-app-bar app color="primary" height="60%" clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <div class="d-flex align-center">
        <v-img
          alt="Logo"
          class="shrink mr-2"
          contain
          src="./assets/logo.png"
          transition="scale-transition"
          width="40"
        />
      </div>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      clipped
      color="grey lighten-4"
      app
      fixed
    >
      <v-list nav>
        <v-list-item-group
          active-class="blue lighten-4 darken-1--text text--accent-4"
        >
          <v-list-item @click="drawer = false" :to="{ path: '/dashboard' }">
            <v-list-item-icon>
              <v-icon>mdi-view-dashboard</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Übersicht</v-list-item-title>
          </v-list-item>
          <v-list-item @click="drawer = false" :to="{ path: '/trend/null' }">
            <v-list-item-icon>
              <v-icon>mdi-chart-timeline-variant</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Trend</v-list-item-title>
          </v-list-item>
          <v-list-item @click="drawer = false" :to="{ path: '/sensordetails' }">
            <v-list-item-icon>
              <v-icon>mdi-access-point</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Sensor Details</v-list-item-title>
          </v-list-item>
          <v-list-item @click="drawer = false" :to="{ path: '/settings' }">
            <v-list-item-icon>
              <v-icon>mdi-cogs</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Einstellungen</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-main class="ma-2">
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data: () => ({
    drawer: null,
  }),
};
</script>
