module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  pwa: {
    name: 'atmo',
    themeColor: '#448AFF',
    manifestOptions: {
      start_url: '/#/dashboard'
    },
    appleMobileWebAppCapable: true,
    iconPaths: {
      appleTouchIcon: 'img/icons/apple-touch-icon-180x180.png',
    }
  }
}