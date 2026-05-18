---
title: 'Construyendo cimientos robustos: SOLID bajo un enfoque funcional'
date: '2023-09-20'
coverImage: 'https://ik.imagekit.io/02idw6idur/spy-x-family-cast_converted.webp'
excerpt: 'Adaptando los principios clásicos al desarrollo actual.'
tags: [solid, principios, frontend]
ogImage:
  url: 'https://ik.imagekit.io/02idw6idur/spy-x-family-cast_converted.webp'
---

Luego de haber escrito un artículo sobre Arquitectura hexagonal, perdí de vista lo esencial
a la hora de entender a profundidad un concepto. Recuerdo a un profesor en la universidad
cuando cursaba el segundo semestre y veía matemáticas discretas.
"La información solo se convierte en conocimiento cuando la haces tuya" - nos decía,
y vaya que tenía razón. Por este motivo, decidí dar un paso atrás y comenzar a
estructurar una ruta de aprendizaje correcta, tanto para ti, quien sea que me esté leyendo, como para mí.

Comenzaremos aprendiendo sobre los principios SOLID, y como en este blog nos
gusta el frontend sabrás que no solemos utilizar muchas clases, por lo
que veremos SOLID bajo un enfoque funcional y por supuesto, siguiendo
la filosofía de este blog, lo haremos lo más ameno posible, sin tanta palabrería.
Sin nada más que agregar, vamos allá.

