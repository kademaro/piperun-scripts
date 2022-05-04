    // METODO PARA COLETAR DADOS DO FORMULARIO E ENVIAR PARA O PIPERUN, COM DADOS DE UTM.
    // dependencia do google analytics.

    // URL de referencia;
    // https://crmpiperun.com/?utm_source=google&utm_medium=cpc&utm_campaign=institucional

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

    document.addEventListener('submit', (e) => {
        if(e.composedPath()[0].id === "enviar10"){
            enviarDados(
                document.getElementById('idNome').value,
                document.getElementById('idEmail').value,
                document.getElementById('idTel').value,
                document.getElementById('idCidade').value,
                document.getElementById('idUF').value        
            );
        }
        if(e.composedPath()[0].id === "enviar20"){
            enviarDados(
                document.getElementById('idNome2').value,
                document.getElementById('idEmail2').value,
                document.getElementById('idTel2').value,
                document.getElementById('idCidade2').value,
                document.getElementById('idUF2').value        
            );
        }
        if(e.composedPath()[0].id === "enviar30"){
            enviarDados(
                document.getElementById('idNome3').value,
                document.getElementById('idEmail3').value,
                document.getElementById('idTel3').value,
                document.getElementById('idCidade3').value,
                document.getElementById('idUF3').value        
            );
        }
        if(e.composedPath()[0].id === "enviar40"){
            enviarDados(
                document.getElementById('idNome4').value,
                document.getElementById('idEmail4').value,
                document.getElementById('idTel4').value,
                document.getElementById('idCidade4').value,
                document.getElementById('idUF4').value        
            );
        }      
    });

    function enviarDados(name, email, phone, city, estate) {
        // ENDPOINT
        let endpoint = "https://app.pipe.run/webservice/integradorJson?hash=XXXXXXX"

        // VARIABLES
        let dataHora = formatDate(new Date());                

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
            "update": false,
            "status": "open",
            "equal_pipeline": true,
            "filter_status_update": "open",
        }

        // LEAD
        let lead = [{
            "id": email,
            "title": dataHora + " " + name + " - Formulário Site", 
            "name": name,
            "email": email,            
            "mobile_phone": phone,
            "city_name": city,
            "state_name": estate,         
            "last_conversion": {
                "source": utm_source || "Formulário Site"
            },
            "custom_fields": {
                "url_conversao": location.href,
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
            "notes": [
                "Título: " + dataHora + " Formulário Site</br>" +
                "E-mail: " + email + "</br>" +
                "Nome: " + name + "</br>" +
                "WhatsApp: " + phone + "</br>" +
                "utm_source: " + utm_source + "</br>" +
                "utm_medium: " + utm_medium + "</br>" +
                "utm_campaign: " + utm_campaign + "</br>" +
                "utm_term: " + utm_term + "</br>" +
                "utm_content: " + utm_content + "</br>" +
                "utm_position: " + utm_position + "</br>" +
                "utm_device: " + utm_device + "</br>" +
                "utm_match: " + utm_match + "</br>" +
                "utm_creative: " + utm_creative
            ]
        }]

        Object.entries(lead[0]).map(index => {
            if (typeof value === 'string' && value === ''){
                delete lead[0][index]
            }
        });

        // DATA
        let dataToSend = {
            "rules": rules,
            "leads": lead
        }   
             
        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }, body: JSON.stringify(dataToSend)
        }).then(response => {
            window.location.href ="https://www.SEU-REDIRECIONAMENTO.com";
        });
    }
