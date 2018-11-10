<template>
  <div id="app">
    <div class="main-l">
      <div class="nav-top"></div>
      <div class="level1" v-for="project in projects">
        <router-link class="level1-title" :to="{ name: 'project', params: { project: project.name }}">
          {{ project.name }}
        </router-link>
          <div class="level2" v-for="sub in project.sub">
            <router-link class="level2-title" :to="{ name: 'sub', params: { project: project.name, sub: sub.name }}">
              {{ sub.name }}
            </router-link>
          </div>
      </div>
    </div>
    <div class="main-r">
      <router-view/>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Data from './data/data';

export default {
  name: 'app',
  data() {
    return {
      projects: {}
    }
  },
  created() {
    let self = this;
    axios.get('http://127.0.0.1:8000/api/test')
      .then(function (response) {
         self.projects = response.data;
         console.log(self.projects);
      });
  }
}
</script>

<style scoped>
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: -webkit-flex;
  display: flex;
  width: 100%;
  height: 100%;
}

#app .main-l
{
  width: 250px;
}

#app .main-r {
  flex-grow: 1;
}

#app .nav-top {
  height: 50px;
}

#app .main-l .level1-title,
#app .main-l .level2-title {
  height: 50px;
  line-height: 50px;
  text-align: left;
}

#app .main-l .level1-title {
  padding-left: 20px;
}

#app .main-l .level2-title {
  padding-left: 40px;
}


#app .main-l a {
  display: inline-block;
  width: 100%;
}

a.router-link-exact-active {
  color: #42b983;
  background: #e0eefa;
}

</style>
