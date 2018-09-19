<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/FirstLevelList' }">一级分类</el-breadcrumb-item>
      <el-breadcrumb-item>二级分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!--检索条-->
    <el-col class="toolbar" style="padding: 15px 0;">
      <el-button size="mini" type="primary" @click="handleAdd()" style="float:right;">新增</el-button>
    </el-col>

    <!-- table 内容 -->
    <el-table :data="list" style="width: 100%" :border='true'>
      <el-table-column label="二级列表名称" prop="name">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.$index)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="block">
      <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next,jumper" :page-count="pageCount">
      </el-pagination>
    </div>

    <!-- 模态框 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="50%">
      <el-form :model="editlist" :rules="rules" ref="editlist" label-width="150px" class="demo-ruleForm">
        <el-form-item label="二级列表名称" prop="name">
          <el-input v-model="editlist.name" style="width:100%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('editlist')" v-if="edit">确 定</el-button>
        <el-button type="primary" @click="submitaddForm('editlist')" v-if="!edit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        list: [],
        editlist: [],
        dialogFormVisible: false,
        pageIndex: 1,
        pageSize: 12,
        pageCount: 1,
        title: '',
        edit: false,
        rules: {
          name: [{
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          }, ],
        },
      };
    },
    mounted() {
      this.getInfo();
    },
    methods: {
      getInfo() {
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        this.$http
          .get("api/Back_SortManage/SecondLevelList", {
            params: {
              pageIndex: this.pageIndex,
              pageSize: this.pageSize,
              firstID: window.location.href.split("id=")[1],
              Token: getCookie("token"),
            }
          })
          .then(
            function (response) {
              loading.close();
              var status = response.data.Status;
              if (status === 1) {
                this.list = response.data.Result.datalist;
                this.pageCount = response.data.Result.page;
              } else if (status === 40001) {
                this.$message({
                  showClose: true,
                  type: "warning",
                  message: response.data.Result
                });
                setTimeout(() => {
                  this.$router.push({
                    path: "/login"
                  });
                }, 1500);
              } else {
                loading.close();
                this.$message({
                  showClose: true,
                  type: "warning",
                  message: response.data.Result
                });
              }
            }.bind(this)
          )
          // 请求error
          .catch(
            function (error) {
              loading.close();
              this.$notify.error({
                title: "错误",
                message: "错误：请检查网络"
              });
            }.bind(this)
          );
      },
      handleEdit(index) {
        this.title = "编辑"
        this.editlist = this.list[index]
        this.dialogFormVisible = true
        this.edit = true
      },
      handleAdd() {
        this.edit = false
        this.title = "新增"
        this.editlist = []
        this.dialogFormVisible = true
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        this.$http
          .get("api/Back_SortManage/SecondLevelEdit", {
            params: {
              name: this.editlist.name,
              secondID: this.editlist.ID,
              Token: getCookie("token"),
            }
          })
          .then(
            function (response) {
              loading.close();
              var status = response.data.Status;
              if (status === 1) {
                this.$message({
                  showClose: true,
                  type: "success",
                  message: response.data.Result
                });
                this.getInfo()
                this.dialogFormVisible = false
              } else if (status === 40001) {
                this.$message({
                  showClose: true,
                  type: "warning",
                  message: response.data.Result
                });
                setTimeout(() => {
                  this.$router.push({
                    path: "/login"
                  });
                }, 1500);
              } else {
                loading.close();
                this.$message({
                  showClose: true,
                  type: "warning",
                  message: response.data.Result
                });
              }
            }.bind(this)
          )
          // 请求error
          .catch(
            function (error) {
              loading.close();
              this.$notify.error({
                title: "错误",
                message: "错误：请检查网络"
              });
            }.bind(this)
          );
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      submitaddForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const loading = this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
              });
            this.$http
            .get("api/Back_SortManage/SecondLevelAdd", {
              params: {
                token: getCookie("token"),
                firstID: window.location.href.split("id=")[1],
                name: this.editlist.name,
              }
            })
            .then(
              function (response) {
                loading.close();
                var status = response.data.Status;
                if (status === 1) {
                  this.$message({
                    showClose: true,
                    type: "success",
                    message: response.data.Result
                  });
                  this.getInfo()
                  this.dialogFormVisible = false
                } else if (status === 40001) {
                  this.$message({
                    showClose: true,
                    type: "warning",
                    message: response.data.Result
                  });
                  setTimeout(() => {
                    this.$router.push({
                      path: "/login"
                    });
                  }, 1500);
                } else {
                  loading.close();
                  this.$message({
                    showClose: true,
                    type: "warning",
                    message: response.data.Result
                  });
                }
              }.bind(this)
            )
            // 请求error
            .catch(
              function (error) {
                loading.close();
                this.$notify.error({
                  title: "错误",
                  message: "错误：请检查网络"
                });
              }.bind(this)
            );
            this.dialogFormVisible = false;
            this.editlist = [];
          } else {
            console.log('error submit!!');
            return false;
          }
        });
        },
      handleCurrentChange(val) {
          this.pageIndex = val;
          this.getInfo();
        },
      back(){
        this.$router.push("/FirstLevelList");
      }
      },
      

    };

</script>
<style scoped>
  /* 面包屑 */

  .crumb {
    height: 36px;
    line-height: 36px;
  }

  .block {
    text-align: center;
    padding: 20px 0;
  }

  .el-row {
    padding: 20px 0px;
  }

  .title {
    font-size: 22px;
    padding: 15px;
    font-weight: bolder;
  }

  .el-input {
    width: 50%;
  }

</style>
