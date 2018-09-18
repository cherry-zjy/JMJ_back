<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item>帮助与反馈</el-breadcrumb-item>
    </el-breadcrumb>

    <!--检索条-->
    <el-col class="toolbar" style="padding-top: 15px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.sear" placeholder="关键字" prefix-icon="el-icon-search"></el-input>
        </el-form-item>
        <el-button type="primary" @click="getInfo(true)">查询</el-button>
      </el-form>
    </el-col>

    <!-- table 内容 -->
    <el-table :data="List" style="width: 100%" :border='true'>
      <el-table-column label="反馈内容" prop="Content">
      </el-table-column>
      <el-table-column label="反馈时间" prop="CreateTime">
      </el-table-column>
      <el-table-column label="反馈人昵称" prop="NicName">
      </el-table-column>
      <el-table-column label="反馈人手机号" prop="Phone">
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="del(scope.row.ID)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="block">
      <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next,jumper" :page-count="pageCount" :current-page="currentPage">
      </el-pagination>
    </div>

  </div>
</template>
<script>
  import qs from "qs"
  export default {
    data() {
      return {
        List: [], //列表
        pageCount: 1,
        // currentPage:1,//当前页
        mainurl: "",
        getList: [],
        rules: {
          Content: [{
            required: true,
            message: "请输入内容",
            trigger: "blur"
          }],
        },
        filters: {
          pageIndex: 1,
          pageSize: 12,
          Token: getCookie("token"),
          sear:''
        },
      };
    },
    computed: {
      currentPage: function () {
        return this.filters.pageIndex
      }
    },
    mounted() {
      this.mainurl = mainurl;
      this.getInfo();
    },
    methods: {
      getInfo(searchange) {
        // searchange判断是否是搜索关键字，是的话当前页为1
        if (searchange) {
          this.filters.pageIndex = 1
        }
        if (this.filters.sear == "") {
          delete this.filters.sear
        } else {
          this.filters.sear = this.filters.sear
        }
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        this.$http
          .get("api/Back_PlatformManager/GetFeedbackList", {
            params: this.filters
          })
          .then(
            function (response) {
              loading.close();
              var status = response.data.Status;
              if (status === 1) {
                this.List = response.data.Result.feedbackList;
                this.pageCount = response.data.Result.Page;
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
      
      // 分页
      handleCurrentChange(val) {
        this.filters.pageIndex = val;
        this.getInfo();
      },
      //删除
      del(id) {
        this.$confirm('确认删除该反馈?', '提示', {
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
            .get("api/Back_PlatformManager/DelFeedback", {
              params: {
                Token: getCookie("token"),
                feedbackID: id,
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

  .avatar-uploader .el-upload {
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .el-upload--text {
    width: 100%;
  }

  .avatar-uploader-icon {
    font-size: 32px;
    color: #8c939d;
    width: 317px;
    height: 178px;
    line-height: 178px;
    text-align: center;
    border: 1px dashed #8c939d;
  }

  .avatar {
    width: 100%;
  }

  #editor {
    height: 400px;
  }

</style>
