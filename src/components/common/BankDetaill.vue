<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/BankList' }">银行列表</el-breadcrumb-item>
      <el-breadcrumb-item>银行详情</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- table 内容 -->
    <p class="title">
      <el-button size="mini" type="primary" @click="handleAdd()" style="float:right;margin-bottom:50px;">添加商品</el-button>
    </p>
    <el-table :data="list" style="width: 100%" :border='true'>
      <el-table-column label="商品名称" prop="Name">
      </el-table-column>
      <el-table-column label="金币" prop="ExCoin">
      </el-table-column>
      <el-table-column label="余额" prop="ExBalance">
      </el-table-column>
      <el-table-column label="兑换条件" prop="ExChangeWay" :formatter="ExChangeWay">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" plain @click="handleEdit(scope.$index)">详情</el-button>
          <el-button size="mini" type="danger" plain icon="el-icon-delete" @click="handleDelete(scope.row.ID)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="block">
      <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next,jumper" :page-count="pageCount">
      </el-pagination>
    </div>

    <el-dialog title="新增" :visible.sync="addFormVisible">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="商品名称" prop="Name">
          <el-input v-model="addForm.Name"></el-input>
        </el-form-item>
        <el-form-item label="金币" prop="Coin">
          <el-input v-model="addForm.Coin"></el-input>
        </el-form-item>
        <el-form-item label="余额" prop="Exbalance">
          <el-input v-model="addForm.Exbalance"></el-input>
        </el-form-item>
        <el-form-item label="兑换方式" prop="ExChangeWay">
          <el-radio-group v-model="addForm.ExChangeWay">
            <el-radio class="radio" :label="1">输入兑换码</el-radio>
            <el-radio class="radio" :label="2">上传二维码截图</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click="addSubmit('addForm')">提交</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑" :visible.sync="editFormVisible">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="商品名称" prop="Name">
          <el-input v-model="editForm.Name"></el-input>
        </el-form-item>
        <el-form-item label="金币" prop="ExCoin">
          <el-input v-model="editForm.ExCoin"></el-input>
        </el-form-item>
        <el-form-item label="余额" prop="ExBalance">
          <el-input v-model="editForm.ExBalance"></el-input>
        </el-form-item>
        <el-form-item label="兑换方式" prop="ExChangeWay">
          <el-radio-group v-model="editForm.ExChangeWay">
            <el-radio class="radio" :label="1">输入兑换码</el-radio>
            <el-radio class="radio" :label="2">上传二维码截图</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click="editSubmit('editForm')">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import qs from "qs";
  export default {
    data() {
      return {
        list: [],
        addFormVisible: false,
        addForm: {
          changeWay: 1,
          Exbalance: '',
          Coin: '',
          Name: ''
        },
        addFormRules: {
          Name: [{
            required: true,
            message: "请输入商品名称",
            trigger: "blur"
          }],
          Coin: [{
            required: true,
            message: "请输入金币",
            trigger: "blur"
          }],
          Exbalance: [{
            required: true,
            message: "请输入余额",
            trigger: "blur"
          }],
          ExChangeWay: [{
            required: true,
            message: "请选择兑换方式",
            trigger: "change"
          }]
        },
        editForm: [],
        editFormVisible: false,
        pageIndex: 1,
        pageSize: 12,
        pageCount: 1,
        mainurl: '',
        editFormRules: {
          Name: [{
            required: true,
            message: "请输入商品名称",
            trigger: "blur"
          }],
          ExCoin: [{
            required: true,
            message: "请输入金币",
            trigger: "blur"
          }],
          ExBalance: [{
            required: true,
            message: "请输入余额",
            trigger: "blur"
          }],
          ExChangeWay: [{
            required: true,
            message: "请选择兑换方式",
            trigger: "change"
          }]
        },
      };
    },
    mounted() {
      this.getInfo();
    },
    methods: {
      ExChangeWay(row, ExChangeWay) {
        var ExChangeWay = row[ExChangeWay.property];
        if (ExChangeWay == 1) {
          ExChangeWay = "输入兑换码"
        } else {
          ExChangeWay = "上传二维码截图"
        }
        return ExChangeWay
      },
      getInfo() {
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        this.$http
          .post("api/Back_CurrentManage/BankDetailList?token=" + getCookie("token") + "&id=" + window.location.href.split(
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
              if (status === -1) {
                this.list = response.data.Result
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
      handleCurrentChange(val) {
        this.pageIndex = val;
        this.getInfo();
      },
      handleAdd() {
        this.addForm = {
          changeWay: 1,
          Exbalance: '',
          Coin: '',
          Name: ''
        },
        this.addFormVisible = true
      },
      handleEdit(index) {
        this.editForm = this.list[index]
        this.list[index] = this.list[index]
        this.editFormVisible = true
      },
      handleDelete(id) {
        this.$confirm('确认删除该商品?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const loading = this.$loading({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });
          this.$http
            .get("api/Back_CurrentManage/ExchangePoolDelete", {
              params: {
                ID: id,
                Token: getCookie("token"),
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
                  this.getInfo()
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
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      addSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const loading = this.$loading({
              lock: true,
              text: "Loading",
              spinner: "el-icon-loading",
              background: "rgba(0, 0, 0, 0.7)"
            });
            this.$http
              .get("api/Back_CurrentManage/ExchangePoolAdd", {
                params: {
                  token: getCookie("token"),
                  bankId: window.location.href.split("id=")[1],
                  name: this.addForm.Name,
                  coin: this.addForm.Coin,
                  Exbalance: this.addForm.Exbalance,
                  changeWay: this.addForm.ExChangeWay,
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
                    this.getInfo()
                    this.addFormVisible = false
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
      editSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const loading = this.$loading({
              lock: true,
              text: "Loading",
              spinner: "el-icon-loading",
              background: "rgba(0, 0, 0, 0.7)"
            });
            this.$http
              .get("api/Back_CurrentManage/ExchangePoolEdit", {
                params: {
                  id:this.editForm.ID,
                  token: getCookie("token"),
                  name: this.editForm.Name,
                  coin: this.editForm.ExCoin,
                  Exbalance: this.editForm.ExBalance,
                  changeWay: this.editForm.ExChangeWay,
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
                    this.getInfo()
                    this.editFormVisible = false
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
