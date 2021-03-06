<template lang="html">
  <div class="timeline-events">
    <div class="events" id="container" @mousedown="drag($event, 'down')" @mousemove="drag($event, 'drag')" @mouseup="drag($event, 'up')">
      <div id="slider" :style="{width: sliderWidth}">
        <div class="event" v-for="(e, index) in eventsInOrder" :key="e.id">
          <div class="time" v-if="index === 0 || index === events.length-1">
            <p>{{formatEventTime(e.EventDateTime)}}</p>
          </div>
          <div class="title" :id="e.Id" @click="clickedTitle($event)">
            <p>{{e.Title}}</p>
          </div>
          <div v-if="index != events.length-1" id="h-line"></div>
          <div v-if="index === 0 || index === events.length-1" id="v-line-time" class="v-line"></div>
          <div v-if="selectedEvent.Id === e.Id" id="v-line-title" class="v-line"></div>
        </div>
        <div class="info" id="event-info">
          <div v-if="selectedEvent.Id != ''" id="event-info-inner">
            <div v-if="isWidthLarge()">
              <h3 @click="openModal('editEventTitle')" style="cursor: pointer;">{{selectedTitle}}</h3>
              <h4>{{selectedDate}} - {{selectedTime}}</h4>
              <p>
                {{selectedDescription}}
              </p>
              <b-btn variant="create" @click="openEvent">More</b-btn>
              <b-btn variant="delete" @click="openModal('deleteEvent')" style="float: right;">Delete</b-btn>
            </div>
            <div v-else class="event-info-mobile">
              <b-btn variant="create" @click="openEvent">More</b-btn>
              <b-btn variant="delete" @click="openModal('deleteEvent')" style="float: right;">Delete</b-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
    <b-modal  v-model="modal" :title="modalTitle" @shown="modalOpened" @hidden="modalClosed" size="lg">
      <b-container fluid>
        <b-row v-if="modalType === 'deleteEvent'">
          <b-col>
            <p>
              Are you sure you wish to delete this event?
            </p>
          </b-col>
        </b-row>
        <b-row v-else-if="modalType === 'editEventTitle'">
          <b-col>
            <input type="text" v-model="newEventTitle" @keyup.enter="changeEventTitle" @keyup="checkTitleInput" placeholder="Enter new title" id="titleInput" />
            <b-alert variant="danger" :show="showTitleWarning">Title must be at least 5 characters long</b-alert>
          </b-col>
        </b-row>
      </b-container>
      <div slot="modal-footer" class="w-100">
        <b-btn class="float-left" @click="closeModal">CANCEL</b-btn>
        <b-btn v-if="modalType === 'deleteEvent'" class="float-right" @click="deleteEvent">DELETE</b-btn>
        <b-btn v-else-if="modalType === 'editEventTitle'" class="float-right" @click="changeEventTitle">SAVE</b-btn>
      </div>
    </b-modal>
  </div>
</template>

<script>
import {formatEventTime, formatEventDate, sortEvents, validTitle} from '../../scripts/script'
import $ from 'jquery'

var drag = false
var lastPos = []
var pos = []
var difference = []
var scale = 1

