<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item>退货商品订单列表</el-breadcrumb-item>
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
      <el-table-column label="商品名称" prop="Name">
      </el-table-column>
      <el-table-column label="退款金额" prop="price">
      </el-table-column>
      <!-- <el-table-column label="退款信息" prop="Message">
      </el-table-column> -->
      <el-table-column label="订单状态" prop="Status" :formatter="Type">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- <el-button size="mini" type="primary" @click="handleEdit(scope.row.orderProd,2,'同意')">同意</el-button> -->
          <el-button size="mini" type="primary" @click="handleEdit(scope.row.orderProd,3,'拒绝')">拒绝</el-button>
          <el-button size="mini" v-if="scope.row.Status == 1" type="primary" @click="handleEdit(scope.row.orderProd,2,'修改')">修改状态</el-button>
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
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import expresss from "../../../static/js/express.js";
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
        FormVisible: false,
        addLoading: false,
        action: '',
        loading: false,
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
        addLoading: false,
        FormVisible: false,
        FormVisible: false,
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
            Name: '未退款'
          },
          {
            ID: 2,
            Name: '已退款'
          },
        ]
      };
    },
    filters: {
      orderType: function (value) {
        if (value == 0) {
          value = "未支付"
        } else if (value == 1) {
          value = "未退款"
        } else if (value == 2) {
          value = "已退款"
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
      this.restaurants = expresss;
      this.mainurl = mainurl;
      this.getInfo();
      this.action =
        this.mainurl +
        "/api/Back_OrderManage/ExpressToExcel?token=" +
        getCookie("token");
    },
    methods: {
      forBreak() {
        // 加入快递公司是手动输入的，需要多加一层判断该公司是否存在于数据源中。若不存在则不能发货
        for (let index = 0; index < expresss.length; index++) {
          const element = expresss[index];
          if (this.addForm.Company == element.value) {
            return true;
          }
        }
      },
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
          type = "未退款"
        } else if (type == 2) {
          type = "已退款"
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
          .get("api/Back_OrderManage/DrawBackList", {
            params: {
              expressNo: this.orderNo == '' ? '' - 1 : this.orderNo,
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
      handleEdit(id, status,msg) {
        this.$confirm("确认"+msg+'该订单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http
            .get("api/Back_OrderManage/DrawBackCheck", {
              params: {
                Token: getCookie("token"),
                orderProdID: id,
                type: status,
              }
            })
            .then(
              function (response) {
                var status = response.data.Status;
                if (status === 1) {
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
      },
      addSubmit() {
        this.$refs.addForm.validate(valid => {
          if (valid) {
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
          }
        });
      },
      fahuo(id) {
        this.FormVisible = true
        this.fahuoid = id;
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
