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
                            <input class="form-control" type="text" value="" v-model="token" :disabled="token_input" />
                        </div>
                        <div class="form-group">
                            <button class="btn btn-success btn-lg btn-block" @click="begin" :disabled="!token">Iniciar Processo</button>
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
                        <div :class="['alert ', (prog_update_companies == 100) ? 'alert-success' : 'alert-warning']">
                            <div class="row">
                                <div class="col-sm-1">
                                    <i class="glyphicon glyphicon-time"></i>
                                </div>
                                <div class="col-sm-11">
                                    <p>Remover o atributo <strong>segmento</strong> das empresas.</p>
                                    <div class="progress" v-show="show_update_companies">
                                        <div :class="['progress-bar', (prog_update_companies == 100) ? 'progress-bar-success' : 'progress-bar-warning progress-bar-striped active']" role="progressbar" :aria-valuenow="prog_update_companies" aria-valuemin="0" aria-valuemax="100" :style="{ width: prog_update_companies + '%' }">
                                            {{ prog_update_companies }} %
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div :class="['alert ', (prog_get_segments == 100) ? 'alert-success' : 'alert-warning']">
                            <div class="row">
                                <div class="col-sm-1">
                                    <i class="glyphicon glyphicon-time"></i>
                                </div>
                                <div class="col-sm-11">
                                    <p>Buscar todas os segmentos.</p>
                                    <div class="progress" v-show="show_get_segments">
                                        <div :class="['progress-bar', (prog_get_segments == 100) ? 'progress-bar-success' : 'progress-bar-warning progress-bar-striped active']" role="progressbar" :aria-valuenow="prog_get_segments" aria-valuemin="0" aria-valuemax="100" :style="{ width: prog_get_segments + '%' }">
                                            {{ prog_get_segments }} %
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div :class="['alert ', (prog_delete_segments == 100) ? 'alert-success' : 'alert-warning']">
                            <div class="row">
                                <div class="col-sm-1">
                                    <i class="glyphicon glyphicon-time"></i>
                                </div>
                                <div class="col-sm-11">
                                    <p>Remover <strong>todos</strong> os segmentos.</p>
                                    <div class="progress" v-show="show_delete_segments">
                                        <div :class="['progress-bar', (prog_delete_segments == 100) ? 'progress-bar-success' : 'progress-bar-warning progress-bar-striped active']" role="progressbar" :aria-valuenow="prog_delete_segments" aria-valuemin="0" aria-valuemax="100" :style="{ width: prog_delete_segments + '%' }">
                                            {{ prog_delete_segments }} %
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
import SweetAlert from 'sweetalert2'

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
            token: '',
            token_input: false,
            actual_percentage: 0,
            prog_get_companies: 0,
            prog_get_segments: 0,
            prog_update_companies: 0,
            prog_delete_segments: 0,
            show_get_companies: false,
            show_get_segments: false,
            show_update_companies: false,
            show_delete_segments: false
        }
    },
    methods: {
        begin() {
            http.defaults.headers.token = this.token
            this.actual_percentage = 1

            SweetAlert.fire({   
                title: 'Você tem certeza disso?',
                text: "Você não terá a possibilidade de reverter o processo!",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sim',
                cancelButtonText: 'Não',
                customClass: {
                    confirmButton: 'btn btn-success',
                    cancelButton: 'btn btn-danger',
                },
                buttonsStyling: false
            }).then((result) => {
                if (result.isDismissed) {
                    SweetAlert.fire({
                        title: 'Cancelado',
                        text: 'O processo foi cancelado com sucesso',
                        icon: 'info',
                        confirmButtonColor: '#3085d6',
                        customClass: {
                            confirmButton: 'btn btn-success'
                        },
                        buttonsStyling: false
                    })
                } else {
                    http.get('/companies?show=200&page=0')
                        .then(response => {
                            this.total_companies = response.data.meta.total
                            this.total_pages_companies = response.data.meta.total_pages

                            if (response.status == 200) {
                                this.token_input = true
                                return this.getCompanies()
                            }
                        })
                        .catch(error => {
                            switch (error.response.status) {
                                case 401:
                                    SweetAlert.fire({
                                        title: 'Acesso Não Autorizado',
                                        text: 'Verifique o token inserido e tente novamente.',
                                        icon: 'info',
                                        confirmButtonColor: '#3085d6',
                                        customClass: {
                                            confirmButton: 'btn btn-success'
                                        },
                                        buttonsStyling: false
                                    })
                                    break
                                case 503:
                                    SweetAlert.fire({
                                        title: 'Sistema Indisponível',
                                        text: 'A API do PipeRun está fora do ar. Tente novamente mais tarde.',
                                        icon: 'info',
                                        confirmButtonColor: '#3085d6',
                                        customClass: {
                                            confirmButton: 'btn btn-success'
                                        },
                                        buttonsStyling: false
                                    })
                                    break
                                default:
                                    console.log(error)
                                    break
                            }
                        })
        
                    http.get('/segments?show=200&page=0')
                        .then(response => {
                            this.total_segments = response.data.meta.total
                            this.total_pages_segments = response.data.meta.total_pages
                        })
                        .catch(error => {
                            switch (error.response.status) {
                                case 401:
                                    SweetAlert.fire({
                                        title: 'Acesso Não Autorizado',
                                        text: 'Verifique o token inserido e tente novamente.',
                                        icon: 'info',
                                        confirmButtonColor: '#3085d6',
                                        customClass: {
                                            confirmButton: 'btn btn-success'
                                        },
                                        buttonsStyling: false
                                    })
                                    break
                                case 503:
                                    SweetAlert.fire({
                                        title: 'Sistema Indisponível',
                                        text: 'A API do PipeRun está fora do ar. Tente novamente mais tarde.',
                                        icon: 'info',
                                        confirmButtonColor: '#3085d6',
                                        customClass: {
                                            confirmButton: 'btn btn-success'
                                        },
                                        buttonsStyling: false
                                    })
                                    break
                                default:
                                    console.log(error)
                                    break
                            }
                        })
                }
            })
            
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

                        if (response.status == 200 && this.prog_get_companies == 100) {
                            return this.updateCompanies()
                        }
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

                            if (this.prog_update_companies == 100) {
                                this.getSegments()
                            }

                            console.log(response)
                        })
                        .catch(e => {
                            console.log(e)
                        })
                }
            } else {
                SweetAlert.fire({
                    title: 'Problema ao atualizar empresas',
                    text: 'A quantidade total não foi totalmente carregada.',
                    icon: 'error',
                    customClass: {
                        confirmButton: 'btn btn-danger'
                    },
                    buttonsStyling: false
                })
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

                        if (response.status == 200 && this.prog_get_segments == 100) {
                            this.deleteSegments()
                        }
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
                SweetAlert.fire({
                    title: 'Problema ao remover os segmentos',
                    text: 'A quantidade total não foi totalmente carregada.',
                    icon: 'error',
                    customClass: {
                        confirmButton: 'btn btn-danger'
                    },
                    buttonsStyling: false
                })
            }

            this.token_input = false
            SweetAlert.fire('Ajuste Segmento API', '<p>O processo terminou com sucesso!</p>', 'success');
        }
    },
    // events: {
    //     'ready.begin': function (key) {
    //         console.log('Disparei o evento do Begin')
    //         this.getCompanies(key)
    //     }   
    // }
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
