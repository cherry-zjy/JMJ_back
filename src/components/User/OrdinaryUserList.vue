<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item>普通用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--检索条-->
    <el-col class="toolbar" style="padding-top: 15px;padding-bottom:20px">
      <el-input v-model="sear" placeholder="用户手机号" prefix-icon="el-icon-search" style="width:200px"></el-input>
      <el-button type="primary" @click="pageIndex = 1;getInfo()">查询</el-button>
    </el-col>

    <!-- table 内容 -->
    <el-table :data="list" style="width: 100%" :border='true'>
      <el-table-column label="用户头像" prop="logo">
        <template slot-scope="scope">
          <img :src="scope.row.Image" width="100" v-if="scope.row.Image!==null&&scope.row.Image.indexOf('http')>=0"/>
          <img :src="mainurl+scope.row.Image" width="100" v-else/>
        </template>
      </el-table-column>
      <el-table-column label="昵称" prop="NickName">
      </el-table-column>
      <el-table-column label="用户身份" prop="ConsumerLevel">
      </el-table-column>
      <el-table-column label="手机号" prop="Phone">
      </el-table-column>
      <el-table-column label="注册时间" prop="creaTime" :formatter="CreateTime">
      </el-table-column>
      <!-- <el-table-column label="考核信息" prop="Name">
      </el-table-column>
      <el-table-column label="已警告通知天数" prop="Name">
      </el-table-column> -->
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleMsg(scope.row.ID)">下线信息</el-button>
          <el-button size="mini" type="warning" @click="handleLook(scope.row.ID)">查看</el-button>
          <!-- <el-button size="mini" type="info" @click="handleNotice(scope.row.ID)">冻结</el-button> -->
          <el-button size="mini" type="success" @click="handleEdit(scope.row.ID)">通知</el-button>
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
      var checkLogo = (rule, value, callback) => {
        if (this.imageUrl == '') {
          callback(new Error("请上传图片"));
        } else {
          callback();
        }
      };
      return {
        list: [],
        mainurl: '',
        pageIndex: 1,
        pageSize: 8,
        pageCount: 1,
        sear: '',
        startTime: '',
        endTime: '',
      };
    },
    mounted() {
      this.mainurl = mainurl
      this.getInfo();
    },
    methods: {
      CreateTime(row, time) {
        var date = row[time.property];
        return date.replace("T", " ").split(".")[0];
      },
      getInfo() {
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        this.$http
          .get("api/Back_UserManage/OrdinaryUserList", {
            params: {
              phone: this.sear == '' ? '' - 1 : this.sear,
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
      handleMsg(id) {
        this.$router.push("/OrdinaryUserMsg/id=" + id);
      },
      handleLook(id) {
        this.$router.push("/OrdinaryUserLook/id=" + id);
      },
      handleNotice(id) {
        this.$confirm('确认冻结?', '提示', {
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
            .post("api/Back_UserManage/Blocking?token=" + getCookie("token") + "&id=" + id,
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
            message: '已取消冻结'
          });
        });
      },
      handleEdit(id) {
        this.$confirm('确认通知?', '提示', {
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
            .post("api/Back_UserManage/userMessage?token=" + getCookie("token") + "&id=" + id,
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
            message: '已取消通知'
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
