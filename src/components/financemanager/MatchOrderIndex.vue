<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item>匹配订单</el-breadcrumb-item>
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
      </el-form>
    </el-col>
    <!-- table 内容 -->
    <el-table :data="List" style="width: 100%" :border='true'>
      <el-table-column label="订单号" prop="OrderNo">
      </el-table-column>
      <el-table-column label="匹配时间" prop="MatchTime">
      </el-table-column>
      <el-table-column label="用户名" prop="NicName">
      </el-table-column>
      <el-table-column label="联系手机号" prop="Phone">
      </el-table-column>
      <el-table-column label="匹配作品名" prop="ProductName">
        <template slot-scope="scope">
          <img :src="mainurl+scope.row.ProductName" style="max-width:100%">
        </template>
      </el-table-column>
      <el-table-column label="性别" prop="Sex" :formatter="Sex">
      </el-table-column>
      <el-table-column label="姓名" prop="Name">
      </el-table-column>
      <el-table-column label="年" prop="Year" width="80">
      </el-table-column>
      <el-table-column label="月" prop="Month" width="80">
      </el-table-column>
      <el-table-column label="日" prop="Day" width="80">
      </el-table-column>
      <el-table-column label="时" prop="Hour" width="80">
      </el-table-column>
      <el-table-column label="匹配区分" prop="MatchType" width="80">
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="block">
      <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next,jumper" :page-count="pageCount"
        :current-page="currentPage">
      </el-pagination>
    </div>
  </div>
</template>
<script>
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
      };
    },
    computed: {
      currentPage: function () {
        return this.filters.pageIndex
      }
    },
    methods: {
      Sex(row, Sex) {
        console.log(row)
        var Sex = row[Sex.property];
        switch (Sex) {
          case 0:
            return (Sex = "女");
            break;
          case 1:
            return (Sex = "男");
            break;
        }
      },
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
          .get("api/Back_FinanceManager/MatchOrderIndex", {
            params: this.filters
          })
          .then(
            function (response) {
              loading.close();
              var status = response.data.Status;
              if (status === 1) {
                this.List = response.data.Result.prodMatchList;
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
      //
      getUsers() {
        this.getInfo();
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
