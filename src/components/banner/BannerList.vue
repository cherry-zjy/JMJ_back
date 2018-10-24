<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item>Banner列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--检索条-->
    <el-col class="toolbar" style="padding: 15px 0;">
      <el-button size="mini" type="primary" @click="handleAdd()" style="float:right">新增</el-button>
    </el-col>

    <!-- table 内容 -->
    <el-table :data="list" style="width: 100%" :border='true'>
      <el-table-column label="Banner图片" prop="Image">
        <template slot-scope="scope">
          <img :src="mainurl+scope.row.Image" width="100" />
        </template>
      </el-table-column>
      <el-table-column label="适用范围" prop="Position" :formatter="Post">
      </el-table-column>
      <el-table-column label="是否跳转" prop="IsJump" :formatter="IsJump">
      </el-table-column>
      <el-table-column label="跳转链接" prop="Url">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" plain icon="el-icon-edit" @click="handleEdit(scope.row.ID)">编辑</el-button>
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
    methods: {
      IsJump(row, IsJump){
        var IsJump = row[IsJump.property];
        if (IsJump == true) {
          return IsJump = "是"
        } else{
          return IsJump = "否"
        }
        return IsJump
      },
      Post(row, Position) {
        var Position = row[Position.property];
        if (Position == 1) {
          return Position = "首页"
        } else if (Position == 2) {
          return Position = "首页超值热卖Banner"
        } else if (Position == 3) {
          return Position = "每日家居Banner"
        } else if (Position == 4) {
          return Position = "美妆洗护Banner"
        } else if (Position == 5) {
          return Position = "母婴健康Banner"
        } else if (Position == 6) {
          return Position = "珠宝饰品Banner"
        } else if (Position == 7) {
          return Position = "休闲零食Banner"
        } else if (Position == 8) {
          return Position = "海外馆Banner"
        } else if (Position == 9) {
          return Position = "一口价（两件99）"
        }else if (Position == 10) {
          return Position = "个人海报"
        }
        return Position
      },
      getInfo() {
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        this.$http
          .get("api/Back_PlatManage/BannerList", {
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
              .get("api/Back_SortManage/FirstLevelImage", {
                params: {
                  logo: this.editForm.Logo,
                  id: this.editForm.ID,
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
      editimg(index) {
        this.editForm = this.list[index]
        this.imageUrl = this.mainurl + this.list[index].Logo
        this.dialogFormVisible = true
      },
      handleCurrentChange(val) {
        this.pageIndex = val;
        this.getInfo();
      },
      handleAdd(index, row) {
        this.$router.push("/AddBanner");
      },
      handleEdit(id) {
        this.$router.push("/EditBanner/id=" + id);
      },
      handleDelete(id) {
        this.$confirm('确认删除该Bnner?', '提示', {
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
            .get("api/Back_PlatManage/BannerDelete", {
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
    font-size: 22px;
    padding: 15px;
    font-weight: bolder;
  }

  .el-input {
    width: 50%;
  }

</style>
