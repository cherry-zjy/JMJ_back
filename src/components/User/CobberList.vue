<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item>城市合伙人列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--检索条-->
    <el-col class="toolbar" style="padding-top: 15px;padding-bottom:20px">
      <el-input v-model="sear" placeholder="用户手机号" prefix-icon="el-icon-search" style="width:200px"></el-input>
      <el-button type="primary" @click="pageIndex = 1;getInfo()">查询</el-button>
      <div style="float:right;">
        <el-button type="primary" @click="handleAdd()">新增</el-button>
      </div>
    </el-col>

    <!-- table 内容 -->
    <el-table :data="list" style="width: 100%" :border='true'>
      <el-table-column label="用户头像" prop="image">
        <template slot-scope="scope">
          <img :src="scope.row.image" width="100" v-if="scope.row.image!==null&&scope.row.image.indexOf('http')>=0"/>
          <img :src="mainurl+scope.row.image" width="100" v-else/>
        </template>
      </el-table-column>
      <el-table-column label="昵称" prop="nickName">
      </el-table-column>
      <el-table-column label="地区" prop="Adress">
      </el-table-column>
      <el-table-column label="手机号" prop="phone">
      </el-table-column>
      <el-table-column label="余额" prop="Price">
      </el-table-column>
      <el-table-column label="注册时间" prop="CreateTime" :formatter="CreateTime">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="warning" @click="handleLook(scope.row.ID)">查看</el-button>
          <el-button size="mini" type="danger" @click="handleDel(scope.row.ID)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block">
      <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next,jumper" :page-count="pageCount">
      </el-pagination>
    </div>
    <!-- 模态框 -->
    <el-dialog title="新增" :visible.sync="dialogFormVisible" width="50%">
      <el-form :model="editlist" :rules="rules" ref="editlist" label-width="150px" class="demo-ruleForm">
        <el-form-item label="用户手机号" prop="phone">
          <el-input v-model="editlist.phone" style="width:100%"></el-input>
        </el-form-item>
        <el-form-item label="地区" prop="selectedOptions">
          <i v-if="!isshow" class="el-icon-loading"></i>
          <el-cascader :options="Address" v-model="editlist.selectedOptions" :change-on-select="true" :clearable="true"
            :filterable="true" @change="handleChange" v-if="isshow">
          </el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitaddForm('editlist')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      var checkselecte = (rule, value, callback) => {
        if (this.editlist.city == '' || this.editlist.city == undefined) {
          callback(new Error("请选择省"));
        } else if (this.editlist.erae == '' || this.editlist.erae == undefined) {
          callback(new Error("请选择市"));
        } else if (this.editlist.minerae == '' || this.editlist.minerae == undefined) {
          callback(new Error("请选择区"));
        } else {
          callback();
        }
      }
      return {
        list: [],
        mainurl: '',
        pageIndex: 1,
        pageSize: 8,
        pageCount: 1,
        isshow: false,
        sear: '',
        dialogFormVisible: false,
        editlist: {
          phone: '',
          selectedOptions: [],
        },
        Address: [],
        rules: {
          phone: [{
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          }, ],
          selectedOptions: [{
            type: 'array',
            required: true,
            trigger: 'change',
            validator: checkselecte
          }],
        },
      };
    },
    mounted() {
      this.mainurl = mainurl

      this.getCity()
    },
    methods: {
      getCity() {
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        this.$http
          .get("api/Address/GetProvinceCityRegion", {
            params: {
              pageIndex: 1,
              pageSize: 999
            }
          })
          .then(
            function (response) {
              loading.close();
              var status = response.data.Status;
              if (status === 1) {
                for (var i = 0; i < response.data.Result.length; i++) {
                  this.Address[i] = {
                    label: response.data.Result[i].ProvinceName,
                    value: response.data.Result[i].ProvinceID,
                    children: []
                  }
                  for (var y = 0; y < response.data.Result[i].City.length; y++) {
                    var arr = {
                      label: response.data.Result[i].City[y].CityName,
                      value: response.data.Result[i].City[y].CityID,
                      children: []
                    }
                    this.Address[i].children.push(arr)
                    for (var z = 0; z < response.data.Result[i].City[y].Region.length; z++) {
                      var arr2 = {
                        label: response.data.Result[i].City[y].Region[z].RegionName,
                        value: response.data.Result[i].City[y].Region[z].RegionID,
                      }
                      this.Address[i].children[y].children.push(arr2)
                    }
                  }
                }
                this.isshow = true
                this.getInfo();
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
              loading.close();
              console.log(error)
              this.$notify.error({
                title: "错误",
                message: "错误：请检查网络"
              });
            }.bind(this)
          );
      },
      handleChange(value) {
        this.editlist.city = this.editlist.selectedOptions[0];
        this.editlist.erae = this.editlist.selectedOptions[1]
        this.editlist.minerae = this.editlist.selectedOptions[2]
      },
      myAddressErae(value) {
        for (var y in this.Address) {
          for (var z in this.Address[y].children) {
            for (var i in this.Address[y].children[z].children) {
              if (this.Address[y].children[z].children[i].value == value && value != undefined) {
                return value = this.Address[y].children[z].children[i].value
              }
            }
          }
        }
      },
      addfilters(Region) {
        for (var y in this.Address) {
          for (var z in this.Address[y].children) {
            if (this.Address[y].children[z].value == Region && Region != undefined) {
              return this.Address[y].label + this.Address[y].children[z].label
            }
            for (var i in this.Address[y].children[z].children) {
              if (this.Address[y].children[z].children[i].value == Region && Region != undefined) {
                return this.Address[y].label + this.Address[y].children[z].label + this.Address[y].children[
                  z].children[i].label
              }
            }
          }
        }
        this.isshow = true
      },
      CreateTime(row, time) {
        var date = row[time.property];
        return date.replace("T", " ").split(".")[0];
      },
      getInfo() {
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        this.$http
          .get("api/Back_UserManage/CobberList", {
            params: {
              phone: this.sear == '' ? '' - 1 : this.sear,
              pageIndex: this.pageIndex,
              pageSize: this.pageSize,
              Token: getCookie("token"),
              type: 1
            }
          })
          .then(
            function (response) {
              loading.close();
              var status = response.data.Status;
              if (status === 1) {
                this.list = response.data.Result.datalist;
                for (let i = 0; i < this.list.length; i++) {
                  this.list[i].Adress = this.addfilters(this.list[i].Adress)
                }
                this.pageCount = response.data.Result.page;
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
      handleLook(id) {
        this.$router.push("/CobberLook/id=" + id);
      },
      handleAdd() {
        this.editlist = []
        this.dialogFormVisible = true
      },
      submitaddForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const loading = this.$loading({
              lock: true,
              text: "Loading",
              spinner: "el-icon-loading",
              background: "rgba(0, 0, 0, 0.7)"
            });
            this.$http
              .post("api/Back_UserManage/CityAdd?token=" + getCookie("token") + "&phone=" + this.editlist.phone +
                "&city=" + this.myAddressErae(this.editlist.minerae),
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
                    this.$message({
                      showClose: true,
                      type: "success",
                      message: response.data.Result
                    });
                    this.getInfo()
                    this.dialogFormVisible = false
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
      handleDel(id) {
        this.$confirm('确认删除?', '提示', {
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
            .get("api/Back_UserManage/CityDelete", {
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
