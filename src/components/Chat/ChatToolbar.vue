<template>
  <v-toolbar
    flat
    height="56"
    :class="`${className}`"
  >
    <v-btn
      icon
      @click="goBack"
    >
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
    <div v-if="!isChatReadOnly">
      <slot name="avatar-toolbar" />
    </div>
    <div :class="`${className}__textfield-container`">
      <div
        v-if="isChatReadOnly"
        class="title"
        :style="{ paddingLeft: '12px' }"
      >
        {{ $t(partnerId) }}
      </div>
      <div v-else>
        <v-text-field
          v-model="partnerName"
          box
          full-width
          background-color="transparent"
          :label="partnerId"
        />
      </div>
    </div>

    <v-spacer />
  </v-toolbar>
</template>

<script>
import ChatAvatar from '@/components/Chat/ChatAvatar'
import partnerName from '@/mixins/partnerName'

export default {
  components: {
    ChatAvatar
  },
  mixins: [partnerName],
  props: {
    partnerId: {
      type: String,
      required: true
    }
  },
  computed: {
    className: () => 'chat-toolbar',
    partnerName: {
      get () {
        return this.getPartnerName(this.partnerId)
      },
      set (value) {
        this.$store.commit('partners/displayName', {
          partner: this.partnerId,
          displayName: value
        })
      }
    },
    isChatReadOnly () {
      return this.$store.getters['chat/isChatReadOnly'](this.partnerId)
    }
  },
  methods: {
    goBack () {
      this.$router.push({ name: 'Chats' })
    },
    showPartnerInfo () {
      this.$emit('partner-info', true)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~vuetify/src/stylus/settings/_variables.styl'
@import '../../assets/stylus/themes/adamant/_mixins.styl'
@import '../../assets/stylus/settings/_colors.styl'

.chat-toolbar
  &__textfield-container
    width: 100%

  >>> .v-text-field
    a-text-regular-enlarged-bold()

    .v-label
      max-width: unset
      a-text-regular-enlarged-bold()
    .v-input__control
      padding: 0
    .v-input__control > .v-input__slot
      margin-bottom: 0
    .v-label--active
      transform: translateY(-6px) scale(0.6875)
      font-size: 20px

/** Themes **/
.theme--light
  .chat-toolbar
    background-color: $adm-colors.secondary2-transparent

    >>> .v-text-field
      .primary--text
        color: $grey.darken-1 !important
      .v-label
        color: $grey.darken-4
      .v-label--active
        color: $grey.darken-1
      input
        caret-color: $adm-colors.primary2

.theme--dark
  .chat-toolbar
    >>> .v-text-field
      .primary--text
        color: $shades.white !important
      .v-label
        color: $shades.white
      .v-label--active
        color: $shades.white
</style>
