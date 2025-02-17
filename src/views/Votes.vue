<template>
  <div :class="className">
    <app-toolbar-centered
      app
      :title="$t('votes.page_title')"
      flat
    />

    <v-container
      fluid
      class="pa-0"
    >
      <v-layout
        row
        wrap
        justify-center
      >
        <container>
          <v-card
            flat
            class="transparent"
          >
            <v-card-title class="pa-0">
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                :label="$t('votes.search')"
                :class="`${className}__search`"
                single-line
                hide-details
                class="a-input"
              />
            </v-card-title>

            <div :class="`${className}__spacer`" />

            <v-data-table
              :headers="headers"
              :pagination.sync="pagination"
              :items="delegates"
              :rows-per-page-text="$t('rows_per_page')"
              :search="search"
              hide-actions
              must-sort
              item-key="username"
            >
              <div
                slot="no-data"
                class="text-xs-center"
              >
                <v-layout
                  align-center
                  justify-center
                >
                  <v-progress-circular
                    indeterminate
                    color="primary"
                    size="24"
                    class="mr-3"
                  />
                  <div
                    class="a-text-regular"
                    style="line-height:1"
                  >
                    {{ waitingForConfirmation ? $t('votes.waiting_confirmations') : $t('votes.loading_delegates') }}
                  </div>
                </v-layout>
              </div>

              <template
                slot="headerCell"
                slot-scope="props"
              >
                <span
                  slot="activator"
                  :class="`${className}__header`"
                >
                  {{ $t(props.header.text) }}
                </span>
              </template>

              <template
                slot="items"
                slot-scope="props"
              >
                <td
                  :class="`${className}__body`"
                  class="pr-0"
                  style="cursor:pointer"
                  @click="toggleDetails(props.item, props)"
                >
                  {{ props.item.username }}
                </td>
                <td :class="`${className}__body`">
                  {{ props.item.rank }}
                </td>
                <td>
                  <v-icon
                    v-if="props.item._voted"
                    @click="downVote(props.item.address)"
                  >
                    mdi-thumb-up
                  </v-icon>
                  <v-icon
                    v-else
                    @click="upVote(props.item.address)"
                  >
                    mdi-thumb-up-outline
                  </v-icon>
                </td>
              </template>

              <template
                slot="expand"
                slot-scope="props"
              >
                <v-card
                  flat
                  :class="`${className}__expand`"
                >
                  <v-list :class="`${className}__expand-list`">
                    <v-list-tile :class="`${className}__expand-list-tile`">
                      <v-list-tile-content>
                        <v-list-tile-title class="a-text-active">
                          <a
                            :href="getExplorerUrl() + props.item.address"
                            target="_blank"
                            rel="noopener"
                          >
                            {{ props.item.address }}
                          </a>
                        </v-list-tile-title>
                      </v-list-tile-content>
                    </v-list-tile>

                    <v-list-tile
                      v-for="(item, i) in delegateDetails"
                      :key="i"
                      :class="`${className}__expand-list-tile`"
                    >
                      <v-list-tile-content>
                        <v-list-tile-title class="a-text-explanation">
                          {{ item.title }}
                        </v-list-tile-title>
                      </v-list-tile-content>
                      <v-list-tile-content>
                        <v-list-tile-title class="a-text-explanation text-xs-right">
                          {{ item.format ? item.format(item.value.call(props.item)) : item.value.call(props.item) }}
                        </v-list-tile-title>
                      </v-list-tile-content>
                    </v-list-tile>
                  </v-list>
                </v-card>
              </template>

              <v-alert
                slot="no-results"
                :class="`${className}__alert`"
                :value="true"
                icon="mdi-alert"
              >
                Your search for "{{ search }}" found no results.
              </v-alert>

              <template slot="footer">
                <td
                  :class="`${className}__review`"
                  :colspan="headers.length"
                  class="pa-0"
                >
                  <v-layout
                    row
                    wrap
                    align-center
                    justify-space-between
                  >
                    <pagination
                      v-if="showPagination"
                      v-model="pagination.page"
                      :pages="pages"
                    />

                    <v-btn
                      :disabled="reviewButtonDisabled"
                      class="a-btn-primary"
                      @click="showConfirmationDialog"
                    >
                      {{ $t('votes.summary_title') }}
                    </v-btn>
                  </v-layout>
                </td>
              </template>
            </v-data-table>
          </v-card>
        </container>
      </v-layout>
    </v-container>

    <v-dialog
      v-model="dialog"
      width="500"
    >
      <v-card>
        <v-card-title
          :class="`${className}__dialog-title`"
        >
          {{ $t('votes.summary_title') }}
        </v-card-title>

        <v-divider :class="`${className}__divider`" />

        <v-layout
          row
          wrap
          class="pa-3"
        >
          <div :class="`${className}__dialog-summary`">
            {{ $t('votes.upvotes') }}: <strong>{{ numOfUpvotes }}</strong>,&nbsp;
            {{ $t('votes.downvotes') }}: <strong>{{ numOfDownvotes }}</strong>,&nbsp;
            {{ $t('votes.total_new_votes') }}: <strong>{{ numOfUpvotes + numOfDownvotes }} / {{ voteRequestLimit }}</strong>,&nbsp;
            {{ $t('votes.total_votes') }}: <strong>{{ totalVotes }} / {{ delegates.length }}</strong>
          </div>
          <!-- eslint-disable vue/no-v-html -- Safe internal content -->
          <div
            :class="`${className}__dialog-info`"
            v-html="$t('votes.summary_info')"
          />
          <!-- eslint-enable vue/no-v-html -->
        </v-layout>

        <v-card-actions>
          <v-spacer />

          <v-btn
            flat="flat"
            class="a-btn-regular"
            @click="dialog = false"
          >
            {{ $t('transfer.confirm_cancel') }}
          </v-btn>

          <v-btn
            flat
            class="a-btn-regular"
            @click="sendVotes"
          >
            {{ $t('votes.vote_button_text') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import AppToolbarCentered from '@/components/AppToolbarCentered'
import Pagination from '@/components/Pagination'
import numberFormat from '@/filters/numberFormat'
import { explorerUriToOnion } from '@/lib/uri'

export default {
  components: {
    AppToolbarCentered,
    Pagination
  },
  data: () => ({
    voteRequestLimit: 30,
    search: '',
    headers: [
      { text: 'votes.table_head_name', value: 'username' },
      { text: 'votes.table_head_rank', value: 'rank' },
      { text: 'votes.table_head_vote', value: '_voted' }
    ],
    pagination: {
      rowsPerPage: 50,
      sortBy: 'rank',
      descending: false,
      page: 1
    },
    waitingForConfirmation: false,
    dialog: false
  }),
  computed: {
    className: () => 'delegates-view',
    delegates () {
      const delegates = this.$store.state.delegates.delegates || {}

      return Object.values(delegates)
    },
    numOfUpvotes () {
      return this.delegates
        .filter(delegate => delegate.upvoted && !delegate.voted)
        .length
    },
    numOfDownvotes () {
      return this.delegates
        .filter(delegate => delegate.downvoted && delegate.voted)
        .length
    },
    totalVotes () {
      return this.delegates.filter(delegate => delegate._voted).length
    },
    delegateDetails () {
      return [
        {
          title: this.$t('votes.delegate_uptime'),
          value () {
            return this.productivity
          },
          format: value => `${value}%`
        },
        {
          title: this.$t('votes.delegate_forged'),
          value () {
            return this.forged
          },
          format: value => `${numberFormat(value / 1e8, 1)} ADM`
        },
        {
          title: this.$t('votes.delegate_link'),
          value () {
            return this.link
          }
        },
        {
          title: this.$t('votes.delegate_description'),
          value () {
            return this.description
          }
        }
      ]
    },
    pages () {
      if (this.delegates.length <= 0) {
        return 0
      }

      return Math.ceil(this.delegates.length / this.pagination.rowsPerPage)
    },
    showPagination () {
      return this.search.length === 0
    },
    reviewButtonDisabled () {
      return (this.numOfUpvotes + this.numOfDownvotes) === 0
    }
  },
  mounted () {
    this.$store.dispatch('delegates/getDelegates', {
      address: this.$store.state.address
    })
  },
  methods: {
    getExplorerUrl () {
      return explorerUriToOnion('https://explorer.adamant.im/delegate/')
    },
    upVote (id) {
      this.$store.commit('delegates/upVote', id)
    },
    downVote (id) {
      this.$store.commit('delegates/downVote', id)
    },
    sendVotes () {
      if (!this.validateVotes()) {
        return
      }

      const upVotes = this.delegates
        .filter(delegate => delegate.upvoted && !delegate.voted)
        .map(delegate => `+${delegate.publicKey}`)
      const downVotes = this.delegates
        .filter(delegate => delegate.downvoted && delegate.voted)
        .map(delegate => `-${delegate.publicKey}`)
      const allVotes = [...upVotes, ...downVotes]

      if (allVotes.length <= 0) {
        this.$store.dispatch('snackbar/show', {
          message: this.$t('votes.select_delegates')
        })

        return
      }

      this.waitingForConfirmation = true
      this.dialog = false

      this.$store.dispatch('delegates/voteForDelegates', {
        votes: [...upVotes, ...downVotes],
        address: this.$store.state.address
      })

      this.$store.dispatch('snackbar/show', {
        message: this.$t('votes.sent')
      })
    },
    validateVotes () {
      if (this.upvotedCount + this.downvotedCount > this.voteRequestLimit) {
        this.$store.dispatch('snackbar/show', {
          message: this.$t('votes.vote_request_limit', { limit: this.voteRequestLimit })
        })

        return false
      }

      if (this.$store.state.balance < 50) {
        this.$store.dispatch('snackbar/show', {
          message: this.$t('votes.no_money')
        })

        return false
      }

      return true
    },
    toggleDetails (delegate, props) {
      props.expanded = !props.expanded

      if (!props.expaned) {
        this.$store.dispatch('delegates/getForgedByAccount', delegate)
        this.$store.dispatch('delegates/getForgingTimeForDelegate', delegate)
      }
    },
    formatForgingTime (seconds) {
      if (!seconds) {
        return '...'
      }
      if (seconds === 0) {
        return this.$t('votes.now')
      }
      const minutes = Math.floor(seconds / 60)
      seconds = seconds - (minutes * 60)
      if (minutes && seconds) {
        return `${minutes} ${this.$t('votes.min')} ${seconds} ${this.$t('votes.sec')}`
      } else if (minutes) {
        return `${minutes} ${this.$t('votes.min')}`
      } else {
        return `${seconds} ${this.$t('votes.sec')}`
      }
    },
    showConfirmationDialog () {
      this.dialog = true
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~vuetify/src/stylus/settings/_colors.styl'
@import '../assets/stylus/settings/_colors.styl'
@import '../assets/stylus/themes/adamant/_mixins.styl'

.delegates-view
  &__header
    font-size: 12px
    font-weight: 300
  &__body
    font-size: 14px
    font-weight: 300
    padding: 0 16px !important
  &__dialog-title
    a-text-header()
  &__dialog-summary
    a-text-regular-enlarged()
  &__dialog-info
    a-text-regular-enlarged()
    margin-top: 16px
    >>> a
      text-decoration-line: none
      &:hover
        text-decoration-line: underline
  &__expand
    margin: 20px
  &__expand-list-tile
    height: 36px
    >>> .v-list__tile
      padding-left: 20px
      padding-right: 20px
  &__review
    padding-top: 15px !important
    padding-bottom: 15px !important
  &__search
    >>> .v-input__slot
      padding-left: 16px
      padding-right: 16px
  &__spacer
    height: 20px
    margin-top: 5px
  &__alert
    border: none
  >>> table.v-table thead th:not(:nth-child(1)),
  >>> table.v-table tbody td:not(:nth-child(1))
      padding: 0 16px

/** Themes **/
.theme--light
  .delegates-view
    &__header
      color: $adm-colors.muted
    &__body
      color: $adm-colors.regular
    &__dialog-title
      color: $adm-colors.regular
    &__dialog-summary
      color: $adm-colors.regular
    &__dialog-info
      color: $adm-colors.regular
    &__expand
      background-color: $adm-colors.secondary2
      >>> .a-text-active a
        color: $adm-colors.regular
    &__expand-list
      background-color: transparent
    &__divider
      border-color: $adm-colors.secondary
    &__alert
      background-color: $adm-colors.muted !important
      >>> .v-icon
        color: $shades.white
    >>> .v-table tbody tr:not(:last-child)
      border-bottom: 1px solid $adm-colors.secondary2
    >>> tfoot
      linear-gradient-light()
.theme--dark
  .delegates-view
    &__alert
      background-color: $adm-colors.muted !important
      >>> .v-icon
        color: $shades.white
    >>> tfoot
      linear-gradient-dark()
</style>
