   document.addEventListener("submit", (e) => {        
        enviarDados();        
    });   

    // Função para formatação de data.
    function formatDate(date) {
        return (date.getDate() < 10 ? '0' : '') + date.getDate()
            + '/' +
            (date.getMonth() + 1)
            + '/' +
            date.getFullYear() + ' ' +
            date.getHours() + ':' + date.getMinutes();
    }


    function enviarDados() {
        let endpointHash = "https://app.pipe.run/webservice/integradorJson?hash=beef9e18-9adf-4d47-8215-347eae53d251";
        let dataHora = formatDate(new Date());

        let name = document.getElementById("form-field-name").value;
        let email = document.getElementById("form-field-email").value;
        let telefone = document.getElementById("form-field-telefone").value;
        let estado = document.getElementById("form-field-estado").value;
        let cidade = document.getElementById("form-field-cidade").value;

        function configPost(body) {
            return {
                "method": "POST",
                "headers": { "Content-Type": "application/json" },
                "body": JSON.stringify(body)
            };
        }

        let rules = {
            "update": true,
            "status": "open",
            "equal_pipeline": true,
            "filter_status_update": "open"
        };

        let lead = [{
            "id": email,
            "title": dataHora + " " + name,
            "personal_phone": telefone,
            "name": name,
            "email": email,
            "city_name": cidade,
            "city_state": estado

        }];

        let dataToSend = {
            "rules": rules,
            "leads": lead
        };

        fetch(endpointHash, configPost(dataToSend))
            .then(response => response.json())
            .then(data => {
                console.log(data);
            });
    }
