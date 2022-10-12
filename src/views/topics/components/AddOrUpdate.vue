<template>
  <div>
    <el-dialog top="30px" :title="form.id ? $t('table.edit') : $t('table.add')" :visible.sync="visible" @closed="onClose()">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="发起用户">
          <el-avatar icon="el-icon-user-solid" style="vertical-align: top;" :src="userInfo.avatar ? (domin + userInfo.avatar) : ''" />
          <div style="display: inline-block;margin-left: 2px">
            <div>
              #{{ userInfo.id }}
              <el-divider direction="vertical" />
              {{ userInfo.name }}
            </div>
            <div>
              {{ userInfo.phone }}
            </div>
          </div>
        </el-form-item>
        <el-form-item label="观点内容" prop="intro">
          <el-input v-model="form.intro" show-word-limit clearable type="textarea" maxlength="1000" placeholder="观点内容" :rows="5" />
        </el-form-item>
        <el-form-item label="观点类型" prop="type">
          <el-radio-group v-model="form.type" :disabled="!!form.id" @change="onChangeType">
            <el-radio :label="0">添加图片</el-radio>
            <el-radio :label="1">添加投票</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.type===0" label="最多6张" prop="images">
          <div class="filter-list-box">
            <draggable v-model="form.images" v-bind="dragOptions" class="wrapper" @start="drag = true" @end="drag = false">
              <div v-for="(item, index) in form.images" :key="index" class="upload-images">
                <div class="upload-image">
                  <el-image :src="item.filename && domin + item.filename" class="imageDetail" />
                </div>
                <div class="upload-actions">
                  <i class="el-icon-zoom-in" @click="onPicturePreview(item)" />
                  <i class="el-icon-delete" @click="onPictureRemove(item,index)" />
                </div>
              </div>
            </draggable>
            <custom-upload
              v-show="form.images.length < 6"
              ref-name="images"
              class-name="avatar-uploader"
              @handleBeforeUpload="beforeAvatarUpload"
              @handleSuccess="handleAvatarSuccess"
            >
              <i slot="default" class="el-icon-plus avatar-uploader-icon" />
            </custom-upload>
          </div>
        </el-form-item>
        <el-form-item v-else label-width="0px">
          <div v-for="(item,index) in form.topic_option" :key="index" class="option-list">
            <span>选项{{ index+1 }}</span>
            <el-input v-model="form.topic_option[index]['title']" :disabled="!!form.id" class="option" placeholder="请输入选项内容" />
            <i v-show="form.topic_option.length!==1&&!form.id" class="el-icon-delete" @click="onDeleteOption(index)" />
          </div>
          <el-button v-show="!form.id" class="option-btn el-icon-plus" @click="onAddOption"> 添加选项</el-button>
        </el-form-item>
        <el-form-item label="外链">
          <el-input v-model="form.url" placeholder="请输入链接" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="btnLoading" @click="onFormSubmit()">
          {{ $t('table.confirm') }}
        </el-button>
        <el-button @click="visible = false">
          {{ $t('table.cancel') }}
        </el-button>
      </div>
    </el-dialog>
    <el-image-viewer
      v-if="imageViewer"
      :z-index="3000"
      :on-close="closeViewer"
      :url-list="imageViewerList"
    />
  </div>
</template>

<script>
import { addOrUpdate } from '@/api/topics'
import CustomUpload from '@/components/Upload/CustomUpload'
import { DominKey, getToken } from '@/utils/auth'
import draggable from 'vuedraggable'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'

