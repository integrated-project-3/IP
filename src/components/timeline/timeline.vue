<template >
  <div>
    <div class="timeline">
      <b-row class="head" align-v="start">
        <b-col md="2">
          <b-btn variant="select" @click="back">Back</b-btn>
        </b-col>
        <b-col>
          <span class="timeline-details">
            <h1>{{title}} - {{date}}</h1>
          </span>
        </b-col>
        <b-col md="2">
          <b-btn variant="create" @click="openModal('createEvent')" style="float: right;">Create new event</b-btn>
        </b-col>
      </b-row>
      <b-row align-v="center" class="events">
        <a-events :events="events"></a-events>
      </b-row>
      <b-row align-v="end" class="footer">
        <b-col md="12">
          <b-btn variant="delete" @click="openModal('deleteTimeline')">Delete</b-btn>
        </b-col>
      </b-row>
    </div>
    <b-modal  v-model="modal" :title="modalTitle" @shown="modalOpened" @hidden="modalClosed" size="lg">
      <b-container fluid>
        <b-row v-if="modalType === 'createEvent'">
          <b-col md="6">
            <b-row>
              <input type="text" v-model="newEventTitle" @keyup.enter="createEvent" @keyup="checkTitleInput" placeholder="Enter title" id="titleInput"/>
              <b-alert variant="danger" :show="showTitleWarning">Title must be at least 5 characters long</b-alert>
            </b-row>
            <b-row>
              <b-form-textarea id="textarea1" v-model="newEventDescription" placeholder="Enter description" :rows="3" :max-rows="8"/>
            </b-row>
          </b-col>
          <b-col md="6">
            <b-row id="checkBoxCol">
              <b-form-checkbox id="exactDateTime" v-model="exactDateTime">Exact date and time</b-form-checkbox>
            </b-row>
            <b-row v-if="!exactDateTime">
              <b-form-select v-model="beforeAfterSelect" :options="beforeAfterOptions" class="mb-3" id="beforeAfterSelect" @change="checkInput('beforeAfterSelect')"/>
              <b-form-select v-model="eventSelect" :options="eventOptions" class="mb-3" id="eventSelect" @change="checkInput('eventSelect')"/>
            </b-row>
            <b-row v-if="exactDateTime">
              <input type="datetime-local" v-model="newEventDateTime" id="newEventDateTime" @change="checkInput('newEventDateTime')"/>
            </b-row>
          </b-col>
        </b-row>
        <b-row v-else-if="modalType === 'deleteTimeline'">
          <b-col>
            <p>
              Are you sure you wish to delete this timeline?
            </p>
          </b-col>
        </b-row>
      </b-container>
      <div slot="modal-footer" class="w-100">
        <b-btn class="float-left" @click="closeModal">CANCEL</b-btn>
        <b-btn v-if="modalType === 'createEvent'" class="float-right" @click="createEvent">CREATE</b-btn>
        <b-btn v-else-if="modalType === 'deleteTimeline'" class="float-right" @click="deleteTimeline">DELETE</b-btn>
      </div>
    </b-modal>
  </div>
</template>

<script>
import {formatDate, validTitle} from '../../scripts/script'
import aEvents from './events'

