---
title: 'Frontend-Arquitectura hexagonal 🍺'
date: '2023-08-04'
coverImage: 'https://ik.imagekit.io/02idw6idur/707447_converted.webp'
excerpt: 'Un enfoque para estructurar aplicaciones modulares y escalables'
ogImage:
  url: 'https://ik.imagekit.io/02idw6idur/707447_converted.webp'
---

Cuando comencé a aprender sobre arquitectura hexagonal, la verdad, no entendía mucho. En backend me quedaba un poco más claro, pero cuando se trataba de frontend, se me tornaba borrosa la vista. Pero, luego de leer y leer, de romper, de eliminar todo y volverlo a hacer, me queda mucho más claro cómo llevar la arquitectura hexagonal al frontend sin tantos dolores de cabeza.

Entonces, en este artículo, veremos como solamente la arquitectura hexagonal no es suficiente, sino cómo nos aporta más valor al combinarla con otros enfoques y que ventajas nos traerá su implementación.

Esto lo hago, con la finalidad de ordenar mis propios conocimientos, aprender un poco más en el proceso y sobre todo, ayudar a otros que busquen información y que como yo, lo ven algo borroso.
No abordaremos absolutamente todo en este artículo; sino que lo iremos desglosando para que no sea tan abrumador. El presente funciona como un parteaguas para introducirnos a grandes rasgos y poner en práctica la arquitectura hexagonal.

Vamos a armarnos el chiringuito, pero antes ¿Qué tal un poco de teoría? ¡Vamos!

