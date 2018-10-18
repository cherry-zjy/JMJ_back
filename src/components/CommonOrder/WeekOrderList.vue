<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item>免单商品订单列表</el-breadcrumb-item>
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
      <el-table-column label="订单完成时间" prop="FinishTime">
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
          <el-button size="mini" type="warning" v-if="scope.row.type==1" @click="fahuo(scope.row.ID)">发货</el-button>
          <el-button size="mini" type="warning" disabled v-if="scope.row.type!==1">发货</el-button>
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
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
        list: [],
        mainurl: '',
        type: -1,
        fahuoid:'',
        editForm: {
          OrderNumber: ''
        },
        addForm:{
          ExpressNumber:''
        },
        addFormRules: {
          ExpressNumber: [{
            required: true,
            message: "请输入运单号",
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
      this.mainurl = mainurl
      this.getInfo();
    },
    methods: {
      CreateTime(row, time) {
        var date = row[time.property];
        return date.replace("T", " ").split(".")[0];
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
          .get("api/Back_OrderManage/WeekOrderList", {
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
        this.$router.push("/WeekOrderDetail/id=" + id);
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
                    Token:getCookie("token"),
                    ID:this.fahuoid,
                    ExpressNumber:this.addForm.ExpressNumber
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
      fahuo(id){
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
