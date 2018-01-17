// app.js:
/* global dom tag */

const timer = dom.define(
  () => new Date(),
  {onrender: () => setTimeout(this, 999)}
)

const page = tag.html(
  {lang: 'en-US'},
  tag.head(
    tag.meta({charset: 'utf-8'}),
    tag.title('Timer')
  ),
  tag.body(
    timer,
    tag.script({src: 'https://bit.ly/abc/domdodom.min.js'}),
    tag.script({src: '/app.js'})
  )
)

if (typeof window === 'undefined') {
  module.exports = page
} else {
  dom.mount(page)
}

// --

// import {tag} from '../domdodom'

// export const page = tag.html(
//   {lang: 'en-US'},
//   tag.head(
//     tag.meta({charset: 'utf-8'}),
//     tag.script({src: '/client/index.js'})
//   ),
//   tag.body(
//     tag.h1('Hello, world!'),
//     tag.p('Yes!!!'),
//     tag.div({className: 'placeholder'})/*,
//     initClient */
//   )
// )

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
