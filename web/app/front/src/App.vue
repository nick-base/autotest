<template>
  <div id="app">
    <div class="main-l">
      <div class="nav-top"></div>
      <div class="level1" v-for="project in projects">
        <router-link class="level1-title" v-bind:title="project.description" :to="{ name: 'project', params: { project: project.name }}">
          {{ project.name }}
        </router-link>
          <div class="level2" v-for="sub in project.sub">
            <router-link class="level2-title" v-bind:title="sub.display" :to="{ name: 'sub', params: { project: project.name, sub: sub.name }}">
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

export default {
  name: 'app',
  data() {
    return {
      projects: {}
    }
  },
  created() {
    let self = this;
    axios.get('http://127.0.0.1:8081/api/getlist')
      .then(function (response) {
         self.projects = response.data;
      });
  }
}
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

* {
  box-sizing: border-box;
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

#app:before {
  content: '';
  background: url('./assets/bg1.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center top;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: -100;
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
  padding-left: 50px;
  margin-bottom: 30px;
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

#app .main-l {
  background: #f7f7f7;
}

#app .main-l .nav-top {
  background: #5a863c;
}

#app .main-r .nav-top {
  background: #669844;
}

#app .main-l a {
  text-decoration: none;
  color: #369;
}

#app .main-l a:active {
  color: #369;
}

a.router-link-exact-active {
  color: #fff;
  background: #6cc;
}
</style>
