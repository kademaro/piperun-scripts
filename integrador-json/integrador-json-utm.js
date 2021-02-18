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
            enviarDados();
        }
    }, false );

function enviarDados() {

    // ENDPOINT
    let endpoint = "https://app.pipe.run/webservice/integradorJson?hash=f6d5db02-ea32-4118-a6e2-58dfcea00410"

    let dataHora = formatDate(new Date());
    let name = jQuery('#name').val();
    let email = jQuery('#email').val();
    let phone = jQuery('#phone').val();
    let segment = jQuery('#segment').val();
    let salespeople = jQuery('#salespeople').val();
    let message = jQuery('#message').val();
    let utm_source = getParameterByName('utm_source');
    let utm_medium = getParameterByName('utm_medium');
    let utm_campaign = getParameterByName('utm_campaign');
    let utm_term = getParameterByName('utm_term');
    let utm_content = getParameterByName('utm_content');
    let utm_position = getParameterByName('utm_position');
    let utm_device = getParameterByName('utm_device');
    let utm_match = getParameterByName('utm_match');
    let utm_creative = getParameterByName('utm_creative');

    // RULES
    let rules = {
        "update": true
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
            "utm_content": utm_content,
            "utm_position": utm_position,
            "utm_device": utm_device,
            "utm_match": utm_match,
            "utm_creative": utm_creative
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
            "utm_position: " + utm_position + "</br>" +
            "utm_device: " + utm_device + "</br>" +
            "utm_match: " + utm_match + "</br>" +
            "utm_creative: " + utm_creative + "</br>" +
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
    jQuery.ajax({
        type: "post",
        data: JSON.stringify(dataToSend),
        dataType: "json",
        url: endpoint,
        success:function(data) {
            ga('send','event','form','contato','fale-consultor');
            dataLayer.push({ 'event': 'fale-consultor' });
        }
    });
}
