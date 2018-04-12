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
              <b-row>
                <b-col sm="12" class="description">
                  <h1>Description</h1>
                  <span id="controls">
                    <b-btn id="cancel-description" variant="cancel-edit" v-if="description !== newEventDescription" @click="cancelDescription">Cancel</b-btn>
                    <b-btn id="save-description" variant="save" v-if="description !== newEventDescription" @click="saveDescription">Save</b-btn>
                  </span>
                  <b-form-textarea id="event-description" placeholder="Enter description" v-model="newEventDescription" style="cursor: pointer;" no-resize/>
                </b-col>
              </b-row>
              <b-row>
                <b-col sm="12" md="6" class="attachments">
                  <h1>Attachments</h1>
                  <ul id="attachment-list">
                    <li v-for="attachment in attachments" :key="attachment.Id" @click="clickedAttachment($event)">
                      <span :id="attachment.Id">{{attachment.Title}}</span>
                    </li>
                  </ul>
                  <span id="controls">
                    <b-btn id="delete-attachment" variant="delete" @click="openModal('deleteAttachment')" :disabled="selectedAttachmentId === ''">Delete</b-btn>
                    <b-btn id="create-attachment" variant="create" @click="openModal('createAttachment')">Create</b-btn>
                  </span>
                </b-col>
              </b-row>
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
          <b-row v-else-if="modalType === 'createAttachment'">
            <input type="file" id="newAttachmentInput"/>
          </b-row>
          <b-row v-else-if="modalType === 'deleteAttachment'">
            <b-col>
              <p>
                Are you sure you wish to delete this attachment?
              </p>
            </b-col>
          </b-row>
        </b-container>
        <div slot="modal-footer" class="w-100">
          <b-btn class="float-left" @click="closeModal">CANCEL</b-btn>
          <b-btn v-if="modalType === 'editEventTitle'" class="float-right" @click="changeEventTitle">SAVE</b-btn>
          <b-btn v-else-if="modalType === 'createAttachment'" class="float-right" @click="createAttachment">Create</b-btn>
          <b-btn v-else-if="modalType === 'deleteAttachment'" class="float-right" @click="deleteAttachment">Delete</b-btn>
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
      newEventTitle: '',
      selectedAttachmentId: ''
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
    },
    attachments() {
      return this.event.Attachments
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
      } else if (this.modalType === "createAttachment") {
        this.modalTitle = "Create"
      } else if (this.modalType === "deleteAttachment") {
        this.modalTitle = "Delete"
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
        if (this.modalType === "editEventTitle") {
          if (validTitle(this.newEventTitle)) {
            this.showTitleWarning = false
          }
        } else if (this.modalType === "createAttachment") {
          if (validTitle(this.newAttachmentTitle)) {
            this.showTitleWarning = false
          }
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
    },
    createAttachment() {
      var fileInput = document.getElementById('newAttachmentInput')
      var file = fileInput.files[0]
      if (file === '') return
      this.closeModal()
      this.$store.dispatch('createAttachment', file)
    },
    clickedAttachment(event) {
      if (event.target.classList.contains("selected")) {
        this.clearSelected()
        return
      }
      this.clearSelected()
      event.target.classList.add("selected")
      this.selectedAttachmentId = event.target.children[0].id
    },
    clearSelected() {
      var selected = document.getElementsByClassName("selected")
      for (var i = selected.length-1; i >= 0; i--) {
        selected[0].classList.remove("selected")
      }
      this.selectedAttachmentId = ''
    },
    deleteAttachment() {
      this.closeModal()
      this.$store.dispatch('deleteAttachment', this.selectedAttachmentId)
      this.clearSelected()
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
    h1 {display: inline;}
    #controls {
      @media screen and (max-width: 500px) {width: 100%;}
      button {
        &:not(:last-child) {margin-right: 5px;}
        @media screen and (max-width: 500px) {width: 49%;}
      }
    }
    .description {
      #controls {
        float: right;
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
    .attachments {
      ul {
        list-style-type: none;
        padding: 0;
        width: 65%;
        @media screen and (max-width: 768px) {
          width: 100%;
        }
        max-height: 120px;
        overflow-y: auto;
        li {
          span {
            pointer-events: none;
          }
          &:hover {background-color: $attachment-hover;}
          &.selected {
            background-color: $select;
            color: white;
          }
        }
      }
    }
  }
}
</style>
