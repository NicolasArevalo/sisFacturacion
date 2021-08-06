var nuevoId;
var db=openDatabase("itemDB","1.0", "itemDB",65535);
const tiempoTranscurrido = Date.now();
const hoy=new Date(tiempoTranscurrido);
var totalFactura=0;


function limpiar(){
    document.getElementById("item").value="";
    document.getElementById("cantidad").value="";
    document.getElementById("precio").value="";
    document.getElementById("mostrarTotal").innerHTML="";
}

// funcionalidad de los botones
//      eliminar registro

function eliminarRegistro(){

    $(document).one('click','button[type="button"]', function(event){
        let id=this.id;
        var lista=[];
        $('#listaProductos').each(function(){
            var celdas=$(this).find('tr.Reg_'+id);
            celdas.each(function(){
                var registro=$(this).find('span.miId');
                registro.each(function(){
                    lista.push($(this).html())
                });
            });
        });
        nuevoId=lista[0].substr(1);
        db.transaction(function(transaction){
            var sql="DELETE FROM productos WHERE id="+nuevoId+";"
            transaction.executeSql(sql, undefined, function(){
                alert('Registro borrado bien cool.');
                location.reload();
            }, function(transaction, err){
                alert('Oh noooo: '+err.message);
            });
        });
    });

}

function eliminarFacturas(){

    $(document).one('click','button[type="button"]', function(event){
        let id=this.id;
        var lista=[];
        $('#listaFacturas').each(function(){
            var celdas=$(this).find('tr.Reg_'+id);
            celdas.each(function(){
                var registro=$(this).find('span.miId2');
                registro.each(function(){
                    lista.push($(this).html())
                });
            });
        });
        nuevoId=lista[0].substr(1);
        db.transaction(function(transaction){
            var sql="DELETE FROM facturas WHERE id="+nuevoId+";"
            transaction.executeSql(sql, undefined, function(){
                alert('Registro borrado bien cool.');
                location.reload();
            }, function(transaction, err){
                alert('Oh noooo: '+err.message);
            });
        });
    });

}

function generarTotal(){

    db.transaction(function(transaction){
        var sql="SELECT precio FROM productos";
        transaction.executeSql(sql, undefined, function(transaction, result){
            if(result.rows.length){
                totalFactura=0;
                for(var i=0; i<result.rows.length; i++){
                    var row=result.rows.item(i);
                    var precio=row.precio;
                    totalFactura += precio;
                }
                $('#mostrarTotal').append(totalFactura+' USD$');
            }else{
                $('#mostrarTotal').append(' - ');
            }   

        }, function(transaction, err){
            alert('Oh no, algo salió mal :c en total '+ err.message);
        }
        )
    })
}