<!-- ![vamos!](https://media.giphy.com/media/Nii2FhtCqITxT6uHnE/giphy.gif)  -->

## ¿ Qué son los principios SOLID ?

En términos sencillos, son principios o convenciones de diseño de Software ampliamente aceptados en
la industria, nos ayudan a hacer un código más mantenible y
tolerante a cambios. Esto es aplicable en términos de diseño de clases o funciones y claro, también a nivel
de arquitectura de software y estructura de micro-servicios.
Con estas herramientas en nuestro bolso entenderemos el diseño de software de calidad como una habilidad indispensable.

Siguiendo SOLID nos ayudará a evitar el **Tight Coupling** que no es más que
el acoplamiento que dificulta la mantenibilidad y tolerancia al cambio,
evitaremos escribir un código que sea difícil de testear,
huiremos de la duplicidad de código y la optimización
prematura cuando desarrollemos abstracciones innecesarias que añaden complejidad.

### ¿ Y qué significa SOLID ?

**S** -> Principio de Responsabilidad Única (SRP)

**O** -> Principio de Abierto/Cerrado (OCP)

**L** -> Principio de sustitución de liskov (LSP)

**I** -> Principio de Segregación de Interfaces (ISP)

**D** -> Principio de Inversión de Dependencias (DIP)

**SOLID**

<!-- ![WoW](https://media.giphy.com/media/7m2HklUvR2oFkeeiDg/giphy.gif)  -->

## Principio de Responsabilidad Única (SRP)

Este principio nos dice que nuestras clases o módulos deben tener una única razón
para cambiar, es decir, una sola responsabilidad, así de sencillo como suena.

**¿Y Cómo lo logramos?**

- Una clase o función debe ser igual a un concepto y responsabilidad
- Nuestras clases o funciones deben ser pequeñas con objetivos definidos

**¿Pero qué ganamos con aplicar SRP?**

- Alta cohesión y robustez
- Permitir composición de clases o funciones
- Evitar duplicidad de código

Para verlo mejor, hagamos un ejemplo siguiendo un enfoque funcional:

Supongamos que tenemos una función que calcula el precio de un manga \* la cantidad
a comprar, procesa el pago y luego envía un correo de confirmación al cliente.
Nuestra función se vería así:

```ts
const buyManga = async (manga: Manga, amount: number) => {
  const totalPrice = manga.price * amount
  try {
    await payment.account(manga.id, totalPrice)
    await emailService.send({
      manga: manga,
      process: 'your payment has been processed successfully',
    })
  } catch (error) {
    throw new Error('error proccess [payment]')
  }
}
```

Esto viola el **SRP**, ya que estamos realizando varias tareas dentro de nuestra
función y por lo tanto tiene distintas responsabilidades.

Vamos a arreglarlo:

```ts
const proccesPayment = async (price: number, mangaId: string, payment: PaymentServices) => {
  try {
    await payment.account(mangaId, price)
  } catch (error) {
    throw new Error('error proccess [payment]')
  }
}

const paymentSuccessEmail = async (manga: Manga, emailService: EmailServices) => {
  try {
    await emailService.send({
      manga: manga,
      process: 'your payment has been processed successfully',
    })
  } catch (error) {
    throw new Error('error proccess [email services]')
  }
}

const calculateTotalPrice = (manga: Manga, amount: number) => manga.price * amount
```

Perfecto!, hemos dividido nuestras responsabilidades, conseguimos robustez y modularidad.
Ahora tenemos un código más reutilizable, lo que nos permite aplicar la composición de funciones,
que veremos en el siguiente de los principios **SOLID**.

<!-- ![WoW](https://media.giphy.com/media/zZC2AqB84z7zFnlkbF/giphy.gif)  -->

**¿Y ahora cómo identificamos si nuestras funciones están violando el SRP?**

Podemos detenernos a analizar nuestro código y prestar atención en los siguientes indicadores:

**Múltiples tareas**: Si la función realiza varias tareas distintas, como calcular valores,
interactuar con la db, etc, probablemente estás violando SRP

**Demasiados comentarios**: si necesitas muchos comentarios para explicar lo que
hace la función, es probable que estés intentando hacer demasiado, las funciones deben ser autoexplicativas en lo posible.

**_Cambios frecuentes:_** Si una función se modifica con frecuencia debido a cambios en diferentes partes de tu aplicación quizá estás violando el SRP. Las funciones deben ser concisas y centrarse en una tarea

**Si tienes dificultades para reutilizar una determinada función**

**Cambios en cascada:** si al realizar cambios en una función causa cambios en muchas partes de tu código puede ser un indicio de que la función está acoplada a múltiples responsabilidades.

## Principio de Abierto/Cerrado (OCP)

El principio Abierto/Cerrado (OCP) en esencia establece que el software debería estar abierto a su extensión y cerrado a su modificación. Esto aplica tanto a nuestras clases internas, funciones, servicios, microservicios, casos de uso, etc.

El **OCP** en la programación funcional tiene algunas características específicas que influyen el cómo se interpreta este principio.

Vamos a analizarlo un momento:

**Abierto para su extensión** Significa que puedes agregar nuevas funciones o comportamientos sin modificar el código existente. Esto se logra aplicando conceptos como funciones de orden superior, composición de funciones, y polimorfismo funcional.

**Cerrado para su modificación** Significa que una vez definida la función o un conjunto de funciones, no deberías tener que cambiarlas constantemente cuando necesites nuevas funcionalidades, en su lugar extiende el comportamiento usando funciones adicionales o combinándolas.

Veamos un ejemplo:

Siguiendo el ejemplo anterior, supongamos que tenemos una función que calcula el precio de una lista de mangas

```ts
const calculateTotalPrice = (mangas: Manga[]) =>
  mangas.reduce((acc: number, manga: Manga) => acc * manga.price, 0)
```

Bien, sencillo, supongamos entonces que queremos aplicar un descuento al calcular el
precio total. Ahora, podemos irnos a nuestra función y agregar la lógica necesaria, sin embargo estaríamos tocando el código ya escrito, en este caso puede no apreciarse el problema de hacer constantemente eso, pero si tenemos un aplicación grande, tener que recurrir a modificar el código ya funcional puede llevar a errores inesperados por lo que estaríamos violando el \*_OCP_ en lugar de modificar la función original, podemos crear otra función para extender ese comportamiento.

```ts
...
const applyDiscount = (mangas: Manga[], discount: number) => {
  return mangas.map((manga: Manga) => ({
    ...manga,
    price: manga.price * (1 - discount),
  }));
};

const totalPriceDiscount = (mangas: Manga[], discount: number) => {
  const mangasWithDiscount = applyDiscount(mangas, discount);
  return calculateTotalPrice(mangasWithDiscount);
};
```

Biennn, de esta manera, hemos extendido el comportamiento de **calculateTotalPrice**
sin tener que modificarla, ahora cumplimos con el OCP. Conseguimos resistencia al cambio
en nuestra base de código. Continuemos!

## Principio de sustitucion de liskov (LSP)

Si **S** es un suptipo de **T**, instancias de **T** deberian poder
sustituirse por instancias de **S** sin alterar las propiedades del programa.

<!-- ![no entiendo](https://media.giphy.com/media/8v6MRmBnqgjjejfbQv/giphy.gif)  -->

No nos asustemos, quédate conmigo, vamos a explicar esto paso a paso.

Aquí estamos hablando de la relación entre las clases y sus subclases (clases derivadas o hijos) Esto nos dice que los objetos de una clase deben poder reemplazar a los objetos de su clase base. _"instancias de T deberían poder sustituirse por instancias de S"_ Esto significa que una subclase debe comportarse de una manera compatible con su clase base manteniendo la misma interfaz. _"sin alterar las propiedades del programa."_

En términos simples, toda clase (hija) debe poder utilizarse como si fuese el mismo padre y nadie que necesite el padre, debe comportarse de forma diferente al interactuar con cualquier instancia de él.

En programación funcional se aplica a tipos y funciones, vamos a profundizar un poco más
siguiendo este enfoque.

**Compatibilidad entre firmas:**
En la programación funcional, las funciones deben contener una firma compatible entre la función base y cualquier función derivada. Esto significa que las funciones derivadas deben aceptar los mismos argumentos y devolver el mismo tipo de resultado que la función base

**Consistencia en el comportamiento:**
Las funciones derivadas deben comportarse de una manera que sea consistente con las expectativas de cualquier código que use la función base. Esto significa que las funciones derivadas no deben introducir efectos secundarios ni comportamientos incoherentes con la función base

**Preservación de propiedades:** Si la función base tiene ciertas propiedades que se deben mantener, las funciones derivadas deben garantizar que estas propiedades se conserven. No deben romper las reglas establecidas por la función base

<!-- ![bien](https://media.giphy.com/media/edGzBC6GDOhutW32ps/giphy.gif)  -->

Vamos a entenderlo mejor con un ejemplo en código:

Siguiendo con los ejemplos anteriores, digamos que tenemos un módulo de cálculo de descuentos para nuestra tienda de mangas. Tenemos una función base llamada **discount**

```ts
interface Discount {
  (price: number, percentage: number): number
}
const calculateDiscount: Discount = (price: number, percentage: number) =>
  price - (price * percentage) / 100
```

Perfecto, tenemos nuestra función base con nuestra firma (interfaz), ¡pero espera! Resulta que también tenemos clientes vip, así que necesitamos aplicar un descuento adicional a nuestros clientes más frecuentes, por lo que necesitamos una función derivada que aplique un descuento adicional solo a clientes vip, y para que respete el LSP debe contener la misma firma que la función base.

```ts
interface Discount {
  (price: number, percentage: number): number
}
const calculateDiscount: Discount = (price: number, percentage: number) =>
  price - (price * percentage) / 100

const calculatePremiunDiscount: Discount = (price: number, percentage: number) => {
  const premiunDiscount = 10
  return calculateDiscount(price, percentage + premiunDiscount)
}
```

Vemos que nuestra función **calculatePremiunDiscount** toma los mismos argumentos que **calculateDiscount**, ambas cumplen con la misma **interfaz** y devuelven el mismo tipo, ahora podemos sustituir la función base por la función derivada en cualquier parte de nuestro código, ahora no tendríamos ningún problema, cumpliendo así con el LSP y por si no te has dado cuenta, vamos cumpliendo con el SRP Y OCP para aplicar correctamente este principio. Si por el contrario, nuestra función **calculatePremiunDiscount** devolviese
un tipo distinto a su función padre, o implementase una lógica que no se adecua al contrato, estaríamos violando el LSP.

## Principio de Segregación de Interfaces (ISP)

El ISP se centra en la idea de que los clientes de una interfaz no deben verse forzados a depender de métodos que no utilizan. En términos simples, se basa en dividir interfaces grandes y poco cohesivas en interfaces más pequeñas y específicas.

El ISP establece que:

- No debe haber interfaces grandes que obliguen a proporcionar implementaciones de métodos que no se usen.
- Es mejor tener muchas interfaces pequeñas y específicas en lugar de una grande
- los clientes deben depender solo de las interfaces que necesiten
- Evitar Header Interfaces promoviendo Role Interfaces

Esto nos otorga una alta cohesión y bajo acoplamiento estructural

Antes de ver un ejemplo, definamos primero qué es **Header Interfaces** y **Role Interfaces**, por
ahora veámoslos en términos de clases y luego veremos cómo podemos llevarlo al ámbito funcional.

**Header Interfaces**:
Este término se refiere a una interfaz que contiene una gran cantidad de métodos, por lo
que no todos pueden ser necesarios para las distintas clases que la implementen, ya que esto lleva a dependencias innecesarias, lo que hace el código más complejo y difícil de mantener.

**Role Interfaces**:
Una interfaz de rol se centra en definir un conjunto específico de métodos relacionados
con un papel fundamental que una clase debe desempeñar. Esto evita la sobrecarga de métodos innecesarios y promueve la cohesión y el desacoplamiento en el diseño de software

Vamo a intentar ilustrar esto siguiendo un enfoque funcional:
Volvemos con nuestra tienda de mangas, y ahora también tenemos su Anime. Resulta que necesitamos filtrar los mangas y animes en función de propiedades específicas, comencemos definiendo un **Header interfaces**

```ts
interface Identifiers {
  id: number
  author: string
  studio: string
}

interface Filters {
  byId: <T extends Identifiers>(id: number, objects: T[]) => T | undefined
  byAuthor: <T extends Identifiers>(author: string, objects: T[]) => T | undefined
  byStudio: <T extends Identifiers>(studio: string, objects: T[]) => T | undefined
}
```

Bien, tenemos una interfaz que define varios métodos de filtrado, vemos que recibe y devuelve un genérico, ya que estos métodos deben poder ser usados tanto por nuestros Mangas como por nuestros Animes, definamos ahora nuestras
funciones de filtrado

```ts
...
const byId = <T extends Identifiers>(id: number, objects: T[]) => objects.find((object) => object.id === id)
const byAuthor = <T extends Identifiers>(author: string, objects: T[]) => objects.find((object) => object.author === author)
const byStudio = <T extends Identifiers>(studio: string, objects: T[]) => objects.find((object) => object.studio === studio)
```

Perfecto, bastante simple, ahora necesitamos dos repositorios que retornen las funciones requeridas según su contexto

```ts
...
export const filterManga = (): Filters => {
  return {
    byId,
    byAuthor,
    byStudio
  }
};

export const filterAnime = (): Filters => {
  return {
    byId,
    byAuthor,
    byStudio
  }
};
```

Vemos que ambas funciones implementan nuestra interfaz **Filters**, sin embargo,
dentro de nuestro contexto de **Manga**, solo necesitamos filtrar por Id y por autor,
mientras en nuestro contexto de **Anime**, solo necesitamos filtrar por Id, y por estudio.
El problema aquí, es que al estar suscritas a nuestra interfaz, nos obliga a retornar todos los métodos, aun si no los usamos.

Vamos a intentar resolver esto. Una posible solución es hacer que los métodos de nuestra interfaz sean opcionales

```ts
...
interface Filters {
  byId: <T extends Identifiers>(id: number, objects: T[]) => T | undefined,
  byAuthor?:<T extends Identifiers>(author: string, objects: T[]) => T | undefined,
  byStudio?:<T extends Identifiers>(studio: string, objects: T[]) => T | undefined,
}
```

De esta manera podemos usar solo los métodos que necesitemos

```ts
...
...
export const filterManga = (): Filters => {
  return {
    byId,
    byAuthor,
  }
};

export const filterAnime = (): Filters => {
  return {
    byId,
    byStudio
  }
};
```

Pero como podemos ver esto huele mal. Otra posible solución es aplicar polimorfismo funcional,
para recibir una función como argumento y operar según su contexto, pero como ya te imaginas,
esto implicaría agregar complejidad innecesaria, por lo que la mejor solución y
en donde aplicamos **ISP** Es dividir nuestra interfaz en unas más pequeñas, vamos a eso:

```ts
interface MangaFilters {
  byId: (id: string, mangas: Manga[]) => Manga[]
  byAuthor: (author: string, mangas: Manga[]) => Manga[]
}

interface AnimeFilters {
  byId: (id: string, animes: Anime[]) => Anime[]
  byStudio: (studio: string, animes: Anime[]) => Anime[]
}

export const filterManga = (): MangaFilters => {
  return {
    byId,
    byAuthor,
  }
}

export const filterAnime = (): AnimeFilters => {
  return {
    byId,
    byStudio,
  }
}
```

Perfectooo!! Muchísimo mejor ahora, ya nuestros contextos no están acoplados a la misma interfaz, tenemos más modularidad entre contextos y ahora es mucho más entendible y fácil de extender nuestro código.
Veamos a continuación el último de los principios

<!-- ![iluminado](https://media.giphy.com/media/tsJHwLo3kwOx3rRBP0/giphy.gif) -->

## Principio de Inversión de Dependencias (DIP)

El principio de inversión de dependencia nos dice que nuestros módulos de alto nivel no deberían depender de los de bajo nivel. Ambos deberían depender de abstracciones.
En programación funcional se puede entender de manera un poco diferente, pero la base
es la misma. En lugar de clases y objetos usaremos funciones y composición de funciones.
Vamos a desglosar esto poco a poco para entendernos mejor.

#### Funciones de alto y bajo nivel

**alto:** Se refiere a nuestras funciones que operan a un nivel abstracto, y se enfoca en la lógica principal de una tarea sin preocuparse por detalles de implementación

**bajo:** Son funciones que realizan una tarea específica a nivel detallado y concreto. Estas funciones son responsables de los detalles de implementación

**Abstracciones en lugar de implementaciones concretas**: Esto significa que las funciones
deben tomar funciones como argumentos y devolver funciones como resultado en lugar de
depender de valores concretos.

**Composición de funciones:** Las funciones de alto nivel deben depender de abstracciones
funcionales en lugar de depender de detalles de bajo nivel. Podemos componer funciones
de bajo nivel para crear funcionalidades más complejas

**Inversión de dependencias** La inversión de dependencias implica que las funciones de alto nivel deben poder utilizar diferentes implementaciones de funciones de bajo nivel, intercambiables sin necesidad de modificar su lógica. Esto se logra inyectando funciones como argumentos.

Podemos apreciar el uso de este principio en el patrón repository, así como también en el flujo de trabajo siguiendo una arquitectura hexagonal.

Veamos un ejemplo simple, siguiendo el ejemplo anterior, definamos la interfaz de nuestro repositorio

```ts
export interface IAnimeRepository {
  getById: (id: AnimeId) => Promise<Anime>
}
```

Definamos ahora una función de alto nivel, será nuestro caso de uso

```ts
export const getAnimeById: IGetAnimeById = async (
  id: AnimeId,
  repository: IAnimeRepository
): Promise<Anime> => repository.getById(id)
```

Vemos que nuestro caso de uso no conoce la implementación concreta de nuestra obtención de datos, la inyectamos por parámetro, y la función de bajo nivel, la cual contendrá nuestros detalles de implementación, la escribiremos en nuestro repositorio

```ts
export const apiAnimeRepository = (): IAnimeRepository => {
  return {
    getById,
  }
}

const getById = async (id: AnimeId): Promise<Anime> => {
  const { data: response } = await axios.get<Anime>(`anime/${id}`, {
    headers: {
      Accept: 'application/json',
    },
  })
  return response
}
```

Ahora que nuestro caso de uso no conoce los detalles de implementación del repositorio,
esto nos permite intercambiar fácilmente la lógica de obtención de datos, veamos esto

```ts
export const localAnimeRepository = (): IAnimeRepository => {
  return {
    getById,
  }
}

const getById = async (id: AnimeId): Promise<Anime> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const animes = getAllFromLocalStorage()
      const anime = animes.filter((anime: Anime) => anime.id === id)
      resolve(anime[0])
    }, 300)
  })
}
```

Perfecto, ahora, sin importar cómo obtengamos los datos, nuestro caso de uso seguirá comportándose de la misma forma, cumplimos con el **ISP**, conseguimos facilitar la modificación y sustitución de implementaciones además de que ahora es más fácil testear nuestros casos de uso.

<!-- ![](https://media.giphy.com/media/u2Hq7bqjWWL8oWFz1T/giphy.gif)  -->

¡Hemos llegado al final de este artículo, espero te sirva y puedas leerlo cuantas veces lo necesites, nos vemos en los siguientes artículos!
