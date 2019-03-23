import { createLocalVue, mount } from '@vue/test-utils'
import Field from 'buefy/dist/components/field'
import Input from 'buefy/dist/components/input'
import OriginalArea from '@/components/OriginalArea'
import Toast from 'buefy/dist/components/toast'

const localVue = createLocalVue()
localVue.use(Field)
localVue.use(Input)
localVue.use(Toast)

const text = `Various seek hour as similar.
Color challenge TV there sing wife learn.
Citizen party stop card near however.`

const selected = [
  { sentenceIndex: 0, wordIndex: 2, word: 'hour' },
  { sentenceIndex: 2, wordIndex: 5, word: 'collapses.' },
]

describe('OriginalArea', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(OriginalArea, { localVue })
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  test('has textarea', () => {
    const wrapper = mount(OriginalArea, { localVue })
    const input = wrapper.find('textarea')
    expect(input.is('textarea')).toBeTruthy()
  })

  test('can set text on input', () => {
    const wrapper = mount(OriginalArea, { localVue })
    const textarea = wrapper.find('textarea')
    textarea.setValue(text)

    expect(textarea.element.value).toBe(text)
  })

  test('can clear input', () => {
    const wrapper = mount(OriginalArea, {
      localVue,
      propsData: {
        text,
        selected,
      },
    })

    wrapper
      .findAll('button')
      .filter(node => node.text().match(/Clear/))
      .at(0)
      .trigger('click')

    expect(wrapper.emitted().textChange).toEqual([['']])
    expect(wrapper.emitted().selectedChange).toEqual([[[]]])
  })

  test('has selection mode', () => {
    const wrapper = mount(OriginalArea, {
      localVue,
      propsData: {
        text,
        selected,
        mode: 'selection',
      },
    })

    const textarea = wrapper.find('textarea')

    expect(textarea.exists()).toBeFalsy()

    const textSelection = wrapper.find('.text__selection')

    expect(textSelection.text().replace(/\s+/g, ' ')).toBe(text.replace(/\s+/g, ' '))
  })

  test('can select a word', () => {
    const wrapper = mount(OriginalArea, {
      localVue,
      propsData: {
        text,
        mode: 'selection',
      },
    })

    const textSelection = wrapper.find('.text__selection')

    textSelection.find('.is-unselectable').trigger('click')

    expect(wrapper.emitted()).toEqual({
      selectedChange: [[[{ sentenceIndex: 0, word: 'Various', wordIndex: 0 }]]],
    })
  })
})
