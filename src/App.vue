<template>
  <v-app
    :dark="isDarkTheme"
    class="application--linear-gradient"
  >
    <warning-on-addresses-dialog v-model="showWarningOnAddressesDialog" />
    <component :is="layout">
      <router-view />
    </component>
  </v-app>
</template>

<script>
import dayjs from 'dayjs'
import WarningOnAddressesDialog from '@/components/WarningOnAddressesDialog'
import Notifications from '@/lib/notifications'

export default {
  components: {
    WarningOnAddressesDialog
  },
  data: () => ({
    showWarningOnAddressesDialog: false
  }),
  computed: {
    layout () {
      return this.$route.meta.layout || 'default'
    },
    isLogged () {
      return this.$store.getters.isLogged
    },
    isDarkTheme () {
      return this.$store.state.options.darkTheme
    },
    isLoginViaPassword () {
      return this.$store.getters['options/isLoginViaPassword']
    }
  },
  created () {
    this.setLocale()
  },
  mounted () {
    this.notifications = new Notifications(this)
    this.notifications.start()
  },
  beforeDestroy () {
    this.notifications.stop()
    this.$store.dispatch('stopInterval')
  },
  methods: {
    setLocale () {
      // Set language from `localStorage`.
      //
      // This is required only when initializing the application.
      // Subsequent mutations of `language.currentLocale`
      // will be synchronized with `i18n.locale`.
      const localeFromStorage = this.$store.state.language.currentLocale
      this.$i18n.locale = localeFromStorage
      dayjs.locale(localeFromStorage)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import './assets/stylus/themes/adamant/_mixins.styl'

.theme--light.application--linear-gradient
  linear-gradient-light()
.theme--dark.application--linear-gradient
  linear-gradient-dark()
</style>
