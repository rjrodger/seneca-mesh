![Seneca](http://senecajs.org/files/assets/seneca-logo.png)
> Mesh your [Seneca.js][] microservices

# seneca-mesh
[![npm version][npm-badge]][npm-url]
[![Build Status][travis-badge]][travis-url]
[![Gitter][gitter-badge]][gitter-url]

- __Lead Maintainer:__ [Richard Rodger][Lead]
- __Sponsor:__ [nearForm][Sponsor]

This plugin allows you to wire up seneca services using automatic
meshing. Uses the SWIM gossip algorithm for automatic configuration 
of the microservice network.

If you're using this module, and need help, you can:

- Post a [github issue][],
- Tweet to [@senecajs][],
- Ask on the [Gitter][gitter-url].

If you are new to Seneca in general, please take a look at
[senecajs.org][]. We have everything from tutorials to sample apps to
help get you up and running quickly.


## Install
To install, simply use npm

```sh
npm install seneca-balance-client
npm install seneca-mesh
```
The _seneca-mesh_ plugin depends on the [seneca-balance-client](Balance) plugin.

And in your code:

```js
require('seneca')()
  .use('mesh', { ... options ... })
```

## Test
To run tests, simply use npm:

```sh
npm run test
```

## Example One
Demonstrates connecting two services together using a base node. Base nodes 
are used so that other nodes have a known reference point to join the network.
They are only required for the inital mesh, once the mesh is live, it becomes
redundant.

### base.js

```js
require('seneca')()
  .use('mesh',{base:true})

// start first!
// $ node base.js
```

### service-foo.js

```js
require('seneca')()
  .add( 'foo:1', function (msg, done) {
    done( null, {x:1,v:100+msg.v} )
  })

  // this service handles foo:1 messages
  .use('mesh', { auto:true, pin:'foo:1' })

  .ready( function () {
    var seneca = this

    setInterval( function() {

      // use bar:1, even though location of
      // service-bar is not configured!
      seneca.act('bar:1,v:2', console.log)
    }, 3000 )
  })

// $ node service-foo.js
```

### service-bar.js

```js
require('seneca')()
  .add( 'bar:1', function (msg, done) {
    done( null, {x:1,v:100+msg.v} )
  })

  // this service handles bar:1 messages
  .use('mesh', { auto:true, pin:'bar:1' })

  .ready( function () {
    var seneca = this

    setInterval( function() {

      // use foo:1, even though location of
      // service-foo is not configured!
      seneca.act('foo:1,v:2', console.log)
    }, 3000 )
  })

// $ node service-bar.js
```

The _foo_ and _bar_ services call each other, but neither requires
configuration information!

## Example Two
The example below shows you how to use consume and observe models on 
individual pins. By default patterns are created in consume mode. If
observe mode is used __all__ action handlers are called for that 
pattern.

```js
require('seneca')
  .use('my-plugin')
  .use('mesh', {
    auto: true,
    listen: [
      {pin: 'role:search,cmd:upsert', model: 'consume'},
      {pin: 'role:search,cmd:search', model: 'consume'},
      {pin: 'role:info,info:updated', model: 'observe'}
    ]
  })
```

## Further examples

You can review the source code of these example projects to see seneca-mesh in action:

* [NodeZoo Live system](https://github.com/nodezoo/nodezoo-system)
* [NodeZoo Workshop, iteration 5](https://github.com/nodezoo/nodezoo-workshop#iteration-05-mesh-networking)
* [ramanajun.io twitter clone](https://github.com/senecajs/ramanujan)



<!--
## Usage

TODO


## Releases

TODO
-->


## Contributing
The [Seneca.js org][] encourages __open__ and __safe__ participation.

- __[CoC][]__

If you feel you can help in any way, be it with documentation, examples, 
extra testing, or new features please get in touch.


## License
Copyright (c) 2015-2016, Richard Rodger and other contributors.
Licensed under [MIT][].

[MIT]: ./LICENSE
[npm-badge]: https://badge.fury.io/js/seneca-mesh.svg
[npm-url]: https://badge.fury.io/js/seneca-mesh
[Seneca.js org]: https://github.com/senecajs/
[Seneca.js]: https://www.npmjs.com/package/seneca
[@senecajs]: http://twitter.com/senecajs
[senecajs.org]: http://senecajs.org/
[travis-badge]: https://travis-ci.org/rjrodger/seneca-mesh.svg
[travis-url]: https://travis-ci.org/rjrodger/seneca-mesh
[gitter-badge]: https://badges.gitter.im/Join%20Chat.svg
[gitter-url]: https://gitter.im/rjrodger/seneca
[github issue]: https://github.com/rjrodger/seneca-mesh/issues
[Balance]: https://github.com/rjrodger/seneca-balance-client
[Lead]: https://github.com/rjrodger/seneca-balance-client
[Sponsor]: http://nearform.com
[CoC]: http://senecajs.org/contribute/details/code-of-conduct.html
