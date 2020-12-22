<template>
    <div id="app">
        <div class="container">
            <div class="row">
                <div class="col-sm-4"></div>
                <div class="col-sm-4">
                    <img alt="PipeRun logo" src="https://crmpiperun.com/wp-content/uploads/2017/04/piperun-crm-vendas-logodark.png">
                </div>
                <div class="col-sm-4"></div>
            </div>
            <div style="padding-top:50px;"></div>
            <div class="row">
                <div class="col-sm-4"></div>
                <div class="col-sm-4">
                    <div class="well" style="text-align: left">
                        <p>
                            Este aplicativo faz a busca de todas as empresas do cliente, retira o atributo 
                            segmento das empresas e remove <strong>todos</strong> os segmentos da base.
                            <br><br>
                            Para que funcione, é importante informar o token da API do cliente.
                        </p>
                    </div>
                </div>
                <div class="col-sm-4"></div>
            </div>
            <div style="padding-top:50px;"></div>
            <div class="row">
                <div class="col-sm-4"></div>
                <div class="col-sm-4">
                    <p>Buscar todas as empresas.</p>
                    <button class="btn btn-primary btn-lg btn-block" type="button" @click="getCompanies" :disabled="getButton">Buscar</button>
                </div>
                <div class="col-sm-4"></div>
            </div>
            <div style="padding-top:25px;"></div>
            <div class="row">
                <div class="col-sm-4"></div>
                <div class="col-sm-4">
                    <p>Remover o atributo <strong>segmento</strong> das empresas.</p>
                    <button class="btn btn-warning btn-lg btn-block" type="button" @click="updateCompanies">Atualizar</button>
                </div>
                <div class="col-sm-4"></div>
            </div>
            <div style="padding-top:25px;"></div>
            <div class="row">
                <div class="col-sm-4"></div>
                <div class="col-sm-4">
                    <p>Buscar todas os segmentos.</p>
                    <button class="btn btn-primary btn-lg btn-block" type="button" @click="getSegments" :disabled="getButton">Buscar</button>
                </div>
                <div class="col-sm-4"></div>
            </div>
            <div style="padding-top:25px;"></div>
            <div class="row">
                <div class="col-sm-4"></div>
                <div class="col-sm-4">
                    <p>Remover <strong>todos</strong> os segmentos.</p>
                    <button class="btn btn-danger btn-lg btn-block" type="button" @click="deleteSegments" :disabled="deleteButton">Remover</button>
                </div>
                <div class="col-sm-4"></div>
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
            total_companies: 0,
            total_pages_companies: 0,
            total_segments: 0,
            total_pages_segments: 0,
            companies: [],
            segments: [],
            page: 0,
            getButton: true,
            updateButton: true,
            deleteButton: true
        }
    },
    methods: {
        getCompanies() {
            this.page = 1

            while (this.page <= this.total_pages_companies) {
                http.get('/companies?show=200&page=' + this.page)
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
            if (this.companies.length == this.total_companies) {
                for (let i = 0; i < this.companies.length; i++) {
                    http.put('/companies/' + this.companies[i], {
                            'segment_id': null
                        })
                        .then(response => {
                            console.log(response)
                        })
                        .catch(e => {
                            console.log(e)
                        })
                }
            } else {
                alert('Problema ao atualizar empresas. A quantidade total não foi totalmente carregada.')
            }
        },
        getSegments() {
            this.page = 1
            
            while (this.page <= this.total_pages_segments) {
                http.get('/segments?show=200&page=' + this.page)
                    .then(response => {
                        response.data.data.forEach(element => {
                            this.segments.push(element.id)
                        });
                    })
                    .catch(e => {
                        console.log(e)
                    })

                this.page++
            }
        },
        deleteSegments() {
            if (this.segments.length == this.total_segments) {
                for (let i = 0; i < this.segments.length; i++) {
                    http.delete('/segments/' + this.segments[i])
                        .then(response => {
                            console.log(response)
                        })
                        .catch(e => {
                            console.log(e)
                        })
                }
            } else {
                alert('Problema ao atualizar empresas. A quantidade total não foi totalmente carregada.')
            }
        }
    },
    async mounted() {
        http.get('/companies?show=200&page=0')
            .then(response => {
                this.total_companies = response.data.meta.total
                this.total_pages_companies = response.data.meta.total_pages
                this.getButton = false
            })
            .catch(e => {
                console.log(e)
            })

        http.get('/segments?show=200&page=0')
            .then(response => {
                this.total_segments = response.data.meta.total
                this.total_pages_segments = response.data.meta.total_pages
                this.deleteButton = false
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
    color: #2c3e50;
    margin-top: 60px;
}
</style>
