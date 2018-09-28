<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/CobberList' }">城市合伙人列表</el-breadcrumb-item>
      <el-breadcrumb-item>城市合伙人详情</el-breadcrumb-item>
    </el-breadcrumb>

    <el-form :model="editForm" label-width="120px" ref="editForm">
        <el-row>
          <el-col :span="12">
            <p class="title">用户信息</p>
            <el-form-item label="用户昵称">
              {{editForm.nickName}}
            </el-form-item>
            <el-form-item label="用户头像">
              <img :src="mainurl+editForm.Image" style="width:100px;height:100px;border-radius: 50%;"/>
            </el-form-item>
            <el-form-item label="所在地区">
              {{editForm.Adress}}
            </el-form-item>
            <el-form-item label="用户手机号">
              {{editForm.phone}}
            </el-form-item>
            <el-form-item label="用户微信账号">
              {{editForm.weixinAccount}}
            </el-form-item>
            <el-form-item label="账户余额">
              {{editForm.balance}}
            </el-form-item>
            <el-form-item label="我的佣金">
              {{editForm.FinishedCommission}}
            </el-form-item>
            <!-- <el-form-item label="权益商品">
              {{editForm.zhifubao}}
            </el-form-item> -->
            <el-form-item label="所获佣金">
              {{editForm.NotSettledCommission}}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        list: [],
        mainurl: '',
        type: -1,
        editForm: {
          OrderNumber: ''
        },
      };
    },
    filters: {
      orderType: function (value) {
        if (value == 0) {
          value = "未支付"
        } else if (value == 1) {
          value = "待发货"
        } else if (value == 2) {
          value = "待收货"
        } else if (value == 3) {
          value = "待评价"
        } else if (value == 4) {
          value = "已评价"
        } else if (value == 9) {
          value = "已取消"
        }
        return value
      },
      Paytype: function (value) {
        if (value == 0) {
          value = "支付宝"
        } else if (value == 1) {
          value = "微信"
        } else if (value == 2) {
          value = "余额"
        }
        return value
      }
    },
    mounted() {
      this.mainurl = mainurl
      this.getInfo();
    },
    methods: {
      Type(row, type) {
        var type = row[type.property];
        if (type == 0) {
          type = "未支付"
        } else if (type == 1) {
          type = "待发货"
        } else if (type == 2) {
          type = "待收货"
        } else if (type == 3) {
          type = "待评价"
        } else if (type == 4) {
          type = "已评价"
        } else if (type == 9) {
          type = "已取消"
        }
        return type
      },
      getInfo() {
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        this.$http
          .get("api/Back_UserManage/CobberDetail", {
            params: {
              id: window.location.href.split("id=")[1],
              Token: getCookie("token"),
            }
          })
          .then(
            function (response) {
              loading.close();
              var status = response.data.Status;
              if (status === 1) {
                this.editForm = response.data.Result;
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
    font-size: 22px;
    padding-bottom: 15px;
    font-weight: bolder;
  }

  .el-input {
    width: 50%;
  }

  .el-dialog {
    width: 80%;
  }

  .el-form-item {
    margin-bottom: 0;
  }

</style>
