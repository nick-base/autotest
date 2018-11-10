<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>

<script>
import axios from 'axios';


axios.get('http://127.0.0.1:8000/api/test')
  .then(function (response) {
     console.log(response);
  });


export default {
  name: 'home',
  components: {

  }
}
</script>
