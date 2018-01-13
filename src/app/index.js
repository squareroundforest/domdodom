import {tag} from '../domdodom'

export default tag.html(
  {lang: 'en-US'},
  tag.head(
    tag.meta({charset: 'utf-8'}),
    tag.script({src: '/client/index.js'})
  ),
  tag.body(
    tag.h1('Hello, world!'),
    tag.p('Yes!!!')
  )
)
