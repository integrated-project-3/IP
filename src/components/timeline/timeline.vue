<template >
  <div class="timeline">
    <b-row class="head" align-v="start">
      <b-col>
        <b-btn variant="select" @click="back">Back</b-btn>
      </b-col>
      <b-col>
        <span class="timeline-details">
          <h1>{{timeline.title}}</h1>
          <p>
            {{formatDate(timeline.date)}}
          </p>
      </span>
      </b-col>
      <b-col>
        <b-btn variant="create" @click="openModal" style="float: right;">Create new event</b-btn>
      </b-col>
    </b-row>
    <b-row></b-row>
  </div>
</template>

<script>
import {formatDate} from '../../scripts/script'
import axios from 'axios'

var timeline = {
  title: '',
  date: '',
  isDeleted: '',
  id: ''
}

function fetchTimeline() {
  const timelineId = sessionStorage.getItem('timelineId')
  axios.get('https://b0qss3eydk.execute-api.eu-west-2.amazonaws.com/aileron/GetTimeline', {
    headers: {
      'X-Api-Key': 'zQfYRHZ1vY3GFnvDZep8Z5KqlHsOKxgf1vnldchF',
      'timelineid': timelineId
    }
  })
  .then((data) => {
    timeline.title = data.data.Title
    timeline.date = data.data.CreationTimeStamp
    timeline.isDeleted = data.data.isDeleted
    timeline.id = data.data.Id
  })
  .catch(error => {
    console.log(error)
  })
}

export default {
  name: 'aTimeline',
  data() {
    return {
      timeline,
      formatDate
    }
  },
  //eslint-disable-next-line
  beforeRouteEnter(to, from, next) {
    //eslint-disable-next-line
    next(vm => {
      fetchTimeline()
    })
  },
  methods: {
    back: function() {
      this.$router.push({name: 'REGISTER'})
    },
    openModal: function() {
      alert("new")
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
}
</style>
