import axios from 'axios';

export default {
  name: 'Data',
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
      });
  }
}
