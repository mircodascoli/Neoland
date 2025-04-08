## Lenguaje natural projecto PARTYTIME

### USER

1. Aparecen los datos de el usuario, y sus recetas guardadas. por cada receta, tenemos un boton para eliminarlay otro par comprar productos

2. Al darle al boton de eliminar, se elimina la receta.

3. a darle el boton cart se redirige al carrito

### RECETAS

1. al tocar una figure se abre una description con la informacion de la receta.
2. despues de la descripcion puedes volver a la lista
3. seleccionando una receta y tocando el boton, el usuario se redirige a la pagina de los calculadores con la opcion de el cocktail seleccionado anteriormente en el listado de opciones de el selector de los calculadoes

### CALCULADORES

1. en esta pagina se muestra la receta calculada con un range medio de el ultimo cocktail que ha sido seleccionado en la lista anterior

2. el usuario puede cambiar o ajustar el range de los ml antes de poder guardar su receta en la parte de usuario

3. una vez que la receta ha sido guardada, el usuario puede ver su lista de recetas guardadas en la parte de user

### PRODUCTOS

1. tienda clasica donde se muestran los productos y se puede comprar con el boton añadir al carrito

### CARRITO

1. se visualizan todos los productos que el usuario ha comprado y se puede eliminar uno por uno
2. en el caso de los calculadores, se tienen en cuenta los ml de las botellas y se compra solo lo que nececita el usuario para completar sus recetas
3. en el caso de compra por tienda las botellas seran siempre enteras

## PSEUDOCODIGO

### USER

1. display each saved recipe;
get element from form with submit CALCULATE on /CALCULATORS
append li > figure > img , h2 , ingredients

1.1. append buttons DELETE , BUY

2. delete recipe ON CLICK DELETE
get element html > button delete > ON CLICK > show alert dialog> ON CONFIRM> DELETE li recipe

3. TRANSFER ml of items to cart ON CLICK BUY
get element html >button buy > ON CLICK > show alert dialog> ON CONFIRM> TRANSFER ml of items to cart

### RECETAS

1. ONCLICK animate div description

1.1 on click BACK close div description

2. SELECT ONE recipe 

2.1 ONCLICK go to calculators

### CALCULADORES

1. GET COCKTAIL FROM button calculate

1.2  select in the option

1.3 get the middle range as standard

2. the range adjust the ml of the cocktail ingredients below

3. ONclick to save ml of the objects involved in the user section
3.1. ON CLICK save to cart the bottles according to the mls

### PRODUCTOS

1. display product according to our database
2. ON CLICK add to cart, save to cart according to bottle unity .

### CARRITO

1. display cart
2. ON CLICK delete items from cart with buttons - & +
3. ON CLICK delete all items from cart
4. ONCLICK BUY go to amazon cart

