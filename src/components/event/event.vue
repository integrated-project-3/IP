<template lang="html">
  <div>
    <div v-if="event != null">
      <b-row>
        <b-col md="10" offset-md="1" class="event-page" id="event-page">
          <b-row class="event-head" align-v="start">
            <b-col sm="12" lg="2" class="event-buttons">
              <b-btn variant="select" @click="back" id="event-back-button">Back</b-btn>
            </b-col>
            <b-col sm="12" lg="8" class="event-details">
              <h1 @click="openModal('editEventTitle')" style="cursor: pointer;">{{title}}</h1>
              <h3>{{date}} - {{time}}</h3>
            </b-col>
            <b-col sm="12" lg="2" class="event-buttons">
              <b-btn variant="delete" @click="openModal('deleteEvent')" id="event-delete-button">Delete event</b-btn>
            </b-col>
          </b-row>
          <b-row class="event-main" align-v="center">
            <b-col sm="12">
              <div class="description">
                <h1>Description</h1>
                <span id="controls">
                  <!-- <i class="material-icons description-controls" id="save-description" v-if="description !== newEventDescription" @click="saveDescription">done</i>
                  <i class="material-icons description-controls" id="cancel-description" v-if="description !== newEventDescription" @click="cancelDescription">close</i> -->
                  <b-btn id="cancel-description" variant="cancel-edit" v-if="description !== newEventDescription" @click="cancelDescription">Cancel</b-btn>
                  <b-btn id="save-description" variant="save" v-if="description !== newEventDescription" @click="saveDescription">Save</b-btn>
                </span>
                <b-form-textarea id="event-description" placeholder="Enter description" v-model="newEventDescription" style="cursor: pointer;" no-resize/>
              </div>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-modal  v-model="modal" :title="modalTitle" @shown="modalOpened" @hidden="modalClosed" size="lg" id="timeline-modal">
        <b-container fluid>
          <b-row v-if="modalType === 'editEventTitle'">
            <b-col>
              <input type="text" v-model="newEventTitle" @keyup.enter="changeEventTitle" @keyup="checkTitleInput" placeholder="Enter new title" id="title-input" />
              <b-alert variant="danger" :show="showTitleWarning">Title must be at least 5 characters long</b-alert>
            </b-col>
          </b-row>
        </b-container>
        <div slot="modal-footer" class="w-100">
          <b-btn class="float-left" @click="closeModal">CANCEL</b-btn>
          <b-btn v-if="modalType === 'editEventTitle'" class="float-right" @click="changeEventTitle">SAVE</b-btn>
        </div>
      </b-modal>
    </div>
    <div v-else>
      <div v-if="timeline != null">
        <h2>
          No event selected. Click <router-link to="/timeline">here</router-link> to return to timeline.
        </h2>
      </div>
      <div v-else>
        <h2>
          No event or timeline selected. Click <router-link to="/">here</router-link> to return to timeline register.
        </h2>
      </div>
    </div>
  </div>
</template>

<script>
import {formatEventDate, formatEventTime, validTitle} from '../../scripts/script'

export default {
  name: 'aTimeline',
  data() {
    return {
      newEventDescription: '',
      modal: false,
      modalTitle: '',
      showTitleWarning: false,
      modalType: '',
      newEventTitle: ''
    }
  },
  mounted() {
    this.newEventDescription = this.description
  },
  computed: {
    timeline() {
      return this.$store.state.currentTimeline
    },
    event() {
      return this.$store.state.currentEvent
    },
    id() {
      return this.event.Id
    },
    title() {
      return this.event.Title
    },
    date() {
      let date = formatEventDate(this.event.EventDateTime)
      if (date === 'Date not available')
        return ''
      return date
    },
    time() {
      let time = formatEventTime(this.event.EventDateTime)
      if (time === 'Time not available')
        return ''
      return time
    },
    description() {
      return this.event.Description
    }
  },
  methods: {
    back() {
      this.$router.push({name: 'TIMELINE'})
    },
    cancelDescription() {
      this.newEventDescription = this.description
    },
    saveDescription() {
      var payload = {
        id: this.id,
        description: this.newEventDescription
      }
      this.$store.dispatch('changeEventDescription', payload)
    },
    openModal(type) {
      this.modal = true
      this.modalType = type
    },
    closeModal() {
      this.modal = !this.modal
    },
    modalOpened() {
      if (this.modalType === "editEventTitle") {
        document.getElementById('title-input').focus()
        this.modalTitle = "Edit"
        this.newEventTitle = this.title
      }
    },
    modalClosed() {
      if (this.modalType === "editEventTitle") {
        this.newEventTitle = ''
        this.showTitleWarning = false
      }
      this.modalType = ''
      this.modalTitle = ''
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
    changeEventTitle() {
      if (!validTitle(this.newEventTitle)) {
        document.getElementById('title-input').focus()
        this.showTitleWarning = true
        return
      }
      this.closeModal()
      var payload = {
        id: this.id,
        title: this.newEventTitle
      }
      this.$store.dispatch('changeEventTitle', payload)
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/styles/theme.scss';
@import '../../assets/styles/main.scss';

.event-page {
  background-color: $event-bg;
  margin-top: 20px;
  // height: stretch;
  .event-head {
    padding: 20px;
    box-shadow: 0 3px 6px rgba(0,0,0,.16);
    @media screen and (max-width: 720px) {
      .event-buttons {
        &:nth-child(n+2) {margin-top: 10px;}
      }
      .event-details {overflow: auto;}
    }
    @media screen and (min-width: 720px) {
      .event-details {overflow: hidden;}
    }
    .event-buttons button {width: 100%;}
    .event-details {
      h1, h3 {
        // font-size: 2.5em;
        display:inline-block;
        &:last-child {
          &::before{
            content: ' - '
          }
        }
      }
      i {font-size: 0.7em;}
    }
  }
  .event-main {
    padding: 20px;
    .description {
      @media screen and (max-width: 500px) {
        // text-align: center;
      }
      h1 {display: inline;}
      #controls {
        float: right;
        @media screen and (max-width: 500px) {
          width: 100%;
        }
        button {
          &:not(:last-child) {margin-right: 5px;}
          @media screen and (max-width: 500px) {
            width: 49%;
          }
        }
      }
      textarea {
        border: none;
        overflow: auto;
        -webkit-box-shadow: none;
        -moz-box-shadow: none;
        box-shadow: none;
        &:focus {
          background-color: $edit-description;
          outline: 1px solid gray;
        }
      }
    }
  }
}
</style>
