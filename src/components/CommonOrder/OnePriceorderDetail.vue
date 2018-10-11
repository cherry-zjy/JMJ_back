<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/OnePriceorderlist' }">一口价商品商品订单</el-breadcrumb-item>
      <el-breadcrumb-item>一口价商品订单详情</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form :model="editForm" label-width="120px" ref="editForm">
        <el-row>
          <el-col :span="12">
            <p class="title">订单信息</p>
            <el-form-item label="订单号">
              {{editForm.orderNo}}
            </el-form-item>
            <el-form-item label="用户名">
              {{editForm.userName}}
            </el-form-item>
            <el-form-item label="购买信息">
              {{editForm.BuyMessage}}
            </el-form-item>
            <el-form-item label="商品金额">
              {{editForm.prodPrice}}
            </el-form-item>
            <el-form-item label="红包">
              {{editForm.hongBao}}
            </el-form-item>
            <el-form-item label="实付金额">
              {{editForm.onlinePrice}}
            </el-form-item>
            <el-form-item label="支付方式">
              {{editForm.Paytype | Paytype}}
            </el-form-item>
            <el-form-item label="支付时间">
              {{editForm.payTime}}
            </el-form-item>
            <el-form-item label="身份验证">
              {{editForm.Identity}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <p class="title">收货信息</p>
            <el-form-item label="订单状态">
              {{editForm.orderType | orderType}}
            </el-form-item>
            <el-form-item label="收货人姓名">
              {{editForm.consigneeName}}
            </el-form-item>
            <el-form-item label="收货人电话">
              {{editForm.phone}}
            </el-form-item>
            <el-form-item label="收货人地址">
              {{editForm.Adress}}
            </el-form-item>
            <el-form-item label="物流单号">
              {{editForm.LogisticsNumber}}
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
        if (value == -1) {
          value = "余额支付方式"
        } else if (value == 1) {
          value = "微信内支付"
        } else if (value == 2) {
          value = "调用微信支付"
        } else if (value == 0) {
          value = "默认"
        }else if (value == 3) {
          value = "支付宝"
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
          .get("api/Back_OrderManage/ProductDetail", {
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
                this.editForm = response.data.Result
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
