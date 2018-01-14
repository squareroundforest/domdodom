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
    tag.div({className: 'placeholder'})/*,
    initClient */
  )
)

// TODO: maybe view should be renamed to render

// const init = () => {
//   // should not cause unnecessary dom change, because and component updates will become hard
//   const placeholder = document.querySelector('.placeholder')
//   const yo = render(placeholder, tag.div('yo'))
//   yo('yoyo')
// }
//
// if (typeof window !== 'undefined') {
//   window.addEventListener('load', init)
// }
