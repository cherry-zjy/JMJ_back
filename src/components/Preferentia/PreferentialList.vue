<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item>优惠券列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--检索条-->
    <el-col class="toolbar" style="padding: 15px 0;">
      <el-button size="mini" type="primary" @click="handleAdd()" style="float:right">新增</el-button>
    </el-col>

    <!-- table 内容 -->
    <el-table :data="list" style="width: 100%" :border='true'>
      <el-table-column label="抵用券名称" prop="Name">
      </el-table-column>
      <el-table-column label="抵用券抵用信息" prop="Position">
        <template slot-scope="scope">
          满{{scope.row.Full}}减{{scope.row.CutPrice}}
        </template>
      </el-table-column>
      <el-table-column label="抵用券适用商品种类" prop="classificationID">
      </el-table-column>
      <el-table-column label="有效日期" prop="Url">
        <template slot-scope="scope">
          {{scope.row.startTime | time}}--{{scope.row.endTime | time}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" plain @click="detail(scope.row.ID)">详情</el-button>
          <el-button size="mini" type="success" plain v-if="scope.row.status==1" disabled>已发放</el-button>
          <el-button size="mini" type="success" plain v-if="scope.row.status!==1" @click="handleDelete(scope.row.ID,1)">抵用券发放</el-button>
          <el-button size="mini" type="danger" plain v-if="scope.row.status==2" disabled>已关闭发放</el-button>
          <el-button size="mini" type="danger" plain v-if="scope.row.status!==2" @click="handleDelete(scope.row.ID,2)">关闭发放</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block">
      <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next,jumper" :page-count="pageCount">
      </el-pagination>
    </div>
    <!-- 模态框 -->
    <el-dialog title="抵用券详情" :visible.sync="dialogFormVisible1" width="50%">
      <el-form :model="editForm" label-width="180px" ref="editForm">
        <el-form-item label="抵用券名称">
          {{editForm.name}}
        </el-form-item>
        <el-form-item label="抵用券抵用信息">
          满{{editForm.full}}减{{editForm.cut}}
        </el-form-item>
        <el-form-item label="抵用券适用用户等级">
          {{editForm.userlevel}}
        </el-form-item>
        <el-form-item label="抵用券适用商品种类">
          {{editForm.zhonglei}}
        </el-form-item>
        <el-form-item label="抵用券有效日期">
          {{editForm.starttime | time}}--{{editForm.endtime | time}}
        </el-form-item>
        <el-form-item label="抵用券数量">
          {{editForm.number}}
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">关闭</el-button>
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
        editForm: [],
        imageUrl: '',
        dialogFormVisible1: false,
        mainurl: '',
        pageIndex: 1,
        pageSize: 12,
        pageCount: 1,
        datalist: [],
      };
    },
    mounted() {
      this.mainurl = mainurl
      this.getInfo();
      this.getClass()
    },
    filters: {
      time: function (value) {
        if (value) {
          return value.split("T")[0];
        }
        
      }
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
          .get("api/Back_PreferentialManage/PreferentialList", {
            params: {
              pageIndex: this.pageIndex,
              pageSize: this.pageSize,
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
      getClass() {
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        this.$http
          .get("api/Back_PreferentialManage/PreferentialValue", {
            params: {
              Token: getCookie("token"),
            }
          })
          .then(
            function (response) {
              loading.close();
              var status = response.data.Status;
              if (status === 1) {
                this.datalist = response.data.Result.datalist;
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
      handleCurrentChange(val) {
        this.pageIndex = val;
        this.getInfo();
      },
      handleAdd(index, row) {
        this.$router.push("/AddPreferential");
      },
      handleDelete(id, type) {
        this.$confirm('确认?', '提示', {
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
            .get("api/Back_PreferentialManage/PreferentialOrNot", {
              params: {
                Token: getCookie("token"),
                id: id,
                type: type
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
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      detail(id) {
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        this.$http
          .get("api/Back_PreferentialManage/PreferentialDetail", {
            params: {
              Token: getCookie("token"),
              id: id,
            }
          })
          .then(
            function (response) {
              loading.close();
              var status = response.data.Status;
              if (status === -1) {
                this.editForm = response.data.Result;
                this.dialogFormVisible1 = true
                for (let i = 0; i < this.datalist.length; i++) {
                  if (this.datalist[i].ID == this.editForm.classificationID) {
                    this.editForm.zhonglei = this.datalist[i].name
                  }
                }
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
