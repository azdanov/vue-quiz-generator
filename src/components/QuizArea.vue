<template>
  <div>
    <b-field label-for="quiz" label="Quiz">
      <b-input
        id="quiz"
        ref="quiz"
        rows="10"
        type="textarea"
        :value="transform"
      ></b-input>
    </b-field>
    <div class="buttons has-addons is-centered">
      <button :disabled="!transform" class="button" @click="recompute = Math.random()">
        Shuffle
      </button>
      <button :disabled="!transform" class="button is-success" @click="copy">
        Copy
      </button>
    </div>
    <div class="block">
      <b-radio v-model="radio" native-value="start">Start</b-radio>
      <b-radio v-model="radio" native-value="end">End</b-radio>
      <b-radio v-model="radio" native-value="random">Random</b-radio>
      <b-radio v-model="radio" native-value="lines">Lines</b-radio>
      <b-radio v-model="radio" native-value="selection">Selection</b-radio>
    </div>
  </div>
</template>

<script>
import { sample, shuffle } from 'lodash'
import escapeStringRegexp from 'escape-string-regexp'

export default {
  name: 'QuizArea',
  props: {
    mode: {
      type: String,
      default: '',
    },
    selected: {
      type: Array,
      default: () => [],
    },
    text: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      /** @desc reload transform */
      recompute: null,
    }
  },
  computed: {
    radio: {
      /** @param {string} mode */
      set(mode) {
        this.$emit('modeChange', mode)
      },
      /** @returns {string} */
      get() {
        return this.mode
      },
    },
    transform() {
      void this.recompute

      if (!this.text || (this.mode === 'selection' && this.selected.length == 0)) return

      let sentences = this.text.split('\n').map(sentence => sentence.trim())
      let words

      switch (this.mode) {
        case 'lines':
          ;({ sentences, words } = this.linesMode(sentences))
          break
        case 'selection':
          ;({ sentences, words } = this.selectionMode(sentences))
          break
        case 'start':
          ;({ sentences, words } = this.startMode(sentences))
          break
        case 'random':
          ;({ sentences, words } = this.randomMode(sentences))
          break
        case 'end':
          ;({ sentences, words } = this.endMode(sentences))
          break
      }

      return this.createOutput(sentences, words)
    },
  },
  methods: {
    /**
     * @param {string[]} sentences
     * @returns {{sentences: string[], words: string[]}}
     */
    linesMode(sentences) {
      return {
        sentences: shuffle(sentences),
        words: shuffle(sentences.map((_, index) => `${index + 1}`)),
      }
    },
    /**
     * @param {string[]} sentences
     * @returns {{sentences: string[], words: string[]}}
     */
    startMode(sentences) {
      const words = sentences.map(sentence => this.clean(sentence.split(' ')[0]))

      sentences = sentences.map((sentence, index) => {
        const position = sentence.indexOf(words[index])

        return this.replaceWord(sentence, position, position + words[index].length)
      })

      return { sentences, words: shuffle(words) }
    },
    /**
     * @param {string[]} sentences
     * @returns {{sentences: string[], words: string[]}}
     */
    endMode(sentences) {
      const words = sentences.map(sentence => this.clean(sentence.split(' ').pop()))

      sentences = sentences.map((sentence, index) => {
        const position = sentence.lastIndexOf(words[index])

        return this.replaceWord(sentence, position, position + words[index].length)
      })

      return { sentences, words: shuffle(words) }
    },
    /**
     * @param {string[]} sentences
     * @returns {{sentences: string[], words: string[]}}
     */
    randomMode(sentences) {
      const words = sentences.map(sentence => {
        const sentenceWords = sentence.split(' ')
        return this.clean(sample(sentenceWords))
      })

      sentences = sentences.map((sentence, index) => {
        const position = sentence.search(
          new RegExp(`\\b${escapeStringRegexp(words[index])}\\b`),
        )

        return this.replaceWord(sentence, position, position + words[index].length)
      })

      return { sentences, words: shuffle(words) }
    },
    /**
     * @param {string[]} sentences
     * @returns {{sentences: string[], words: string[]}}
     */
    selectionMode(sentences) {
      const words = this.selected.map(word => this.clean(word.word))
      const sentencesModified = [...sentences]

      this.selected.forEach(({ sentenceIndex }, index) => {
        const sentence = sentencesModified[sentenceIndex]
        const position = sentence.search(
          new RegExp(`\\b${escapeStringRegexp(words[index])}\\b`),
        )

        sentencesModified[sentenceIndex] = this.replaceWord(
          sentence,
          position,
          position + words[index].length,
        )
      })

      return { sentences: sentencesModified, words: shuffle(words) }
    },
    /**
     * @param {string[]} sentences
     * @param {string[]} words
     * @returns {string}
     */
    createOutput(sentences, words) {
      const text = sentences.join('\n')
      const answers = words.map((word, index) => `${index + 1}) ${word}`).join('  ')

      return `${text}\n\n${answers}`
    },
    /** @param {string} mode */
    onModeChange(mode) {
      this.$emit('modeChange', mode)
    },
    copy() {
      if (!this.transform) return

      navigator.permissions
        .query({ name: 'clipboard-write' })
        .then(result => {
          if (result.state == 'granted' || result.state == 'prompt') {
            navigator.clipboard
              .writeText(this.transform)
              .then(this.onCopy, this.onError)
          }
        })
        .catch(() => {
          this.$refs.quiz.$refs.textarea.select()
          const result = document.execCommand('copy')
          this.$refs.quiz.$refs.textarea.blur()

          if (result) {
            this.onCopy()
          } else {
            this.onError()
          }
        })
    },
    onCopy() {
      this.$toast.open({
        message: 'Copied!',
        type: 'is-success',
        position: 'is-bottom',
      })
    },
    onError() {
      this.$toast.open({
        message: 'Error!',
        type: 'is-danger',
        position: 'is-bottom',
      })
    },
    /**
     * @param {string} sentence
     * @param {number} start
     * @param {number} end
     * @returns {string}
     */
    replaceWord(sentence, start, end) {
      return `${sentence.substring(0, start)}(  )${sentence.substring(end)}`
    },
    /** @param {string} word */
    clean(word) {
      return word.replace(/[^\w\s']|_/g, '').replace(/\s+/g, ' ')
    },
  },
}
</script>

<style scoped></style>
