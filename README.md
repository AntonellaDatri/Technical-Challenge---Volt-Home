## Ejecucion

Para poder correr la aplicacion es necesario:

- configurar el .env (instrucciones en [env.md](env.md))
- asegurarse de estar corriendo Docker desde la computadora en la que se correra el proyecto
- ejecutar el comando npm run docker:deploy para crear y ejecutar el proyecto

Para poder acceder a la documentacion de la API acceder a la pagina http://localhost:8080/api/docs (es necesario que el proyecto este corriendo correctamente).

Se dejo adjunto una collection para poder importar los endpoints en Postman para interactuar con la API en el root del proyecto.

## Como funciona la compra/venta

Para la gestion de compra y venta de monedas virtuales se registran ordenes, las cuales son completadas una vez que haya un comprador y un vendedor que hayan acordado una misma cantidad de nominales a intercambiar. Al completarse se genera un registro de la transaccion que identifica el movimiento y se modifican las wallets de los involucrados.

Para poder comprar una criptomoneda es necesario que el comprador disponga del dinero requerido en su wallet y que anteriormente otra persona haya intentado vender la cantidad exacta de la misma criptomoneda (por ejemplo, para poder comprar 1 BTC tiene que haber una orden de venta por 1 BTC). En el caso de la venta, el mecanismo es el mismo pero en sentido inverso.

El precio de las criptomonedas se actualizan cada 30mins usando la API de Cryptocompare. Se actualiza el precio solo para las criptomonedas con las que se recibio una orden anteriormente. Esto se hizo debido a las fluctuaciones de precio de las criptomonedas, lo cual podria generar inconvenientes a la hora de la transaccion ya que en esta demo solo es posible realizar intercambios por precios exactos.

Con la aplicacion se pueden comprar las siguientes monedas y criptomonedas usando USD como valor de cambio:
USDT, BTC, ETH, XRP, ADA, LTC, BCH, DOT, BNB, SOL, DOGE, AVAX y MATIC

## Formas en las que podria escalar el proyecto

- hacer que la gestion de ordenes de compra-venta pueda resolverse con valores parciales y no exactos (es decir, que no sea obligatorio que una compra tenga el mismo precio que una venta para que sea concretada)
- permitir que la compra-venta no sea solo por unidades sino tambien por precio (por ejemplo, en vez de comprar N Bitcoins, comprar 1000 USD de Bitcoin)
- delegar la gestion de ordenes de compra-venta a un microservicio especializado
- generar eventos para que otros microservicios o aplicaciones puedan escucharlos y generar acciones (por ejemplo, avisarle al usuario que se completo una operacion)
- poder consultar todos los movimientos de compra-venta que hizo una persona usando el dato de las transacciones generadas
- permitir que solo usuarios autenticados puedan acceder al sistema
- delegar la consulta por portfolios a un microservicio especializado que cachee informacion y responda rapidamente