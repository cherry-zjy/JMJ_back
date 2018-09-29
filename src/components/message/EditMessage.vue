<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/MessageList' }">消息列表</el-breadcrumb-item>
      <el-breadcrumb-item>修改消息</el-breadcrumb-item>
    </el-breadcrumb>

    <el-main>
      <el-form :model="getList" ref="getList" label-width="150px" class="demo-ruleForm" :rules="rules" style="width:70%">
        <el-form-item label="消息标题" prop="Title">
          <el-input v-model="getList.Title"></el-input>
        </el-form-item>
        <el-form-item label="消息图片" prop="Image">
          <el-upload v-model="getList.Image" class="avatar-uploader" :action="action" :show-file-list="false"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar" style="width:300px;">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="消息内容" prop="Content">
           <el-input v-model="getList.Content" type="textarea" rows="8"></el-input>
          <!-- <UEditor :defaultMsg='defaultMsg' :config='config' ref="ueditor"></UEditor> -->
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('getList')">修改</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </div>
</template>
<script>
  import UEditor from "../UEditor";
  import qs from "qs";
  export default {
    data() {
      // var checkdefaultMsg = (rule, value, callback) => {
      //   if (encodeURIComponent(this.$refs.ueditor.getUEContent()) == '') {
      //     callback(new Error("请输入内容"));
      //   } else {
      //     callback();
      //   }
      // };
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
        pageIndex: 1,
        pageSize: 12,
        pageCount: 1,
        config: {
          initialFrameWidth: null,
          initialFrameHeight: 500
        },
        // defaultMsg: "这里是初始化内容",
        rules: {
          Image: [{
            required: true,
            validator: checkLogo
          }],
          Content: [{
            required: true,
            message: '请输入消息内容',
            trigger: 'blur'
          }],
          Title: [{
            required: true,
            message: '请输入消息标题',
            trigger: 'blur'
          }, ],
        },
        find: false
      };
    },
    // components: {
    //   UEditor
    // },
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
          .get("api/Back_MessageManage/MessageList", {
            params: {
              pageIndex: this.pageIndex,
              pageSize: this.pageSize,
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
                    // this.defaultMsg = decodeURIComponent(response.data.Result.datalist[i].Content);
                    // console.log(this.defaultMsg)
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
                      path: "/MessageList"
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
              .post("api/Back_MessageManage/MessageEdit",
                qs.stringify({
                  image: this.getList.Image,
                  title: this.getList.Title,
                  content: this.getList.Content,
                  id: window.location.href.split("id=")[1],
                  Token: getCookie("token"),
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
                        path: "/MessageList"
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
      handleCurrentChange(val) {
        this.pageIndex = val;
        this.getInfo();
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
