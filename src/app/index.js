import {tag} from '../domdodom'

export const page = tag.html(
  {lang: 'en-US'},
  tag.head(
    tag.meta({charset: 'utf-8'}),
    tag.script({src: '/client/index.js'})
  ),
  tag.body(
    tag.h1('Hello, world!'),
    tag.p('Yes!!!'),
    tag.div({className: 'root'})
  )
)

// const init = () => {
//   const root = document.querySelector('.root')
//   view(root, tag.div('yo'))
// }
//
// if (typeof window !== 'undefined') {
//   window.addEventListener('load', init)
// }
