    document.addEventListener('deviceready', onDeviceReady, false);
    var db;
    function onDeviceReady() {
        try{
            db = window.openDatabase("agenda", "1.0", "Agenda",2 * 1024 * 1024);
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
            var foto = new String(document.getElementById('foto').value);
            var dataB = new String(document.getElementById('aniversario').value);        
            try{
                tx.executeSql('CREATE TABLE IF NOT EXISTS aniversario (id integer primary key autoincrement,nome varchar, foto text, aniver varchar)');
                if (name == "" ){
                    alert('Confira se há algum campo nulo!');                
                } else{
                    tx.executeSql('INSERT INTO aniversario (nome,foto,aniver) VALUES ("'+name+'","'+foto+'","'+aniversario+'")');
                    alert('Aniversario inserido com sucesso!');
                    window.location = "index.html";
                } 
            }catch(e){
                alert("Mensagem de erro: "+e);
            }           
        }

         //lista todas as agenda       
        function carregarAgenda() {                 
            buscaAgenda();            
            var listarTodaAgenda = localStorage.getItem("listarAgenda");
            //alert(listarTodasTarefas);
            document.getElementById("listarAgenda").innerHTML = listarTodaAgenda;
            
        };
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
                listarAgenda +=  row.nome +"</li><li>Foto=> "+row.foto+"</li><li>Aniversário=> "+row.aniversario+" </li>";
                listarAgenda += "<li><a onclick='excluirAgenda("+row.id+");'class='excluir'>Excluir</a></li></ul></p>";
            }             
            localStorage.setItem('listarAgenda',listarAgenda);           
        }

        //LISTAR ANIVERSARIANTES DO DIA
        function verTodos(){
            window.location = "agenda.html";
        }

        function buscaAniversario() {
            db.transaction(function (tx){
                tx.executeSql('SELECT * FROM aniversario ORDER BY nome asc;', [], agenda, errorCB);
            });
        }
        
        function aniversario(tx, results) {
            var len = results.rows.length;
            var listarAniversario = '';            
            for (var i=0; i<len; i++){
                var row = results.rows.item(i); 
                listarAniversario += "<p> <ul class='listaTarefas'> <li>Nome=> "; 
                listarAniversario +=  row.nome +"</li><li>Foto=> "+row.foto+"</li><li>Aniversário=> "+row.aniversario+" </li>>";
                listarAniversario += "</ul></p>";
            }             
            localStorage.setItem('listarAniversario',listarAgenda);           
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

        //CAPTURAR FOTO DA ÁRVORE
    function captureFoto() {
        var destinationType = navigator.camera.DestinationType;
        navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50, saveToPhotoAlbum:true,
            destinationType: destinationType.NATIVE_URL });
    }

    function onPhotoDataSuccess(imageData) {
      var smallImage = document.getElementById('smallImage');
      smallImage.style.display = 'block';
      smallImage.src = imageData;
      localStorage.setItem('foto',imageData);
    }

    function onFail(message) {
      alert('Failed because: ' + message);
    }