<template>
    <div id="app">
        <div class="container">
            <div class="row">
                <div class="col-sm-6">
                    <div class="well" style="text-align: left">
                        <div style="text-align: center; margin-bottom: 25px;">
                            <img alt="PipeRun logo" src="https://piperun.s3-sa-east-1.amazonaws.com/logo/logo_preta.png" width="200px">
                        </div>
                        <p>
                            Este aplicativo faz a busca de todas as empresas do cliente, retira o atributo 
                            segmento das empresas e remove <strong>todos</strong> os segmentos da base.
                            <br><br>
                            Para que funcione, é importante informar o token da API do cliente.
                        </p>
                        <div class="form-group">
                            <input class="form-control" type="text" value="" v-model="token" />
                        </div>
                        <div class="form-group">
                            <button class="btn btn-success btn-lg btn-block" @click="begin" :disabled="get_button">Iniciar Processo</button>
                        </div>
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="well">
                        <div :class="['alert ', (prog_get_companies == 100) ? 'alert-success' : 'alert-warning']">
                            <div class="row">
                                <div class="col-sm-1">
                                    <i :class="['glyphicon', (prog_get_companies == 100) ? 'glyphicon-ok-circle' : (prog_get_companies == 0) ? 'glyphicon-time' : 'glyphicon-spin glyphicon-refresh']"></i>
                                </div>
                                <div class="col-sm-11">
                                    <p>Buscar todas as empresas.</p>
                                    <div class="progress" v-show="show_get_companies">
                                        <div :class="['progress-bar', (prog_get_companies == 100) ? 'progress-bar-success' : 'progress-bar-warning progress-bar-striped active']" role="progressbar" :aria-valuenow="prog_get_companies" aria-valuemin="0" aria-valuemax="100" :style="{ width: prog_get_companies + '%' }">
                                            {{ prog_get_companies }} %
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="alert alert-warning">
                            <div class="row">
                                <div class="col-sm-1">
                                    <i class="glyphicon glyphicon-time"></i>
                                </div>
                                <div class="col-sm-11">
                                    <p>Remover o atributo <strong>segmento</strong> das empresas.</p>
                                    <div class="progress" v-show="show_update_companies">
                                        <div class="progress-bar" role="progressbar" :aria-valuenow="prog_update_companies" aria-valuemin="0" aria-valuemax="100" :style="{ width: prog_update_companies + '%' }">
                                            {{ prog_update_companies }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="alert alert-warning">
                            <div class="row">
                                <div class="col-sm-1">
                                    <i class="glyphicon glyphicon-time"></i>
                                </div>
                                <div class="col-sm-11">
                                    <p>Buscar todas os segmentos.</p>
                                    <div class="progress" v-show="show_get_segments">
                                        <div class="progress-bar" role="progressbar" :aria-valuenow="prog_get_segments" aria-valuemin="0" aria-valuemax="100" :style="{ width: prog_get_segments + '%' }">
                                            {{ prog_get_segments }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="alert alert-warning">
                            <div class="row">
                                <div class="col-sm-1">
                                    <i class="glyphicon glyphicon-time"></i>
                                </div>
                                <div class="col-sm-11">
                                    <p>Remover <strong>todos</strong> os segmentos.</p>
                                    <div class="progress" v-show="show_delete_segments">
                                        <div class="progress-bar" role="progressbar" :aria-valuenow="prog_delete_segments" aria-valuemin="0" aria-valuemax="100" :style="{ width: prog_delete_segments + '%' }">
                                            {{ prog_delete_segments }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
            token: 'a3f1c21d0824e5a6406c3f6e18885dbe',
            //token: '62a0b768c257014f4382f270dc9bd198',
            actual_percentage: 0,
            prog_get_companies: 0,
            prog_get_segments: 0,
            prog_update_companies: 0,
            prog_delete_segments: 0,
            show_get_companies: false,
            show_get_segments: false,
            show_update_companies: false,
            show_delete_segments: false,
            get_button: true,
            update_button: true,
            delete_button: true
        }
    },
    methods: {
        begin() {
            http.defaults.headers.token = this.token

            this.getCompanies()
        },
        getCompanies() {
            this.page = 1
            this.actual_percentage = 1

            while (this.page <= this.total_pages_companies) {
                http.get('/companies?show=200&page=' + this.page)
                    .then(response => {
                        this.show_get_companies = true
                        this.prog_get_companies = Math.floor(this.actual_percentage / this.total_pages_companies * 100)
                        this.actual_percentage++

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
            this.actual_percentage = 1

            if (this.companies.length == this.total_companies) {
                for (let i = 0; i < this.companies.length; i++) {
                    http.put('/companies/' + this.companies[i], {
                            'segment_id': null
                        })
                        .then(response => {
                            this.show_update_companies = true
                            this.prog_update_companies = Math.floor(this.actual_percentage / this.total_companies * 100)
                            this.actual_percentage++

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
            this.actual_percentage = 1

            while (this.page <= this.total_pages_segments) {
                http.get('/segments?show=200&page=' + this.page)
                    .then(response => {
                        this.show_get_segments = true
                        this.prog_get_segments = Math.floor(this.actual_percentage / this.total_pages_segments * 100)
                        this.actual_percentage++

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
            this.actual_percentage = 1

            if (this.segments.length == this.total_segments) {
                for (let i = 0; i < this.segments.length; i++) {
                    http.delete('/segments/' + this.segments[i])
                        .then(response => {
                            this.show_delete_segments = true
                            this.prog_delete_segments = Math.floor(this.actual_percentage / this.total_segments * 100)
                            this.actual_percentage++

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
        http.get('/companies?show=200&page=0&token=' + this.token)
            .then(response => {
                this.total_companies = response.data.meta.total
                this.total_pages_companies = response.data.meta.total_pages
                this.get_button = false
            })
            .catch(e => {
                console.log(e)
            })

        http.get('/segments?show=200&page=0&token=' + this.token)
            .then(response => {
                this.total_segments = response.data.meta.total
                this.total_pages_segments = response.data.meta.total_pages
                this.delete_button = false
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

.glyphicon-spin {
    -webkit-animation: spin 1000ms infinite linear;
    animation: spin 1000ms infinite linear;
}

@-webkit-keyframes spin {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(359deg);
        transform: rotate(359deg);
    }
}
@keyframes spin {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(359deg);
        transform: rotate(359deg);
    }
}
</style>
