var nuevoId;
var db=openDatabase("itemDB","1.0", "itemDB",65535);// Conexión con la BD
const tiempoTranscurrido = Date.now(); // crea la fecha
const hoy=new Date(tiempoTranscurrido); // crea el objeto date con la fecha
var totalFactura=0; // Crea variable global del total de la factura
var productosFactura =[]; // Crea array de productos para la factura
var productosJson=[];
// Función que limpia la pantalla de las tablas para que no se repitan
function limpiar(){
    document.getElementById("item").value="";
    document.getElementById("cantidad").value="";
    document.getElementById("precio").value="";
    document.getElementById("mostrarTotal").innerHTML="";
}

// funcionalidad de los botones
//      eliminar registro
alert('Hola, antes de empezar saltarán 3 errores, ya que no tienes creadas las tablas. No te asustes, cierra las alertas y dale en empezar. Gracias ;).');
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

//      eliminar facturas

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
            estado='Pagado';
            var sql="UPDATE facturas SET estado='"+estado+"' WHERE id="+nuevoId+";"
            transaction.executeSql(sql, undefined, function(){
                alert('Aquí sale la pantalla de pago pero hagamos de cuenta que ya pagaste ;)');
                location.reload();
            }, function(transaction, err){
                alert('Oh noooo: '+err.message);
            });
        });
    });

}

// No es botón pero esta función le da el valor al total de productos

function generarTotal(){

    db.transaction(function(transaction){
        var sql="SELECT cantidad, precio FROM productos";
        transaction.executeSql(sql, undefined, function(transaction, result){
            if(result.rows.length){
                totalFactura=0;
                for(var i=0; i<result.rows.length; i++){
                    var row=result.rows.item(i);
                    var cantidad=row.cantidad;
                    var precio=row.precio;
                    var precioTotal=precio*cantidad; // Precio x cantidad de objetos

                    totalFactura += precioTotal;
                }
                $('#mostrarTotal').append('$ '+totalFactura+' COP');
            }else{
                $('#mostrarTotal').append(' - ');
            }   

        }, function(transaction, err){
            alert('Oh no, algo salió mal :c en total '+ err.message);
        }
        )
    })
}
// Función para arreglo de productos para factura
function productosEnArray() {
    db.transaction(function (transaction) {
        var sql = "SELECT item FROM productos";
        transaction.executeSql(sql, undefined, function (transaction, result) {
            if (result.rows.length) {
                for (var i = 0; i < result.rows.length; i++) {
                    var row = result.rows.item(i);
                    var producto = row.item;

                    productosFactura.push(producto);
                }
                console.log(productosFactura);
                productosJson = JSON.stringify(productosFactura);
                /* console.log(productosJson); */
            } else {
                console.log("No hay productos vale")
            }
        }, function (transaction, err) {
            console.log("Hasta aquí mal chamo");
            alert('Oh no, algo salió mal :c en total ' + err.message);
        }
        )
    });
}

function mostrarProductos(){
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
            var sql="SELECT productos FROM facturas WHERE id="+nuevoId+";"
            transaction.executeSql(sql, undefined, function(transaction, result){
                var row = result.rows.item(0);
                var productos = JSON.parse(row.productos);
                alert(productos);
            }, function(transaction, err){
                alert('Oh noooo, no pudimos traer los productos. '+err.message);
            });
        });
    });
}


