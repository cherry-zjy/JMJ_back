<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item>审查列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--检索条-->
    <el-col class="toolbar" style="padding: 15px 0;">
      <el-button size="mini" type="primary" @click="handleAdd()" style="float:right">新增</el-button>
    </el-col>

    <!-- table 内容 -->
    <el-table :data="list" style="width: 100%" :border='true'>
      <el-table-column label="商品名称" prop="prodName">
      </el-table-column>
      <el-table-column label="供应商账号" prop="business">
      </el-table-column>
      <el-table-column label="详情">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleEdit(scope.row.ID)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handle('1', scope.row,'同意')" v-if="scope.row.type == '2'" disabled>已拒绝</el-button>
          <el-button size="mini" type="primary" @click="handle('1', scope.row,'同意')" v-if="scope.row.type == '0'">同意</el-button>
          <el-button size="mini" type="success" @click="handle('2', scope.row,'拒绝')" v-if="scope.row.type == '1'" disabled>已同意</el-button>
          <el-button size="mini" type="primary" @click="handle('2', scope.row,'拒绝')" v-if="scope.row.type == '0'">拒绝</el-button>
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
  import qs from "qs";
  export default {
    data() {
      return {
        list: [],
        imageUrl: '',
        mainurl: '',
        pageIndex: 1,
        pageSize: 12,
        pageCount: 1,
      };
    },
    mounted() {
      this.mainurl = mainurl
      this.getInfo();
    },
    filters: {
      time: function (value) {
        return value.substring(0, 10)
      }
    },
    methods: {
      Type(row, Type) {
        var Type = row[Type.property];
        if (Type == 1) {
          Type = '余额'
        }else if(Type == 2){
          Type = '金币'
        }
        return Type
      },
      yiju(row, yiju) {
        var yiju = row[yiju.property];
        if (yiju == 1) {
          yiju = '兑换码'
        }else if(yiju == 2){
          yiju = '二维码'
        }
        return yiju
      },
      getInfo() {
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        this.$http
          .get("api/Back_Examine/ExamineList", {
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
      handleCurrentChange(val) {
        this.pageIndex = val;
        this.getInfo();
      },
      handleEdit(id) {
        this.$router.push("/EditOrdinaryProduct/id=" + id + "&page=" + this.pageIndex);
      },
      handle(state,row,msg){
        this.$confirm('确认' + msg + '?', '提示', {
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
            .get("api/Back_Examine/PlatAgreeOrNot", {
              params: {
                Token: getCookie("token"),
                prodid: row.ID,
                adminName:row.business,
                type: state,
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
            message: '已取消操作'
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
