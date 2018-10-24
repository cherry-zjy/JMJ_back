<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/FreightFormworkList' }">运费模板列表</el-breadcrumb-item>
      <el-breadcrumb-item>修改运费模板</el-breadcrumb-item>
    </el-breadcrumb>

    <el-main>
      <el-form :model="getList" ref="getList" label-width="150px" class="demo-ruleForm" :rules="rules" style="width:70%">
        <el-form-item label="模板名称" prop="Name">
          <el-input v-model="getList.Name"></el-input>
        </el-form-item>
        <el-form-item label="计费方式" prop="Type">
          <el-radio-group v-model="getList.Type">
            <el-radio label="0">按件</el-radio>
            <el-radio label="1">按重量</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="配送区域">
          <el-button size="mini" type="primary" @click="handleAdd()" style="float:right">新增</el-button>
          <el-table :data="list" style="width: 100%;margin:60px 0" :border='true'>
            <el-table-column label="配送区域" prop="Provinces">
            </el-table-column>
            <el-table-column label="首件" prop="First">
            </el-table-column>
            <el-table-column label="运费" prop="FirstPrice">
            </el-table-column>
            <el-table-column label="续件" prop="Per">
            </el-table-column>
            <el-table-column label="续费" prop="PerPrice">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="danger" plain icon="el-icon-delete" @click="Del(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitFormwork('getList')">修改</el-button>
        </el-form-item>
      </el-form>
    </el-main>
    <!-- 模态框 -->
    <el-dialog title="新增配送区域" :visible.sync="dialogFormVisible" width="50%">
      <el-form :model="editForm" :rules="listrules" ref="editForm" label-width="150px" class="demo-editForm"
        label-position="left">
        <el-form-item label="配送区域" prop="Provinces">
          <i v-if="!isshow" class="el-icon-loading"></i>
          <el-select v-else v-model="editForm.Provinces" placeholder="请选择">
            <el-option v-for="item in Address" :key="item.label" :label="item.label" :value="item.label">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="首件" prop="First">
          <el-input v-model="editForm.First"></el-input>
        </el-form-item>
        <el-form-item label="运费" prop="FirstPrice">
          <el-input v-model="editForm.FirstPrice"></el-input>
        </el-form-item>
        <el-form-item label="续件" prop="Per">
          <el-input v-model="editForm.Per"></el-input>
        </el-form-item>
        <el-form-item label="续费" prop="PerPrice">
          <el-input v-model="editForm.PerPrice"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('editForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import qs from "qs";
  export default {
    data() {
      return {
        dialogFormVisible: false,
        list: [],
        getList: [],
        mainurl: '',
        editForm: [],
        isshow:false,
        listrules: {
          Provinces: [{
            required: true,
            message: '请输入配送区域',
            trigger: 'change'
          }],
          First: [{
            required: true,
            message: '请输入首件',
            trigger: 'blur'
          }],
          FirstPrice: [{
            required: true,
            message: '请输入运费',
            trigger: 'blur'
          }],
          Per: [{
            required: true,
            message: '请输入续件',
            trigger: 'blur'
          }],
          PerPrice: [{
            required: true,
            message: '请输入续费',
            trigger: 'blur'
          }],
        },
        rules: {
          Url: [{
            required: true,
            message: '请输入跳转地址',
            trigger: 'blur'
          }, ],
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
      this.getInfo();
    },
    methods: {
      getCity() {
        this.$http
          .get("api/Address/GetProvinceCityRegion", {
            params: {
              pageIndex: 1,
              pageSize: 999
            }
          })
          .then(
            function (response) {
              var status = response.data.Status;
              if (status === 1) {
                for (var i = 0; i < response.data.Result.length; i++) {
                  this.Address[i] = {
                    label: response.data.Result[i].ProvinceName,
                    value: response.data.Result[i].ProvinceID,
                  }
                }
                this.isshow = true
              } else if (status === -1) {
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
              this.$notify.error({
                title: "错误",
                message: "错误：请检查网络"
              });
            }.bind(this)
          );
      },
      getInfo() {
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        this.$http
          .get("api/Back_CurrentManage/ReigionDetail", {
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
                this.getList = response.data.Result.form;
                this.getList.Type = "" + response.data.Result.form.Type + ""
                this.list = response.data.Result.datalist;
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
            this.list.push({
              Provinces: this.editForm.Provinces,
              First: this.editForm.First,
              FirstPrice: this.editForm.FirstPrice,
              Per: this.editForm.Per,
              PerPrice: this.editForm.PerPrice,
            });
            this.dialogFormVisible = false
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      Del(index) {
        this.list.splice(index, 1)
      },
      handleAdd(index, row) {
        this.dialogFormVisible = true
        if (this.Address = []) {
          this.getCity()
        }
      },
      submitFormwork(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const loading = this.$loading({
              lock: true,
              text: "Loading",
              spinner: "el-icon-loading",
              background: "rgba(0, 0, 0, 0.7)"
            });
            this.$http
              .post("api/Back_CurrentManage/FreightFormworkEdit",
                qs.stringify({
                  token: getCookie("token"),
                  id: window.location.href.split("id=")[1],
                  Name: this.getList.Name,
                  Type: this.getList.Type,
                  Items: this.list
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
                    this.getInfo()
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

  .title {
    font-size: 22px;
    padding: 15px;
    font-weight: bolder;
  }

  .el-input {
    width: 50%;
  }

</style>
