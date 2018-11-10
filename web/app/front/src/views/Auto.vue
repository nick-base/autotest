<template>
  <div id="auto">
    <div v-if="sub_name" class="nav-top">
      {{ sub.name }}<span class="lower">{{ sub.description }}</span>
    </div>
    <div v-else class="nav-top">
      {{ project.name }}<span class="lower">{{ project.description }}</span>
    </div>
    <div class="main">
      <div v-if="sub_name" class="sub-line" v-for="c in sub_case" @click="send(c.name)">
        {{ c.name }}
      </div>
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
      sub: {},
      sub_case: {},
    }
  },
  created() {
    this.refresh();
  },
  watch: {
    '$route' (to, from) {
      this.refresh();
    }
  },
  methods: {
    send (name) {
      let params = {
        'project': this.project_name,
        'sub': this.sub_name,
        'case': name
      };
      axios.get('http://127.0.0.1:8081/api/run', {
        params: params
      }).then(function (response) {
         console.log(response.data)
      });
    },
    refresh() {
      this.project_name = this.$route.params.project;
      this.sub_name = this.$route.params.sub;
      if (!this.sub_name) {
        this.subs = {}
        this.sub = {}
        this.sub_case = {}
      }
      let self = this;
      axios.get('http://127.0.0.1:8081/api/getlist')
        .then(function (response) {
          let project = response.data.find(function(project) {
            return project.name == self.project_name;
          });
          self.project = project || {};

          if (!project || !self.sub_name) {
            return
          }

          self.subs = project.sub || {};
          self.sub = self.subs && self.subs.find(function(s) {
            return s.name == self.sub_name;
          });
          self.sub_case = self.sub && self.sub.case || {};
        });
    },
  },
  components: {

  }
}
</script>

<style scoped>
#auto .nav-top {
  text-align: left;
  color: #fff;
  line-height: 50px;
}

#auto .lower {
  color: #eee;
  font-size: 14px;
  margin-left: 30px;
}

.main {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  height: 86vh;
}

.sub-line {
  line-height: 45px;
  height: 45px;
  padding-left: 20px;
  text-align: left;
  margin: 5px 0 5px 15px;
  background: #fff;
  border-radius: 5px;
  width: 300px;
  cursor: pointer;
}
</style>
