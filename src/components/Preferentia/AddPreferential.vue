<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/PreferentialList' }">优惠券列表</el-breadcrumb-item>
      <el-breadcrumb-item>新增抵用券</el-breadcrumb-item>
    </el-breadcrumb>

    <el-main>
      <el-form :model="getList" ref="getList" label-width="150px" class="demo-ruleForm" :rules="rules" style="width:70%">
        <el-form-item label="抵用券名称" prop="Name">
          <el-input v-model="getList.Name"></el-input>
        </el-form-item>
        <el-form-item label="抵用券类型" prop="Type">
          <el-radio-group v-model="getList.Type">
            <el-radio label="1">折扣券</el-radio>
            <el-radio label="2">商品抵用券</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="抵用券使用条件" prop="condition">
          满&nbsp;<el-input v-model="getList.Full" style="width:60px"></el-input>
          减&nbsp;<el-input v-model="getList.CutPrice" style="width:60px"></el-input>
        </el-form-item>
        <el-form-item label="抵用券适用用户等级" prop="userLevel">
          <el-radio-group v-model="getList.userLevel">
            <el-radio :label="item" v-for="(item,index) in Level" :key="index"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="抵用券适用商品种类" prop="classificationID">
          <el-radio-group v-model="getList.classificationID">
            <el-radio :label="item.ID" v-for="(item,index) in datalist" :key="index">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="抵用券有效日期" prop="time">
          <el-date-picker v-model="getList.time" value-format="yyyy-MM-dd" @change="getSTime" format="yyyy-MM-dd" type="daterange"
            start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="抵用券数量" prop="Count">
          <el-input v-model="getList.Count" type="number"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('getList')">新增</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </div>
</template>
<script>
  import qs from "qs";
  export default {
    data() {
      var checkcondition = (rule, value, callback) => {
        console.log(this.getList.Full)
        if (this.getList.Full == '' || this.getList.CutPrice == '') {
          console.log(this.getList.Full)
          callback(new Error("请输入满减"));
        } else {
          callback();
        }
      };
      var checktype = (rule, value, callback) => {
        console.log(this.getList.classificationID)
        if (this.getList.classificationID == -1) {
          callback(new Error("请输入抵用券适用商品种类"));
        } else {
          callback();
        }
      };
      return {
        Level: [],
        datalist: [],
        getList: {
          Full: '',
          CutPrice: '',
          time: '',
          classificationID:-1
        },
        Info: [],
        mainurl: '',
        rules: {
          Count: [{
            required: true,
            message: '请输入抵用券数量',
            trigger: 'blur'
          }, ],
          condition: [{
            required: true,
            trigger: 'blur',
            validator: checkcondition
          }],
          time: [{
            required: true,
            message: '请输入抵用券有效日期',
            trigger: 'blur'
          }],
          Type: [{
            required: true,
            message: '请选择抵用券类型',
            trigger: 'change'
          }],
          userLevel: [{
            required: true,
            message: '请选择抵用券适用用户等级',
            trigger: 'change'
          }],
          classificationID: [{
            required: true,
            validator: checktype,
            trigger: 'change'
          }],
          Name: [{
            required: true,
            message: '请输入抵用券名称',
            trigger: 'blur'
          }, ],
        },
      };
    },
    mounted() {
      this.mainurl = mainurl
      this.getInfo()
    },
    methods: {
      getSTime(val) {
        console.log(val)
        this.getList.time = val;
      },
      getInfo() {
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
          this.$http
          .get("api/Back_PreferentialManage/PreferentialValue", {
            params: {
              Token: getCookie("token"),
            }
          })
          .then(
            function (response) {
              loading.close();
              var status = response.data.Status;
              if (status === 1) {
                this.Level = response.data.Result.userLevel.split(",");
                this.datalist = response.data.Result.datalist;
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
            var startTime = this.getList.time[0].substring(0, 10)
            var endTime = this.getList.time[1].substring(0, 10)
            this.$http
              .post("api/Back_PreferentialManage/PreferentialAdd",
                qs.stringify({
                  Token: getCookie("token"),
                  Name: this.getList.Name,
                  Full: this.getList.Full,
                  CutPrice: this.getList.CutPrice,
                  userLevel: this.getList.userLevel,
                  classificationID: this.getList.classificationID,
                  startTime: startTime,
                  endTime: endTime,
                  Count: this.getList.Count,
                  Type: this.getList.Type,
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
                        path: "/PreferentialList"
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
