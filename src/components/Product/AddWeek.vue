<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/WeekList' }">每周免单列表</el-breadcrumb-item>
      <el-breadcrumb-item>新增每周免单</el-breadcrumb-item>
    </el-breadcrumb>

    <el-main>
      <div style="text-align: center">
        <el-date-picker v-model="time" value-format="yyyy-MM-dd" @change="getSTime" format="yyyy-MM-dd" type="daterange"
          start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
      </div>
      <div class="btn">
        <el-transfer filterable style="text-align: left; display: inline-block" v-model="value1" :data="data" :titles="['未添加的商品', '已添加的商品']"></el-transfer>
      </div>
      <div class="btn">
        <el-button type="primary" @click="submitForm()">确 定</el-button>
      </div>
    </el-main>
  </div>
</template>
<script>
  import qs from "qs";
  export default {
    data() {
      return {
        data: [],
        value1: [],
        list: [],
        time: ''
        // renderFunc(h, option) {
        //   return <span><img src={ option.Image }/>  { option.label }</span>;
        // }
      };
    },
    mounted() {
      this.mainurl = mainurl
      this.getInfo();
    },
    methods: {
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
              classificationID: -1,
              sear: -1,
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
                this.data = [];
                this.list = response.data.Result.datalist
                for (let i = 1; i <= this.list.length; i++) {
                  this.data.push({
                    key: this.list[i].ID,
                    label: this.list[i].prodName,
                    Image: mainurl + this.list[i].logo,
                  });
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
      getSTime(val) {
        console.log(val)
        this.time = val;
      },
      submitForm() {
        if (this.time == '') {
          this.$message({
            showClose: true,
            type: "warning",
            message: '请输入活动时间'
          });
          return;
        }
        if (this.value == '') {
          this.$message({
            showClose: true,
            type: "warning",
            message: '请选择商品'
          });
          return;
        }
        var startTime = this.time[0].substring(0, 10)
        var endTime = this.time[1].substring(0, 10)
        console.log(this.value1)
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        this.$http
          .post("api/Back_ProductManage/OnePriceAdd",
            qs.stringify({
              token: getCookie("token"),
              prodIDs: this.value1,
              Type: 3,
              StartTime: startTime,
              EndTime: endTime
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
                    path: "/DailyList"
                  });
                }, 1500);
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
  .btn {
    margin-top: 50px;
    text-align: center
  }

</style>
