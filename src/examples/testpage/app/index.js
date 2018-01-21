import {tag, mount} from '../../..'

const app = tag.div('foo')
export const page = tag.html(
  {lang: 'en-US'},
  tag.head(
    tag.meta({charset: 'utf-8'}),
    tag.title('test mount')
  ),
  tag.body(
    app,
    tag.script({src: '/client/index.js'})
  )
)

if (typeof window !== 'undefined') {
  console.log('waiting...')
  setTimeout(() => {
    console.log('mounting')
    mount(app, document.querySelector('div'))
    console.log('done')
  }, 999)
}
