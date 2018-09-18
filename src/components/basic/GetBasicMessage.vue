<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item>基本信息</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="msgbox">
      <p>注册用户数量：{{List.userList}}</p>
      <br/>
      <p>会员用户数量：{{List.vipLis}}</p>
      <br/>
      <p>活跃用户数量：{{List.ActiveUser}}</p>
      
    </div>
  </div>


</template>
<script>
  export default {
    data() {
      return {
        List: "", //列表
      };
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
          .get("api/Back_BasicMessage/GetBasicMessage", {
            params: {
              Token: getCookie("token"),
            }
          })
          .then(
            function (response) {
              loading.close();
              var status = response.data.Status;
              if (status === 1) {
                this.List = response.data.Result;
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
      }
    },
    mounted() {
      this.getInfo();
    }
  };

</script>
<style scoped>
  .msgbox {
    padding: 80px 0 0 20px;
    font-size: 22px;
  }

  /* 面包屑 */

  .crumb {
    height: 36px;
    line-height: 36px;
  }

</style>
