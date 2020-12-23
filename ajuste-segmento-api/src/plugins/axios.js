import Vue from 'vue';
import axios from 'axios';
import rateLimit from 'axios-rate-limit';

// HTTP Axios
Vue.use(axios)

export default rateLimit(axios.create({
        baseURL: 'https://api.pipe.run/v1',
        headers: {
            'Content-Type': 'application/json'
        }
    }), {
        maxRequests: 2,
        perMilliseconds: 1000,
        maxRPS: 2
    });