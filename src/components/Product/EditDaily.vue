<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/DailyList' }">每日团购列表</el-breadcrumb-item>
      <el-breadcrumb-item>修改每日团购</el-breadcrumb-item>
    </el-breadcrumb>

    <el-main>
      <el-form :model="getList" ref="getList" label-width="150px" class="demo-ruleForm" :rules="rules" style="width:70%">
        <p class="title">商品信息</p>
        <el-row>
          <el-col :span="12">
            <el-form-item label="商品名称" prop="prodName">
              <el-input v-model="getList.prodName"></el-input>
            </el-form-item>
            <el-form-item label="商品原价" prop="TeamBuyingPrice">
              <el-input v-model="getList.TeamBuyingPrice" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品售价" prop="prodPrice">
              <el-input v-model="getList.prodPrice" type="number"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品形式">
              <el-input disabled="disabled" value="每日团购"></el-input>
            </el-form-item>
            <el-form-item label="活动时间">
              <el-date-picker v-model="time" value-format="yyyy-MM-dd" @change="getSTime" format="yyyy-MM-dd" type="daterange"
                start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
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
              <el-select v-model="getList.classificationSecondID" placeholder="类型">
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
            <el-form-item label="一级总名称">
              <el-input v-model="getList.SpecTypeName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="二级总名称">
              <el-input v-model="getList.SpecTypeSecondName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div v-for="(item,index) in spce" :key="index">
          <p class="tabletitle">
            <img v-if="item.FirstImage" :src="mainurl+item.FirstImage" style="width:70px;height:70px;vertical-align: middle;" />
            一级规格名称：{{item.SpecName}}&nbsp;&nbsp;&nbsp;
            库存：{{item.Stock}}&nbsp;&nbsp;&nbsp;
            价格：{{item.Price}}&nbsp;&nbsp;&nbsp;
            商品编号：{{item.CommodityNumber}}&nbsp;&nbsp;&nbsp;
            商品条形码：{{item.barCode}}&nbsp;&nbsp;&nbsp;
            <el-button size="mini" type="warning" @click="handleAdd(index)" style="float:right">新增二级规格</el-button>
            <el-button size="mini" type="danger" plain icon="el-icon-edit" @click="EditOne(index)">修改</el-button>
            <el-button size="mini" type="danger" plain icon="el-icon-delete" @click="DelOne(index)">删除</el-button>
          </p>
          <el-table style="width: 100%" :border='true' :data="item.specSecond">
            <el-table-column label="二级规格图片">
              <template slot-scope="scope" v-if="scope.row.SecondImage">
                <img :src="mainurl+scope.row.SecondImage" style="width:60px;height:60px" />
              </template>
            </el-table-column>
            <el-table-column label="二级规格名称" prop="SpecName">
            </el-table-column>
            <el-table-column label="库存" prop="Stock">
            </el-table-column>
            <el-table-column label="价格" prop="Price">
            </el-table-column>
            <el-table-column label="商品编号" prop="CommodityNumber">
            </el-table-column>
            <el-table-column label="商品条形码" prop="BarCode">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="danger" plain icon="el-icon-delete" @click="Del(index,scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <p class="title">商品详细信息</p>
        <el-row>
          <el-col :span="12">
            <el-form-item label="商品简介">
              <el-input type="textarea" v-model="getList.Introduce"></el-input>
            </el-form-item>
            <!-- <el-form-item label="预售商品">
              <el-switch v-model="getList.Isyushou"></el-switch>
            </el-form-item> -->
            <!-- <el-form-item label="折扣力度" prop="Salesvolume">
              <el-input v-model="getList.Salesvolume" disabled="disabled" v-if="!getList.Isyushou"></el-input>
              <el-input v-model="getList.Salesvolume" v-if="getList.Isyushou"></el-input>
            </el-form-item> -->
            <!-- <el-form-item label="身份验证">
              <el-switch v-model="getList.IsOutSourcing"></el-switch>
            </el-form-item> -->
            <el-form-item label="快递运费" prop="ExpressWay">
              <el-input v-model="getList.ExpressWay" style="width:120px" type="number"></el-input>元
            </el-form-item>
            <el-form-item label="快递模板" prop="FreightFormworkID">
              <el-select v-model="getList.FreightFormworkID" placeholder="运费模板">
                <el-option v-for="item in mubanList" :key="item.ID" :label="item.Name" :value="item.ID">
                </el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="商品库存">
              <el-input v-model="getList.Stock"></el-input>
            </el-form-item> -->
            <el-form-item label="赠送优惠券商品">
              <el-switch v-model="getList.Appoint"></el-switch>
            </el-form-item>
            <el-form-item label="上下架" prop="UppAndLow">
              <el-radio-group v-model="getList.UppAndLow">
                <el-radio :label="1">下架</el-radio>
                <el-radio :label="2">上架</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品销量">
              <el-input v-model="getList.Salesvolume" type="number"></el-input>
            </el-form-item>
            <!-- <el-form-item label="是否推荐">
              <el-switch v-model="getList.IsRecommended"></el-switch>
            </el-form-item> -->
            <el-form-item label="商品佣金" prop="Commission">
              <el-input v-model="getList.Commission" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品条形码">
              <el-input v-model="getList.BarCode"></el-input>
            </el-form-item>
            <el-form-item label="商品编码">
              <el-input v-model="getList.prodNumber"></el-input>
            </el-form-item>
            <el-form-item label="供应商编号">
               <el-input v-model="getList.SupplierNumber"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="bannerimg" label="轮播顶图">
              <el-upload class="upload-demo" :action="action" :on-preview="handlePreview" :on-remove="bannerhandleRemove"
                :file-list="bannerimg" :limit="6" list-type="picture-card" :on-success="bannerhandleAvatarSuccess"
                :before-upload="beforeAvatarUpload" multiple>
                <i class="el-icon-plus"></i>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过1MB,最多可上传6张</div>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品海报">
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
          <el-button type="primary" class="editbtn" @click="submitFormwork('getList')">修改</el-button>
        </el-form-item>
      </el-form>
    </el-main>
    <!-- 模态框 -->
    <el-dialog title="新增一级分类名称" :visible.sync="dialogFormVisible1" width="50%">
      <el-form :model="AddForm" :rules="addrules" ref="AddForm" label-width="150px" class="demo-editForm"
        label-position="left">
        <el-form-item label="一级规格图片">
          <el-upload v-model="AddForm.FirstImage" class="avatar-uploader" :action="action" :show-file-list="false"
            :on-success="handleFirstSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="FirstImage" :src="FirstImage" class="avatar" width="200">
            <div v-else class="el-upload el-upload--picture-card">
              <i class="el-icon-plus"></i>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="一级规格名称" prop="SpecName">
          <el-input v-model="AddForm.SpecName"></el-input>
        </el-form-item>
        <el-form-item label="库存" prop="Stock">
          <el-input v-model="AddForm.Stock"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="Price">
          <el-input v-model="AddForm.Price"></el-input>
        </el-form-item>
        <el-form-item label="商品编号" prop="CommodityNumber">
          <el-input v-model="AddForm.CommodityNumber"></el-input>
        </el-form-item>
        <el-form-item label="商品条形码">
          <el-input v-model="AddForm.barCode"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="submitOneForm('AddForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 模态框 -->
    <el-dialog title="新增二级规格名称" :visible.sync="dialogFormVisible" width="50%">
      <el-form :model="editForm" :rules="listrules" ref="editForm" label-width="150px" class="demo-editForm"
        label-position="left">
        <el-form-item label="二级规格图片">
          <el-upload v-model="editForm.SecondImage" class="avatar-uploader" :action="action" :show-file-list="false"
            :on-success="handleSecondSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="SecondImage" :src="SecondImage" class="avatar" width="200">
            <div v-else class="el-upload el-upload--picture-card">
              <i class="el-icon-plus"></i>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="二级规格名称" prop="SpecName">
          <el-input v-model="editForm.SpecName"></el-input>
        </el-form-item>
        <el-form-item label="库存" prop="Stock">
          <el-input v-model="editForm.Stock"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="Price">
          <el-input v-model="editForm.Price" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品编号" prop="CommodityNumber">
          <el-input v-model="editForm.CommodityNumber"></el-input>
        </el-form-item>
        <el-form-item label="商品条形码">
          <el-input v-model="editForm.BarCode"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('editForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 模态框 -->
    <el-dialog title="修改一级分类名称" :visible.sync="dialogFormVisible2" width="50%">
      <el-form :model="editoneForm" :rules="editoneFormrules" ref="editoneForm" label-width="150px" class="demo-editForm"
        label-position="left">
        <el-form-item label="一级规格图片">
          <el-upload v-model="editoneForm.FirstImage" class="avatar-uploader" :action="action" :show-file-list="false"
            :on-success="handleFirstSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="FirstImage" :src="FirstImage" class="avatar" width="200">
            <div v-else class="el-upload el-upload--picture-card">
              <i class="el-icon-plus"></i>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="一级规格名称" prop="SpecName">
          <el-input v-model="editoneForm.SpecName"></el-input>
        </el-form-item>
        <el-form-item label="库存" prop="Stock">
          <el-input v-model="editoneForm.Stock"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="Price">
          <el-input v-model="editoneForm.Price"></el-input>
        </el-form-item>
        <el-form-item label="商品编号" prop="CommodityNumber">
          <el-input v-model="editoneForm.CommodityNumber"></el-input>
        </el-form-item>
        <el-form-item label="商品条形码">
          <el-input v-model="editoneForm.barCode"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="submiteditForm('editoneForm')">确 定</el-button>
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
      var checkeditFirstImage = (rule, value, callback) => {
        if (this.FirstImage == '') {
          callback(new Error("请上传一级规格图片"));
        } else {
          callback();
        }
      };
      var checkClassification = (rule, value, callback) => {
        if (this.getList.classificationSecondID == '' || this.getList.classificationSecondID == undefined) {
          callback(new Error("请选择商品分类"));
        } else {
          callback();
        }
      };
      var checkFirstImage = (rule, value, callback) => {
        if (this.FirstImage == '') {
          callback(new Error("请上传一级规格图片"));
        } else {
          callback();
        }
      };
      var checkSecondImage = (rule, value, callback) => {
        if (this.SecondImage == '') {
          callback(new Error("请上传二级规格图片"));
        } else {
          callback();
        }
      };
      var checktime = (rule, value, callback) => {
        if (this.time == '') {
          callback(new Error("请选择活动时间"));
        } else {
          callback();
        }
      };
      return {
        currentpage: 0,
        config: {
          initialFrameWidth: null,
          initialFrameHeight: 500
        },
        time: '',
        defaultMsg: "",
        dialogFormVisible: false,
        dialogFormVisible1: false,
        dialogFormVisible2: false,
        editindex:0,
        dialogVisible: false,
        //轮播图点击放大
        dialogImageUrl: '',
        imageUrl: '',
        FirstImage: '', //一级规格图片
        SecondImage: '', //二级规格图片
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
        //   SpeName: '一级规格名称1',
        //   specSecond: [{
        //     SecondSpecName: '二级规格名称1',
        //     Stock: '库存',
        //     Price: '价格',
        //     BarCode: '商品条形码',
        //     CommodityNumber: '商品编号',
        //   }, {
        //     SecondSpecName: '二级规格名称2',
        //     Stock: '库存',
        //     Price: '价格',
        //     BarCode: '商品条形码',
        //     CommodityNumber: '商品编号',
        //   }],
        // }], //一级规格
        getList: {
          IsOutSourcing: false,
          // Detail:'',
        },
        mainurl: '',
        editForm: [],
        addindex: '', //添加二级规格的index
        AddForm: {
          SpecName: '',
          Price: '',
          FirstImage: '',
          BarCode: '',
          CommodityNumber: '',
          Stock: '',
          specSecond: []
        },
        editoneForm: {
          SpecName: '',
          Price: '',
          FirstImage: '',
          BarCode: '',
          CommodityNumber: '',
          Stock: '',
          specSecond: []
        },
        addrules: {
          SpecName: [{
            required: true,
            message: '请输入一级规格名称',
            trigger: 'blur'
          }],
          FirstImage: [{
            required: true,
            validator: checkFirstImage
          }],
          Price: [{
            required: true,
            message: '请输入一级规格价格',
            trigger: 'blur'
          }],
          CommodityNumber: [{
            required: true,
            message: '请输入商品编号',
            trigger: 'blur'
          }],
          Stock: [{
            required: true,
            message: '请输入库存',
            trigger: 'blur'
          }],
        },
        editoneFormrules: {
          SpecName: [{
            required: true,
            message: '请输入一级规格名称',
            trigger: 'blur'
          }],
          FirstImage: [{
            required: true,
            validator: checkeditFirstImage
          }],
          Price: [{
            required: true,
            message: '请输入一级规格价格',
            trigger: 'blur'
          }],
          CommodityNumber: [{
            required: true,
            message: '请输入商品编号',
            trigger: 'blur'
          }],
          Stock: [{
            required: true,
            message: '请输入库存',
            trigger: 'blur'
          }],
        },
        listrules: {
          SecondImage: [{
            required: true,
            validator: checkSecondImage
          }],
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
          CommodityNumber: [{
            required: true,
            message: '请输入商品编号',
            trigger: 'blur'
          }],
          SpecName: [{
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
          prodName: [{
            required: true,
            message: '请输入商品名称',
            trigger: 'blur'
          }, ],
          time: [{
            required: true,
            validator: checktime
          }],
          prodNumber: [{
            required: true,
            message: '请输入商品编码',
            trigger: 'change'
          }, ],
          TeamBuyingPrice: [{
            required: true,
            message: '请输入商品原价',
            trigger: 'blur'
          }, ],
          prodPrice: [{
            required: true,
            message: '请输入商品售价',
            trigger: 'blur'
          }, ],
          ClassificationSecondID: [{
            required: true,
            validator: checkClassification
          }],
          SpecTySecondName: [{
            required: true,
            message: '请输入二级总名称',
            trigger: 'blur'
          }, ],
          SpecTypeName: [{
            required: true,
            message: '请输入一级总名称',
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
          SupplierNumber: [{
            required: true,
            message: '请输入供应商编号',
            trigger: 'blur'
          }, ],
          UppAndLow: [{
            required: true,
            message: '请选择上下架',
            trigger: 'change'
          }, ],
          bannerimg: [{
            required: true,
            validator: checkbannerimg
          }],
          ProdPoster: [{
            required: true,
            validator: checkLogo
          }],
          ExpressWay: [{
            required: true,
            message: '请输入运费快递',
            trigger: 'blur'
          }, ],
          FreightFormworkID: [{
            required: true,
            message: '请输入快递模板',
            trigger: 'change'
          }, ],
        },
      };
    },
    components: {
      UEditor
    },
    mounted() {
      this.currentpage = window.location.href.split("&page=")[1]
      console.log(this.currentpage)
      this.mainurl = mainurl
      this.action = this.mainurl + "/api/UploadPhotos/UpdateForImage";
      this.getType();
      this.getmuban();
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
          .get("api/Back_ProductManage/ProductEditDetail", {
            params: {
              type: 1,
              id: window.location.href.split("id=")[1].split("&")[0],
              Token: getCookie("token"),
            }
          })
          .then(
            function (response) {
              loading.close();
              var status = response.data.Status;
              if (status === 1) {
                this.getList = response.data.Result;
                this.changeclassification()
                if(response.data.Result.ProdPoster == '' || response.data.Result.ProdPoster == null){
                  this.imageUrl = ""
                } else {
                  this.imageUrl = mainurl + response.data.Result.ProdPoster;
                }
                // var imgarr = Array();
                var imgarr = response.data.Result.Image.split(',')
                console.log(imgarr)
                for (let i = 0; i < imgarr.length; i++) {
                  let arr = Array();
                  arr = {
                    url: this.mainurl + imgarr[i]
                  }
                  this.bannerimg.push(arr)
                  this.addbannerimg.push(imgarr[i])
                }
                this.spce = response.data.Result.specification;
                this.defaultMsg = decodeURIComponent(response.data.Result.Detail);
                if (response.data.Result.startTime && response.data.Result.endTime) {
                  this.time = [response.data.Result.startTime.substring(0, 10), response.data.Result.endTime.substring(
                    0,
                    10)]
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
      getSTime(val) {
        console.log(val)
        this.time = val;
      },
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
      getSTime(val) {
        console.log(val)
        this.time = val;
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
        console.log(this.addbannerimg)
        console.log(this.bannerimg)
      },
      handleFirstSuccess(res, file) {
        this.FirstImage = URL.createObjectURL(file.raw);
        this.AddForm.FirstImage = res.Result[0];
        this.editoneForm.FirstImage = res.Result[0];
      },
      handleSecondSuccess(res, file) {
        this.SecondImage = URL.createObjectURL(file.raw);
        this.editForm.SecondImage = res.Result[0];
      },
      //海报大图
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
        this.getList.ProdPoster = res.Result[0];
      },
      //批量上传图片
      bannerhandleRemove(file, fileList) {
        //获取删除的图片地址，在addbannerimg中对应删除
        console.log(file)
        let file1 = file.url
        for (let i = 0; i < this.addbannerimg.length; i++) {
          if (this.mainurl + this.addbannerimg[i] == file1) {
            this.addbannerimg.splice(i, 1)
          }
        }
      },
      beforeAvatarUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 1;
        if (!isLt2M) {
          this.$message.error("上传图片大小不能超过 1MB!");
        }
        return isLt2M;
      },
      //新增二级规格
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.spce[this.addindex].specSecond.push({
              SpecName: this.editForm.SpecName,
              SecondImage: this.editForm.SecondImage,
              Stock: this.editForm.Stock,
              Price: this.editForm.Price,
              BarCode: this.editForm.BarCode,
              CommodityNumber: this.editForm.CommodityNumber,
            });
            this.dialogFormVisible = false
          }
        });
      },
      //新增一级规格
      submitOneForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.AddForm = {
              SpecName: this.AddForm.SpecName,
              FirstImage: this.AddForm.FirstImage,
              Price: this.AddForm.Price,
              BarCode: this.AddForm.BarCode,
              CommodityNumber: this.AddForm.CommodityNumber,
              Stock: this.AddForm.Stock,
              specSecond: []
            }
            this.spce.push(this.AddForm)
            console.log(this.spce)
            this.dialogFormVisible1 = false
            this.AddForm = {
              SpecName: '',
              FirstImage: '',
              Price: '',
              BarCode: '',
              CommodityNumber: '',
              Stock: '',
              specSecond: []
            }
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
      EditOne(index) {
        this.editindex = index
        this.editoneForm = this.spce[index]
        this.editoneForm.BarCode = this.spce[index].barCode
        this.FirstImage = mainurl + this.spce[index].FirstImage
        this.dialogFormVisible2 = true
      },
      submiteditForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log(this.editoneForm)
            this.spce[this.editindex] = this.editoneForm
            // this.spce[this.editindex].barCode = this.AddForm.BarCode
            // this.spce[this.editindex].FirstImage = this.AddForm.FirstImage 
            this.dialogFormVisible2 = false
          } else {
            this.$message({
              showClose: true,
              type: "warning",
              message: '请完善信息'
            });
            return false;
          }
        });
      },
      Del(pindex, index) {
        this.spce[pindex].specSecond.splice(index, 1)
      },
      handleAdd(index) {
        this.SecondImage = ''
        this.editForm = [];
        this.addindex = index
        this.dialogFormVisible = true
      },
      handleAddOne() {
        this.FirstImage = ''
        this.AddForm = {
          SpecName: '',
          Price: '',
          FirstImage: '',
          BarCode: '',
          CommodityNumber: '',
          Stock: '',
          specSecond: []
        }
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
            if (this.spce.length == 0) {
              this.$message({
                showClose: true,
                type: "warning",
                message: '一级规格不能为空'
              });
              return;
            }
            for (let i = 0; i < this.spce.length; i++) {
              delete this.spce[i].FirstPrice
              this.spce[i].Stock = this.spce[i].Stock == '' ? -1 : this.spce[i].Stock
              this.spce[i].CommodityNumber = this.spce[i].CommodityNumber == '' ? -1 : this.spce[i].CommodityNumber
              this.spce[i].BarCode = this.spce[i].BarCode == '' ? -1 : this.spce[i].BarCode
              for (let y = 0; y < this.spce[i].specSecond.length; y++) {
                console.log(this.spce[i].specSecond[y])
                this.spce[i].specSecond[y].prodNumber = this.spce[i].specSecond[y].CommodityNumber;
                this.spce[i].specSecond[y].SecondSpecName = this.spce[i].specSecond[y].SpecName;
                delete this.spce[i].specSecond[y].CommodityNumber
                delete this.spce[i].specSecond[y].SpecName
              }
            }
            var startTime = this.time[0].substring(0, 10)
            var endTime = this.time[1].substring(0, 10)
            console.log(this.spce)
            // return;
            var startTime = this.time[0].substring(0, 10)
            var endTime = this.time[1].substring(0, 10)
            const loading = this.$loading({
              lock: true,
              text: "Loading",
              spinner: "el-icon-loading",
              background: "rgba(0, 0, 0, 0.7)"
            });
            this.$http
              .post("api/Back_ProductManage/ProductEdit",
                qs.stringify({
                  token: getCookie("token"),
                  ID: window.location.href.split("id=")[1].split("&page")[0],
                  TeamBuyingPrice: this.getList.TeamBuyingPrice,
                  Name: this.getList.prodName,
                  prodPrice: this.getList.prodPrice,
                  Classification: this.getList.classificationID,
                  ClassificationSecond: this.getList.classificationSecondID,
                  specs: this.spce,
                  SpecTypeName: this.getList.SpecTypeName !== '' ? this.getList.SpecTypeName : -1,
                  SpecTypeSecondName: this.getList.SpecTypeSecondName !== '' ? this.getList.SpecTypeSecondName : -1,
                  Introduce: this.getList.Introduce !== '' ? this.getList.Introduce : -1,
                  IsOutSourcing: this.getList.IsOutSourcing,
                  Salesvolume: this.getList.Salesvolume,
                  Commission: this.getList.Commission,
                  ExpressWay: this.getList.ExpressWay,
                  FreightNameID: this.getList.FreightFormworkID,
                  Image: banner,
                  ProdPoster: this.getList.ProdPoster !== '' ? this.getList.ProdPoster : -1,
                  Detail: encodeURIComponent(content),
                  OutDiscount: -1,
                  Ntegrate: -1,
                  NumOfMem: -1,
                  SignTimes: -1,
                  startTime:startTime,
                  endTime:endTime,
                  IsRecommended:this.getList.IsRecommended,
                  // Stock:this.getList.Stock !== '' ? this.getList.Stock : -1,
                  BarCode:this.getList.BarCode !== '' ? this.getList.BarCode : -1,
                  ProdCode:this.getList.prodNumber !== '' ? this.getList.prodNumber : -1,
                  Appoint:this.getList.Appoint,
                  SupplierNumber:this.getList.SupplierNumber !== '' ? this.getList.SupplierNumber : -1,
                  UppAndLow:this.getList.UppAndLow,
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
                        path: "/DailyList?page=" + window.location.href.split("&page=")[1]
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
            this.$message({
              showClose: true,
              type: "warning",
              message: '请完善信息'
            });
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

  .editbtn {
    position: fixed;
    right: 5%;
    top: 15%
  }

</style>