export default {
  name: 'aEvents',
  data() {
    return {
      formatEventTime,
      formatEventDate,
      scale,
      selectedEvent: {
        'Id': '',
        'Title': '',
        'EventDateTime': '',
        'Description': '',
        'IsDeleted': '',
        'Location': '',
        'LinkedTimelineEventIds': [],
        'Attachments': []
      },
      modal: false,
      modalTitle: '',
      newEventTitle: '',
      showTitleWarning: false,
      modalType: ''
    }
  },
  mounted() {
    var slider = document.getElementById("slider")
    // slider.style.width = this.sliderWidth()
    require('mouse-wheel')((dx, dy, dz, ev) => {
      if (this.isWidthLarge()) {
        if (ev.ctrlKey) {
          ev.preventDefault()
          if (dy > 0 && this.scale > .2) {
            this.scale -= .1
          }
          if (dy < 1.2) {
            this.scale += .1
          }
          slider.style.transform = "scale("+this.scale+")"
        }
      }
    })

    var self = this

    $(window).resize(function() {
      self.clearSelected()
    })
  },
  computed: {
    sliderWidth() {
      // if (this.isWidthLarge()) {
      return 375 * this.events.length + "px"
      // }
    },
    eventsInOrder() {
      return sortEvents(this.events)
    },
    selectedTitle() {
      if (this.selectedEvent.Title != null)
        return this.selectedEvent.Title
      return ""
    },
    selectedTime() {
      if (this.selectedEvent.EventDateTime != null)
        return formatEventTime(this.selectedEvent.EventDateTime)
      return ""
    },
    selectedDate() {
      if (this.selectedEvent.EventDateTime != null)
        return formatEventDate(this.selectedEvent.EventDateTime)
      return ""
    },
    selectedDescription() {
      if (this.selectedEvent.Description != null) {
        var s = this.selectedEvent.Description
        if (s.length > 90) {
          s = s.substr(0,90) + '...'
        }
        return s
      }
      return ""
    }
  },
  props: {
    events: {
      type: Array,
      required: true
    }
  },
  methods: {
    drag: function(event, type) {
      if (type === "down") {
        drag = true
        lastPos = [event.clientX, event.clientY]
      }
      if (type === "up") {
        drag = false
      }
      if (type === "drag" && drag) {
        pos = [event.clientX, event.clientY]
        difference = [ (pos[0]-lastPos[0]), (pos[1]-lastPos[1])]
        event.srcElement.scrollLeft = event.srcElement.scrollLeft - (difference[0]/10)
      }
    },
    clickedTitle: function(event) {
      if (event.srcElement.classList.contains("selected")) {
        this.clearSelected()
        return
      }
      this.clearSelected()
      event.srcElement.classList.add("selected")
      this.selectedEvent = this.getEventFromId(event.srcElement.id)

      var info = document.getElementById("event-info")
      if (this.isWidthLarge()) {
        var eventX = event.target.offsetLeft
        info.style.left = eventX + "px"
        info.style.top = ''
      } else {
        var eventY = event.target.offsetTop + 18
        // var x = window.outerWidth - 200
        var x = event.target.offsetLeft + $(".event").width() - 200
        info.style.top = eventY + "px"
        info.style.left = x + "px"
      }


    },
    clearSelected: function() {
      var selected = document.getElementsByClassName("selected")
      for (var i = selected.length-1; i >= 0; i--) {
        selected[0].classList.remove("selected")
      }
      this.selectedEvent = {
        'Id': '',
        'Title': '',
        'EventDateTime': '',
        'Description': '',
        'IsDeleted': '',
        'Location': '',
        'LinkedTimelineEventIds': [],
        'Attachments': []
      }
    },
    getEventFromId: function(id) {
      return this.events.filter(event => event.Id === id)[0]
    },
    editEventTitle: function() {

    },
    openEvent: function() {
      this.$store.commit('setCurrentEvent', this.selectedEvent)
      this.$router.push({name: 'EVENT'})
    },
    deleteEvent: function() {
      this.closeModal()
      this.$store.dispatch('deleteEvent', this.selectedEvent.Id)
      this.clearSelected()
    },
    dateFromDateTime(dateTime) {
      return dateTime.substr(0,10)
    },
    timeFromDateTime(dateTime) {
      return dateTime.substr(11,16)
    },
    openModal(type) {
      this.modal = true
      this.modalType = type
    },
    closeModal() {
      this.modal = !this.modal
    },
    modalOpened() {
      if (this.modalType === "deleteEvent") {
        this.modalTitle = "Delete"
      } else if (this.modalType === "editEventTitle") {
        document.getElementById('titleInput').focus()
        this.modalTitle = "Edit"
        this.newEventTitle = this.selectedEvent.Title
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
        document.getElementById('titleInput').focus()
        this.showTitleWarning = true
        return
      }
      this.closeModal()
      var payload = {
        id: this.selectedEvent.Id,
        title: this.newEventTitle
      }
      this.$store.dispatch('changeEventTitle', payload)
    },
    isWidthLarge() {
      var width = window.outerWidth
      return width > 992
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/styles/theme.scss';
@import '../../assets/styles/main.scss';

$width-large: 992px;

.timeline-events {
  width: 100%;  
  .events {
    overflow: hidden;
    height: 500px;
    cursor: pointer;
    width: 100vw;
    height: 500px;
    // box-shadow: 0 0 5px 5px rgba(0, 0, 0, .1);
    padding-top: 10px;
    @media screen and (max-width: $width-large) {
      height: auto;
      width: 100%;
      margin: auto;
    }
    #slider {
      position: relative;
      top: 0;
      left: 0;
      transform-origin: 0 0;
      pointer-events: none;
      @media screen and (max-width: $width-large) {
        transform: scale(1) !important;
        width: 100% !important;
      }
    }
    #h-line {
      width: 75px;
      border-bottom: 1px solid black;
      position: relative;
      top: -35px;
      right: -300px;
      @media screen and (max-width: $width-large) {
        display: none;
      }
    }
    .v-line {
      height: 50px;
      border-left: 1px solid black;
      &#v-line-title {
        position: relative;
        left: 150px;
      }
      &#v-line-time {
        position: absolute;
        margin-left: 150px;
        margin-top: -120px;
      }
      @media screen and (max-width: $width-large) {
        display: none;
      }
    }
    .event {
      margin-left: 37.5px;
      margin-right: 37.5px;
      display: inline-block;
      text-align: center;
      cursor: default;
      pointer-events: all;
      @media screen and (max-width: $width-large) {
        width: 100%;
        margin: 0;
        text-align: left;
        padding-top: 1px;
      }
      p {
        position: relative;
        top: 50%;
        transform: translateY(-50%);
        pointer-events: none;
        @media screen and (max-width: $width-large) {
          padding-left: 20px;
        }
      }
      .time {
        background-color: $text;
        color: white;
        width: 200px;
        height: 70px;
        margin: auto;
        transform: skewX(-10deg);
        @media screen and (max-width: $width-large) {
          display: none;
          background-color: red;
        }
      }
      .title {
        background-color: white;
        margin-top: 50px;
        position: relative;
        top: 50%;
        width: 300px;
        height: 70px;
        &.selected {
          background-color: $select;
          color: white;
        }
        @media screen and (max-width: $width-large) {
          width: 100%;
          margin-top: 0;
        }
      }
    }
    .info {
      position: absolute;
      pointer-events: all;
      cursor: default;
    }
    .info #event-info-inner{
      background-color: white;
      box-shadow: 0 16px 16px rgba(0, 0, 0, .16);
      width: 300px;
      max-height: 200px;
      padding: 10px;
      h3 {
        // overflow: hidden;
        white-space: nowrap;
      }
      overflow: hidden;
      .icon {
        cursor: pointer;
      }

      @media screen and (max-width: $width-large) {
        width: 198px;
        padding: 0;
        background-color: inherit;
        box-shadow: none;
      }
    }
  }
}
</style>
