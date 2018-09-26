<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/Overflow' }">超值热卖列表</el-breadcrumb-item>
      <el-breadcrumb-item>超值热卖详情</el-breadcrumb-item>
    </el-breadcrumb>

    <div style="margin:50px 0">
      <p class="title">图片：</p>
      <el-form :model="list" ref="getList" label-width="150px" class="demo-ruleForm" style="width:70%;">
        <el-upload v-model="list.Image" class="avatar-uploader" :action="action" :show-file-list="false" :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar" style="width:300px;">
          <img v-else src="../../../static/images/shangchuantupian.png" style="width:500px" />
        </el-upload>
      </el-form>
    </div>

    <!-- table 内容 -->
    <p class="title">包含商品：
      <el-button size="mini" type="primary" @click="handleAdd()" style="float:right">添加商品</el-button>
    </p>
    <el-table :data="list" style="width: 100%" :border='true'>
      <el-table-column label="图片" prop="Image">
        <template slot-scope="scope">
          <img :src="mainurl+scope.row.Image" width="100" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" plain @click="handleEdit(scope.row.ID)">详情</el-button>
          <el-button size="mini" type="danger" plain icon="el-icon-delete" @click="handleDelete(scope.row.ID)">删除</el-button>
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
        editForm: [],
        pageIndex: 1,
        pageSize: 12,
        pageCount: 1,
        imageUrl: '',
        mainurl: '',
        action: '',
      };
    },
    mounted() {
      this.mainurl = mainurl
      this.action = this.mainurl + "/api/UploadPhotos/UpdateForImage";
      this.getInfo();
    },
    methods: {
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        this.$http
          .get("api/Back_CurrentManage/OverflowEdit", {
            params: {
              Image: res.Result[0],
              Token: getCookie("token"),
              id: window.location.href.split("id=")[1],
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
              console.log(error)
              this.$notify.error({
                title: "错误",
                message: "错误：请检查网络"
              });
            }.bind(this)
          );
      },
      beforeAvatarUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error("上传头像图片大小不能超过 2MB!");
        }
        return isLt2M;
      },
      getInfo() {
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        this.$http
          .get("api/Back_CurrentManage/OverflowDetailList", {
            params: {
              id: window.location.href.split("id=")[1],
              Token: getCookie("token"),
              pageIndex: this.pageIndex,
              pageSize: this.pageSize,
            }
          })
          .then(
            function (response) {
              loading.close();
              var status = response.data.Status;
              if (status === 1) {
                if (response.data.Result.Image == '') {
                  this.imageUrl = ''
                } else {
                  this.imageUrl = mainurl + response.data.Result.Image;
                }
                this.list = response.data.Result.dataList;
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
              console.log(error)
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
      handleAdd() {
        this.$router.push("/AddOverflowDetail/id=" + window.location.href.split("id=")[1]);
      },
      handleEdit() {
        this.$router.push("/EditOrdinaryProduct/id=" + window.location.href.split("id=")[1]);
      },
      handleDelete(id) {
        this.$confirm('确认删除该商品?', '提示', {
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
            .get("api/Back_CurrentManage/OverflowProductDelete", {
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
    font-size: 18px;
    padding: 0 0 10px 0;
    font-weight: bolder;
  }

</style>