export default {
  name: 'aTimeline',
  data() {
    return {
      modal: false,
      modalTitle: '',
      newEventTitle: '',
      showTitleWarning: false,
      modalType: '',
      exactDateTime: false,
      newEventDescription: '',
      beforeAfterSelect: null,
      beforeAfterOptions: [
        { value: null, text: 'Before/After', disabled: true},
        { value: 'before', text: 'Before'},
        { value: 'after', text: 'After'}
      ],
      eventSelect: null,
      newEventDateTime: null
    }
  },
  components: {
    aEvents
  },
  computed: {
    timeline() {
      return this.$store.state.currentTimeline
    },
    title() {
      return this.timeline.title
    },
    date() {
      return formatDate(this.timeline.date)
    },
    events() {
      return this.timeline.timelineEvents || []
    },
    eventOptions() {
      var options = [
        { value: null, text: 'Select an event', disabled : true}
      ]
      for (var i = 0; i < this.events.length; i++) {
        var option = {
          value: this.events[i].Id,
          text: this.events[i].Title
        }
        options.push(option)
      }
      return options
    },
    startTime() {
      return this.timeFromDateTime(this.events[0].EventDateTime)
    },
    endTime() {
      return this.timeFromDateTime(this.events[this.events.length-1].EventDateTime)
    }
  },
  methods: {
    back() {
      this.$router.push({name: 'REGISTER'})
    },
    timeFromDateTime(dateTime) {
      return dateTime.substring(11, 16)
    },
    deleteTimeline() {
      this.closeModal()
      this.$store.dispatch('deleteTimeline', this.timeline.id)
      this.$router.push({name: 'REGISTER'})
    },
    openModal(type) {
      this.modal = true
      this.modalType = type
    },
    closeModal() {
      this.modal = !this.modal
    },
    modalOpened() {
      if (this.modalType === "createEvent") {
        document.getElementById('titleInput').focus()
        this.modalTitle = "Create"
      } else if (this.modalType === "deleteTimeline") {
        this.modalTitle = "Delete"
      }
    },
    modalClosed() {
      if (this.modalType === "createEvent") {
        this.newEventTitle = ''
        this.newEventDescription = ''
        this.exactDateTime = false
        this.showTitleWarning = false
        this.beforeAfterSelect = null
        this.eventSelect = null
        this.newEventDateTime = null
      }
      this.modalType = ''
      this.modalTitle = ''
    },
    createEvent() {
      if (!validTitle(this.newEventTitle)) {
        document.getElementById('titleInput').focus()
        this.showTitleWarning = true
        return
      }
      if (!this.exactDateTime) {
        if(this.beforeAfterSelect === null) {
          var select = document.getElementById("beforeAfterSelect")
          select.focus()
          select.style.border = "1px solid red"
          return
        }
        if(this.eventSelect === null) {
          var eselect = document.getElementById("eventSelect")
          eselect.focus()
          eselect.style.border = "1px solid red"
          return
        }
      } else {
        if (this.newEventDateTime === null) {
          var datetime = document.getElementById("newEventDateTime")
          datetime.focus()
          datetime.style.border = "1px solid red"
          return
        }
      }
      this.closeModal()
      var payload = {
        title: this.newEventTitle,
        description: this.newEventDescription
      }

      if (!this.exactDateTime) {
        payload.beforeAfter = this.beforeAfterSelect
        payload.eventId = this.eventSelect
        this.$store.dispatch('createEventBA', payload)
      } else {
        payload.dateTime = this.newEventDateTime
        this.$store.dispatch('createEventExact', payload)
      }
    },
    /* Called when a key is pressed on the create modal input. */
    checkTitleInput: function() {
      /*
        If the user has tried to create a timeline that has less than 5 characters
        then the warning gets shown.
        This automatically hides the warning once they have entered at least 5 characters.
      */
      if (this.showTitleWarning === true) {
        if (validTitle(this.newEventTitle)) {
          this.showTitleWarning = false
        }
      }
    },
    checkInput(id) {
      var el = document.getElementById(id)
      if (el.style.border === "1px solid red") {
        el.style.border = ""
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles/theme.scss';
@import '../../assets/styles/main.scss';

.timeline {
  padding-top: 20px;
  .timeline-details {
    h1 {
      @media only screen and (max-width: 576px) {
        font-size: 2em;
      }
      font-size: 4em;
    }
    p {
      font-size: 2em;
    }
  }
  .footer {
    position: fixed;
    bottom: 0;
    padding: 20px;
  }
}
.md-datepicker-dialog {
  z-index: 1200 !important;
}
</style>
