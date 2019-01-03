<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/OrdinaryUserList' }">普通用户列表</el-breadcrumb-item>
      <el-breadcrumb-item>普通用户下线信息</el-breadcrumb-item>
    </el-breadcrumb>

    <!--检索条-->
    <el-col class="toolbar" style="padding-top: 15px;">
      <el-form :inline="true" style="float:right">
        <el-form-item>
          <el-button type="primary" @click="handleAdd()">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!-- table 内容 -->
    <el-table :data="list" style="width: 100%" :border='true'>
      <el-table-column label="关系" prop="relationShipOneName">
      </el-table-column>
      <el-table-column label="用户名" prop="name">
      </el-table-column>
      <el-table-column label="手机号" prop="Phone">
      </el-table-column>
      <el-table-column label="身份" prop="identity">
      </el-table-column>
      <el-table-column label="佣金" prop="Commission">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleDel(scope.row.ID)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="block">
      <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next,jumper" :page-count="pageCount">
      </el-pagination>
    </div>

    <!-- 模态框 -->
    <el-dialog title="新增" :visible.sync="dialogFormVisible" width="50%">
      <el-form :model="editlist" :rules="rules" ref="editlist" label-width="150px" class="demo-ruleForm">
        <el-form-item label="用户手机号" prop="phone">
          <el-input v-model="editlist.phone" style="width:100%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitaddForm('editlist')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import qs from "qs";
  export default {
    data() {
      return {
        list: [],
        editlist: [],
        dialogFormVisible: false,
        pageIndex: 1,
        pageSize: 12,
        pageCount: 1,
        rules: {
          phone: [{
            required: true,
            message: '请输入手机号',
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
          .post("api/Back_UserManage/LineMessage?token=" + getCookie("token") + "&id=" + window.location.href.split(
              "id=")[1],
            // qs.stringify({
            //   token: getCookie("token"),
            //   id:window.location.href.split("id=")[1],
            // })
          )
          .then(
            function (response) {
              loading.close();
              var status = response.data.Status;
              if (status === 1) {
                this.list = response.data.Result.datalist;
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
              console.log(error)
              loading.close();
              this.$notify.error({
                title: "错误",
                message: "错误：请检查网络"
              });
            }.bind(this)
          );
      },
      handleAdd() {
        this.editlist = []
        this.dialogFormVisible = true
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
              .post("api/Back_UserManage/LineAdd?token=" + getCookie("token") + "&id=" + window.location.href.split(
                  "id=")[1] + "&phone=" + this.editlist.phone,
                // qs.stringify({
                //   token: getCookie("token"),
                //   id:window.location.href.split("id=")[1],
                // })
              )
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
                  console.log(error)
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
      handleCurrentChange(val) {
        this.pageIndex = val;
        this.getInfo();
      },
      handleDel(id) {
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const loading = this.$loading({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });
          this.$http
            .post("api/Back_UserManage/LineDelete?token=" + getCookie("token") + "&id=" + id,
              // qs.stringify({
              //   token: getCookie("token"),
              //   id:window.location.href.split("id=")[1],
              // })
            )
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
                console.log(error)
                loading.close();
                this.$notify.error({
                  title: "错误",
                  message: "错误：请检查网络"
                });
              }.bind(this)
            );
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
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
