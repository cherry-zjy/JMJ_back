<template>
  <div>
    <el-header>
      <el-breadcrumb separator="|" class="crumb">
        <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: 'GetUserIndex' }" v-if='isjump'>用户列表</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '../../user/GetUserIndexDetail/id='+userid+''}" v-if='isjump'>用户详情</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '../../GetProductListIndex' }" v-if='!isjump'>作品列表</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '../../GetProductListIndex?name='+editForm.PushMan+'&id='+userid+'' }" v-if='isjump'>作品列表</el-breadcrumb-item>
        <el-breadcrumb-item>作品详情</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <el-row>
      <el-col :span="12">
        <p class="title">作品信息</p>
        <el-form ref="editForm" label-width="150px" class="demo-editForm" :label-position="labelPosition">
          <el-form-item label="作品名：" prop="Name">
            {{editForm.Name}}
          </el-form-item>
          <el-form-item label="作品简介：" prop="Intro">
            {{editForm.Intro}}
          </el-form-item>
          <el-form-item label="发布人：" prop="PushMan">
            {{editForm.PushMan}}
          </el-form-item>
          <el-form-item label="作品大图：" prop="BigImage">
            <img :src="mainurl+editForm.BigImage" width="100" @click="handlePictureCardPreview(editForm.BigImage)" />
          </el-form-item>
          <el-form-item label="单品图：" prop="Imges">
            <span v-for="(items,index) in imageForm" :key="index">
              <img :src="mainurl+items" width="100" class="imgpad" @click="handlePictureCardPreview(items)">
            </span>
          </el-form-item>
          <el-form-item label="主色调：" prop="MainColor">
            <div class="circle" v-bind:style="{ background: editForm.MainColor}"></div>
            <!-- 主用神五行：{{editForm.MainAttribute}} -->
            <!-- <el-button size="mini" type="primary" @click="dialogmian=true">修改</el-button> -->
          </el-form-item>
          <el-form-item label="辅色调：" prop="SubColor">
            <div class="circle" v-bind:style="{ background: editForm.SubColor}"></div>
            <!-- 辅用神五行：{{editForm.SecondaryColorAttribute}} -->
            <!-- <el-button size="mini" type="primary" @click="dialogsecond=true">修改</el-button> -->
          </el-form-item>
          <el-form-item label="空间分类：" prop="Area">
            {{editForm.Area}}
          </el-form-item>
          <el-form-item label="合适面积：" prop="Proportion">
            {{editForm.Proportion}}
          </el-form-item>

        </el-form>
      </el-col>
      <el-col :span="12">
        <p class="title">服务商信息</p>
        <el-form ref="ServiceProvider" label-width="150px" class="demo-editForm" :label-position="labelPosition">
          <el-form-item label="服务商官方全称：" prop="FullName">
            {{ServiceProvider.FullName}}
          </el-form-item>
          <el-form-item label="LOGO：" prop="Logo">
            <img :src="mainurl+ServiceProvider.Logo" width="100" />
          </el-form-item>
          <el-form-item label="服务商姓名：" prop="ServerName">
            {{ServiceProvider.ServerName}}
          </el-form-item>
          <el-form-item label="服务商手机号：" prop="Phone">
            {{ServiceProvider.Phone}}
          </el-form-item>
          <el-form-item label="地图位置：" prop="Address">
            {{ServiceProvider.Address}}
          </el-form-item>
          <el-form-item label="楼号门牌号：" prop="AddressDetail">
            {{ServiceProvider.AddressDetail}}
          </el-form-item>
          <el-form-item label="主用神五行：" prop="MainAttribute">
            {{editForm.MainAttribute}}
            <el-button size="mini" type="primary" @click="dialogmian=true">修改</el-button>
          </el-form-item>
          <el-form-item label="辅用神五行：" prop="SecondaryColorAttribute">
            {{editForm.SecondaryColorAttribute}}
            <el-button size="mini" type="primary" @click="dialogsecond=true">修改</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <center>
      <el-button type="primary" @click="back()" class="centerbtn">返回</el-button>
    </center>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>

    <el-dialog title="提示" :visible.sync="dialogmian" width="30%" center>
      <el-select v-model="editForm.MainAttribute" placeholder="请选择五行">
        <el-option v-for="item in mainList" :key="item.name" :label="item.name" :value="item.name"></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogmian = false">取 消</el-button>
        <el-button type="primary" @click="editmain(0,editForm.MainAttribute)">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="dialogsecond" width="30%" center>
      <el-select v-model="editForm.SecondaryColorAttribute" placeholder="请选择五行">
        <el-option v-for="item in mainList" :key="item.name" :label="item.name" :value="item.name"></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogsecond = false">取 消</el-button>
        <el-button type="primary" @click="editmain(1,editForm.SecondaryColorAttribute)">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
  import qs from "qs";
  export default {
    data() {
      return {
        editForm: [],
        imageForm: [],
        mainurl: "",
        labelPosition: 'left',
        reason: "",
        dialogFormVisible: false,
        ServiceProvider: [],
        isjump: false,
        dialogImageUrl: '',
        dialogVisible: false,
        dialogmian: false,
        dialogsecond: false,
        mainList: [{
            name: "金",
          },
          {
            name: "木",
          },
          {
            name: "水",
          },
          {
            name: "火",
          },
          {
            name: "土",
          },
        ],
      };
    },
    computed: {
      userid: function () {
        return window.location.href.split("userid=")[1]
      }
    },
    mounted() {
      this.mainurl = mainurl;
      if (window.location.href.split("userid=")[1] !== undefined && window.location.href.split("userid=")[1] !== "" &&
        window.location.href.split("userid=")[1] !== 'undefined') {
        this.userid;
        this.isjump = true;
      }
      this.getInfo()
    },
    methods: {
      getInfo() {
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        // 获取详情
        this.$http
          .get("api/Back_ProductList/GetProductDetail", {
            params: {
              Token: getCookie("token"),
              prodID: window.location.href.split("id=")[1].split("&")[0]
            }
          })
          .then(
            function (response) {
              loading.close();
              var status = response.data.Status;
              if (status === 1) {
                this.editForm = response.data.Result;
                var images = response.data.Result.Imges;
                this.imageForm = images.split(",");
                this.ServiceProvider = response.data.Result.ServiceProvider[0];
                console.log(this.ServiceProvider)
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
              // this.$notify.error({
              //   title: "错误",
              //   message: "错误：请检查网络"
              // });
            }.bind(this)
          );
      },
      //图片放大
      handlePictureCardPreview(url) {
        this.dialogImageUrl = this.mainurl + url;
        this.dialogVisible = true;
      },
      editmain(type, value) {
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        // 获取详情
        this.$http
          .get("api/Back_ProductList/EditProdAttribute", {
            params: {
              Token: getCookie("token"),
              prodID: window.location.href.split("id=")[1].split("&")[0],
              type: type,
              value: value
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
                this.dialogmian = false
                this.dialogsecond = false
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
              // this.$notify.error({
              //   title: "错误",
              //   message: "错误：请检查网络"
              // });
            }.bind(this)
          );
      },
      back() {
        if (this.isjump) {
          this.$router.push('../../GetProductListIndex?name=' + this.editForm.PushMan + '&id=' + this.userid + '');
        } else {
          this.$router.push("/GetProductListIndex");
        }
      },
    },

  };

</script>
<style scoped>
  .is-controls-right {
    float: right;
    margin-right: 50%;
  }

  .title {
    font-size: 22px;
    padding: 15px;
    font-weight: bolder;
  }

  .el-form-item__label {
    text-align: left;
  }

  form {
    padding: 15px;
  }

  .imgpad {
    padding: 5px;
  }

  .circle {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }

</style>
