<template>
  <v-dialog
    v-model="show"
    width="250"
  >
    <v-card>
      <v-layout
        justify-center
        row
        wrap
        class="py-3"
      >
        <div
          :style="{ cursor: 'pointer' }"
          @click="saveQrcode"
        >
          <QrcodeRenderer
            ref="qrcode"
            :text="text"
            :logo="logoURL"
            :opts="opts"
          />
        </div>

        <v-btn
          class="a-btn-primary mt-3"
          @click="saveQrcode"
        >
          {{ $t('login.save_qr_code_to_images') }}
        </v-btn>
      </v-layout>
    </v-card>
  </v-dialog>
</template>

<script>
import b64toBlob from 'b64-to-blob'
import FileSaver from 'file-saver'

import QrcodeRenderer from '@/components/QrcodeRenderer'

export default {
  components: {
    QrcodeRenderer
  },
  props: {
    value: {
      type: Boolean,
      required: true
    },
    text: {
      type: String,
      default: ''
    },
    logo: {
      type: Boolean,
      default: undefined
    }
  },
  data: () => ({
    opts: {
      scale: 8.8
    }
  }),
  computed: {
    show: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    },
    logoURL () {
      return this.logo ? '/img/adm-qr-invert.png' : ''
    }
  },
  methods: {
    saveQrcode () {
      const imgUrl = this.$refs.qrcode.$el.src
      const base64Data = imgUrl.slice(22, imgUrl.length)
      const byteCharacters = b64toBlob(base64Data)
      const blob = new Blob([byteCharacters], { type: 'image/png' })
      FileSaver.saveAs(blob, 'adamant-im.png')
    }
  }
}
</script>
