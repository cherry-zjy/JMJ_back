<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item>提现明细</el-breadcrumb-item>
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
        <el-select v-model="filters.state" placeholder="是否支付">
          <el-option v-for="item in state" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-form-item>
          <el-button type="primary" @click="getInfo(true)">查询</el-button>
        </el-form-item>
        <el-tag><span class="cursur" @click="filters.state='2';getInfo(true)">未支付总费用：{{Unpaid}}</span></el-tag>
        <el-tag><span @click="filters.state='3';getInfo(true)" class="cursur">已支付总费用：{{Paid}}</span></el-tag>
      </el-form>
    </el-col>
    <!-- table 内容 -->
    <el-table :data="List" style="width: 100%" :border='true'>
      <el-table-column label="提现人姓名" prop="Name">
      </el-table-column>
      <el-table-column label="申请日期" prop="ApplyTime">
      </el-table-column>
      <el-table-column label="提现支付宝账号" prop="Account">
      </el-table-column>
      <el-table-column label="提现金额（元）" prop="Price" :render-header="foo">
      </el-table-column>
      <el-table-column label="提现状态" prop="State" :formatter="State">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="handle('1', scope.row,'同意')" v-if="scope.row.State == '2'" disabled>已同意</el-button>
          <el-button size="mini" type="primary" @click="handle('1', scope.row,'同意')" v-if="scope.row.State == '0'">同意</el-button>
          <el-button size="mini" type="danger" @click="handle('2', scope.row,'拒绝')" v-if="scope.row.State == '1'" disabled>已拒绝</el-button>
          <el-button size="mini" type="primary" @click="handle('2', scope.row,'拒绝')" v-if="scope.row.State == '0'">拒绝</el-button>
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
        Paid: '',
        Unpaid: '',
        // 搜索关键字
        filters: {
          pageIndex: 1,
          pageSize: 12,
          Token: getCookie("token"),
          // sear: '',
          // startTime: '',
          // endTime: '',
          state: "0",
          priceOrder:0
        },
        state: [{
          value: '0',
          label: '提现状态（全部）'
        }, {
          value: '1',
          label: '未审核'
        }, {
          value: '2',
          label: '已拒绝'
        }, {
          value: '3',
          label: '已支付'
        }],
      };
    },
    computed: {
      currentPage: function () {
        return this.filters.pageIndex
      }
    },
    methods: {
      State(row, State) {
        console.log(row)
        var State = row[State.property];
        switch (State) {
          case 0:
            return (State = "待同意");
            break;
          case 1:
            return (State = "拒绝");
            break;
          case 2:
            return (State = "同意");
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
        this.$http
          .get("api/Back_FinanceManager/GetWithdrawIndex", {
            params: this.filters
          })
          .then(
            function (response) {
              loading.close();
              var status = response.data.Status;
              if (status === 1) {
                this.List = response.data.Result.withdrawList;
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
      foo(h,{column}){
       console.log(column)
        return(
          <span>{column.label}
          <i class="icon el-icon-caret-top" onClick={ this.topsort } style="display:none"></i>
          <i class="icon el-icon-d-caret" onClick={ this.bottomsort }></i>
          </span>
        )
      },
      topsort(){
        $(".el-icon-d-caret").show();
        $(".el-icon-caret-top").hide();
        this.filters.priceOrder = 0;
        this.filters.pageIndex = 1
        this.getInfo()
      },
      bottomsort(){
        $(".el-icon-caret-top").show();
        $(".el-icon-d-caret").hide();
        this.filters.priceOrder = 1;
        this.filters.pageIndex = 1
        this.getInfo()
      },
      getData() {
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        this.$http
          .get("api/Back_FinanceManager/PaidData", {
            params: {
              Token: getCookie("token")
            }
          })
          .then(
            function (response) {
              loading.close();
              var status = response.data.Status;
              if (status === 1) {
                this.Paid = response.data.Result.Paid;
                this.Unpaid = response.data.Result.Unpaid;
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
      //审核
      handle(state, row, msg) {
        this.$confirm('确认' + msg + '?', '提示', {
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
            .get("api/Back_FinanceManager/HandleWithdrawals", {
              params: {
                Token: getCookie("token"),
                withID: row.ID,
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
  .cursur{
    cursor: pointer;
  }

</style>
