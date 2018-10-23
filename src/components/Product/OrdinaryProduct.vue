<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item>普通商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--检索条-->
    <el-col class="toolbar" style="padding-top: 15px;">
      <el-input v-model="sear" placeholder="关键字" prefix-icon="el-icon-search" style="width:200px"></el-input>
      <el-select v-model="classificationID" placeholder="类型">
        <el-option v-for="item in classificationList" :key="item.ID" :label="item.Name" :value="item.ID">
        </el-option>
      </el-select>
      <el-button type="primary" @click="pageIndex = 1;getInfo()">查询</el-button>
      <el-form :inline="true" style="float:right">
        <el-form-item>
          <el-button type="primary" @click="handleAdd()">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!-- table 内容 -->
    <el-table :data="list" style="width: 100%" :border='true'>
      <el-table-column label="商品名称" prop="prodName">
      </el-table-column>
      <el-table-column label="缩略图" prop="logo">
        <template slot-scope="scope">
          <img :src="mainurl+scope.row.logo" width="100" />
        </template>
      </el-table-column>
      <el-table-column label="商品价格" prop="price">
      </el-table-column>
      <el-table-column label="商品佣金" prop="commission">
      </el-table-column>
      <el-table-column label="商品评价" prop="Name">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="comment(scope.row.ID)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.row.ID)">修改</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.ID)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block">
      <!-- <el-pagination :current-page.sync="currentPage" @current-change="handleCurrentChange" layout="prev, pager, next,jumper"
        :page-count="pageCount">
      </el-pagination> -->
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="pageIndex"
        layout="prev, pager, next, jumper" :page-count="pageCount">
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
        classificationList: [{
          ID: "-1",
          Name: "全部"
        }],
        classificationID: '-1',
        mainurl: '',
        pageIndex: 1,
        pageSize: 8,
        pageCount: 1,
        sear: '',
        // currentPage: 4
      };
    },
    mounted() {
      if (window.location.href.split("page=")[1]) {
        this.pageIndex = Number(window.location.href.split("page=")[1])
      }
      this.mainurl = mainurl
      this.getType();
      this.pageCount = 10;
    },
    methods: {
      getType() {
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        this.$http
          .get("api/Back_SortManage/FirstLevelList", {
            params: {
              pageIndex: 1,
              pageSize: 999,
              Token: getCookie("token"),
            }
          })
          .then(
            function (response) {
              loading.close();
              var status = response.data.Status;
              if (status === 1) {
                for (let i = 0; i < response.data.Result.dataList.length; i++) {
                  this.classificationList.push(response.data.Result.dataList[i])
                }
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
      },
      getInfo() {
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        this.$http
          .get("api/Back_ProductManage/OrdinaryProduct", {
            params: {
              classificationID: this.classificationID,
              sear: this.sear == '' ? '' - 1 : this.sear,
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
      handleAdd() {
        this.$router.push("/AddOrdinaryProduct");
      },
      comment(id) {
        this.$router.push("/OrdinaryComment/id=" + id);
      },
      handleDelete(id) {
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
            .post("api/Back_ProductManage/prodDelete?token=" + getCookie("token") + "&ID=" + id,
              // qs.stringify({
              //   token: getCookie("token"),
              //   ID: id,
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
                    tt.$router.push({
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
