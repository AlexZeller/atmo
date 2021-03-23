import Vue from 'vue';
import VueRouter from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
import Trend from '../views/Trend.vue';
import SensorDetails from '../views/SensorDetails.vue';
import Settings from '../views/Settings.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
  },
  {
    path: '/trend/:initialRoom',
    name: 'Trend',
    component: Trend,
    props: true,
  },
  {
    path: '/sensordetails',
    name: 'SensorDetails',
    component: SensorDetails
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings
  }
];

const router = new VueRouter({
  routes,
});

export default router;
