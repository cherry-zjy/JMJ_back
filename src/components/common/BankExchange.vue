<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/BankList' }">银行列表</el-breadcrumb-item>
      <el-breadcrumb-item>银行兑换步骤</el-breadcrumb-item>
    </el-breadcrumb>

    <el-form :model="list" ref="list" label-width="150px" class="demo-ruleForm" :rules="rules" style="width:70%">
      <el-form-item label="消息内容" prop="defaultMsg">
        <UEditor :defaultMsg='defaultMsg' :config='config' ref="ueditor"></UEditor>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitFormwork('list')">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import qs from "qs";
  import UEditor from "../UEditor";
  export default {
    data() {
      var checkdefaultMsg = (rule, value, callback) => {
        if (encodeURIComponent(this.$refs.ueditor.getUEContent()) == '') {
          callback(new Error("请输入内容"));
        } else {
          callback();
        }
      };
      return {
        config: {
          initialFrameWidth: null,
          initialFrameHeight: 500
        },
        list: [],
        defaultMsg: '',
        rules: {
          defaultMsg: [{
            required: true,
            validator: checkdefaultMsg
          }],
        },
      };
    },
    components: {
      UEditor
    },
    mounted() {
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
          .post("api/Back_CurrentManage/ExchangePath?token=" + getCookie("token") + "&id=" + window.location.href.split(
              "id=")[1],
            // qs.stringify({
            //   token: getCookie("token"),
            //   id:window.location.href.split("id=")[1],
            // })
          )
          .then(
            function (response) {
              loading.close();
              var status = response.data.Status;
              if (status === 1) {
                this.list.defaultMsg = response.data.Result.ExchangeDetail
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
              this.$notify.error({
                title: "错误",
                message: "错误：请检查网络"
              });
            }.bind(this)
          );
      },
      submitFormwork(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var content = this.$refs.ueditor.getUEContent()
            const loading = this.$loading({
              lock: true,
              text: "Loading",
              spinner: "el-icon-loading",
              background: "rgba(0, 0, 0, 0.7)"
            });
            this.$http
              .post("api/Back_CurrentManage/ExchangePathEdit",
                qs.stringify({
                  token: getCookie("token"),
                  id: window.location.href.split("id=")[1],
                  detail: encodeURIComponent(content),
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
                        path: "/BankList"
                      });
                    }, 1500);
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
                  this.$notify.error({
                    title: "错误",
                    message: "错误：请检查网络"
                  });
                }.bind(this)
              );
          } else {
            console.log('error submit!!');
            return false;
          }
        });
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

</style>
