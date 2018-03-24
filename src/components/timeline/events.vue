<template lang="html">
  <div class="events" id="container" @mousedown="drag($event, 'down')" @mousemove="drag($event, 'drag')" @mouseup="drag($event, 'up')">
    <div id="slider" :style="{width: sliderWidth}">
      <div class="event" v-for="(e, index) in eventsInOrder" :key="e.id">
        <div class="time" v-if="index === 0 || index === events.length-1">
          <p>{{formatAttachmentTime(e.EventDateTime)}}</p>
        </div>
        <div class="title" :id="e.Id" @click="clickedTitle($event)">
          <p>{{e.Title}}</p>
        </div>
        <div v-if="index != events.length-1" id="h-line"></div>
        <div v-if="index === 0 || index === events.length-1" id="v-line-time" class="v-line"></div>
        <div v-if="selectedEvent.Id === e.Id" id="v-line-title" class="v-line"></div>
      </div>
      <div class="info" id="event-info">
        <div v-if="selectedEvent.Id != ''" >
          <h2>{{selectedTitle}}<i class="material-icons icon" style="padding-left: 5px;">edit</i></h2>
          <h4>{{selectedTime}}</h4>
          <p>
            {{selectedDescription}}
          </p>
          <b-btn variant="create" @click="openEvent">More</b-btn>
          <b-btn variant="delete" @click="deleteEvent" style="float: right;">Delete</b-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {formatAttachmentTime} from '../../scripts/script'

var drag = false
var lastPos = []
var pos = []
var difference = []
var scale = 1

export default {
  name: 'aEvents',
  data() {
    return {
      formatAttachmentTime,
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
      }
    }
  },
  mounted() {
    var slider = document.getElementById("slider")
    // slider.style.width = this.sliderWidth()
    require('mouse-wheel')((dx, dy, dz, ev) => {
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
    })
  },
  computed: {
    sliderWidth() {
      return 375 * this.events.length + "px"
    },
    eventsInOrder() {
      return this.events
    },
    selectedTitle() {
      if (this.selectedEvent.Title != null)
        return this.selectedEvent.Title
      return ""
    },
    selectedTime() {
      if (this.selectedEvent.EventDateTime != null)
        return formatAttachmentTime(this.selectedEvent.EventDateTime)
      return ""
    },
    selectedDescription() {
      if (this.selectedEvent.Description != null)
        return this.selectedEvent.Description.substr(0,90) + '...'
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

      var eventX = event.srcElement.offsetLeft

      var info = document.getElementById("event-info")
      info.style.left = eventX + "px"

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

    },
    deleteEvent: function() {

    }
  }
}
</script>

<style lang="scss">
@import '../../assets/styles/theme.scss';
@import '../../assets/styles/main.scss';

.events {
  overflow: hidden;
  height: 500px;
  cursor: pointer;
  width: 100vw;
  height: 500px;
  box-shadow: 0 0 5px 5px rgba(0, 0, 0, .1);
  padding-top: 10px;
  #slider {
    position: relative;
    top: 0;
    left: 0;
    transform-origin: 0 0;
    pointer-events: none;
  }
  #h-line {
    width: 75px;
    border-bottom: 1px solid black;
    position: relative;
    top: -35px;
    right: -300px;
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
  }
  .event {
    margin-left: 37.5px;
    margin-right: 37.5px;
    display: inline-block;
    text-align: center;
    cursor: default;
    pointer-events: all;
    p {
      position: relative;
      top: 50%;
      transform: translateY(-50%);
      pointer-events: none;
    }
    .time {
      background-color: $text;
      color: white;
      width: 200px;
      height: 70px;
      margin: auto;
      transform: skewX(-10deg);
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
    }
  }
  .info {
    position: absolute;
    pointer-events: all;
    cursor: default;
  }
  .info div{
    background-color: white;
    box-shadow: 0 16px 16px rgba(0, 0, 0, .16);
    width: 300px;
    max-height: 200px;
    padding: 10px;
    .icon {
      cursor: pointer;
    }
    #delete-event {
      font-size: 19px;
    }
  }
}
</style>
