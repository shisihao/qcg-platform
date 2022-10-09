<template>
  <div class="app-container">
    <el-form ref="form" :model="defaultValue" label-position="right" label-width="110px">
      <el-form-item label="开关">
        <el-switch
          v-model="defaultValue.switch"
          active-value="on"
          inactive-value="off"
        />
      </el-form-item>
      <el-form-item label="锁单价格">
        <el-input-number v-model="defaultValue.lock_price" :min="0" :precision="2" controls-position="right" />
      </el-form-item>
      <el-form-item label="锁单手机号" prop="account">
        <div class="account-wrap">
          <div v-show="defaultValue.account.length" class="account-container-1">
            <el-tag
              v-for="(tag,accountIndex) in defaultValue.account"
              :key="accountIndex"
              closable
              :disable-transitions="false"
              @close="handleClose(tag)"
            >
              {{ tag }}
            </el-tag>
          </div>
          <div class="account-container-2">
            <div v-for="(item,index) in new_aconunt" :key="index">
              <el-form-item label="账号">
                <el-input
                  v-model.number.trim="item.phone"
                  class="input-new-tag"
                />
              </el-form-item>
              <el-form-item label="密码">
                <el-input
                  v-model.trim="item.password"
                  type="password"
                  class="input-new-tag"
                />
              </el-form-item>
            </div>
            <template>
              <el-button v-if="inputVisible" class="button-new-tag" size="small" @click="showInput">+ 添加手机号</el-button>
            </template>
          </div>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="btnLoading" @click="onFormSubmit()">
          {{ $t('table.confirm') }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { lockFlash, putLockFlash } from '@/api/configs'
export default {
  name: 'Locksetting',
  data() {
    return {
      new_aconunt: [],
      btnLoading: false,
      inputVisible: true,
      inputValue: '',
      inputPass: '',
      defaultValue: {
        switch: 'off',
        lock_price: 0,
        account: []
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getList()
    },
    getList() {
      lockFlash()
        .then(response => {
          this.form = response.data.value
          this.defaultValue = response.data.value
        })
        .catch(() => {
        })
    },

    handleClose(tag) {
      this.defaultValue.account.splice(this.defaultValue.account.indexOf(tag), 1)
    },
    showInput() {
      this.inputVisible = false
      this.new_aconunt.push({ phone: '', password: '' })
    },
    onFormSubmit() {
      this.btnLoading = true
      this.defaultValue = Object.assign(this.defaultValue, { new_accounts: this.new_aconunt })
      putLockFlash(this.defaultValue)
        .then(({ msg }) => {
          this.$message.success(msg)
          this.new_aconunt = []
          this.inputVisible = true
          this.getList()
        })
        .catch(() => {
          this.getList()
          this.new_aconunt = []
          this.inputVisible = true
        })
        .finally(() => {
          this.btnLoading = false
        })
    }
  }
}
</script>

<style  scoped>
.app-container{
  width: 800px;
}
.el-input-number{
  width: 200px;
}

 .el-tag {
  margin-right: 10px;
  margin-bottom: 10px;
}
.button-new-tag {
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 150px;
  margin-left: 10px;
  vertical-align: bottom;
}
.el-tag--mini {
  height: 32px;
  line-height: 32px;
  padding: 0 15px;
  font-size: 15px;
}
.account-wrap{
  display: flex;

}
.account-container-1{
flex: 2;
}
.account-container-2 {
  flex: 1;
}
.el-form{
  padding-left: 10px;
}
</style>
