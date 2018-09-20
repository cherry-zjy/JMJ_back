<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/BannerList' }">Banner列表</el-breadcrumb-item>
      <el-breadcrumb-item>修改Banner</el-breadcrumb-item>
    </el-breadcrumb>

    <el-main>
      <el-form :model="getList" ref="getList" label-width="150px" class="demo-ruleForm" :rules="rules" style="width:70%">
        <el-form-item label="Banner图片" prop="Image">
          <el-upload v-model="getList.Image" class="avatar-uploader" :action="action" :show-file-list="false"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar" style="width:300px;">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="是否跳转" prop="IsJump">
          <el-radio-group v-model="getList.IsJump">
            <el-radio label="true">是</el-radio>
            <el-radio label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="适用范围" prop="Position">
          <el-radio-group v-model="getList.Position">
            <el-radio label="1">首页</el-radio>
            <el-radio label="2">首页超值热卖Banner</el-radio>
            <el-radio label="3">每日家居Banner</el-radio>
            <el-radio label="4">美妆洗护Banner</el-radio>
            <div style="padding:20px">
              <el-radio label="5">母婴健康Banner</el-radio>
              <el-radio label="6">珠宝饰品Banner</el-radio>
              <el-radio label="7">休闲零食Banner</el-radio>
            </div>
            <el-radio label="8">海外馆Banner</el-radio>
            <el-radio label="9">一口价（两件99）</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="跳转地址" prop="Url">
          <el-input v-model="getList.Url"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('getList')">修改</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </div>
</template>
<script>
  import qs from "qs";
  export default {
    data() {
      var checkLogo = (rule, value, callback) => {
        if (this.imageUrl == '') {
          callback(new Error("请上传图片"));
        } else {
          callback();
        }
      };
      return {
        getList: [],
        dialogFormVisible: false,
        imageUrl: '',
        mainurl: '',
        action: '',
        rules: {
          Url: [{
            required: true,
            message: '请输入跳转地址',
            trigger: 'blur'
          }, ],
          Image: [{
            required: true,
            validator: checkLogo
          }],
          IsJump: [{
            required: true,
            message: '请选择是否跳转',
            trigger: 'change'
          }],
          Position: [{
            required: true,
            message: '请选择适用范围',
            trigger: 'change'
          }],
          Title: [{
            required: true,
            message: '请输入跳转地址',
            trigger: 'blur'
          }, ],
        },
        find: false
      };
    },
    mounted() {
      this.mainurl = mainurl
      this.action = this.mainurl + "/api/UploadPhotos/UpdateForImage";
      this.getInfo();
    },
    methods: {
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
        this.getList.Image = res.Result[0];
      },
      beforeAvatarUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error("上传头像图片大小不能超过 2MB!");
        }
        return isLt2M;
      },
      getInfo() {
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        this.$http
          .get("api/Back_PlatManage/BannerList", {
            params: {
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
                this.list = response.data.Result.datalist;
                for (let i = 0; i < response.data.Result.datalist.length; i++) {
                  if (window.location.href.split("id=")[1] == response.data.Result.datalist[i].ID) {
                    this.getList = response.data.Result.datalist[i]
                    console.log(this.getList)
                    this.getList.IsJump = ""+response.data.Result.datalist[i].IsJump+""
                    this.getList.Position = ""+response.data.Result.datalist[i].Position+""
                    this.imageUrl = this.mainurl + response.data.Result.datalist[i].Image
                    this.find = true;
                  }
                }
                if (!this.find) {
                  this.$message({
                    showClose: true,
                    type: "warning",
                    message: "错误页面"
                  });
                  setTimeout(() => {
                    this.$router.push({
                      path: "/BannerList"
                    });
                  }, 1500);
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
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const loading = this.$loading({
              lock: true,
              text: "Loading",
              spinner: "el-icon-loading",
              background: "rgba(0, 0, 0, 0.7)"
            });
            this.$http
              .get("api/Back_PlatManage/BannerEdit", {
                params: {
                  image: this.getList.Image,
                  jump: this.getList.IsJump,
                  position: this.getList.Position,
                  id: window.location.href.split("id=")[1],
                  Token: getCookie("token"),
                  Url:this.getList.Url,
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
                    setTimeout(() => {
                      this.$router.push({
                        path: "/BannerList"
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
      editimg(index) {
        this.editForm = this.list[index]
        this.imageUrl = this.mainurl + this.list[index].Logo
        this.dialogFormVisible = true
      },
      handleAdd(index, row) {
        this.$router.push("/AddMessage");
      },
      handleEdit(id) {
        this.$router.push("/EditMessage/id=" + id);
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

  .el-row {
    padding: 20px 0px;
  }

  .title {
    font-size: 22px;
    padding: 15px;
    font-weight: bolder;
  }

  .el-input {
    width: 50%;
  }

</style>
