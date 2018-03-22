<template lang="html">
  <div class="events" id="scroll" @mousedown="drag($event, 'down')" @mousemove="drag($event, 'drag')" @mouseup="drag($event, 'up')">
    <div class="float-wrapper" :style="{width: wrapperWidth+'px'}">
      <div class="event" v-for="(e, index) in events" :key="e.id">
        <div class="time" v-if="index === 0 || index === events.length-1">
          <p>{{formatAttachmentTime(e.EventDateTime)}}</p>
        </div>
        <div class="title" id="title" :style="{width: index!=0 && index!= events.length-1? eventWidth+'px':'300px'}">
          <p>{{e.Title}}</p>
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
var eventWidth = 300
var wrapperWidth = 0

export default {
  name: 'aEvents',
  data() {
    return {
      formatAttachmentTime,
      eventWidth,
      wrapperWidth
    }
  },
  mounted() {
    this.wrapperWidth = 375 * this.events.length
    require('mouse-wheel')((dx, dy) => {
      if (dy > 0) {
        this.eventWidth += 10
        this.wrapperWidth += 30
      }
      if (dy < 0) {
        this.eventWidth -= 10
        this.wrapperWidth -= 30
      }
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
  .float-wrapper {
    // width: 2000px;
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
    }
    .time {
      background-color: $text;
      color: white;
      width: 200px;
      height: 70px;
      margin: auto;
      transform: skewX(-10deg);
    }
    .title{
      background-color: white;
      margin-top: 50px;
      position: relative;
      top: 50%;
      // width: 300px;
      height: 70px;
    }
  }
}
</style>
