<template>
    <div id="app">
        <img alt="PipeRun logo" src="https://crmpiperun.com/wp-content/uploads/2017/04/piperun-crm-vendas-logodark.png">
        <div class="container">
            <div class="row">
                <button class="btn btn-primary" type="button" @click="getCompanies" :disabled="getButton">Buscar</button>
            </div>
            <div style="padding-top:25px;"></div>
            <div class="row">
                <button class="btn btn-warning" type="button" @click="updateCompanies" :disabled="updateButton">Atualizar</button>
            </div>
        </div>
    </div>
</template>

<script>
import http from './plugins/axios'

export default {
    name: 'App',
    data() {
        return {
            total: 0,
            total_pages: 0,
            endpoint: '/companies?show=200&page=',
            companies: [],
            page: 1,
            getButton: true,
            updateButton: true,
        }
    },
    methods: {
        getCompanies() {
            while (this.page <= this.total_pages) {
                http.get(this.endpoint + this.page)
                    .then(response => {
                        response.data.data.forEach(element => {
                            this.companies.push(element.id)
                        });
                    })
                    .catch(e => {
                        console.log(e)
                    })

                this.page++
            }
        },
        updateCompanies() {

        }
    },
    async mounted() {
        http.get(this.endpoint + '0')
            .then(response => {
                this.total = response.data.meta.total
                this.total_pages = response.data.meta.total_pages
                this.getButton = false
            })
            .catch(e => {
                console.log(e)
            })
    }
}
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
