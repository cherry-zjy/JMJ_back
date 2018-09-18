<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item>认证审核列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--检索条-->
    <el-col class="toolbar" style="padding-top: 15px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.sear" placeholder="关键字" prefix-icon="el-icon-search"></el-input>
        </el-form-item>
        <el-select v-model="filters.type" placeholder="是否审核通过">
          <el-option v-for="item in type" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
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
        <el-tag><span class="cursur" @click="filters.pageIndex = 1;filters.type = '0';getInfo()">总认证申请人数：{{Datalist.Sum}}</span></el-tag>
        <el-tag><span @click="filters.pageIndex = 1;filters.type = '1';getInfo()" class="cursur">通过人数：{{Datalist.Through}}</span></el-tag>
        <el-tag><span class="cursur" @click="filters.pageIndex = 1;filters.type = '2';getInfo()">拒绝人数：{{Datalist.NotThrough}}</span></el-tag>
        <el-tag><span>未审核人数：{{Datalist.Unaudited}}</span></el-tag>
      </el-form>
    </el-col>
    <!-- table 内容 -->
    <el-table :data="List" style="width: 100%" :border='true'>

      <el-table-column label="审核人昵称" prop="NicName">
      </el-table-column>
      <el-table-column label="手机号" prop="Phone">
      </el-table-column>
      <el-table-column label="真实姓名" prop="Name">
      </el-table-column>
      <el-table-column label="申请时间" prop="IdentityTime">
      </el-table-column>
      <el-table-column label="证件号" prop="IdentityCode">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="info" @click="examine(0,scope.row.ID,'确认通过该审核？')" v-if="scope.row.Status == '审核中'">通过</el-button>
          <el-button size="mini" type="success" @click="examine(0,scope.row.ID,'确认通过该审核？')" disabled v-if="scope.row.Status == '已通过'">已通过</el-button>
          <el-button size="mini" type="info" @click="examine(1,scope.row.ID,'确认拒绝该审核？')" v-if="scope.row.Status == '审核中'">拒绝</el-button>
          <el-button size="mini" type="danger" @click="examine(1,scope.row.ID,'确认拒绝该审核？')" disabled v-if="scope.row.Status == '已拒绝'">已拒绝</el-button>
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
  export default {
    data() {
      return {
        List: [], //列表
        pageCount: 1,
        mainurl: "",
        Datalist:[],
        filters: {
          pageIndex: 1,
          pageSize: 12,
          Token: getCookie("token"),
          type:'0'
        },
        type: [{
          value: '0',
          label: '是否审核通过（全部）'
        }, {
          value: '2',
          label: '审核未通过'
        }, {
          value: '1',
          label: '审核通过'
        }],
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
        // if (this.filters.startTime == "") {
        //   delete this.filters.startTime
        // } else {
        //   this.filters.startTime = this.filters.startTime
        // }
        // if (this.filters.endTime == "") {
        //   delete this.filters.endTime
        // } else {
        //   this.filters.endTime = this.filters.endTime
        // }
        this.$http
          .get("api/Back_ExamineManager/UserExamineIndex", {
            params: this.filters
          })
          .then(
            function (response) {
              loading.close();
              var status = response.data.Status;
              if (status === 1) {
                this.List = response.data.Result.userList;
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
          .get("api/Back_ExamineManager/DataStatistics", {
            params: {
              type:2,
              Token:getCookie("token")
            }
          })
          .then(
            function (response) {
              loading.close();
              var status = response.data.Status;
              if (status === 1) {
                this.Datalist = response.data.Result;
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
      //审核
      examine(state,id,msg) {
        this.$confirm(''+msg+'', '提示', {
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
          .get("api/Back_ExamineManager/ExamineUser", {
            params: {
              Token: getCookie("token"),
              userID: id,
              state: state,
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
                this.getInfo();
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
            message: '已取消操作'
          });          
        });
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
  .cursur{
    cursor: pointer;
  }

</style>
