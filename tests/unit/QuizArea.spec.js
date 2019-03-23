import { createLocalVue, mount } from '@vue/test-utils'
import Field from 'buefy/dist/components/field'
import Input from 'buefy/dist/components/input'
import QuizArea from '@/components/QuizArea'
import Toast from 'buefy/dist/components/toast'
import Radio from 'buefy/dist/components/radio'
const lodash = jest.requireActual('lodash')

const localVue = createLocalVue()
localVue.use(Field)
localVue.use(Input)
localVue.use(Toast)
localVue.use(Radio)

const text = `Various seek hour as similar.
Color challenge TV there sing wife learn.
Citizen party stop card near however.`

const selected = [
  { sentenceIndex: 0, wordIndex: 2, word: 'hour' },
  { sentenceIndex: 2, wordIndex: 5, word: 'collapses.' },
]

describe('QuizArea', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(QuizArea, { localVue })
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  test('has textarea', () => {
    const wrapper = mount(QuizArea, { localVue })
    const textarea = wrapper.find('textarea')
    expect(textarea.is('textarea')).toBeTruthy()
  })

  test('has working shuffle button', () => {
    const wrapper = mount(QuizArea, {
      localVue,
      propsData: {
        text,
        selected,
        mode: 'random',
      },
    })

    const before = wrapper.find('textarea').element.value

    wrapper
      .findAll('button')
      .filter(node => node.text().match(/Shuffle/))
      .at(0)
      .trigger('click')

    const after = wrapper.find('textarea').element.value

    expect(before).not.toEqual(after)
  })

  describe('radio', () => {
    let wrapper, findAndClick
    beforeEach(() => {
      wrapper = mount(QuizArea, { localVue })
      findAndClick = word => {
        wrapper
          .findAll('[type]')
          .filter(node => node.element.value.match(new RegExp(word)))
          .at(0)
          .trigger('click')
      }
    })

    test('change to start', () => {
      findAndClick('start')
      expect(wrapper.emitted()).toEqual({ modeChange: [['start']] })
    })

    test('change to end', () => {
      findAndClick('end')
      expect(wrapper.emitted()).toEqual({ modeChange: [['end']] })
    })

    test('change to random', () => {
      findAndClick('random')
      expect(wrapper.emitted()).toEqual({ modeChange: [['random']] })
    })

    test('change to lines', () => {
      findAndClick('lines')
      expect(wrapper.emitted()).toEqual({ modeChange: [['lines']] })
    })

    test('change to selection', () => {
      findAndClick('selection')
      expect(wrapper.emitted()).toEqual({ modeChange: [['selection']] })
    })
  })

  describe('modes', () => {
    describe('start', () => {
      test('can create a quiz', () => {
        lodash.shuffle = jest.fn(a => a)
        const wrapper = mount(QuizArea, {
          localVue,
          propsData: {
            text,
            selected,
            mode: 'start',
          },
        })

        const textarea = wrapper.find('textarea')
        expect(textarea.element.value).toMatchInlineSnapshot(`
"(  ) seek hour as similar.
(  ) challenge TV there sing wife learn.
(  ) party stop card near however.

1) Various  2) Color  3) Citizen"
`)
      })

      test('can create a quiz with random answers', () => {
        lodash.shuffle = jest.fn(a => a.reverse())
        const wrapper = mount(QuizArea, {
          localVue,
          propsData: {
            text,
            selected,
            mode: 'start',
          },
        })

        const textarea = wrapper.find('textarea')
        expect(textarea.element.value).toMatchInlineSnapshot(`
"(  ) seek hour as similar.
(  ) challenge TV there sing wife learn.
(  ) party stop card near however.

1) Citizen  2) Color  3) Various"
`)
      })
    })

    describe('end', () => {
      test('can create a quiz', () => {
        lodash.shuffle = jest.fn(a => a)
        const wrapper = mount(QuizArea, {
          localVue,
          propsData: {
            text,
            selected,
            mode: 'end',
          },
        })

        const textarea = wrapper.find('textarea')
        expect(textarea.element.value).toMatchInlineSnapshot(`
"Various seek hour as (  ).
Color challenge TV there sing wife (  ).
Citizen party stop card near (  ).

1) similar  2) learn  3) however"
`)
      })

      test('can create a quiz with random answers', () => {
        lodash.shuffle = jest.fn(a => a.reverse())
        const wrapper = mount(QuizArea, {
          localVue,
          propsData: {
            text,
            selected,
            mode: 'end',
          },
        })

        const textarea = wrapper.find('textarea')
        expect(textarea.element.value).toMatchInlineSnapshot(`
"Various seek hour as (  ).
Color challenge TV there sing wife (  ).
Citizen party stop card near (  ).

1) however  2) learn  3) similar"
`)
      })
    })

    describe('random', () => {
      test('can create a quiz', () => {
        lodash.sample = jest.fn(a => a[1])
        lodash.shuffle = jest.fn(a => a)

        const wrapper = mount(QuizArea, {
          localVue,
          propsData: {
            text,
            selected,
            mode: 'random',
          },
        })

        const textarea = wrapper.find('textarea')
        expect(textarea.element.value).toMatchInlineSnapshot(`
"Various (  ) hour as similar.
Color (  ) TV there sing wife learn.
Citizen (  ) stop card near however.

1) seek  2) challenge  3) party"
`)
      })

      test('can create a quiz with random answers', () => {
        lodash.sample = jest.fn(a => a[1])
        lodash.shuffle = jest.fn(a => a.reverse())

        const wrapper = mount(QuizArea, {
          localVue,
          propsData: {
            text,
            selected,
            mode: 'random',
          },
        })

        const textarea = wrapper.find('textarea')
        expect(textarea.element.value).toMatchInlineSnapshot(`
"Various (  ) hour as similar.
Color (  ) TV there sing wife learn.
Citizen (  ) stop card near however.

1) party  2) challenge  3) seek"
`)
      })
    })

    describe('lines', () => {
      test('can create a quiz', () => {
        lodash.sample = jest.fn(a => a[1])
        lodash.shuffle = jest.fn(a => a)

        const wrapper = mount(QuizArea, {
          localVue,
          propsData: {
            text,
            selected,
            mode: 'lines',
          },
        })

        const textarea = wrapper.find('textarea')
        expect(textarea.element.value).toMatchInlineSnapshot(`
"Various seek hour as similar.
Color challenge TV there sing wife learn.
Citizen party stop card near however.

1) 1  2) 2  3) 3"
`)
      })

      test('can create a quiz with random answers', () => {
        lodash.sample = jest.fn(a => a[1])
        lodash.shuffle = jest.fn(a => a.reverse())

        const wrapper = mount(QuizArea, {
          localVue,
          propsData: {
            text,
            selected,
            mode: 'lines',
          },
        })

        const textarea = wrapper.find('textarea')
        expect(textarea.element.value).toMatchInlineSnapshot(`
"Citizen party stop card near however.
Color challenge TV there sing wife learn.
Various seek hour as similar.

1) 3  2) 2  3) 1"
`)
      })
    })

    describe('selection', () => {
      test('can create a quiz', () => {
        lodash.sample = jest.fn(a => a[1])
        lodash.shuffle = jest.fn(a => a)

        const wrapper = mount(QuizArea, {
          localVue,
          propsData: {
            text,
            selected,
            mode: 'selection',
          },
        })

        const textarea = wrapper.find('textarea')
        expect(textarea.element.value).toMatchInlineSnapshot(`
"Various seek (  ) as similar.
Color challenge TV there sing wife learn.
(  )party stop card near however.

1) hour  2) collapses"
`)
      })

      test('can create a quiz with random answers', () => {
        lodash.sample = jest.fn(a => a[1])
        lodash.shuffle = jest.fn(a => a.reverse())

        const wrapper = mount(QuizArea, {
          localVue,
          propsData: {
            text,
            selected,
            mode: 'selection',
          },
        })

        const textarea = wrapper.find('textarea')
        expect(textarea.element.value).toMatchInlineSnapshot(`
"Various seek (  ) as similar.
Color challenge TV there sing wife learn.
(  )party stop card near however.

1) collapses  2) hour"
`)
      })
    })
  })
})
