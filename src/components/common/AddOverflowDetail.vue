<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/Overflow' }">超值热卖列表</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/OverflowDetail/id='+id}">超值热卖详情</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    
    <el-transfer v-model="value1" :data="data"></el-transfer>

  </div>
</template>
<script>
  import qs from "qs";
  export default {
    data() {
      const generateData = _ => {
        const data = [];
        for (let i = 1; i <= 15; i++) {
          data.push({
            key: i,
            label: `备选项 ${ i }`,
          });
        }
        return data;
      };
      return {
        data: generateData(),
        value1: [1, 4],
        id:''
      };
    },
    mounted() {
      this.id = window.location.href.split("id=")[1]
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
          .get("api/Back_ProductManage/OrdinaryProduct", {
            params: {
              sear: -1,
              classificationID:-1,
              Token: getCookie("token"),
              pageIndex: this.pageIndex,
              pageSize: this.pageSize,
            }
          })
          .then(
            function (response) {
              loading.close();
              var status = response.data.Status;
              if (status === 1) {
                this.list = response.data.Result;
                console.log(this.list)
                // this.imageUrl = response.data.Result.dataList;
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
              console.log(error)
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
    font-size: 18px;
    padding: 0 0 10px 0;
    font-weight: bolder;
  }

</style>
