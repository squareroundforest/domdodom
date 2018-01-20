// const html = innerHTML('<p>foo</p><p>bar</p>')
//
// // mount under body:
// mount(html)
//
// // mount in place of element:
// mount(html, document.getElementById('placeholder'))
//
// // render under body:
// render(html)
//
// // render in place of element:
// render(html, document.getElementById('placeholder'))
//
// // render in place of reference:
// const ref = mount(html, document.getElementById('placeholder'))
// update(html, ref)
//
// // ? what if it is already rendered on the server
// // -> only if there is a single top element can it properly mount
//
// // ? what should we do if we want to render a single textarea element that is initially empty
//
// const textarea = document.querySelector('textarea')
// mount(htmlContent('some code'), textarea)
//
// // ? accept some limitation on innerHTML
//
// // ! innerHTML is a wrong name, verbatim HTML? or just HTML?
//
// // --
//
// // partial rendering internally:
// const listItems = define((_, children) => children.map(tag.li))
//
// // the usage of this here is questionable because it introduces the state
// // also not good because of what's with the existing children and props?
// const shuffleItems = listItems({onclick: e => render(this, shuffle(this.children))})
//
// render(
//   document.body,
//   {'class': 'hybrid-list'},
//   tag.ul(
//     // this is why not sure anymore about returning multiple items, the innerHTML should be sorted
//     // in a different way, and maybe just using a placeholder or container is fine
//     shuffleItems('foo', 'bar', 'baz'),
//     shuffleItems('qux', 'quux', 'quuz')
//   )
// )
//
// // wrapped component:
// const shuffleList = define(
//   (_, children) => tag.ul(shuffle(children).map(tag.li)),
//   {onclick: (e, v) => render(v)}
// )
// render(shuffleList(1, 2, 3), document.getElementById('shuffle'))
//
// // app.js:
// /* global dom tag */
//
// const timer = dom.define(
//   () => new Date(),
//   {onrender: () => setTimeout(this, 999)}
// )
//
// const page = tag.html(
//   {lang: 'en-US'},
//   tag.head(
//     tag.meta({charset: 'utf-8'}),
//     tag.title('Timer')
//   ),
//   tag.body(
//     timer,
//     tag.script({src: 'https://bit.ly/abc/domdodom.min.js'}),
//     tag.script({src: '/app.js'})
//   )
// )
//
// if (typeof window === 'undefined') {
//   module.exports = page
// } else {
//   dom.mount(page)
// }
//
// // --
//
// // import {tag} from '../domdodom'
//
// // export const page = tag.html(
// //   {lang: 'en-US'},
// //   tag.head(
// //     tag.meta({charset: 'utf-8'}),
// //     tag.script({src: '/client/index.js'})
// //   ),
// //   tag.body(
// //     tag.h1('Hello, world!'),
// //     tag.p('Yes!!!'),
// //     tag.div({className: 'placeholder'})/*,
// //     initClient */
// //   )
// // )
//
// // TODO: maybe view should be renamed to render
//
// // const init = () => {
// //   // should not cause unnecessary dom change, because and component updates will become hard
// //   const placeholder = document.querySelector('.placeholder')
// //   const yo = render(placeholder, tag.div('yo'))
// //   yo('yoyo')
// // }
// //
// // if (typeof window !== 'undefined') {
// //   window.addEventListener('load', init)
// // }
