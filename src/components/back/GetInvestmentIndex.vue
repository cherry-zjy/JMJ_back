<template>
  <div>
    <el-breadcrumb separator="|" class="crumb">
      <el-breadcrumb-item :to="{ path: '/' }">后台管理</el-breadcrumb-item>
      <el-breadcrumb-item>广告列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--检索条-->
    <el-col class="toolbar" style="padding-top: 15px;" v-if="!change">
      <el-select v-model="filters.type" placeholder="类型">
        <el-option v-for="item in type" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <!-- <el-button type="primary" @click="getInfo()">查询</el-button> -->
      <el-tag v-if="filters.type == 1"><span @click="filters.pageIndex = 1;filters.state = 1;getInfo()" class="cursur">首页广告上架：{{adverup}}</span></el-tag>
      <el-tag v-if="filters.type == 1"><span @click="filters.pageIndex = 1;filters.state = 2;getInfo()" class="cursur">首页广告下架：{{adverdown}}</span></el-tag>
      <el-tag v-if="filters.type == 2"><span @click="filters.pageIndex = 1;filters.state = 1;getInfo()" class="cursur">配对广告上架：{{adverup}}</span></el-tag>
      <el-tag v-if="filters.type == 2"><span @click="filters.pageIndex = 1;filters.state = 2;getInfo()" class="cursur">配对广告下架：{{adverdown}}</span></el-tag>
      <el-tag v-if="filters.type == 0"><span @click="filters.pageIndex = 1;filters.state = 1;getInfo()" class="cursur">欢迎页广告上架：{{adverup}}</span></el-tag>
      <el-tag v-if="filters.type == 0"><span @click="filters.pageIndex = 1;filters.state = 2;getInfo()" class="cursur">欢迎页广告下架：{{adverdown}}</span></el-tag>
      <el-form :inline="true" style="float:right">
        <el-form-item>
          <el-button type="primary" @click="handleAdd()">新增</el-button>
        </el-form-item>

      </el-form>
    </el-col>

    <!-- table 内容 -->
    <el-table :data="List" style="width: 100%" :border='true' v-if="!change">
      <el-table-column label="广告标题" prop="Title">
      </el-table-column>
      <el-table-column label="广告图" prop="Image" width="250">
        <template slot-scope="scope">
          <img :src="mainurl+scope.row.Image" width="200" height="150" @click="handlePictureCardPreview(scope.row.Image)" />
        </template>
      </el-table-column>
      <el-table-column label="广告类型" prop="Type" :formatter="typeText">
      </el-table-column>
      <el-table-column label="投放人姓名" prop="Name">
      </el-table-column>
      <el-table-column label="发布时间" prop="CreateTime">
      </el-table-column>
      <el-table-column label="到期时间" prop="ExpiryTime" :formatter="timefilterHandler">
      </el-table-column>
      <el-table-column label="状态" prop="State" :formatter="statefilterHandler">
      </el-table-column>
      <el-table-column label="广告点击次数" prop="ClicksNumber">
      </el-table-column>
      <el-table-column label="排序" prop="Sequence">
        <template slot-scope="scope">
          {{scope.row.Sequence}}
          <el-button type="primary" icon="el-icon-edit" circle @click="editseq(scope.row.Sequence,scope.row.ID)"></el-button>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="del(scope.row.ID)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="block" v-if="!change">
      <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next,jumper" :page-count="pageCount">
      </el-pagination>
    </div>

    <el-main v-if="change">

      <el-form :model="getList" ref="getList" label-width="150px" class="demo-ruleForm" :rules="rules" style="width:70%">
        <el-form-item>
          <el-button type="primary" @click="change = false" style="float:right">返回</el-button>
        </el-form-item>
        <el-form-item label="广告标题" prop="Title">
          <el-input v-model="getList.Title"></el-input>
        </el-form-item>
        <el-form-item label="广告类型" prop="Type">
          <el-select v-model="getList.Type" placeholder="请选择类型">
            <el-option v-for="item in typeList" :key="item.value" :label="item.name" :value="item.type"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="投放人姓名" prop="Name">
          <el-input v-model="getList.Name"></el-input>
        </el-form-item>
        <el-form-item label="到期时间" prop="ExpiryTime">
          <el-date-picker type="date" placeholder="到期时间" v-model="getList.ExpiryTime" style="width: 100%;"></el-date-picker>
        </el-form-item>
        <el-form-item label="广告大图" prop="Image">
          <el-upload v-model="getList.Image" class="avatar-uploader" :action="action" :show-file-list="false"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="广告内容" prop="defaultMsg">
          <UEditor :defaultMsg='defaultMsg' :config='config' ref="ueditor"></UEditor>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('getList')" v-if="!add">修改</el-button>
          <el-button type="primary" @click="addForm('getList')" v-if="add">添加</el-button>
          <el-button @click="resetForm('getList')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-main>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>

    <el-dialog title="提示" :visible.sync="centerDialogVisible" width="30%" center>
      <el-input v-model="Sequence"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="seqhandle()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import qs from "qs"
  import UEditor from "../UEditor.vue";
  export default {
    data() {
      var checkdefaultMsg = (rule, value, callback) => {
        if (encodeURIComponent(this.$refs.ueditor.getUEContent()) == '') {
          callback(new Error("请输入广告内容"));
        } else {
          callback();
        }
      };
      return {
        List: [], //列表
        pageCount: 1,
        mainurl: "",
        filters: {
          pageIndex: 1,
          pageSize: 4,
          Token: getCookie("token"),
          type: '4',
          state: 0
        },
        adverdown:'',
        adverup:'',
        dialogImageUrl: '',
        Sequence: '',
        SequenceID: '',
        centerDialogVisible: false,
        change: false,
        typeList: [{
            name: "欢迎广告页",
            type: 0
          },
          {
            name: "首页间接广告位",
            type: 1
          },
          {
            name: "配对页广告位",
            type: 2
          },
          {
            name: "作品页广告位",
            type: 3
          }
        ],
        getList: {
          ExpiryTime: '',
          State: '',
          ID: '',
          Image: '',
          Name: '',
          Type: '',
          Title: '',
        },
        action: "",
        add: false,
        imageUrl: "",
        rules: {
          Image: [{
            required: true,
            message: "请上传图片",
            trigger: "blur"
          }],
          Name: [{
            required: true,
            message: '请输入投放人姓名',
            trigger: 'blur'
          }, ],
          Title: [{
            required: true,
            message: '请输入广告标题',
            trigger: 'blur'
          }, ],
          Type: [{
            required: true,
            message: '请选择广告类型',
            trigger: 'change'
          }],
          ExpiryTime: [{
            type: 'date',
            required: true,
            message: '请选择时间',
            trigger: 'change'
          }],
          defaultMsg: [{
            required: true,
            validator: checkdefaultMsg
          }],
          type: [{
            value: '0',
            label: '是否审核通过（全部）'
          }, {
            value: '1',
            label: '审核未通过'
          }, {
            value: '2',
            label: '审核通过'
          }],
        },
        type: [{
          value: '4',
          label: '类型（全部）'
        }, {
          value: '0',
          label: '欢迎广告页'
        }, {
          value: '1',
          label: '首页间接广告位'
        }, {
          value: '2',
          label: '配对页广告位'
        }, {
          value: '3',
          label: '作品页广告位'
        }],
        defaultMsg: "这里是初始化内容",
        config: {
          initialFrameWidth: null,
          initialFrameHeight: 500
        },
        dialogVisible: false
      };
    },
    computed: {
      filterstype() {
        return this.filters.type
      }
    },
    watch: {
      filterstype: function (newQuestion, oldQuestion) {
        if (newQuestion !== oldQuestion) {
          this.filters.pageIndex = 1;
          this.filters.state = 0
          this.getInfo()
          if (newQuestion == 0) {
            this.getadver(1)
          } else if (newQuestion == 1) {
            this.getadver(2)
          } else if (newQuestion == 2) {
            this.getadver(3)
          }
        }
      },
    },
    components: {
      UEditor
    },
    mounted() {
      this.mainurl = mainurl;
      this.action = this.mainurl + "/api/Photo/UpdateForImage?type=0",
        this.getInfo();
    },
    methods: {
      getadver(type) {
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        this.$http
          .get("api/Back_PlatformManager/GetAdverTypeUpDown", {
            params: {
              type: type,
            }
          })
          .then(
            function (response) {
              loading.close();
              var status = response.data.Status;
              if (status === 1) {
                this.adverdown = response.data.Result.Down
                this.adverup = response.data.Result.Up
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
      timefilterHandler(row) {
        var ExpiryTime = row.ExpiryTime;
        ExpiryTime = ExpiryTime.substring(0, 10);
        return ExpiryTime
      },
      typeText(row, Type) {
        var type = row[Type.property];
        switch (type) {
          case 0:
            return (type = "欢迎广告页");
            break;
          case 1:
            return (type = "首页间接广告位");
            break;
          case 2:
            return (type = "配对页广告位");
            break;
          case 3:
            return (type = "作品页广告位");
            break;
          default:
            break;
        }
      },
      statefilterHandler(row, State) {
        var State = row[State.property];
        switch (State) {
          case 0:
            return (State = "上架");
            break;
          case 1:
            return (State = "下架");
            break;
        }
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
        this.getList.Image = res.Result[0];
      },
      beforeAvatarUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error("上传头像图片大小不能超过 2MB!");
        }
        return isLt2M;
      },
      //图片放大
      handlePictureCardPreview(url) {
        this.dialogImageUrl = this.mainurl + url;
        this.dialogVisible = true;
      },
      editseq(seq, id) {
        this.centerDialogVisible = true;
        this.Sequence = seq;
        this.SequenceID = id
      },
      seqhandle() {
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        this.$http
          .get("api/Back_PlatformManager/OrderAdver", {
            params: {
              Token: getCookie("token"),
              advID: this.SequenceID,
              sequence: this.Sequence
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
                this.centerDialogVisible = false,
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
      // 修改提交
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            //判断是否填写完整  --true
            this.$confirm("确认提交吗？", "提示", {}).then(() => {
              var para = Object.assign({}, this.getList);
              const loading = this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
              });
              var content = this.$refs.ueditor.getUEContent();
              // 发保存请求
              this.$http
                .post("api/Back_PlatformManager/EditBannerList",
                  qs.stringify({
                    Token: getCookie("token"),
                    InvestID: para.ID,
                    Type: para.Type,
                    Image: para.Image,
                    Name: para.Name,
                    // Url: para.Url,
                    Title: para.Title,
                    ExpiryTime: para.ExpiryTime,
                    Ueditor: encodeURIComponent(content)
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
                      // 表单重置
                      this.$refs["getList"].resetFields();
                      this.getInfo();
                      this.change = false;
                      this.add = fasle;
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
            });
          }
        });
      },
      // 新增提交
      addForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            //判断是否填写完整  --true
            this.$confirm("确认提交吗？", "提示", {}).then(() => {
              var para = Object.assign({}, this.getList);
              console.log(para)
              const loading = this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
              });
              var content = this.$refs.ueditor.getUEContent();
              // 发保存请求
              this.$http
                .post("api/Back_PlatformManager/AddInvestment",
                  qs.stringify({
                    Token: getCookie("token"),
                    Type: para.Type,
                    Image: para.Image,
                    Name: para.Name,
                    // Url: para.Url,
                    Title: para.Title,
                    ExpiryTime: para.ExpiryTime,
                    Ueditor: encodeURIComponent(content)
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
                      // 表单重置
                      this.$refs["getList"].resetFields();
                      this.getInfo();
                      this.change = false;
                      this.add = fasle;
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
            });
          }
        });
      },
      //删除
      del(id) {
        this.$confirm('确认删除该广告?', '提示', {
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
            .get("api/Back_PlatformManager/DelBannerList", {
              params: {
                Token: getCookie("token"),
                bannerID: id,
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
      /*
        重置表单
        */
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      /*
           1、获取列表 渲染列表
           2、搜索关键字
           3、分页
        */
      getInfo() {
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        this.$http
          .get("api/Back_PlatformManager/GetInvestmentIndex", {
            params: this.filters
          })
          .then(
            function (response) {
              loading.close();
              var status = response.data.Status;
              if (status === 1) {
                this.List = response.data.Result.investList;
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
      //
      getUsers() {
        this.getInfo();
      },
      // 分页
      handleCurrentChange(val) {
        this.filters.pageIndex = val;
        this.getInfo();
      },
      //详情
      handleEdit(index, row) {
        console.log(Object.assign({}, row));
        var obj = Object.assign({}, row);
        this.getList = obj;
        this.getList.ExpiryTime = new Date(this.getList.ExpiryTime.substring(0, 10))
        this.imageUrl = this.mainurl + obj.Image;
        this.change = true;
        this.add = false;
        this.defaultMsg = decodeURIComponent(this.getList.Ueditor);
      },
      addSubmit() {
        var content = this.$refs.ueditor.getUEContent();
        this.editForm.Details = encodeURIComponent(content);
        console.log(this.editForm);
      },
      //新增
      handleAdd() {
        this.change = true;
        this.add = true;
        this.getList = {
          ExpiryTime: '',
          State: '',
          ID: '',
          Image: '',
          Name: '',
          Type: '',
          // Url: '',
          Title: '',
        };
        this.defaultMsg = '';
        this.imageUrl = '';
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

  .avatar-uploader .el-upload {
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .el-upload--text {
    width: 100%;
  }

  .avatar-uploader-icon {
    font-size: 32px;
    color: #8c939d;
    width: 317px;
    height: 178px;
    line-height: 178px;
    text-align: center;
    border: 1px dashed #8c939d;
  }

  .avatar {
    width: 100%;
  }

  #editor {
    height: 400px;
  }

</style>
