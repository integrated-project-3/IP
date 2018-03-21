<template lang="html">
  <div class="events">
    <div class="event-title" v-for="e in events" :key="e.id">
      <p>{{e.Title}}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'aEvents',
  props: {
    events: {
      type: Array,
      required: true
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles/theme.scss';
@import '../../assets/styles/main.scss';
.events {
  width: 100%;
  height: 450px;
  background-color: yellow;
  overflow-x: scroll;
  .event-title {
    margin-left: 75px;
    display: inline-block;
    width: 350px;
    height: 60px;
    background-color: white;
    text-align: center;
    p {
      position: relative;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
