<template>
  <div class="app-container">
    <div style="display:inline; width: 100%">
      <el-input
        v-model="search"
        size="small"
        style="width: 200px"
        placeholder="请输入用户Id进行搜索"/>
      &nbsp;
      <el-button size="small"
        type="primary"
        icon="el-icon-search"
        @click="searchUser"
      >搜索</el-button>
    </div>
    <el-table
      :data="tableData"
      stripe
      style="width: 100%;min-height: 685px">
      <el-table-column
        prop="userId"
        label="用户Id"
        width="180">
      </el-table-column>
      <el-table-column
        prop="nickName"
        label="用户昵称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="loginTime"
        label="登陆时间"
        width="180">
      </el-table-column>
      <el-table-column
        prop="role"
        label="角色">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-popconfirm
            confirm-button-text='好的'
            cancel-button-text='不用了'
            icon="el-icon-info"
            icon-color="red"
            title="确定要删除该用户吗？"
            @onConfirm="handleDelete(scope.$index, scope.row)"
            @onCancel="cancel(scope.$index, scope.row)"
          >
            <el-button
            size="mini"
            type="danger"
            slot="reference"
            >删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <br>
    <el-pagination
      background
      :page-size="pageSize"
      layout="prev, pager, next"
      @current-change="pageChange"
      :total="total">
    </el-pagination>
  </div>
</template>


<script>
import date from '@/utils/date'
  export default {
    inject: [ 'reload' ],
    data() {
      return { tableData: [], dialogVisible: false, total: 0, pageSize: 12, search: '' }
    },
    created() {
      this.getUserList()
    },
    methods: {
      handleDelete(index, row) {
        console.log('confirm', index, row)
        this.$http.delete('/v1/user/'+row.userId)
          .then(({ status, data }) => {
            if (status == 200 && data.Code == 0) {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.reload()
              return
            }
            this.$message.error('删除失败，请稍后重试');
          })
          .catch(e => {
            console.log(e)
            this.$message.error('删除失败，请稍后重试');
          })
      },
      cancel(index, row) {
        console.log("cancle", index, row)
      },
      getUserList(skip = 0, limit = 12) {
        this.$http.get(`/v1/user/?skip=${skip}&limit=${limit}`)
          .then(({status, data}) => {
            if (status == 200 && data.Code == 0) {
              this.tableData = fixDatas(data.Res.rows)
              this.total = data.Res.count
              this.pageSize = limit
              return
            }
            this.tableData = []
          })
          .catch(e => {
            console.log(e)
          })
      },
      pageChange(page) {
        this.getUserList((page - 1) * this.pageSize, this.pageSize)
      },
      searchUser() {
        if (!this.search) {
          this.reload()
          return
        }
        this.$http.get(`/v1/user/${this.search}`)
          .then(({ data, status }) => {
            if (status == 200 && data.Code == 0) {
              this.tableData = fixDatas([data.Res])
              this.total = 1
              return
            }
            this.tableData = []
            this.total = 0
          })
          .catch(e => {
            console.log(e)
            this.tableData = []
            this.total = 0
          })
      }
    }
  }

  function fixDatas(arr) {
    arr.forEach(item => {
      item.role = item.role === 1 ? 'anchor' : 'audience'
      item.loginTime = date.dateFilter(item.loginTime * 1000)
    })
    return arr
  }
</script>