<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item>会员充值订单</el-breadcrumb-item>
    </el-breadcrumb>
    <!--检索条-->
    <el-col class="toolbar" style="padding-top: 15px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.sear" placeholder="关键字" prefix-icon="el-icon-search"></el-input>
        </el-form-item>

        <el-form-item>
          <el-col :span="11">
            <el-date-picker type="date" placeholder="开始日期" v-model="filters.startTime" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col class="line" :span="1">~</el-col>
          <el-col :span="11">
            <el-date-picker type="date" placeholder="结束时间" v-model="filters.endTime" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getInfo(true)">查询</el-button>
        </el-form-item>
        <el-tag>总购买人数：{{NOP}}</el-tag>
        <el-tag>总收入：{{TotalIncome}}</el-tag>
      </el-form>
    </el-col>
    <!-- table 内容 -->
    <el-table :data="List" style="width: 100%" :border='true'>

      <el-table-column label="订单号" prop="OrderCode">
      </el-table-column>
      <el-table-column label="用户名" prop="Name">
      </el-table-column>
      <el-table-column label="联系手机号" prop="Phone">
      </el-table-column>
      <el-table-column label="充值时间" prop="PayTime">
      </el-table-column>
      <el-table-column label="实付款" prop="Type">
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
          pageIndex: 1,
          pageSize: 12,
          Token: getCookie("token"),
          sear: '',
          startTime: '',
          endTime: '',
        },
        TotalIncome:'',
        NOP:''
      };
    },
    computed: {
      currentPage: function () {
        return this.filters.pageIndex
      }
    },
    methods: {
      /*
           1、获取列表 渲染列表
           2、搜索关键字
           3、分页
        */
      getInfo(searchange) {
        if (searchange) {
          this.filters.pageIndex = 1
        }
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        if (this.filters.sear == "") {
          delete this.filters.sear
        } else {
          this.filters.sear = this.filters.sear
        }
        if (this.filters.startTime == "") {
          delete this.filters.startTime
        } else {
          this.filters.startTime = this.filters.startTime
        }
        if (this.filters.endTime == "") {
          delete this.filters.endTime
        } else {
          this.filters.endTime = this.filters.endTime
        }
        this.$http
          .get("api/Back_FinanceManager/VipsRechargeOrderIndex", {
            params: this.filters
          })
          .then(
            function (response) {
              loading.close();
              var status = response.data.Status;
              if (status === 1) {
                this.List = response.data.Result.userRecList;
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
      getData() {
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        this.$http
          .get("api/Back_FinanceManager/RechargeData", {
            params: {
              Token:getCookie("token"),
              Type:2
            }
          })
          .then(
            function (response) {
              loading.close();
              var status = response.data.Status;
              if (status === 1) {
                this.NOP = response.data.Result.NOP;
                this.TotalIncome = response.data.Result.TotalIncome;
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
    },
    mounted() {
      this.mainurl = mainurl;
      this.getInfo();
      this.getData();
    }
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

</style>