$(function () {
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
            "tpago VARCHAR(15) NOT NULL, "+
            "productos VARCHAR(100) NOT NULL)";
 
            transaction.executeSql(sql,undefined, function(){
                alert("Tabla 2 creada exitosamente");
            }, function(transaction, err){
                alert("2 oh, algo salió mal :( "+err.message);
            })
        });
    });
    //Cargar tablas, total y limpiar las otras
    limpiar();
    cargarDatos();
    cargarFacturas();
    generarTotal();
    

    // Función que carga la lista de productos | creación de los items de la tabla
    function cargarDatos() {
        $("#listaProductos").children().remove();
        db.transaction(function (transaction) {
            var sql = "SELECT * FROM productos ORDER BY id ASC";
            transaction.executeSql(sql, undefined, function (transaction, result) {
                if (result.rows.item) {
                    $("#listaProductos").append('<tr><th>Código</th><th>Producto</th><th>Cantidad</th><th>Precio c/u</th><th></th><th></th></tr>')
                    for (var i = 0; i < result.rows.length; i++) {
                        var row = result.rows.item(i);
                        var item = row.item;
                        var cantidad = row.cantidad;
                        var id = row.id;
                        var precio = row.precio;

                        $("#listaProductos").append('<tr id="fila' + id + '" class="Reg_A' + id + '"> <td><span class="miId">A' +
                            id + '</span></td><td><span>' +
                            item + '</span></td><td><span>' +
                            cantidad + '</span></td><td><span>$ ' +
                            precio + ' COP </span></td><td><button type="button" id="A' +
                            id + '" onclick="eliminarRegistro()"><i class="fas fa-backspace"></button></i></td></tr>');
                    }
                } else {
                    $("#listaProductos").append('<tr><td colspan="5" align="center">No existen los productos.</td></tr>');

                }

            }, function (transaction, err) {
                alert('Oh no, algo salió mal :c ' + err.message);
            }
            )
        })
    }
    // Función que carga lista de facturas | también crea los items
    function cargarFacturas() {
        $("#listaFacturas").children().remove();
        db.transaction(function (transaction) {
            var sql = "SELECT * FROM facturas ORDER BY id ASC";
            transaction.executeSql(sql, undefined, function (transaction, result) {

                if (result.rows.item) {

                    $("#listaFacturas").append('<tr><th>#</th><th>Cliente</th><th>Total</th><th>Fecha</th><th>Estado</th><th>Tipo de pago</th><th></th><th></th></tr>')
                    for (var i = 0; i < result.rows.length; i++) {
                        var row = result.rows.item(i);
                        var item = row.nombre;
                        var cantidad = row.total;
                        var id = row.id;
                        var fecha = row.fecha;
                        var estado = row.estado;
                        var tpago = row.tpago;
                        $("#listaFacturas").append('<tr id="fila' + id + '" class="Reg_F' + id + '"> <td><span class="miId2">F' +
                            id + '</span></td><td><span>' +
                            item + '</span></td><td><span>$ ' +
                            cantidad + ' COP </span></td><td><span>' +
                            fecha + ' </span></td><td><span>' +
                            estado + ' </span></td><td><span>' +
                            tpago + ' </span></td><td><button type="button" id="F' +
                            id + '" onclick="mostrarProductos()"><i class="far fa-eye"> Mostrar</i></button></td><td><button type="button" id="F' +
                            id + '" onclick="eliminarFacturas()"><i class="fas fa-shopping-cart"> Pagar</i></button></i></td></tr>');

                    }
                } else {
                    $("#listaFacturas").append('<tr><td colspan="5" align="center">No existen los productos.</td></tr>');

                }

            }, function (transaction, err) {
                alert('Oh no, algo salió mal2 :c ' + err.message);
            }
            )
        })
    }

    // Insertar un nuevo producto
    $("#insertar").click(function () {
        var item = $("#item").val();
        var cantidad = $("#cantidad").val();
        var precio = $("#precio").val();

        db.transaction(function (transaction) {
            var sql = "INSERT INTO productos(item, cantidad, precio) VALUES(?,?,?)";
            transaction.executeSql(sql, [item, cantidad, precio], function () {
            }, function (transaction, err) {
                alert(err.message);
            })

            limpiar();
            cargarDatos();
            generarTotal();

        })

    })

    // Insertar nueva factura
    $("#mandarFactura").click(function () {

        if (document.getElementById('nombreUsuario').value != "") {
            function mandarDatosFactura() {
                var nombre = $("#nombreUsuario").val();
                var total = totalFactura;
                var fecha = hoy.toLocaleDateString();
                var estado = "Activo";
                var tpago;
                /* var productos=productosFactura; */
                if ($("#inlineRadio1").prop('checked')) {
                    tpago = "Contado";
                } else if ($("#inlineRadio2").prop('checked')) {
                    tpago = "Crédito";
                } else {
                    alert('No se seleccionó método de pago.');
                }
                
                productosEnArray();
                db.transaction(function (transaction) {

                    var sql = "INSERT INTO facturas(nombre, total, fecha, estado, tpago, productos) VALUES(?,?,?,?,?,?)";
                    transaction.executeSql(sql, [nombre, total, fecha, estado, tpago, productosJson], function () {

                    }, function (transaction, err) {

                        alert(err.message);
                    })

                    productosJson = [];
                    limpiar();
                    cargarFacturas();

                })
            };
            if ($("#inlineRadio1").prop('checked')) {
                tpago = "Contado";
                mandarDatosFactura();
            } else if ($("#inlineRadio2").prop('checked')) {
                tpago = "Crédito";
                mandarDatosFactura();
            } else {
                alert('No se seleccionó método de pago.');
            }
        } else {
            alert('No puedes generar factura sin tu nombre.');
        }


    })

    //Eliminar toda la tabla productos
    $("#eliminarPr").click(function () {
        if (!confirm("Está seguro de borrar todo?", "")) return;
        db.transaction(function (transaction) {
            var sql = "DROP TABLE productos";
            transaction.executeSql(sql, undefined, function () {
                alert("Tabla correctamente eliminada. La página se recargará...");
                location.reload();
            }, function (transaction, err) {
                alert('Oh, algo no salió como esperabamos :x ', err.message);
            })
        })
    })

    //Eliminar toda la tabla productos
    $("#eliminarFa").click(function () {
        if (!confirm("Está seguro de borrar todo?", "")) return;
        db.transaction(function (transaction) {
            var sql = "DROP TABLE facturas";
            transaction.executeSql(sql, undefined, function () {
                alert("Tabla correctamente eliminada. La página se recargará...");
                location.reload();
            }, function (transaction, err) {
                alert('Oh, algo no salió como esperabamos :x ', err.message);
            })
        })
    })
})