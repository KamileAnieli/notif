    document.addEventListener('deviceready', onDeviceReady, false);
    var db;
    function onDeviceReady() {
        try{
            db = window.openDatabase("tarefas", "1.0", "Tarefas",2 * 1024 * 1024);
            //alert('Banco criado com sucesso!');
        }catch(e){
            alert('Mensagem:'+e);
        }
        //NOTIFICAÇÕES
        alert('ola1');
        var push = PushNotification.init({ 
        "android": { 
            "senderID": "123456789", "icon": "phonegap", "iconColor": "blue"}, 
            "ios": {"alert": "true", "badge": "true", "sound": "true"},
            "windows": {} 
         });
        alert('ola3');
        push.on('notification', function(data) {
             alert('ola4');
        });
    };

    //lista todas as tarefas       
        function carregarTarefas() {                 
            buscaTarefas();            
            var listarTodasTarefas = localStorage.getItem("listarTarefas");
            //alert(listarTodasTarefas);
            document.getElementById("listar_tarefas").innerHTML = listarTodasTarefas;
            
        };

        //ADD PROJETO NOVO
        function addTarefa() {            
            db.transaction(salvarTarefa, errorCB, successCB);
        }

        function salvarTarefa(tx) {
            var nameTarefa = new String(document.getElementById('nomeTarefa').value); 
            var descTarefa = new String(document.getElementById('descTarefa').value);
            var atual = new Date();
            var dia = atual.getDate();
            var mes = atual.getMonth()+1;
            var ano = atual.getFullYear();
            var dataA = ano+'/'+mes+'/'+dia;
            var dataB = new String(document.getElementById('dataA').value);        
            try{
                tx.executeSql('CREATE TABLE IF NOT EXISTS tarefas (id integer primary key autoincrement,nome varchar, tarefa text, dateA varchar,dateB varchar)');
                if (nameTarefa == "" ){
                    alert('Confira se ha algum campo nulo!');                
                } else{
                    tx.executeSql('INSERT INTO tarefas (nome,tarefa,dateA,dateB) VALUES ("'+nameTarefa+'","'+descTarefa+'","'+dataA+'","'+dataB+'")');
                    alert('Tarefa inserida com sucesso!');
                    buscaTarefas();
                } 
            }catch(e){
                alert("Mensagem de erro: "+e);
            }           
        }

        //LISTAR PROJETOS
        function buscaTarefas() {
            var atual = new Date();
            var dia = atual.getDate();
            var mes = atual.getMonth()+1;
            var ano = atual.getFullYear();
            var dataA = ano+'/'+mes+'/'+dia;
            db.transaction(function (tx){
                tx.executeSql('SELECT * FROM tarefas WHERE dateB >= ?  ORDER BY dateB asc;', [dataA], tarefa, errorCB);
            });
        }
        
        function tarefa(tx, results) {
            var len = results.rows.length;
            var listarTarefas = '';            
            for (var i=0; i<len; i++){
                var row = results.rows.item(i); 
                listarTarefas += "<p> <ul class='listaTarefas'> <li>Nome=> "; 
                listarTarefas +=  row.nome +"</li><li>Tarefa=> "+row.tarefa+"</li><li>Data de Cadastro=> "+row.dateA+" </li><li>Data de Validade=> "+row.dateB+"</li>";
                listarTarefas += "<li><a onclick='excluirTarefa("+row.id+");'class='excluir'>Excluir</a></li></ul></p>";
            }             
            localStorage.setItem('listarTarefas',listarTarefas);           
        }

        function excluirTarefa(id){
            db.transaction(function (tx){
                tx.executeSql('DELETE FROM tarefas WHERE id = ?', [id]);               
            });
            buscaTarefas();
        }

        function sair(){
            navigator.notification.confirm(
                'Você tem certeza que deseja sair da aplicação?', 
                 exittApp,           
                'Sair',          
                ['Sair','Cancelar']     
            );
        }

        function exittApp(button){
            if (button == 1){
                navigator.app.exitApp();
            }
        }
        

        function errorCB(err) {
            alert("ErrorCB: "+err);
        }

        function successCB() {
            alert("Executado com sucesso!");
        }