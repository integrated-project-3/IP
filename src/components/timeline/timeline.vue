<template >
  <div>
    <div v-if="timeline != null">
      <div class="timeline">
        <b-row class="head" align-v="start">
          <b-col sm="12" lg="2" class="timeline-buttons">
            <b-btn variant="select" @click="back" id="timeline-back-button">Back</b-btn>
          </b-col>
          <b-col sm="12" lg="6" class="timeline-details">
            <h1 v-on:click="openModal('editTimelineTitle')" style="cursor: pointer;">{{title}}</h1>
            <h3>{{date}}</h3>
          </b-col>
          <b-col sm="6" lg="2" class="timeline-buttons">
            <b-btn variant="delete" @click="openModal('deleteTimeline')" id="timeline-delete-button">Delete timeline</b-btn>
          </b-col>
          <b-col sm="6" lg="2" class="timeline-buttons" id="timeline-create-div">
            <b-btn variant="create" @click="openModal('createEvent')" style="float: right;" id="timeline-create-button">Create new event</b-btn>
          </b-col>
        </b-row>
        <b-row align-v="center">
          <a-events ref="events" :events="events"></a-events>
        </b-row>
      </div>
      <b-modal  v-model="modal" :title="modalTitle" @shown="modalOpened" @hidden="modalClosed" size="lg" id="timeline-modal">
        <b-container fluid>
          <b-row v-if="modalType === 'createEvent'">
            <b-col md="6" class="modal-half">
              <b-row>
                <input type="text" v-model="newEventTitle" @keyup.enter="createEvent" @keyup="checkTitleInput" placeholder="Enter title" id="title-input"/>
                <b-alert variant="danger" :show="showTitleWarning" id="title-alert">Title must be at least 5 characters long</b-alert>
              </b-row>
              <b-row>
                <b-form-textarea id="description-input" v-model="newEventDescription" placeholder="Enter description" :rows="8" no-resize/>
              </b-row>
            </b-col>
            <b-col md="6" class="modal-half">
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
          <b-row v-else-if="modalType === 'editTimelineTitle'">
            <b-col>
              <input type="text" v-model="newTimelineTitle" @keyup.enter="changeTimelineTitle" @keyup="checkTitleInput" placeholder="Enter new title" id="title-input" />
              <b-alert variant="danger" :show="showTitleWarning">Title must be at least 5 characters long</b-alert>
            </b-col>
          </b-row>
        </b-container>
        <div slot="modal-footer" class="w-100">
          <b-btn class="float-left" @click="closeModal">CANCEL</b-btn>
          <b-btn v-if="modalType === 'createEvent'" class="float-right" @click="createEvent">CREATE</b-btn>
          <b-btn v-else-if="modalType === 'deleteTimeline'" class="float-right" @click="deleteTimeline">DELETE</b-btn>
          <b-btn v-else-if="modalType === 'editTimelineTitle'" class="float-right" @click="changeTimelineTitle">SAVE</b-btn>
        </div>
      </b-modal>
    </div>
    <div v-else>
      <h2>
        No timeline selected. Click <router-link to="/">here</router-link> to return to timeline register.
      </h2>
    </div>
  </div>
</template>

<script>
import {formatDate, validTitle} from '../../scripts/script'
import aEvents from './timeline-events'

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
      newEventDateTime: null,
      newTimelineTitle: ''
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
      // this.$store.commit('clearCurrentTimeline')
      this.back()
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
        document.getElementById('title-input').focus()
        this.modalTitle = "Create"
      } else if (this.modalType === "deleteTimeline") {
        this.modalTitle = "Delete"
      } else if (this.modalType === "editTimelineTitle") {
        document.getElementById('title-input').focus()
        this.modalTitle = "Edit"
        this.newTimelineTitle = this.title
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
        this.$refs.events.clearSelected()
      } else if (this.modalType === "editTimelineTitle") {
        this.newEventTitle = ''
        this.showTitleWarning = false
      }
      this.modalType = ''
      this.modalTitle = ''
    },
    createEvent() {
      if (!validTitle(this.newEventTitle)) {
        document.getElementById('title-input').focus()
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
        payload.dateTime = this.events.filter(event => event.Id === this.eventSelect)[0].EventDateTime
        // if (payload.dateTime.slice(-2) !== 'BA')
        //   payload.dateTime = payload.dateTime + 'BA'
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
    },
    changeTimelineTitle() {
      if (!validTitle(this.newTimelineTitle)) {
        document.getElementById('title-input').focus()
        this.showTitleWarning = true
        return
      }
      this.closeModal()
      var payload = {
        id: this.timeline.id,
        title: this.newTimelineTitle
      }
      this.$store.dispatch('changeTimelineTitle', payload)
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/styles/theme.scss';
@import '../../assets/styles/main.scss';

.timeline {
  padding-top: 20px;
  @media screen and (max-width: 720px) {
    .timeline-buttons {
      &:nth-child(n+2) {margin-top: 10px;}
    }
    .timeline-details {overflow: auto;}
  }
  @media screen and (min-width: 720px) {
    .timeline-details {overflow: hidden;}
  }
  .timeline-buttons button {width: 100%;}
  .timeline-details {
    h1, h3 {
      // font-size: 2.5em;
      display:inline;
      &:last-child {
        &::before{
          content: ' - '
        }
      }
    }
  }
}
#timeline-modal {
  #title-input {
    background-color: white;
    border-bottom: 2px solid #EEEEEE;
  }
  #title-alert {
    width: 100%;
  }
  #description-input {
    margin-top: 20px;
    border: 1px solid #38474E;
  }
  .modal-half {padding: 30px;}
}
</style>
