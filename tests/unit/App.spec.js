import { createLocalVue, mount } from '@vue/test-utils'
import App from '@/App'
import Field from 'buefy/dist/components/field'
import Input from 'buefy/dist/components/input'
import Toast from 'buefy/dist/components/toast'
import Radio from 'buefy/dist/components/radio'

const localVue = createLocalVue()
localVue.use(Field)
localVue.use(Input)
localVue.use(Toast)
localVue.use(Radio)

describe('App', function() {
  test('is vue instance', () => {
    const wrapper = mount(App, { localVue })

    expect(wrapper.name()).toBe('App')
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
