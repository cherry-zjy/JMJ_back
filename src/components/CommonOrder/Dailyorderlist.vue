<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item>团购商品订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--检索条-->
    <el-col class="toolbar" style="padding-top: 15px;margin-bottom:20px">
      <el-input v-model="orderNo" placeholder="订单号" prefix-icon="el-icon-search" style="width:200px"></el-input>
      <el-input v-model="name" placeholder="用户名" prefix-icon="el-icon-search" style="width:200px"></el-input>
      <el-select v-model="type" placeholder="订单状态">
        <el-option v-for="item in typeList" :key="item.ID" :label="item.Name" :value="item.ID">
        </el-option>
      </el-select>
      <el-button type="primary" @click="pageIndex = 1;getInfo()">查询</el-button>
    </el-col>

    <!-- table 内容 -->
    <el-table :data="list" style="width: 100%" :border='true'>
      <el-table-column label="订单编号" prop="OrderNo">
      </el-table-column>
      <el-table-column label="订单完成时间" prop="FinishTime" :formatter="CreateTime">
      </el-table-column>
      <el-table-column label="商品名称" prop="prdName">
      </el-table-column>
      <el-table-column label="用户名" prop="userName">
      </el-table-column>
      <el-table-column label="收货号码" prop="Phone">
      </el-table-column>
      <el-table-column label="收货地址" prop="Adress">
      </el-table-column>
      <el-table-column label="付款金额" prop="Price">
      </el-table-column>
      <el-table-column label="订单状态" prop="type" :formatter="Type">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.row.ID)">查看</el-button>
          <el-button size="mini" type="warning" v-if="scope.row.type==1" @click="fahuo(scope.row.Company,scope.row.ExpressNo,scope.row.ID)">发货</el-button>
          <el-button size="mini" type="warning" disabled v-if="scope.row.type!==1">发货</el-button>
          <!-- <el-button size="mini" type="warning" v-if="scope.row.type==3" @click="tuihuo(scope.row.ID)">退款</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block">
      <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next,jumper" :page-count="pageCount">
      </el-pagination>
    </div>

    <!--模态框-->
    <el-dialog title="新增" :visible.sync="FormVisible">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="运单号" prop="ExpressNumber">
          <el-input v-model="addForm.ExpressNumber" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="快递公司" prop="Company">
          <el-autocomplete v-model="addForm.Company" :fetch-suggestions="querySearchAsync" placeholder="请输入内容" @select="handleSelect"></el-autocomplete>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="FormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  // import expresss from "../../../static/js/express.js";
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
        restaurants: [],
        CompanyName: "",
        timeout: null,
        list: [],
        options4: [], //快递公司,带value
        citylist: [], //快递公司,不带value
        imageUrl: false,
        mainurl: '',
        type: -1,
        fahuoid: '',
        editForm: {
          OrderNumber: ''
        },
        addForm: {
          ExpressNumber: '',
          Company: ''
        },
        action: '',
        loading: false,
        addLoading: false,
        FormVisible: false,
        addFormRules: {
          ExpressNumber: [{
            required: true,
            message: "请输入运单号",
            trigger: "blur"
          }],
          Company: [{
            required: true,
            message: "请输入快递公司",
            trigger: "blur"
          }],
        },
        pageIndex: 1,
        pageSize: 8,
        pageCount: 1,
        orderNo: '',
        name: '',
        typeList: [{
            ID: -1,
            Name: '全部'
          },
          {
            ID: 1,
            Name: '待付款'
          },
          {
            ID: 2,
            Name: '待收货'
          },
          {
            ID: 3,
            Name: '待发货'
          },
          {
            ID: 4,
            Name: '待评价'
          },
        ]
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
      // this.restaurants = expresss;
      this.mainurl = mainurl;
      this.getInfo();
      this.action =
        this.mainurl +
        "/api/Back_OrderManage/ExpressToExcel?token=" +
        getCookie("token");
    },
    methods: {
      querySearchAsync(queryString, cb) {
        var restaurants = this.restaurants;
        var results = queryString ?
          restaurants.filter(this.createStateFilter(queryString)) :
          restaurants;

        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          cb(results);
        }, 1000 * Math.random());
      },
      createStateFilter(queryString) {
        return state => {
          return (
            state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
          );
        };
      },
      handleSelect(item) {
        this.addForm.Company = item.value;
      },
      remoteMethod(query) {
        if (query !== '') {
          this.loading = false;
          this.options4 = this.citylist.filter(item => {
            return item.ExpressName.toLowerCase()
              .indexOf(query.toLowerCase()) > -1;
          });
          console.log(this.options4)
        } else {
          this.options4 = [];
        }
      },
      forBreak() {
        // 加入快递公司是手动输入的，需要多加一层判断该公司是否存在于数据源中。若不存在则不能发货
        for (let index = 0; index < this.restaurants.length; index++) {
          const element = this.restaurants[index];
          if (this.addForm.Company == element.value) {
            return true;
          }
        }
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = true;
        this.citylist = res.Result
      },
      beforeAvatarUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error("文件大小不能超过 2MB!");
        }
        return isLt2M;
      },
      CreateTime(row, time) {
        var date = row[time.property];
        if (date) {
          return date.replace("T", " ").split(".")[0];
        }
      },
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
          .get("api/Back_OrderManage/DailyOrderList", {
            params: {
              orderNo: this.orderNo == '' ? '' - 1 : this.orderNo,
              name: this.name == '' ? '' - 1 : this.name,
              type: this.type,
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
      handleEdit(id) {
        this.$router.push("/DailyorderDetail/id=" + id);
      },
      tuihuo(id) {
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        this.$http
          .get("api/Back_OrderManage/DrawBack", {
            params: {
              id: id,
              Token: getCookie("token")
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
      },
      addSubmit() {
        this.$refs.addForm.validate(valid => {
          if (valid) {
            if (this.forBreak()) {
              this.$confirm("确认发货？", '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                //判断是否填写完整  --true
                this.addLoading = true;
                // 将token传入参数中
                // 发保存请求
                this.$http
                  .get("api/Back_OrderManage/Consignment", {
                    params: {
                      Token: getCookie("token"),
                      ID: this.fahuoid,
                      ExpressCode: this.addForm.Company,
                      ExpressNumber: this.addForm.ExpressNumber
                    }
                  })
                  .then(
                    function (response) {
                      this.addLoading = false;
                      var status = response.data.Status;
                      if (status === 1) {
                        // 表单重置
                        this.$refs["addForm"].resetFields();
                        this.FormVisible = false;
                        this.$message({
                          showClose: true,
                          type: "success",
                          message: response.data.Result
                        });
                        this.getInfo();
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
                      this.$notify.error({
                        title: "错误",
                        message: "错误：请检查网络"
                      });
                    }.bind(this)
                  );
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消'
                });
              });
            } else {
              this.$notify.error({
                title: "错误",
                message: "错误：请匹配正确的快递公司"
              });
            }
          }
        });
      },
      getCompany() {
        this.$http
          .get("api/Back_OrderManage/ExpressToExcel", {
            params: {
              token: getCookie("token"),
            }
          })
          .then(
            function (response) {
              this.addLoading = false;
              var status = response.data.Status;
              if (status === 1) {
                var express = []
                for (let i = 0; i < response.data.Result.length; i++) {
                  var arr = {
                    value:response.data.Result[i].ExpressName
                  }
                  express.push(arr)
                }
                this.restaurants = express
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
              this.addLoading = false;
              this.$notify.error({
                title: "错误",
                message: "错误：请检查网络"
              });
            }.bind(this)
          );
      },
      fahuo(no, company, id) {
        if (this.restaurants.length == 0) {
          this.getCompany()
        }
        this.FormVisible = true;
        this.fahuoid = id;
        this.addForm.ExpressNumber = no
        this.addForm.Company = company
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
