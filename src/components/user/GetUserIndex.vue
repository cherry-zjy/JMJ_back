<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--检索条-->
    <el-col class="toolbar" style="padding-top: 15px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.sear" placeholder="关键字" prefix-icon="el-icon-search"></el-input>
        </el-form-item>
        <el-select v-model="filters.IsVip" placeholder="会员">
          <el-option v-for="item in IsVip" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="filters.IsVerify" placeholder="是否认证">
          <el-option v-for="item in IsVerify" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-form-item>
          <el-button type="primary" @click="getInfo(true)">查询</el-button>
        </el-form-item>
        <el-tag><span @click="filters.IsVip = '1';filters.IsVerify = '0';filters.pageIndex = 1;getInfo()" class="cursur">会员人数：{{BlackRealMoney.BlackCard}}</span></el-tag>
        <el-tag><span @click="filters.IsVerify = '2';filters.IsVip = '0';filters.pageIndex = 1;getInfo()" class="cursur">实名认证人数：{{BlackRealMoney.Attestation}}</span></el-tag>
        <el-tag><span>钱袋收入总金额：{{BlackRealMoney.MoneyBag}}</span></el-tag>
      </el-form>
    </el-col>
    <!-- table 内容 -->
    <el-table :data="List" style="width: 100%" :border='true'>

      <el-table-column label="用户名" prop="Name">
      </el-table-column>
      <el-table-column label="注册时间" prop="CreateTime" :render-header="time">
      </el-table-column>
      <el-table-column label="手机号" prop="Phone">
      </el-table-column>
      <el-table-column label="是否会员认证" prop="IsVip" width="120">
      </el-table-column>
      <el-table-column label="会员卡号" prop="CardNo">
      </el-table-column>
      <el-table-column label="剩余匹配次数" prop="Available" :render-header="pipei">
      </el-table-column>
      <el-table-column label="钱袋收入（元）" prop="Balance" :render-header="foo">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">详情</el-button>
          <el-button size="mini" type="success" @click="force(scope.row,0)" v-if="scope.row.IsVerify=='是'">实名</el-button>
          <el-button size="mini" type="danger" @click="force(scope.row,1)" v-if="scope.row.IsVerify=='否'">不实名</el-button>
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
        BlackRealMoney:[],
        // 搜索关键字
        filters: {
          sear: "",
          pageIndex: 1,
          pageSize: 12,
          Token: getCookie("token"),
          IsVip: '0',
          IsVerify: '0',
          Order:1,
          RegisterOrder:0,
          MatchOrder:0
        },
        IsVip: [{
          value: '0',
          label: '全部用户'
        }, {
          value: '1',
          label: '会员（是）'
        }, {
          value: '2',
          label: '会员（否）'
        }, {
          value: '3',
          label: '实名认证（是）'
        }, {
          value: '4',
          label: '实名认证（否）'
        }],
        IsVerify: [{
          value: '0',
          label: '是否认证（全部）'
        }, {
          value: '1',
          label: '认证未通过'
        }, {
          value: '2',
          label: '认证通过'
        }],
      };
    },
    computed: {
      currentPage: function () {
        return this.filters.pageIndex
      }
    },
    methods: {
     foo(h,{column}){
        return(
          <span>{column.label}
          <i class="icon el-icon-caret-top" id="footop" onClick={ this.topsort }></i>
          <i class="icon el-icon-caret-bottom" id="foobot" onClick={ this.bottomsort } style="display:none"></i>
          </span>
        )
      },
      time(h,{column}){
        return(
          <span>{column.label}
          <i class="icon el-icon-d-caret" id="timetop" onClick={ this.toptime }></i>
          <i class="icon el-icon-caret-bottom" id="timebot" onClick={ this.bottomtime } style="display:none"></i>
          </span>
        )
      },
      pipei(h,{column}){
        return(
          <span>{column.label}
          <i class="icon el-icon-d-caret" id="pptop" onClick={ this.pptop }></i>
          <i class="icon el-icon-caret-bottom" id="ppbot" onClick={ this.ppbot } style="display:none"></i>
          </span>
        )
      },
      topsort(){
        $("#foobot").show();
        $("#footop").hide();
        $("#timetop").show();
        $("#timebot").hide();
        $("#pptop").show();
        $("#ppbot").hide();
        this.filters.Order = 0;
        this.filters.MatchOrder = 0;
        this.filters.pageIndex = 1;
        this.filters.RegisterOrder = 0;
        this.getInfo()
      },
      bottomtime(){
        $("#timetop").show();
        $("#timebot").hide();
        $("#foobot").hide();
        $("#footop").show();
        $("#pptop").show();
        $("#ppbot").hide();
        this.filters.Order = 0;
        this.filters.RegisterOrder = 0;
        this.filters.MatchOrder = 0;
        this.filters.pageIndex = 1
        this.getInfo()
      },
      toptime(){
        $("#timebot").show();
        $("#timetop").hide();
        $("#foobot").hide();
        $("#footop").show();
        $("#pptop").show();
        $("#ppbot").hide();
        this.filters.RegisterOrder = 1;
        this.filters.Order = 0;
        this.filters.pageIndex = 1;
        this.filters.MatchOrder = 0;
        this.getInfo()
      },
      bottomsort(){
        $("#footop").show();
        $("#foobot").hide();
        $("#timetop").show();
        $("#timebot").hide();
        $("#pptop").show();
        $("#ppbot").hide();
        this.filters.Order = 1;
        this.filters.RegisterOrder = 0;
        this.filters.pageIndex = 1;
        this.filters.MatchOrder = 0;
        this.getInfo()
      },
      pptop(){
        $("#pptop").show();
        $("#ppbot").hide();
        $("#foobot").hide();
        $("#footop").show();
        $("#pptop").show();
        $("#ppbot").hide();
        this.filters.RegisterOrder = 0;
        this.filters.pageIndex = 1;
        this.filters.MatchOrder = 0;
        this.filters.Order = 0;
        this.getInfo()
      },
      ppbot(){
        $("#pptop").hide();
        $("#ppbot").show();
        $("#foobot").hide();
        $("#footop").show();
        $("#pptop").show();
        $("#ppbot").hide();
        this.filters.RegisterOrder = 1;
        this.filters.Order = 0;
        this.filters.MatchOrder = 1;
        this.filters.pageIndex = 1
        this.getInfo()
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
          .get("api/Back_UserList/GetUserIndex", {
            params: this.filters
          })
          .then(
            function (response) {
              loading.close();
              var status = response.data.Status;
              if (status === 1) {
                this.List = response.data.Result.coustomer;
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
      force(row,status){
        var obj = Object.assign({}, row);
        var urlId = obj.ID;
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        this.$http
          .get("api/Back_UserList/ForceAuthentication", {
            params: {
              userID:urlId,
              State:status,
              Token:getCookie("token"),
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
      },
      getData(){
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        this.$http
          .get("api/Back_UserList/BlackRealMoney", {
            params: {}
          })
          .then(
            function (response) {
              loading.close();
              var status = response.data.Status;
              if (status === -1) {
                this.BlackRealMoney = response.data.Result;
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
      //详情
      handleEdit(index, row) {
        console.log(Object.assign({}, row));
        var obj = Object.assign({}, row);
        var urlId = obj.ID;
        this.$router.push("/user/GetUserIndexDetail/id=" + urlId);
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
