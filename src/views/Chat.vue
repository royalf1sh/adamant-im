<template>
  <v-layout
    row
    wrap
    justify-center
  >
    <container>
      <chat
        :message-text="messageText"
        :partner-id="partnerId"
        @click:chat-avatar="onClickChatAvatar"
      />

      <PartnerInfo
        v-if="contactAddress"
        v-model="show"
        :address="contactAddress"
        :name="contactName"
        :owner-address="address"
      />

      <ProgressIndicator :show="!isFulfilled" />
    </container>
  </v-layout>
</template>

<script>
import Chat from '@/components/Chat/Chat'
import PartnerInfo from '@/components/PartnerInfo'
import ProgressIndicator from '@/components/ProgressIndicator'
import partnerName from '@/mixins/partnerName'

export default {
  components: {
    ProgressIndicator,
    Chat,
    PartnerInfo
  },
  mixins: [partnerName],
  props: {
    messageText: {
      default: '',
      type: String
    },
    partnerId: {
      required: true,
      type: String
    }
  },
  data: () => ({
    show: false,
    contactAddress: '',
    contactName: ''
  }),
  computed: {
    address () {
      return this.$store.state.address
    },
    isFulfilled () {
      return this.$store.state.chat.isFulfilled
    }
  },
  methods: {
    /**
     * @param {string} address ADAMANT address
     */
    onClickChatAvatar (address) {
      this.contactAddress = address
      this.contactName = this.getPartnerName(address)
      this.show = true
    }
  }
}
</script>