$(function(){
    //Crear la tabla de productos

    $("#crear").click(function(){
        db.transaction(function(transaction){
            var sql="CREATE TABLE productos "+
            "(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "+
            "item VARCHAR(100) NOT NULL, "+
            "cantidad INTEGER(1000) NOT NULL, "+
            "precio DECIMAL(5,2) NOT NULL)";

            transaction.executeSql(sql,undefined, function(){
                alert("Tabla 1 creada exitosamente");
            }, function(transaction, err){
                alert("1 oh, algo salió mal :( "+err.message);
            })
        });
    });

    // Crear la tabla de facturas

    $("#crear").click(function(){
        db.transaction(function(transaction){
            var sql="CREATE TABLE facturas "+
            "(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "+
            "nombre VARCHAR(100) NOT NULL, "+
            "total INTEGER(1000) NOT NULL, "+
            "fecha VARCHAR(100) NOT NULL,"+
            "estado VARCHAR(15) NOT NULL,"+
            "tpago VARCHAR(15) NOT NULL)";

            transaction.executeSql(sql,undefined, function(){
                alert("Tabla 2 creada exitosamente");
            }, function(transaction, err){
                alert("2 oh, algo salió mal :( "+err.message);
            })
        });
    });

    //Cargar la lista de productos

    $("#actualizar").click(function(){
        cargarDatos();
        cargarFacturas();
        generarTotal();
        limpiar();
    })

    // Función que carga la lista de productos | creación de los items de la tabla
    function cargarDatos(){
        $("#listaProductos").children().remove();
        db.transaction(function(transaction){
            var sql="SELECT * FROM productos ORDER BY id ASC";
            transaction.executeSql(sql, undefined, function(transaction, result){
                if(result.rows.item){
                    $("#listaProductos").append('<tr><th>Código</th><th>Producto</th><th>Cantidad</th><th>Precio</th><th></th><th></th></tr>')
                    for(var i=0; i<result.rows.length; i++){
                        var row=result.rows.item(i);
                        var item=row.item;
                        var cantidad=row.cantidad;
                        var id=row.id;
                        var precio=row.precio;
                        $("#listaProductos").append('<tr id="fila'+id+'" class="Reg_A'+id+'"> <td><span class="miId">A'+
                        id+'</span></td><td><span>'+
                        item+'</span></td><td><span>'+
                        cantidad+'</span></td><td><span>'+
                        precio+' USD$ </span></td><td><button type="button" id="A'+
                        id+'" onclick="eliminarRegistro()"><i class="fas fa-backspace"></button></i></td></tr>');
                    }
                }else{
                    $("#listaProductos").append('<tr><td colspan="5" align="center">No existen los productos.</td></tr>');

                }

            }, function(transaction, err){
                alert('Oh no, algo salió mal :c '+ err.message);
            }
            )
        })  
    }  
    // Función que carga lista de facturas | también crea
    function cargarFacturas(){
        $("#listaFacturas").children().remove();
        db.transaction(function(transaction){
            var sql="SELECT * FROM facturas ORDER BY id ASC";
            transaction.executeSql(sql, undefined, function(transaction, result){
                console.log(result.rows)
                if(result.rows.item){
                    console.log(result.rows.length)
                    $("#listaFacturas").append('<tr><th>#</th><th>Cliente</th><th>Total</th><th>Fecha</th><th>Estado</th><th>Tipo de pago</th><th></th></tr>')
                    for(var i=0; i<result.rows.length; i++){
                        
                        var row=result.rows.item(i);
                        var item=row.nombre;
                        var cantidad=row.total;
                        var id=row.id;
                        var fecha=row.fecha;
                        var estado=row.estado;
                        var tpago=row.tpago;
                        $("#listaFacturas").append('<tr id="fila'+id+'" class="Reg_F'+id+'"> <td><span class="miId2">F'+
                        id+'</span></td><td><span>'+
                        item+'</span></td><td><span>'+
                        cantidad+'USD$ </span></td><td><span>'+
                        fecha+' </span></td><td><span>'+
                        estado+' </span></td><td><span>'+
                        tpago+' </span></td><td><button type="button" id="F'+
                        id+'" onclick="eliminarFacturas()"><i class="fas fa-shopping-cart">Pagar</i></button></i></td></tr>');

                    }
                }else{
                    $("#listaFacturas").append('<tr><td colspan="5" align="center">No existen los productos.</td></tr>');

                }

            }, function(transaction, err){
                alert('Oh no, algo salió mal2 :c '+ err.message);
            }
            )
        })  
    }

    // Insertar un nuevo registro
    $("#insertar").click(function(){
        var item=$("#item").val();
        var cantidad=$("#cantidad").val();
        var precio=$("#precio").val();

        db.transaction(function(transaction){
            var sql="INSERT INTO productos(item, cantidad, precio) VALUES(?,?,?)";
            transaction.executeSql(sql,[item, cantidad, precio], function(){
            }, function(transaction, err){
                alert(err.message);
            })

            limpiar();
            cargarDatos();
            generarTotal();

        })

    })


    // Insertar nueva factura
    $("#mandarFactura").click(function(){
        
        if (document.getElementById('nombreUsuario').value != "") {
            var nombre = $("#nombreUsuario").val();
            var total = totalFactura;
            var fecha = hoy.toLocaleDateString();
            var estado = "Activo";
            var crediOcontado;
            var tpago;
            console.log($("#inlineRadio1").prop('checked'))
            console.log($("#inlineRadio2").prop('checked'))
            if ($("#inlineRadio1").prop('checked')) {
                tpago = "Contado";
            } else if ($("#inlineRadio2").prop('checked')) {
                tpago = "Crédito";
            } else {
                alert('No se seleccionó método de pago.');
            }

            db.transaction(function (transaction) {
                var sql = "INSERT INTO facturas(nombre, total, fecha, estado, tpago) VALUES(?,?,?,?,?)";
                transaction.executeSql(sql, [nombre, total, fecha, estado, tpago], function () {
                }, function (transaction, err) {
                    alert(err.message);
                })
                
                limpiar(); 
                cargarFacturas(); 

            })
        }else{
            alert('No puedes generar factura sin tu nombre.');
        }
        

    })




    //Eliminar toda la tabla
    $("#eliminarTodo").click(function(){
        if(!confirm("Está seguro de borrar todo?","")) return;
        db.transaction(function(transaction){
            var sql="DROP TABLE facturas";
            transaction.executeSql(sql, undefined, function(){
                alert("Tabla correctamente eliminada. La página se recargará...");
                location.reload();
            }, function(transaction, err){
                alert('Oh, algo no salió como esperabamos :x ', err.message);
            })
        })
    })


})