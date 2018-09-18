<template>
  <div>
    <el-header>
      <el-breadcrumb separator="|" class="crumb">
        <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/GetUserIndex' }">用户列表</el-breadcrumb-item>
        <el-breadcrumb-item>用户详情</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <el-row>
      <el-col :span="12">
        <!-- <el-main style="width:70%;"> -->
        <el-form ref="editForm" label-width="150px" class="demo-editForm">
          <el-form-item label="昵称：" prop="Name">
            {{editForm.Name}}
          </el-form-item>
          <el-form-item label="头像：" prop="Image">
            <img :src="mainurl+editForm.Image" width="100" />
          </el-form-item>
          <el-form-item label="手机号：" prop="Phone">
            {{editForm.Phone}}
          </el-form-item>
          <el-form-item label="性别：" prop="Sex">
            {{editForm.Sex|sexfilter}}
          </el-form-item>
          <el-form-item label="位置：" prop="Region">
            {{editForm.Region}}
          </el-form-item>
          <el-form-item label="生日：" prop="BrithDay">
            {{editForm.BrithDay}}
          </el-form-item>
          <el-form-item label="个人简介：" prop="Introduce">
            {{editForm.Introduce}}
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12">
        <el-form ref="editForm" label-width="150px" class="demo-editForm">
        <el-form-item label="会员：" prop="IsVip">
            {{editForm.IsVip}}
          </el-form-item>
           <el-form-item label="会员到期时间：" prop="ExpiryTime">
            {{editForm.ExpiryTime}}
          </el-form-item>
           <el-form-item label="钱袋收入（元）：" prop="Balance">
            {{editForm.Balance}}
          </el-form-item>
           <el-form-item label="剩余匹配次数：" prop="Available">
            {{editForm.Available}}
          </el-form-item>
          <el-form-item label="粉丝数：" prop="FansQuantity">
            {{editForm.FansQuantity}}
          </el-form-item>
          <el-form-item label="关注数：" prop="FollowQuantity">
            {{editForm.FollowQuantity}}
          </el-form-item>
          <el-form-item label="是否认证：" prop="IsVerify">
            {{editForm.IsVerify}}
          </el-form-item>
        <el-form-item label="发布作品：" v-if="detail">
          <el-button type="primary" @click="prodetail()">详情</el-button>
        </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <center>
      <el-button type="primary" @click="back()">返回</el-button>
    </center>
    <!-- </el-main> -->
  </div>
</template>
<script>
  import qs from "qs"
  export default {
    data() {
      return {
        editForm: [],
        mainurl: '',
        detail:false
      }
    },
    mounted() {
      this.mainurl = mainurl;
      this.getInfo();
    },
    methods: {
      getPro(){
        this.$http
        .get("api/Back_ProductList/GetProductListIndex", {
          params: {
            Token: getCookie("token"),
            pageSize: 999,
            pageIndex: 1,
            sear: this.editForm.Name,
          }
        })
        .then(
          function (response) {
            var status = response.data.Status;
            if (status === 1) {
              if(response.data.Result.product.length > 0){
                this.detail = true;
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
            loading.close();
            this.$notify.error({
              title: "错误",
              message: "错误：请检查网络"
            });
          }.bind(this)
        );
      },
      getInfo(){
        const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.action = mainurl + "api/BackOperate/ParkExport";
      // 获取详情
      this.$http
        .get("api/Back_UserList/GetUserDetail", {
          params: {
            Token: getCookie("token"),
            userID: window.location.href.split("id=")[1]
          }
        })
        .then(
          function (response) {
            loading.close();
            var status = response.data.Status;
            if (status === 1) {
              this.editForm = response.data.Result;
              this.getPro();
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
      back() {
        this.$router.push("/GetUserIndex");
      },
      prodetail(){
        this.$router.push("/GetProductListIndex?name="+this.editForm.Name+"&id="+window.location.href.split("id=")[1])
      }
    },
    filters: {
      sexfilter: function (value) {
        if (value == '-1') {
          value = "未定义"
        } else if (value == '0') {
          value = "女"
        } else {
          value = "男"
        }
        return value
      }
    },
    
  };

</script>
<style scoped>
  .is-controls-right {
    float: right;
    margin-right: 50%;
  }

</style>
