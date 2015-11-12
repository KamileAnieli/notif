    document.addEventListener('deviceready', onDeviceReady, false);
    var db;
    function onDeviceReady() {
        try{
            db = window.openDatabase("agendas", "1.0", "Agenda",2 * 1024 * 1024);
            //alert('Banco criado com sucesso!');
        }catch(e){
            alert('Mensagem:'+e);
        }
    };


        //ADD AGENDA NOVA
        function addAgenda() {            
            db.transaction(salvarAgenda, errorCB, successCB);
        }

        function salvarAgenda(tx) {
            var name = new String(document.getElementById('nome').value); 
            var aniversario = new String(document.getElementById('aniversario').value);        
            try{
                tx.executeSql('CREATE TABLE IF NOT EXISTS aniversario (id integer primary key autoincrement,nome varchar, aniver varchar)');
                if (name == "" ){
                    alert('Confira se há algum campo nulo!');                
                } else{
                    tx.executeSql('INSERT INTO aniversario (nome,aniver) VALUES ("'+name+'","'+aniversario+'")');
                    alert('Aniversario inserido com sucesso!');
                    window.location = "index.html";
                } 
            }catch(e){
                alert("Mensagem de erro: "+e);
            }           
        }

         //lista todas as agenda       
        function carregarAgenda() { 
            buscaAniversario();            
            var listarTodaAgenda = localStorage.getItem("listarAniversario");
            //alert(listarTodasTarefas);
            document.getElementById("listarAniversario").innerHTML = listarTodaAgenda;
            
        };

        function verTodos(){
            buscaAgenda();            
            var listarTodaAgenda = localStorage.getItem("listarAgenda");
            //alert(listarTodasTarefas);
            document.getElementById("listarAgenda").innerHTML = listarTodaAgenda;
        }
        //LISTAR AGENDA
        function buscaAgenda() {
            db.transaction(function (tx){
                tx.executeSql('SELECT * FROM aniversario ORDER BY nome asc;', [], agenda, errorCB);
            });
        }
        
        function agenda(tx, results) {
            var len = results.rows.length;
            var listarAgenda = '';            
            for (var i=0; i<len; i++){
                var row = results.rows.item(i); 
                listarAgenda += "<p> <ul class='listaTarefas'> <li>Nome=> "; 
                listarAgenda +=  row.nome +"</li><li>Aniversário=> "+row.aniver+" </li>";
                listarAgenda += "<li><a onclick='excluirAgenda("+row.id+");'class='excluir'>Excluir</a></li></ul></p>";
            }             
            localStorage.setItem('listarAgenda',listarAgenda);           
        }

        //LISTAR ANIVERSARIANTES DO DIA
        

        function buscaAniversario() {
            db.transaction(function (tx){
                tx.executeSql('SELECT * FROM aniversario ORDER BY nome asc;', [], aniversario, errorCB);
            });
        }        
        function aniversario(tx, results) {
            var len = results.rows.length;
            var listarAniversario = '';            
            for (var i=0; i<len; i++){
                var row = results.rows.item(i); 
                var atual = new Date();
                var dia = atual.getDate();
                var mes = atual.getMonth()+1;
                var aniver = new Date(row.aniver);
                var diaA = aniver.getDate();
                var mesA = aniver.getMonth()+1;
                
                if ((dia == diaA) && (mes == mesA)){
                    listarAniversario += "<p> <ul class='listaTarefas'> <li>Nome=> "; 
                    listarAniversario +=  row.nome +"</li><li>Aniversário=> "+row.aniver+" </li>>";
                    listarAniversario += "</ul></p>";
                }
            }             
            localStorage.setItem('listarAniversario',listarAniversario);           
        }

        //EXCLUIR ANIVERSARIO

        function excluirAgenda(id){
            db.transaction(function (tx){
                tx.executeSql('DELETE FROM aniversario WHERE id = ?', [id]);               
            });
            buscaAgenda();
        }

        function pagAdd(){
            window.location = 'teste.html';  
        }

        function voltar(){
            window.location = 'index.html';  
        }

        function sair(){
            navigator.notification.confirm(
                'Você tem certeza que deseja sair da aplicação?', 
                 exittApp,           
                'Sair',          
                ['Sair','Cancelar']     
            );
        }  

        function errorCB(err) {
            alert("ErrorCB: "+err);
        }

        function successCB() {
            alert("Executado com sucesso!");
        }

         <!-- //GEOLOCALIZAÇÃO -->
    function coordenadas(){ 
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
            function onSuccess(position) {
                localStorage.setItem('latitude',position.coords.latitude);
                localStorage.setItem('longitude',position.coords.longitude);
                
            }
            function onError(error) {
                alert('code: '    + error.code    + '\n' +
                        'message: ' + error.message + '\n');
            }
        
        var latitude = localStorage.getItem('latitude');
        var longitude = localStorage.getItem('longitude');  
        document.getElementById("latitude").value = latitude;
        document.getElementById("longitude").value = longitude;
    }