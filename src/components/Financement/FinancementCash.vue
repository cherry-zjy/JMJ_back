<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item>资金提现</el-breadcrumb-item>
    </el-breadcrumb>

    <el-col class="toolbar" style="padding: 15px 0;">
      <el-select v-model="classificationID" placeholder="类型">
        <el-option v-for="item in classificationList" :key="item.ID" :label="item.Name" :value="item.ID">
        </el-option>
      </el-select>
      <el-button type="primary" @click="pageIndex = 1;getInfo()">查询</el-button>
      <div style="float:right">
        <el-button type="primary" @click="method1('ta')">导出excel</el-button>
        <!-- <input id="file" type="file" /> -->
      </div>
    </el-col>

    <!-- table 内容 -->
    <el-table :data="list" style="width: 100%" :border='true' id="ta">
      <el-table-column label="提现用户" prop="userName">
      </el-table-column>
      <el-table-column label="提现金额" prop="Price">
      </el-table-column>
      <el-table-column label="提现方式" prop="Type" :formatter="Paytype">
      </el-table-column>
      <el-table-column label="提现时间" prop="CreateTime" :formatter="CreateTime">
      </el-table-column>
      <el-table-column label="账号" prop="AccountNumber">
      </el-table-column>
      <el-table-column label="户名" prop="AccountName">
      </el-table-column>
      <el-table-column label="状态" prop="Status" :formatter="Status">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.row.ID)" v-if="!scope.row.Status">发放</el-button>
          <el-button disabled="disabled" size="mini" type="primary" @click="handleEdit(scope.row.ID)" v-if="scope.row.Status">发放</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="block">
      <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next,jumper" :page-count="pageCount">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        list: [],
        pageIndex: 1,
        pageSize: 12,
        pageCount: 1,
        mainurl: '',
        classificationID: -1,
        classificationList: [{
          ID: -1,
          Name: '全部'
        }, {
          ID: 1,
          Name: '已发放'
        }, {
          ID: 2,
          Name: '未发放'
        }]
      };
    },
    mounted() {
      this.mainurl = mainurl
      this.getInfo();
    },
    methods: {
      Paytype(row, Type) {
        var Type = row[Type.property];
        if (Type == 1) {
          Type = "银行卡"
        } else if (Type == 2) {
          Type = "支付宝"
        } else if (Type == 3) {
          Type = "微信"
        }
        return Type
      },
      CreateTime(row, CreateTime) {
        var CreateTime = row[CreateTime.property];
        if (CreateTime) {
          return CreateTime.replace("T", " ").split(".")[0];
        }
      },
      Status(row, Status) {
        var Status = row[Status.property];
        if (Status) {
          Status = "已提现"
        } else {
          Status = "未提现"
        }
        return Status
      },
      getInfo() {
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        this.$http
          .get("api/Back_FinancementManage/FinancementCash", {
            params: {
              type: this.classificationID,
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
      method1(){
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        this.$http
          .get("api/Back_FinancementManage/CashToExcel", {
            params: {
              Token: getCookie("token"),
            }
          })
          .then(
            function (response) {
              loading.close();
              var status = response.data.Status;
              if (status === 1) {
                this.list = response.data.Result;
                this.pageCount = 1
                this.pageIndex = 1
                setTimeout(() => {
                  method1('ta')
                }, 1500);
                
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
      handleEdit(id) {
        this.$confirm('确认发放?', '提示', {
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
            .get("api/Back_FinancementManage/Extend", {
              params: {
                ID: id,
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
            message: '已取消删除'
          });
        });
      },
      handleCurrentChange(val) {
        this.pageIndex = val;
        this.getInfo();
      },
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
  #file{
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }

</style>
