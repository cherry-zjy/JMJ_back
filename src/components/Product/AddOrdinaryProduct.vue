<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/OrdinaryProduct' }">普通商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>新增普通商品</el-breadcrumb-item>
    </el-breadcrumb>

    <el-main>
      <el-form :model="getList" ref="getList" label-width="150px" class="demo-ruleForm" :rules="rules" style="width:70%">
        <p class="title">商品信息</p>
        <el-row>
          <el-col :span="12">
            <el-form-item label="商品名称" prop="Name">
              <el-input v-model="getList.Name"></el-input>
            </el-form-item>
            <el-form-item label="商品形式">
              <el-input disabled="disabled" value="普通商品"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品原价" prop="Number">
              <el-input v-model="getList.Number"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="商品分类" prop="ClassificationSecondID">
              <el-select v-model="getList.classificationID" placeholder="类型" @change="changeclassification()">
                <el-option v-for="item in classificationList" :key="item.ID" :label="item.Name" :value="item.ID">
                </el-option>
              </el-select>
              <el-select v-model="getList.ClassificationSecondID" placeholder="类型">
                <el-option v-for="item in ClassificationSecondList" :key="item.ID" :label="item.name" :value="item.ID">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <p class="title">
          商品规格
          <el-button size="mini" type="primary" @click="handleAddOne()" style="float:right">新增一级规格</el-button>
        </p>
        <el-row>
          <el-col :span="12">
            <el-form-item label="一级总名称" prop="SpecTypeName">
              <el-input v-model="getList.SpecTypeName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="二级总名称" prop="SpecTypeSecondName">
              <el-input v-model="getList.SpecTypeSecondName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div v-for="(item,index) in spce" :key="index">
          <p class="tabletitle">
            {{item.value}}
            <el-button size="mini" type="warning" @click="handleAdd(index)" style="float:right">新增二级规格</el-button>
            <el-button size="mini" type="danger" plain icon="el-icon-delete" @click="DelOne(index)">删除</el-button>
          </p>
          <el-table style="width: 100%" :border='true' :data="item.children">
            <el-table-column label="二级规格名称" prop="SecondSpecName">
            </el-table-column>
            <el-table-column label="库存" prop="Stock">
            </el-table-column>
            <el-table-column label="价格" prop="Price">
            </el-table-column>
            <el-table-column label="商品编号" prop="prodNumber">
            </el-table-column>
            <el-table-column label="商品条形码" prop="BarCode">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="danger" plain icon="el-icon-delete" @click="Del(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <p class="title">商品详细信息</p>
        <el-row>
          <el-col :span="12">
            <el-form-item label="商品简介" prop="Introduce">
              <el-input type="textarea" v-model="getList.Introduce"></el-input>
            </el-form-item>
            <!-- <el-form-item label="预售商品">
              <el-switch v-model="getList.Isyushou"></el-switch>
            </el-form-item> -->
            <!-- <el-form-item label="折扣力度" prop="Salesvolume">
              <el-input v-model="getList.Salesvolume" disabled="disabled" v-if="!getList.Isyushou"></el-input>
              <el-input v-model="getList.Salesvolume" v-if="getList.Isyushou"></el-input>
            </el-form-item> -->
            <el-form-item label="身份验证">
              <el-switch v-model="getList.IsOutSourcing"></el-switch>
            </el-form-item>
            <el-form-item label="快递运费">
              <el-switch v-model="getList.yunfei"></el-switch>
              <div v-if="getList.yunfei" style="display:inline-block">
                <el-input v-model="getList.ExpressWay" style="width:120px" type="number"></el-input>元
                <el-select v-model="getList.FreightNameID" placeholder="运费模板">
                  <el-option v-for="item in mubanList" :key="item.ID" :label="item.Name" :value="item.ID">
                  </el-option>
                </el-select>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品销量" prop="Salesvolume">
              <el-input v-model="getList.Salesvolume" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品佣金" prop="Commission">
              <el-input v-model="getList.Commission" type="number"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="bannerimg" label="轮播顶图">
              <el-upload class="upload-demo" :action="action" :on-preview="handlePreview" :on-remove="bannerhandleRemove"
                :file-list="addbannerimg" limit="6" list-type="picture-card" :on-success="bannerhandleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <i class="el-icon-plus"></i>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB,最多可上传6张</div>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="ProdPoster" label="商品海报">
              <el-upload v-model="getList.ProdPoster" class="avatar-uploader" :action="action" :show-file-list="false"
                :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                <img v-if="imageUrl" :src="imageUrl" class="avatar" width="200">
                <div v-else class="el-upload el-upload--picture-card">
                  <i class="el-icon-plus"></i>
                </div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <p class="title">商品详情</p>
        <el-form-item label="消息内容" prop="defaultMsg">
          <UEditor :defaultMsg='defaultMsg' :config='config' ref="ueditor"></UEditor>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitFormwork('getList')">修改</el-button>
        </el-form-item>
      </el-form>
    </el-main>
    <!-- 模态框 -->
    <el-dialog title="新增一级分类名称" :visible.sync="dialogFormVisible1" width="50%">
      <el-form :model="AddForm" :rules="addrules" ref="AddForm" label-width="150px" class="demo-editForm"
        label-position="left">
        <el-form-item label="一级规格名称" prop="value">
          <el-input v-model="AddForm.value"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitOneForm('AddForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 模态框 -->
    <el-dialog title="新增二级规格名称" :visible.sync="dialogFormVisible" width="50%">
      <el-form :model="editForm" :rules="listrules" ref="editForm" label-width="150px" class="demo-editForm"
        label-position="left">
        <el-form-item label="二级规格名称" prop="SecondSpecName">
          <el-input v-model="editForm.SecondSpecName"></el-input>
        </el-form-item>
        <el-form-item label="库存" prop="Stock">
          <el-input v-model="editForm.Stock"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="Price">
          <el-input v-model="editForm.Price" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品编号" prop="prodNumber">
          <el-input v-model="editForm.prodNumber"></el-input>
        </el-form-item>
        <el-form-item label="商品条形码" prop="BarCode">
          <el-input v-model="editForm.BarCode"></el-input>
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
  import UEditor from "../UEditor";
  export default {
    data() {
      var checkLogo = (rule, value, callback) => {
        if (this.imageUrl == '') {
          callback(new Error("请上传商品海报"));
        } else {
          callback();
        }
      };
      var checkdefaultMsg = (rule, value, callback) => {
        if (encodeURIComponent(this.$refs.ueditor.getUEContent()) == '') {
          callback(new Error("请输入内容"));
        } else {
          callback();
        }
      };
      var checkbannerimg = (rule, value, callback) => {
        if (this.bannerimg.length == 0 && this.addbannerimg.length == 0) {
          callback(new Error("请上传轮播图"));
        } else {
          callback();
        }
      };
      var checkClassification = (rule, value, callback) => {
        console.log(this.getList.ClassificationSecondID)
        if (this.getList.ClassificationSecondID == '' || this.getList.ClassificationSecondID == undefined) {
          callback(new Error("请选择商品分类"));
        } else {
          callback();
        }
      };
      return {
        config: {
          initialFrameWidth: null,
          initialFrameHeight: 500
        },
        defaultMsg: "这里是初始化内容",
        dialogFormVisible: false,
        dialogFormVisible1: false,
        dialogVisible: false,
        //轮播图点击放大
        dialogImageUrl: '',
        imageUrl: '',
        action: '',
        list: [],
        mubanList: [],
        muban: '',
        bannerimg: [], //轮播图
        addbannerimg: [], //新增轮播图
        classificationList: [], //一级规格列表
        ClassificationSecondList: [], //二级规格列表
        spce: [],
        demo: [], //接口规格暂存参数
        demospce: [], //接口规格参数
        // spce: [{
        //   value: '一级规格名称1',
        //   children: [{
        //     SecondSpecName: '二级规格名称1',
        //     Stock: '库存',
        //     Price: '价格',
        //     BarCode: '商品条形码',
        //     prodNumber: '商品编号',
        //   }, {
        //     SecondSpecName: '二级规格名称2',
        //     Stock: '库存',
        //     Price: '价格',
        //     BarCode: '商品条形码',
        //     prodNumber: '商品编号',
        //   }],
        // }], //一级规格
        getList: {
          IsOutSourcing: false
        },
        mainurl: '',
        editForm: [],
        addindex: '', //添加二级规格的index
        AddForm: {
          value: '',
          children: []
        },
        addrules: {
          value: [{
            required: true,
            message: '请输入一级规格名称',
            trigger: 'blur'
          }],
        },
        listrules: {
          Stock: [{
            required: true,
            message: '请输入库存',
            trigger: 'blur'
          }],
          Price: [{
            required: true,
            message: '请输入价格',
            trigger: 'blur'
          }],
          BarCode: [{
            required: true,
            message: '请输入商品条形码',
            trigger: 'blur'
          }],
          prodNumber: [{
            required: true,
            message: '请输入商品编号',
            trigger: 'blur'
          }],
          SecondSpecName: [{
            required: true,
            message: '请输入二级规格名称',
            trigger: 'blur'
          }],
        },
        rules: {
          defaultMsg: [{
            required: true,
            validator: checkdefaultMsg
          }],
          Name: [{
            required: true,
            message: '请输入商品名称',
            trigger: 'blur'
          }, ],
          Number: [{
            required: true,
            message: '请输入商品原价',
            trigger: 'blur'
          }, ],
          ClassificationSecondID: [{
            required: true,
            validator: checkClassification
          }],
          SpecTypeSecondName: [{
            required: true,
            message: '请输入一级总名称',
            trigger: 'blur'
          }, ],
          SpecTypeName: [{
            required: true,
            message: '请输入二级总名称',
            trigger: 'blur'
          }, ],
          Introduce: [{
            required: true,
            message: '请输入商品简介',
            trigger: 'blur'
          }, ],
          Commission: [{
            required: true,
            message: '请输入商品佣金',
            trigger: 'blur'
          }, ],
          Salesvolume: [{
            required: true,
            message: '请输入商品销量',
            trigger: 'blur'
          }, ],
          Introduce: [{
            required: true,
            message: '请输入商品简介',
            trigger: 'blur'
          }, ],
          bannerimg: [{
            required: true,
            validator: checkbannerimg
          }],
          ProdPoster: [{
            required: true,
            validator: checkLogo
          }],
        },
      };
    },
    components: {
      UEditor
    },
    mounted() {
      this.mainurl = mainurl
      this.action = this.mainurl + "/api/UploadPhotos/UpdateForImage";
      this.getType();
      this.getmuban();
    },
    methods: {
      getType() {
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        this.$http
          .get("api/Back_SortManage/FirstLevelList", {
            params: {
              pageIndex: 1,
              pageSize: 999,
              Token: getCookie("token"),
            }
          })
          .then(
            function (response) {
              loading.close();
              var status = response.data.Status;
              if (status === 1) {
                for (let i = 0; i < response.data.Result.dataList.length; i++) {
                  this.classificationList.push(response.data.Result.dataList[i])
                }
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
      getmuban() {
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        this.$http
          .get("api/Back_CurrentManage/FreightFormworkList", {
            params: {
              pageIndex: 1,
              pageSize: 999,
              Token: getCookie("token"),
            }
          })
          .then(
            function (response) {
              loading.close();
              var status = response.data.Status;
              if (status === 1) {
                for (let i = 0; i < response.data.Result.datalist.length; i++) {
                  this.mubanList.push(response.data.Result.datalist[i])
                }
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
      changeclassification() {
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        this.$http
          .get("api/Back_SortManage/SecondLevelList", {
            params: {
              pageIndex: 1,
              pageSize: 999,
              firstID: this.getList.classificationID,
              Token: getCookie("token"),
            }
          })
          .then(
            function (response) {
              loading.close();
              var status = response.data.Status;
              if (status === 1) {
                this.ClassificationSecondList = response.data.Result.datalist;
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
      handlePreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      bannerhandleAvatarSuccess(res, file) {
        this.addbannerimg.push(res.Result[0])
      },
      //海报大图
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
        this.getList.ProdPoster = res.Result[0];
      },
      //批量上传图片
      bannerhandleRemove(file, fileList) {
        console.log(file)
        //获取删除的图片地址，在addbannerimg中对应删除
        let file1 = file.response.Result
        for (let i = 0; i < this.addbannerimg.length; i++) {
          if (this.addbannerimg[i] == file1) {
            this.addbannerimg.splice(i, 1)
          }
        }
      },
      beforeAvatarUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error("上传头像图片大小不能超过 2MB!");
        }
        return isLt2M;
      },
      //新增二级规格
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.spce[this.addindex].children.push({
              SecondSpecName: this.editForm.SecondSpecName,
              Stock: this.editForm.Stock,
              Price: this.editForm.Price,
              BarCode: this.editForm.BarCode,
              prodNumber: this.editForm.prodNumber,
            });
            this.dialogFormVisible = false
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //新增一级规格
      submitOneForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.spce.push(this.AddForm)
            console.log(this.spce)
            this.dialogFormVisible1 = false
            this.AddForm = {
              value: '',
              children: []
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      DelOne(index) {
        this.$confirm('确认删除该一级规格?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.spce.splice(index, 1)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      Del(index) {
        this.spce[this.addindex].children.splice(index, 1)
      },
      handleAdd(index) {
        this.editForm = [];
        this.addindex = index
        this.dialogFormVisible = true
      },
      handleAddOne() {
        this.AddForm = []
        this.dialogFormVisible1 = true
      },
      submitFormwork(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var content = this.$refs.ueditor.getUEContent();
            //商品轮播图
            var banner = '';
            for (let i = 0; i < this.addbannerimg.length; i++) {
              banner += "" + this.addbannerimg[i] + ",";
            }
            banner = banner.substring(0, banner.length - 1)
            //规格
            for (let i = 0; i < this.spce.length; i++) {
              this.demo = []
              var SecondSpecName = '';
              var prodNumber = '';
              var Price = '';
              var Stock = '';
              var BarCode = '';
              this.demo.SpecName = this.spce[i].value
              for (let y = 0; y < this.spce[i].children.length; y++) {
                SecondSpecName += "" + this.spce[i].children[y].SecondSpecName + ",";
                prodNumber += "" + this.spce[i].children[y].prodNumber + ",";
                Price += "" + this.spce[i].children[y].Price + ",";
                Stock += "" + this.spce[i].children[y].Stock + ",";
                BarCode += "" + this.spce[i].children[y].BarCode + ",";
              }
              this.demo.SecondSpecName = SecondSpecName.substring(0, SecondSpecName.length - 1)
              this.demo.prodNumber = prodNumber.substring(0, prodNumber.length - 1)
              this.demo.Price = Price.substring(0, Price.length - 1)
              this.demo.Stock = Stock.substring(0, Stock.length - 1)
              this.demo.BarCode = BarCode.substring(0, BarCode.length - 1)
              this.demospce.push(this.demo)
            }
            console.log(this.demospce)
            const loading = this.$loading({
              lock: true,
              text: "Loading",
              spinner: "el-icon-loading",
              background: "rgba(0, 0, 0, 0.7)"
            });
            this.$http
              .post("api/Back_ProductManage/CommonProductAdd",
                qs.stringify({
                  token: getCookie("token"),
                  Name: this.getList.Name,
                  Number: this.getList.Number,
                  ClassificationSecondID: this.getList.ClassificationSecondID,
                  specs: this.demospce,
                  SpecTypeName: this.getList.SpecTypeName,
                  SpecTypeSecondName: this.getList.SpecTypeSecondName,
                  Introduce: this.getList.Introduce,
                  IsOutSourcing: this.getList.IsOutSourcing,
                  Salesvolume: this.getList.Salesvolume,
                  Commission: this.getList.Commission,
                  ExpressWay: this.getList.yunfei ? this.getList.ExpressWay : 0,
                  FreightNameID: this.getList.yunfei ? this.getList.FreightNameID : -1,
                  Image: banner,
                  ProdPoster: this.getList.ProdPoster,
                  Detail: encodeURIComponent(content),
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
                        path: "/OrdinaryProduct"
                      });
                    }, 1500);
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
    padding: 15px;
    font-weight: bolder;
  }

  .el-row {
    padding: 0
  }

  .tabletitle {
    margin: 20px 0;
  }

</style>
