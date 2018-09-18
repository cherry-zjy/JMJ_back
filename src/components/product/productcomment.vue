<template>
  <div>
    <el-header>
      <el-breadcrumb separator="|" class="crumb">
        <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '../../GetProductListIndex' }">作品列表</el-breadcrumb-item>
        <el-breadcrumb-item>评论列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    
    <!--检索条-->
    <el-col class="toolbar" style="padding-top: 15px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.sear" placeholder="关键字" prefix-icon="el-icon-search"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getInfo()">查询</el-button>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="primary" @click="back()">返回</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!-- table 内容 -->
    <el-table :data="List" style="width: 100%" :border='true'>
      <el-table-column label="评论人" prop="Name">
      </el-table-column>
      <el-table-column label="到期时间" prop="CreateTime">
      </el-table-column>
      <el-table-column label="评论内容" prop="Content">
      </el-table-column>
      
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="del(scope.row.ID)">删除</el-button>
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
        List: [],
        productparam: {
          pageIndex: 1,
          pageSize: 12,
          Token: getCookie("token"),
          prodID: window.location.href.split("id=")[1],
        },
        // 搜索关键字
        filters: {
          sear: ""
        },
        mainurl: "",
        labelPosition: 'left',
        pageCount: 1,
      };
    },
    mounted() {
      this.mainurl = mainurl;
      this.getInfo()
    },
    methods: {
      getInfo(){
        const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      // 获取详情
      if (this.filters.sear == "") {
          delete this.productparam.sear
        } else {
          this.productparam.sear = this.filters.sear
        }
      this.$http
        .get("api/Back_ProductList/GetProductEvalList", {
          params: this.productparam
        })
        .then(
          function (response) {
            loading.close();
            var status = response.data.Status;
            if (status === 1) {
              this.List = response.data.Result.prodEvalList;
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
            // this.$notify.error({
            //   title: "错误",
            //   message: "错误：请检查网络"
            // });
          }.bind(this)
        );
      },
      handleCurrentChange(val) {
        this.filters.pageIndex = val;
        this.getInfo();
      },
      timefilterHandler(row) {
        var ExpiryTime = row.ExpiryTime;
        ExpiryTime = ExpiryTime.substring(0, 10);
        return ExpiryTime
      },
      back() {
        this.$router.push("/GetProductListIndex");
      },
      //删除
      del(id) {
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
            .get("api/Back_ProductList/DelProductEval", {
              params: {
                Token: getCookie("token"),
                prodID: id,
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
  .is-controls-right {
    float: right;
    margin-right: 50%;
  }

  .title {
    font-size: 22px;
    padding: 15px;
    font-weight: bolder;
  }

  .el-form-item__label {
    text-align: left;
  }

  form {
    padding: 15px;
  }

  .imgpad {
    padding: 5px;
  }
  .block {
    text-align: center;
    padding: 20px 0;
  }

</style>
