<template>
    <div class="app-container">
        <el-form :model="params" status-icon :rules="rules" ref="params" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户ID" prop="userId">
            <el-input v-model="params.userId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="nickName">
            <el-input v-model="params.nickName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户权限" prop="role">
            <el-radio-group v-model="params.role">
                <el-radio v-model="params.role" label=1>anchor</el-radio>
                <el-radio v-model="params.role" label=2>audience</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm('params')">提交</el-button>
            <el-button @click="resetForm('params')">重置</el-button>
        </el-form-item>
        </el-form>
    </div>
</template>

<script>
import axios from 'axios'
  export default {
    data() {
      var checkRole = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请选择一个权限'));
        }
      };
      var validateUserId = (rule, value, callback) => {
        if (value === '') {
          return callback(new Error('请输入用户Id'));
        } else {
          if (this.params.nickName !== '') {
            this.$refs.params.validateField('nickName');
          }
          callback();
        }
      };
      var validateNickName = (rule, value, callback) => {
        if (value === '') {
          return callback(new Error('请输入用户昵称'));
        } else {
          callback();
        }
      };
      return {
        params: {
          userId: '',
          nickName: '',
          role: null
        },
        rules: {
          userId: [
            { validator: validateUserId, trigger: 'blur' }
          ],
          nickName: [
            { validator: validateNickName, trigger: 'blur' }
          ],
          role: [
            { validator: checkRole, trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (!valid) {
            console.log('error submit!!');
            return false;
          }
          
        });
        if (!this.params.nickName || !this.params.userId || !this.params.role) {
          return
        }
        this.params.role = Number(this.params.role)
        axios.post("/v1/user/", this.params, { headers: { "Content-Type": "application/json" } }).then(({ status, data }) => {
          if (status == 200 && data.Code == 0) {
            this.$message({
              message: '添加用户成功',
              type: 'success'
            });
            this.resetForm(formName)
            return
          }
          this.$message.error('添加失败，请稍后重试');
        }).catch(e => {
          console.log(e)
          this.$message.error('添加失败，请稍后重试');
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>