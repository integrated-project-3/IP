<template lang="html">
  <div class="events" id="container" @mousedown="drag($event, 'down')" @mousemove="drag($event, 'drag')" @mouseup="drag($event, 'up')">
    <div id="slider">
      <div class="event" v-for="(e, index) in events" :key="e.id">
        <div class="time" v-if="index === 0 || index === events.length-1">
          <p>{{formatAttachmentTime(e.EventDateTime)}}</p>
        </div>
        <div class="title" id="title" @click="clickedTitle($event)">
          <p>{{e.Title}}</p>
        </div>
        <div v-if="index != events.length-1" id="h-line"></div>
        <div v-if="index === 0 || index === events.length-1" id="v-line"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {formatAttachmentTime} from '../../scripts/script'
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
      formatAttachmentTime,
      scale
    }
  },
  mounted() {
    var slider = document.getElementById("slider")
    slider.style.width = 375 * this.events.length + "px"
    require('mouse-wheel')((dx, dy, dz, ev) => {
      if (dy > 0 && this.scale > .2) {
        this.scale -= .1
      }
      if (dy < 0) {
        this.scale += .1
      }

      // var windowHalfWidth = $("#container").width()/2
      // var minLeft = windowHalfWidth * 2 - slider.style.width.substring(0,slider.style.width.length-2) * this.scale
      // var xSelf = ev.pageX - $("#container").offset().left - parseFloat($("#slider").css("left"));
      // var newLeft
      // if (this.scale != 1) {
      //   newLeft = Math.min(Math.max((-(xSelf / 0.55 - windowHalfWidth)), minLeft), 0);
      // } else {
      //   newLeft = Math.min(Math.max((-(xSelf * 0.55 - windowHalfWidth)), minLeft), 0);
      // }
      // slider.style.left = newLeft + "px"

      slider.style.transform = "scale("+this.scale+")"
    })
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
      this.clearSelected()
      event.srcElement.classList.add("selected")
    },
    clearSelected: function() {
      var selected = document.getElementsByClassName("selected")
      for (var i = selected.length-1; i >= 0; i--) {
        selected[0].classList.remove("selected")
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles/theme.scss';
@import '../../assets/styles/main.scss';
.events {
  overflow: hidden;
  height: 500px;
  cursor: pointer;
  #slider {
    position: relative;
    top: 0;
    left: 0;
    transform-origin: 0 0;
  }
  #h-line {
    width: 75px;
    border-bottom: 1px solid black;
    position: relative;
    top: -35px;
    right: -300px;
  }
  #v-line {
    height: 50px;
    border-left: 1px solid black;
    position: relative;
    left: 150px;
    top: -120px
  }
  .event {
    margin-left: 37.5px;
    margin-right: 37.5px;
    display: inline-block;
    text-align: center;
    cursor: default;
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
}
</style>
