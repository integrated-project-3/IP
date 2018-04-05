<template lang="html">
  <div>
    <div v-if="event != null">
      <b-row>
        <b-col md="10" offset-md="1" class="event-page" id="event-page">
          <b-row class="head" align-v="start">
            <b-col sm="12" lg="2" class="event-buttons">
              <b-btn variant="select" @click="back" id="event-back-button">Back</b-btn>
            </b-col>
            <b-col sm="12" lg="8" class="event-details">
              <h1>{{title}}<i v-on:click="openModal('editEventTitle')" class="material-icons icon">edit</i></h1>
              <h3>{{date}} - {{time}}<i class="material-icons date-range">date_range</i></h3>
            </b-col>
            <b-col sm="12" lg="2" class="event-buttons">
              <b-btn variant="delete" @click="openModal('deleteEvent')" id="event-delete-button">Delete event</b-btn>
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
  // .event-header {
    // padding: 20px;
    // @media screen and (max-width: 720px) {
    //   text-align: center;
    // }
    // .btn-round {
    //   position: relative;
    //   bottom: 50%;
    //   transform: translateY(50%);
    //   font-size: 1px;
    //   padding: 0;
    //   @media screen and (max-width: 720px) {
    //     width: 100%;
    //     border-radius: 2px;
    //   }
    // }
    // #delete {
    //   @media screen and (min-width: 720px) {
    //     position: absolute;
    //     right: 0;
    //     top: 0;
    //   }
    //   @media screen and (max-width: 720px) {
    //     margin-top: 20px;
    //   }
    // }
    // h1 {
    //   display: inline;
    // }
    // i.date-range {
    //   font-size: 0.9em;
    // }
  // }
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
</style>