export default {
  name: 'AddOrUpdate',
  components: { CustomUpload, draggable, ElImageViewer },
  data() {
    return {
      visible: false,
      btnLoading: false,
      domin: getToken(DominKey),
      userInfo: JSON.parse(getToken('userInfo')),
      imageViewer: false,
      imageViewerList: [],
      currentName: '',
      optionIndex: 0,
      image: {
        width: 0,
        height: 0,
        mine: ''
      },
      form: {
        id: 0,
        images: [],
        topic_option: [],
        intro: '',
        type: 0,
        url: ''
      },
      rules: {
        type: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        intro: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        images: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      }
    }
  },
  methods: {
    init(data) {
      this.visible = true
      if (data) {
        this.form = JSON.parse(JSON.stringify(data))
      }
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          addOrUpdate(this.form)
            .then(({ msg }) => {
              this.$message.success(msg)
              this.visible = false
              this.$emit('refreshList')
            })
            .catch(() => {
            }).finally(() => {
              this.btnLoading = false
            })
        }
      })
    },
    onAddOption() {
      this.form.topic_option.push({
        title: ''
      })
    },
    onDeleteOption(index) {
      this.form.topic_option.splice(index, 1)
    },
    onChangeType(e) {
      if (e === 1 && this.form.topic_option.length === 0) {
        this.form.topic_option.push({
          'title': ''
        })
      }
    },
    onClose() {
      this.$reset()
    },
    onPicturePreview(img) {
      this.imageViewerList = [this.domin + img.filename]
      this.imageViewer = true
    },
    onPictureRemove(index) {
      this.form.images.splice(index, 1)
    },
    closeViewer() {
      this.imageViewer = false
    },
    handleAvatarSuccess(response) {
      if (this.currentName === 'images') {
        this.form[this.currentName].push({ filename: response.name, ...this.image })
      } else {
        this.form[this.currentName].filename = response.name
      }
    },
    beforeAvatarUpload(file, cb, refName) {
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
      this.currentName = refName
      new Promise(function(resolve, reject) {
        const _URL = window.URL || window.webkitURL
        const image = new Image()
        image.onload = function() {
          resolve({
            width: image.width,
            height: image.height
          })
        }
        image.onerror = function() {
          reject()
        }
        image.src = _URL.createObjectURL(file)
      })
        .then(response => {
          if (refName === 'images') {
            this.image.width = response.width
            this.image.height = response.height
            this.image.mime = file.type
          }
        })
        .catch(() => { })
      cb(true)
    }

  }
}
</script>

<style lang="scss" scoped>
.option-list {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  span {
    display: inline-block;
    width: 100px;
    text-align: right;
    padding-right: 12px;
  }
  .option {
    width: 400px;
  }
  .el-icon-delete {
    color: #f56c6c;
    margin-left: 20px;
    cursor: pointer;
  }
}

.option-btn {
  float: right;
  margin-right: 59px;
}

.avatar-uploader {
  display: inline-block;
  ::v-deep .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
    /*object-fit: contain;*/
  }
}
::v-deep .filter-list-box {
  .wrapper {
    display: inline;
    vertical-align: top;
  }
  .upload-images {
    overflow: hidden;
    background-color: #fff;
    border: 1px solid #c0ccda;
    border-radius: 6px;
    box-sizing: border-box;
    width: 100px;
    height: 100px;
    margin: 0 8px 8px 0;
    display: inline-block;
    position: relative;
    cursor: grabbing;
    .upload-image {
      width: 100%;
      height: 100%;
      display: -webkit-box;
      display: -ms-flexbox;
      display: -webkit-flex;
      display: flex;
      -webkit-box-pack: center;
      -ms-flex-pack: center;
      -webkit-justify-content: center;
      justify-content: center;
      -webkit-box-align: center;
      -ms-flex-align: center;
      -webkit-align-items: center;
      align-items: center;
      & > img {
        width: 100%;
      }
    }
    .upload-actions {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      background-color: rgba(0, 0, 0, 0.5);
      text-align: center;
      display: none;
      i {
        margin-left: 6px;
        margin-top: 6px;
        &:first-child {
          margin-left: 0;
        }
      }
    }
    &:hover .upload-actions {
      display: block;
    }
    .upload-actions i {
      color: #fff;
      font-size: 18px;
      cursor: pointer;
    }
  }
}
.el-textarea ::v-deep .el-input__count {
  background-color: transparent;
}
.notice {
  color: #909399;
  font-size: 12px;
  line-height: 1.5;
  margin-top: 10px;
}
</style>
