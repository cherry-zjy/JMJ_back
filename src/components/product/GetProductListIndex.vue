<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: 'GetUserIndex' }" v-if='isjump'>用户列表</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: 'user/GetUserIndexDetail/id='+reverseduserid+''}" v-if='isjump'>用户详情</el-breadcrumb-item>
      <el-breadcrumb-item>用户作品管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!--检索条-->
    <el-col class="toolbar" style="padding-top: 15px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.keyword" placeholder="关键字" prefix-icon="el-icon-search"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getInfo(true)">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!-- table 内容 -->
    <el-table :data="List" style="width: 100%" :border='true'>

      <el-table-column label="作品名" prop="Area">
      </el-table-column>
      <el-table-column label="作品大图" prop="Image">
        <template slot-scope="scope">
          <img :src="mainurl+scope.row.Image" width="200" />
        </template>
      </el-table-column>
      <el-table-column label="发布人" prop="NickName" width="120">
      </el-table-column>
      <el-table-column label="主色调" prop="MainColor" width="120">
        <template slot-scope="scope">
          <div class="circle" v-bind:style="{ background: scope.row.MainColor}"></div>
        </template>
      </el-table-column>
      <el-table-column label="辅色调" prop="SubColor" width="120">
        <template slot-scope="scope">
          <div class="circle" v-bind:style="{ background: scope.row.SubColor}"></div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">作品详情</el-button>
          <el-button size="mini" type="primary" @click="handleComment(scope.$index, scope.row)">评论列表</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
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
  import md5 from "js-md5";

  export default {
    data() {
      return {
        List: [], //列表
        pageCount: 1,
        mainurl: "",
        // 搜索关键字
        filters: {
          keyword: ""
        },
        productparam: {
          pageIndex: 1,
          pageSize: 4,
          Token: getCookie("token"),
        },
        isjump:false,
        userid :""
      };
    },
    computed: {
      name: function () {
        return this.filters.keyword = decodeURIComponent(window.location.href.split("name=")[1].split("&")[0])
      },
      reverseduserid: function () {
        return this.userid = window.location.href.split("id=")[1]
      },
      currentPage: function () {
        return this.productparam.pageIndex
      }
    },
    mounted() {
      this.mainurl = mainurl;
      if (window.location.href.split("name=")[1] !== undefined && window.location.href.split("name=")[1] !== "") {
        this.name;
        this.isjump = true;
      }
      console.log(this.$router)
      this.getInfo();
    },
    methods: {
      /*
           1、获取列表 渲染列表
           2、搜索关键字
           3、分页
        */
      getInfo(searchange) {
        if (searchange) {
          this.productparam.pageIndex = 1
        }
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        if (this.filters.keyword == "") {
          delete this.productparam.sear
        } else {
          this.productparam.sear = this.filters.keyword
        }
        this.$http
          .get("api/Back_ProductList/GetProductListIndex", {
            params: this.productparam
          })
          .then(
            function (response) {
              loading.close();
              var status = response.data.Status;
              if (status === 1) {
                this.List = response.data.Result.product;
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
      //删除
      handleDelete(row) {
        this.$confirm('确认删除该作品?', '提示', {
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
            .get("api/Back_ProductList/DelProduct", {
              params: {
                Token: getCookie("token"),
                prodID: row.ID,
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
      // 分页
      handleCurrentChange(val) {
        this.productparam.pageIndex = val;
        this.getInfo();
      },
      //作品详情
      handleEdit(index, row) {
        console.log(Object.assign({}, row));
        var obj = Object.assign({}, row);
        var urlId = obj.ID;
        this.$router.push("/product/productDetail/id="+urlId+"&userid="+this.reverseduserid+"");
      },
      handleComment(index, row){
        var obj = Object.assign({}, row);
        var urlId = obj.ID;
        this.$router.push("/product/productcomment/id="+urlId);
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
  .circle{
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }

</style>
