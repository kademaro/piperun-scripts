// METODO PARA COLETAR DADOS DO FORMULARIO E ENVIAR PARA O PIPERUN, COM DADOS DE UTM.

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

// Função para formatação de data.
function formatDate(date) {
    return (date.getDate() < 10 ? '0' : '') + date.getDate()
    + '/' + 
    (date.getMonth() + 1)
    + '/' + 
    date.getFullYear() + ' ' +
    date.getHours() + ':' + date.getMinutes();
}

document.addEventListener( 'wpcf7mailsent', function( event ) {
    if ( '30713' == event.detail.contactFormId ) {
            enviarLead();
        }
    }, false );

let enviar_dados = function () {

    // ENDPOINT
    let endpoint = "https://app.pipe.run/webservice/integradorJson?hash=XXXXXXXXXXXXXXXXXXXXXX"

    let dataHora = formatDate(new Date());
    let name = jQuery('#name').val();
    let email = jQuery('#email').val();
    let phone = jQuery('#phone').val();
    let segment = jQuery('#segment').val();
    let salespeople = jQuery('#salespeople').val();
    let utm_source = getParameterByName('utm_source');
    let utm_medium = getParameterByName('utm_medium');
    let utm_campaign = getParameterByName('utm_campaign');
    let utm_term = getParameterByName('utm_term');
    let utm_content = getParameterByName('utm_content');

    // RULES
    let rules = {
        "update": true,
        "equal_pipeline": false,
        "validate_cpf": false,
        "validate_cnpj": false,
        "situation": "null",
        "status": "open",
        "filter_status_update": "open",
        "filter_situation_update": "null"
    }

    // LEAD
    let lead = [{
        "id": name,
        "title": dataHora + " " + "Fale Energia Solar",
        "name": name,
        "email": email,
        "mobile_phone": phone,
        "last_conversion": {
            "source" : "Fale com um consultor"
        },
        "custom_fields": {
            "URL Conversao" : "https://crmpiperun.com/crm-energia-solar/",
            "Segmento" : segment,
            "Número de vendedores" : salespeople,
            "utm_source": utm_source,
            "utm_medium": utm_medium,
            "utm_campaign": utm_campaign,
            "utm_term": utm_term,
            "utm_content": utm_content
        },
        "notes" : [
            "Título: " + dataHora + " Fale Energia Solar</br>" +
            "E-mail: " + email + "</br>" +
            "Nome: " + name + "</br>" +
            "Celular: " + phone + "</br>" +
            "Segmento: "  + segment + "</br>" +
            "Número de vendedores: " + salespeople + "</br>" +
            "utm_source: " + utm_source + "</br>" +
            "utm_medium: " + utm_medium + "</br>" +
            "utm_campaign: " + utm_campaign + "</br>" +
            "utm_term: " + utm_term + "</br>" +
            "utm_content: " + utm_content + "</br>" +
            "Mensagem: " + message
        ]
    }]

    jQuery.each(lead[0], function(index, value) {
        if (typeof value == 'string' && value == '') {
            delete lead[0][index]
        }
    }); 

    // DATA
    let dataToSend = {
        "rules": rules,
        "leads": lead
    }

    // SEND
    jQuery.ajax({
        type: "post",
        data: JSON.stringify(dataToSend),
        dataType: "json",
        url: endpoint
    }).then(function(response) {
        if(response.ok) {
            ga('send','event','form','contato','fale-consultor');
            dataLayer.push({ 'event': 'fale-consultor' });
        } else {
            swal('Aviso', error.message, 'warning');
        }
    }).catch(function(error) {
        swal('Aviso', error.message, 'warning');
    });
};
