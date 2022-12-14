<template>
  <transition name="el-zoom-in-top" @after-leave="doDestroy">
    <div
      v-show="showPopper"
      class="el-color-dropdown"
    >
      <div class="el-color-dropdown__main-wrapper">
        <hue-slider ref="hue" :color="color" vertical style="float: right;" />
        <sv-panel ref="sl" :color="color" />
      </div>
      <alpha-slider v-if="showAlpha" ref="alpha" :color="color" />
      <predefine v-if="predefine" :color="color" :colors="predefine" />
      <div class="el-color-dropdown__btns">
        <span class="el-color-dropdown__value">
          <el-input
            v-model="customInput"
            :validate-event="false"
            size="mini"
            @keyup.native.enter="handleConfirm"
            @blur="handleConfirm"
          />
        </span>
        <!-- <el-button
          size="mini"
          type="text"
          class="el-color-dropdown__link-btn"
          @click="$emit('clear')">
          {{ t('el.colorpicker.clear') }}
        </el-button> -->
        <el-button
          plain
          size="mini"
          type="primary"
          class="el-color-dropdown__btn"
          @click="confirmValue"
        >
          {{ t('el.colorpicker.confirm') }}
        </el-button>
      </div>
      <color-list
        v-if="colorList && colorList.length > 0"
        :color="color"
        :colors="colorList"
        @select="onColorListSelect"
      />
    </div>
  </transition>
</template>

<script>
import SvPanel from './components/sv-panel'
import HueSlider from './components/hue-slider'
import AlphaSlider from './components/alpha-slider'
import Predefine from './components/predefine'
import ColorList from './components/color-list'
import Popper from 'element-ui/src/utils/vue-popper'
import Locale from 'element-ui/src/mixins/locale'
import ElInput from 'element-ui/packages/input'
import ElButton from 'element-ui/packages/button'

export default {
  name: 'ElColorPickerDropdown',

  components: {
    SvPanel,
    HueSlider,
    AlphaSlider,
    ElInput,
    ElButton,
    Predefine,
    ColorList
  },

  mixins: [Popper, Locale],

  props: {
    color: {
      required: true
    },
    showAlpha: Boolean,
    predefine: Array,
    colorList: Array
  },

  data() {
    return {
      customInput: ''
    }
  },

  computed: {
    currentColor() {
      const parent = this.$parent
      return !parent.value && !parent.showPanelColor ? '' : parent.color.value
    }
  },

  watch: {
    showPopper(val) {
      if (val === true) {
        this.$nextTick(() => {
          const { sl, hue, alpha } = this.$refs
          sl && sl.update()
          hue && hue.update()
          alpha && alpha.update()
        })
      }
    },

    currentColor: {
      immediate: true,
      handler(val) {
        this.customInput = val
      }
    }
  },

  mounted() {
    this.$parent.popperElm = this.popperElm = this.$el
    this.referenceElm = this.$parent.$el
  },

  methods: {
    confirmValue() {
      this.$emit('pick')
    },

    onColorListSelect(e) {
      this.$emit('pick', e)
    },

    handleConfirm() {
      this.color.fromString(this.customInput)
    }
  }
}
</script>
