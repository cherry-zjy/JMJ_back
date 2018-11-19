<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/Overflow' }">超值热卖列表</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/OverflowDetail/id='+id}">超值热卖详情</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    
    <el-main>
      <div class="btn">
        <Transfer :page-count="pageCount" :current-page="currentPage" @handleCurrentChange="handleCurrentChange1" @getInfo1="getInfo" filterable style="text-align: left; display: inline-block" v-model="value1" :data="data" :titles="['未添加的商品', '已添加的商品']"></Transfer>
      </div>
      <div class="btn">
        <el-button type="primary" @click="submitForm()">确 定</el-button>
      </div>
    </el-main>

  </div>
</template>
<script>
import Transfer from "../../../static/transfer/src/main";
  import qs from "qs";
  export default {
    data() {
      return {
        data: [],
        value1: [],
        list: [],
        id:'',
        sear:'',
        pageIndex:1,
        pageSize:15,
      };
    },
    mounted() {
      this.id = window.location.href.split("id=")[1]
      this.getInfo(-1)
      this.mainurl = mainurl
    },
    components: {
       Transfer
    },
    computed:{
      currentPage: function () {
        return this.pageIndex
      }
    },
    methods: {
      getInfo(query) {
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        this.sear = query
        if(query == ''){
          query = '-1'
        }
        this.$http
          .get("api/Back_ProductManage/OrdinaryProduct", {
            params: {
              classificationID: -1,
              sear: query,
              pageIndex: this.pageIndex,
              Type: -1,
              pageSize: this.pageSize,
              Token: getCookie("token"),
            }
          })
          .then(
            function (response) {
              loading.close();
              var status = response.data.Status;
              if (status === 1) {
                this.data = [];
                this.list = response.data.Result.datalist
                for (let i = 0; i < this.list.length; i++) {
                  this.data = [];
                this.list = response.data.Result.datalist
                this.pageCount = response.data.Result.page;
                for (let i = 0; i < this.list.length; i++) {
                  this.data.push({
                    key: this.list[i].ID,
                    label: this.list[i].prodName,
                    Image: mainurl + this.list[i].logo,
                  });
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
              // this.$notify.error({
              //   title: "错误",
              //   message: "错误：请检查网络"
              // });
            }.bind(this)
          );
      },
      handleCurrentChange1(val) {
        console.log(val)
        this.pageIndex = val;
        this.getInfo(this.sear);
      },
      submitForm() {
        if (this.value == '') {
          this.$message({
            showClose: true,
            type: "warning",
            message: '请选择商品'
          });
          return;
        }
        console.log(this.value1)
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        this.$http
          .post("api/Back_CurrentManage/OverflowProductAdd",
            qs.stringify({
              token: getCookie("token"),
              prodIDs: this.value1,
              BannerID:this.id,
              Type: 2,
            })
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
                setTimeout(() => {
                  this.$router.push({
                    path: "/OverflowDetail/id=" + window.location.href.split("id=")[1]
                  });
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
    font-size: 18px;
    padding: 0 0 10px 0;
    font-weight: bolder;
  }
  .btn {
    margin-top: 50px;
    text-align: center
  }

</style>
