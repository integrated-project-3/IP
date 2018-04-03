<template lang="html">
  <div>
    <div v-if="event != null">
      <b-row>
        <b-col md="10" offset-md="1" class="event-page" id="event-page">
          <b-row class="event-header">
            <b-col md="1">
              <b-btn class="btn-round" variant="create" @click="back"><i class="material-icons">arrow_back</i></b-btn>
            </b-col>
            <b-col md="1" id="delete">
              <b-btn class="btn-round" variant="delete" @click="openModal('deleteEvent')"><i class="material-icons">delete</i></b-btn>
            </b-col>
            <b-col md="5">
              <h1>{{title}}</h1>
            </b-col>
            <b-col md="5">
              <h1 v-if="this.event.EventDateTime === 'n/a'"></h1>
              <h1 v-else>{{date}} - {{time}} <i class="material-icons date-range">date_range</i></h1>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
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
import {formatEventDate, formatEventTime} from '../../scripts/script'

export default {
  name: 'aTimeline',
  computed: {
    timeline() {
      return this.$store.state.currentTimeline
    },
    event() {
      return this.$store.state.currentEvent
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
    }
  },
  methods: {
    back() {
      this.$router.push({name: 'TIMELINE'})
    },
    openModal(type) {
      console.log(type)
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
  .event-header {
    padding: 20px;
    @media screen and (max-width: 720px) {
      text-align: center;
    }
    .btn-round {
      position: relative;
      bottom: 50%;
      transform: translateY(50%);
      font-size: 1px;
      padding: 0;
      @media screen and (max-width: 720px) {
        width: 100%;
        border-radius: 2px;
      }
    }
    #delete {
      @media screen and (min-width: 720px) {
        position: absolute;
        right: 0;
        top: 0;
      }
      @media screen and (max-width: 720px) {
        margin-top: 20px;
      }
    }
    h1 {
      display: inline;
    }
    i.date-range {
      font-size: 0.9em;
    }
  }
}
</style>
