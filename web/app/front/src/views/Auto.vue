<template>
  <div id="auto">
    <div class="nav-top">{{ project_name }} <span v-if="sub_name" class="subname">{{ sub_name }}</span></div>
    <div class="main">
      <span></span>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'auto',
  data() {
    return {
      project_name: this.$route.params.project,
      project: {},
      sub_name: this.$route.params.sub,
      subs: {},
    }
  },
  watch: {
    '$route' (to, from) {
      this.project_name = to.params.project;
      this.sub_name = to.params.sub;

      let self = this;
      axios.get('http://127.0.0.1:8000/api/test')
        .then(function (response) {
          let project = response.data.find(function(project) {
            return project.name == self.project_name
          });
          self.project = project || {};
          self.subs = project && project.sub || {};
        });
    }
  },
  components: {

  }
}
</script>

<style>
#auto .nav-top {
  text-align: left;
  color: #666;
  line-height: 50px;
}

#auto .subname {
  font-size: 14px;
}
</style>