![disiplinados](https://media.giphy.com/media/KdC9AZ2q4bgLKeHc3m/giphy.gif)

## Que es la Arquitectura hexagonal (puertos y adaptadores)

En resumidas cuentas, la arquitectura hexagonal es un patrón de arquitectura de software que se enfoca en separar, la lógica del negocio de la interfaz de usuario, mediante el uso de interfaces y puertos. Esto permite que el núcleo sea fácilmente testeable y nos permita, desarrollar de una manera mucho más limpia, mantenible y escalable, en la que cada uno de nuestros contextos funcionan de manera independiente, suena lindo, ¿no? Pero vamos un poco más a fondo.

## Un poco más allá (Dependency Inversion Principle)

Debemos tener en cuenta que, uno de los pilares en los que se basa la arquitectura hexagonal, es en el principio de inversión de dependencia. La idea fundamental es invertir el flujo de control de nuestra aplicación, ya que nuestras capas de alto nivel no pueden depender de nuestras capas de bajo nivel, ambas deben depender de abstracciones. Los **puertos** actúan como abstracciones y los **adaptadores** son nuestras dependencias concretas.

**¿¿KHOMO??** ¿Qué son "dependencias concretas" y "cómo se clasifica el nivel de cada capa?" Calma, calma. Vamos a explorar un poco de qué va cada una de las capas en las que se divide la arquitectura hexagonal

![wtf](https://media.giphy.com/media/9x5a37tKFOCoJxLLWJ/giphy.gif)

## Pilares principales

La arquitectura hexagonal se compone de tres capas principales:

- **Capa de Dominio:** Es la capa de más **alto nivel**, ya que contiene la lógica de negocio central de la aplicación y define las reglas de negocio (transformación de los datos, interfaces, tipos, validaciones etc.) y no depende de ninguna otra capa.

- **Capa de Aplicación:** Esta capa se encuentra en un **nivel intermedio** en nuestra jerarquía y se encarga de la comunicación entre la capa de dominio y el mundo exterior, lo que denominamos **casos de uso**

- **Capa de Infraestructura:** Contiene las implementaciones concretas de los puertos definidos en la capa de aplicación, y es nuestra capa de más **bajo nivel**

Todas estas capas se componen mediante una regla de dependencia, y estas dependencias deben apuntar hacia el interior de las capas, es decir, las capas de nivel inferior deben definir interfaces que las capas de nivel superior puedan utilizar para interactuar con ellas. Vamos, que nuestra capa de **Infraestructura** conoce a todas las demás, la de **Aplicación** solo a la de **Dominio** y por último, nuestra capa de **Dominio** solo puede conocerse a sí misma.

Quizá ahora mismo no te quede claro, pero no te preocupes, vamos a escribir ejemplos en código para definir todo esto, por lo pronto, veamos cómo armar nuestro directorio.

![no entiendo nada](https://media.giphy.com/media/6IhNSPu41qQkGdSrfu/giphy.gif)

## clasificacion de nuestras capas

Ahora, bien, vamos a aplicar una estructura usando solo el enfoque de la arquitectura hexagonal:

```
 ./src
├── 📁 application
│  ├── 📄 GetAnimeById
├── 📁 domain
│  ├── 📄 Anime.entity
│  ├── 📄 Anime.repository
└── 📁 infrastructure
   └── 📄 AnimeRepository
```

**Perfectooooo** ahora si nos estamos entendiendo.

![vamos bien](https://media.giphy.com/media/xT0GqD6hwjEAkPq3kY/giphy.gif)

Ya tenemos una imagen mental sobre cómo se traduce todo esto en una estructura de carpetas, ¿vale? Bien hasta ahí, entendible señor, pero aún falta algo para comprender mejor. Vamos a escribir nuestro código en **TypeScript** siguiendo los archivos de la estructura anterior para ver cómo encajan las piezas.

Empecemos por nuestros archivos de dominio, tenemos nuestro **Anime.entity.ts** donde definiremos nuestras entidades:

#### Anime.entity.ts

```ts
type AnimeId = string

type AnimeTitle = {
  spanish: string
  japanese: string
}

type AnimecCategory = 'Shonen' | 'Terror' | 'Romance'

export type Anime = {
  id: AnimeId
  title: AnimeTitle
  categories: AnimecCategory[]
  sinopsis: string
  price: number
}
```

#### Anime.repository.ts

```ts
export interface IAnimeRepository {
  getById: (id: AnimeId) => Promise<Anime>
}

export interface IGetAnimeById {
  (id: AnimeId, repository: IAnimeRepository): Promise<Anime>
}
```

Como podemos ver en **Anime.entity**, establecemos las entidades que son nuestros modelos de datos.

En **IAnimeRepository** estamos definiendo la interfaz que debe usar nuestro repositorio presente en la capa de **Infraestructura** que veremos más adelante. Nuestro **IGetAnimeById** será usada en nuestra capa de **Aplicación** y todo esto forma parte de nuestra lógica de negocios.

Ahora que vemos el camino, sigamos con la capa de aplicación e infraestructura:

#### GetAnimeById.ts

```ts
export const getAnimeById: IGetAnimeById = async (
  id: AnimeId,
  repository: IAnimeRepository
): Promise<Anime> => repository.getById(id)
```

#### AnimeRepository.ts

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

Como te habrás dado cuenta, en nuestra capa de aplicación tenemos nuestra implementación concreta (caso de uso) **GetAnimeById**. Vemos que nuestro repositorio es aceptado por parámetro y solo le estamos especificando nuestra interfaz **IAnimeRepository** (nuestro adaptador). ¡Con esto cumplimos nuestra regla de dependencia! Ya que a la lógica dentro de nuestro repositorio y nuestra función **getById** no le importa, solo importa, la implementación definida en nuestro dominio, lo cual nos permite cambiar nuestro repositorio sin afectar los casos de uso, lo que nos brinda mucha flexibilidad y tolerancia al cambio.

En nuestra capa de **Infraestructura** tenemos nuestra entrada y salida de datos. En el caso del frontend nuestras llamadas a API's, nuestro **apiAnimeRepository** retorna **getById** (puerto) usado en nuestra capa de aplicación.

La ventaja de abstraer la implementación concreta de nuestro repositorio en la capa de aplicación, es que ahora podemos extender nuestro repositorio, podemos crear un **getById** que use el localStorage o cualquier otra cosa siempre que cumpla el contrato con las interfaces definidas en el dominio, pero seamos sinceros, ¿Cuántas veces ocurre esto? sin duda, no muchas. El valor que nos aporta la abstracción ahora, es la alta testabilidadd.

**¡ESTO SI QUE TIENE MEJOR FORMA!**

Antes de continuar dejaré una explicación más detallada de cada capa teniendo en cuenta que estamos trabajando en el frontend.

![veo la luz](https://media.giphy.com/media/xT0GqEkbTfaE5meNNe/giphy.gif)

## ¿Cuál es mi trabajo ?

### Dominio

La lógica de negocio es la que define y controla las reglas y procesos que rigen la operación de una aplicación, como por ejemplo, su estado, independientemente de elementos como el framework usado o la UI.

Dado que en nuestra capa **Domain** es donde estará almacenada nuestra lógica de negocios, allí irá todo aquello que tenga que ver con la transformación de nuestros datos, así como sus respectivas interfaces, funciones validadoras etc.

### Aplicación

Tendremos nuestros **casos de uso**. Siguiendo el ejemplo anterior, podemos decir que, un caso de uso sería nuestro **GetAnimeById**, qué son las diferentes funcionalidades que usa nuestra UI, nuestros componentes y vistas pertenecientes a un framework como React, Vue o angular.

Tradicionalmente la implementación del framework estaría ubicada en infraestructura, ya que es una dependencia externa; pero claro, nuestros componentes van a tener lógica, manejo del estado, ciclos de vida propios del framework, por lo que es complicado abstraerse de esto.

Los beneficios que nos da tratar como parte de nuestra capa de aplicación a nuestra implementación del framework, son superiores a que si intentamos desacoplarnos lo máximo posible, por ello y como convención más que otra cosa, decimos que nuestros componentes de UI forman parte de nuestra capa de aplicación.

### Infrastructure

En esta capa encontramos todo lo relacionado con la entrada y salida de datos, es decir, nuestras llamadas a APIs, las rutas que necesitemos,etc.

## ¿ Y ahora que sigue ?

![aun hay mas](https://media.giphy.com/media/hkbdpWKrH891e/giphy.gif)

No sé si te habrás dado cuenta, ya que en este ejemplo no se aprecia mucho el problema. Para visualizarlo mejor imagina que nuestra aplicación es mucho, muchoo más grande

```
 ./src
├── 📁 application
│  ├── 📄 GetAnimeById
│  ├── 📄 GetUsers
│  ├── 📄 GetUsersByName
│  ├── 📄 CrateProduct
│  ├── 📄 DeleteUserById
│  ├── 📄 ...
│  ├── 📄 ...
│  ├── 📄 ...
│  ├── 📄 ...
├── 📁 domain
│  ├── 📄 Anime.entity
│  ├── 📄 Anime.repository
│  ├── 📄 Product.entity
│  ├── 📄 User.repository
│  ├── 📄 Anime.validations
│  ├── 📄 ...
│  ├── 📄 ...
│  ├── 📄 ...
│  ├── 📄 ...
│  ├── 📄 ...
└── 📁 infrastructure
│  ├── 📄 AnimeRepository
│  ├── 📄 ...
│  ├── 📄 ...
│  ├── 📄 ...
│  ├── 📄 ...
│  ├── 📄 ...
│  ├── 📄 ...
...
```

¿Ya vas viendo el problema no?

![no funciona](https://media.giphy.com/media/g5SW7jjVccIMM/giphy.gif)

A medida que nuestra aplicación escala, se torna un poco difícil de manejar; sobre todo a la hora de buscar los ficheros en los que vamos a trabajar.Tenemos todos nuestros contextos mezclados en sus respectivas capas, así que vamos a introducir otro enfoque interesante, por ello entra en juego el **Vertical slicing**

## Vertical slicing ¿Mucha palabrería?

Consiste en dividir el sistema en funcionalidades verticales completas, que atraviesan todas las capas de la arquitectura hexagonal. Cada vertical slice, es un conjunto de características que proporcionan un valor tangible al usuario y que se implementa de forma independiente y bla bla bla. Lo que vamos a hacer es ordenar nuestros contextos y cada uno tendrá sus propias capas independientes, por lo que el anterior ejemplo nos quedaría así:

```
.
├── 📁 Anime
│  ├── 📁 application
│  │   ├── 📄 GetAnimeById
│  │   ├── 📄 CreateAnime
│  ├── 📁 domain
│  │   ├── 📄 Anime.entity
│  │   ├── 📄 Anime.repository
│  │── 📁 infrastructure
│  │   ├── 📄 AnimeRepository
│  └───└── 📄 AnimeLocalStorageRepository
├── 📁 User
│  ├── 📁 application
│  │  ├── 📄 GetUsersByName
│  │  └── 📄 GetUsers
│  ├── 📁 domain
│  │  ├── 📄 User.entity
│  │  └── 📄 User.repository
│  └── 📁 infrastructure
│     └── 📄 LocalStorageUserRepository
```

**¡Muchísimo mejor!**, ahora tenemos bien ordenados nuestros contextos; logramos conseguir mucha más cohesión, cada uno aislado del otro, y esto nos aportará, una ventaja tremenda, ya que podemos reemplazar, agregar o eliminar contextos y nuestro sistema seguiría funcionando con normalidad, por lo que nos da un 10 en robustez.

![mejor](https://media.giphy.com/media/MARFSIQQNQVWw/giphy.gif)

Ahora esto nos plantea un problema, ¿Qué sucede si tenemos que compartir alguna funcionalidad entre contexto? **Do not repeat yourself** si tienes alguna funcionalidad que se repite más de dos veces entre contextos, conviene crear un apartado **shared**! Pero cuidado! Todo poder conlleva una gran responsabilidad ¿no?

Y como se que seguramente necesitas un ejemplo más tangible (como yo), aca te dejo un ejemplo en **Next** con lo que hemos visto antes:

[hexagonal-architecture-template](https://github.com/VENF/hexagonal-architecture-template)

## El camino que nos falta.

Hemos visto a grandes rasgos qué es la arquitectura hexagonal, que valor nos aporta y cómo implementarla. Por supuesto que esto no es todo, aún nos falta ver muchas otras ventajas y desventajas, analizar algunos criterios a la hora de decidir si nos conviene aplicar arquitectura hexagonal o no, y cómo esto nos ayuda en nuestros test. Pero descuida, eso lo veremos en los siguientes artículos 😏

Ahora, nos despedimos. ¡Hasta el próximo artículo!

![nos vemos](https://media.giphy.com/media/9oIOzcqxbrprPuItZb/giphy.gif)
