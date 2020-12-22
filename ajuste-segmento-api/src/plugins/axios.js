import Vue from 'vue';
import axios from 'axios';
import rateLimit from 'axios-rate-limit';

// HTTP Axios
Vue.use(axios)

export default rateLimit(axios.create({
        baseURL: 'https://api.pipe.run/v1',
        headers: {
            'Content-Type': 'application/json',
            //'token': 'a3f1c21d0824e5a6406c3f6e18885dbe'
            'token': '62a0b768c257014f4382f270dc9bd198'
        }
    }), {
        maxRequests: 2,
        perMilliseconds: 1000,
        maxRPS: 2
    });