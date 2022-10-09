<template>
  <el-dialog title="" :visible.sync="visible" @closed="onClose()">
    <JwChat v-model="inputMsg" :tale-list="list" :tool-config="tool" @enter="bindEnter" />
    <div class="up-img">
      <div v-for="(item, index) in sendImgs" :key="index" class="img-box">
        <i class="el-icon-close close" @click="onCloseImg(index)" />
        <el-image
          class="img-item"
          :src="domin + item.filename"
          fit="cover"
          :preview-src-list="[domin + item.filename]"
        />
      </div>
    </div>
    <div style="display: none;">
      <custom-upload
        class-name="up_uploader"
        @handleBeforeUpload="beforeAvatarUpload"
        @handleSuccess="handleAvatarSuccess"
      />
    </div>
  </el-dialog>
</template>

<script>
import { detailList, setReply } from '@/api/feedback'
import { getToken, DominKey } from '@/utils/auth'
import { mapGetters } from 'vuex'
import CustomUpload from '@/components/Upload/CustomUpload'
import { JwChartData } from './JwChartData'
export default {
  name: 'JwChatTalk',
  components: { CustomUpload },
  data() {
    return {
      : getToken(Key),
      visible: false,
      btnLoading: false,
      inputMsg: '',
      list: [],
      sendImgs: [],
      tool: {
        show: ['img'],
        showEmoji: false,
        callback: this.toolEvent
      },
      form: {
        id: 0,
        user: {},
        content: '',
        created_at: '',
        images: []
      },
      rules: {
        name: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'configInfo', 'info'
    ])
  },
  methods: {
    init(data) {
      this.visible = true
      if (data) {
        this.form = data
        const { created_at, content, user } = data
        this.list.push(new JwChartData(created_at, content, false, user.name, [data.user, 'user']))
        if (data.images && data.images.length) {
          data.images.forEach(v => {
            const img = `<img data-src='${this.domin + v.filename}' />`
            this.list.push(new JwChartData(created_at, img, false, user.name, [data.user, 'user']))
          })
        }
        this.getList(data.id)
      }
    },
    getList(id) {
      detailList(id)
        .then(response => {
          response.data.forEach(item => {
            const { created_at, content, type, user } = item
            this.list.push(new JwChartData(created_at, content, type !== 'user', user.name, [user, type]))
            if (item.images.length > 0) {
              item.images.forEach(v => {
                const img = `<img data-src='${this.domin + v.filename}' />`
                this.list.push(new JwChartData(created_at, img, type !== 'user', user.name, [user, type]))
              })
            }
          })
        })
        .catch(() => {
        })
        .finally(() => {
        })
    },
    getImageDetail() {
      const imgItem = document.getElementsByClassName('img-item')
      imgItem.forEach((v, index) => {
        const indexs = this.sendImgs[index].filename.lastIndexOf('.')
        this.sendImgs[index] = {
          filename: this.sendImgs[index].filename,
          height: v.getElementsByTagName('img')[0].height,
          width: v.getElementsByTagName('img')[0].width,
          mime: this.sendImgs[index].filename.substr(indexs + 1)
        }
      })
    },
    bindEnter(e) {
      this.getImageDetail()
      const msg = this.inputMsg
      if (!msg) {
        this.$message.error('必须输入回复')
        return false
      }
      const images = []
      this.sendImgs.forEach((v, index) => {
        const indexs = this.sendImgs[index].filename.lastIndexOf('.')
        this.sendImgs[index] = {
          filename: this.sendImgs[index].filename,
          height: v.height,
          width: v.width,
          mime: this.sendImgs[index].filename.substr(indexs + 1)
        }
        images.push(this.sendImgs[index])
      })
      this.$confirm(`确定进行回复操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          setReply({ id: this.form.id, content: msg, images: images })
            .then(({ data, msg = '跟进成功' }) => {
              this.sendImgs = []
              this.list.push(new JwChartData(data.created_at, data.content, true, this.info.name, ['', data.type]))
              if (data.images.length > 0) {
                data.images.forEach(item => {
                  const img = `<img data-src='${this.domin + item.filename}' />`
                  this.list.push(new JwChartData(data.created_at, img, true, this.info.name, ['', data.type]))
                })
              }
              this.$message.success(msg)
            })
            .catch(() => {
              this.inputMsg = msg
            })
        })
        .catch(() => {
          this.inputMsg = msg
        })
    },
    onClose() {
      this.$reset('data', false)
    },
    // avatar(data, type) {
    //   if (type === 'user') {
    //     return data.avatar ? this.domin + data.avatar : require('@/assets/images/favicon.png')
    //   } else if (type === 'system') {
    //     return require('@/assets/images/favicon.png')
    //   }
    //   return ''
    // },
    toolEvent(type, plyload) {
      if (type === 'img') {
        if (this.sendImgs.length < 3) {
          document.querySelector('.up_uploader input').click()
        } else {
          this.$message.error('最多上传3张图片')
        }
      }
    },
    onCloseImg(index) {
      this.sendImgs.splice(index, 1)
    },
    handleAvatarSuccess(response, file) {
      this.sendImgs.push({ filename: response.name, height: 0, width: 0, mime: '' })
    },
    beforeAvatarUpload(file, cb) {
      const type = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
      const isLt2M = file.size / 1024 / 1024 < 20

      if (!type.includes(file.type)) {
        this.$message.error('上传图片只能是 ' + type.join(',') + ' 格式!')
        cb(false)
        return
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 20M')
        cb(false)
        return
      }
      cb(true)
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-dialog__body {
  padding: 0;
  padding-top: 30px;
}
.up-img {
  position: relative;
  left: 20px;
  top: -20px;
  .img-box {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 50px;
    margin-right: 20px;
    .img-item {
      width: 100%;
      height: 100%;
    }
    .close {
      position: absolute;
      right: -5px;
      top: -5px;
      z-index: 1;
      color: #000;
      background-color: #999;
      cursor: pointer;
      border-radius: 50%;
      transition: all 0.3s;
      &:hover {
        transform: scale(1.5);
      }
    }
  }
}
</style>
