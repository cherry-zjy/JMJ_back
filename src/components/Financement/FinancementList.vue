<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item>资金明细</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- table 内容 -->
    <el-table :data="list" style="width: 100%" :border='true'>
      <el-table-column label="订单编号" prop="OrderNo">
      </el-table-column>
      <el-table-column label="商品名称" prop="prodName">
      </el-table-column>
      <el-table-column label="购买用户" prop="userName">
      </el-table-column>
      <el-table-column label="付款金额" prop="Pay">
      </el-table-column>
      <el-table-column label="总佣金" prop="">
      </el-table-column>
      <el-table-column label="利润" prop="">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" plain @click="handleEdit(scope.row.ID)">查看</el-button>
          <!-- <el-button size="mini" type="danger" plain icon="el-icon-delete" @click="handleDelete(scope.row.ID)">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="block">
      <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next,jumper" :page-count="pageCount">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        list: [],
        pageIndex: 1,
        pageSize: 12,
        pageCount: 1,
        mainurl: ''
      };
    },
    mounted() {
      this.mainurl = mainurl
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
          .get("api/Back_FinancementManage/FinancementList", {
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
                this.list = response.data.Result.dataList;
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
      handleEdit(id) {
        this.$router.push("/BankDetaill/id=" + id);
      },
      handleCurrentChange(val) {
        this.pageIndex = val;
        this.getInfo();
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
