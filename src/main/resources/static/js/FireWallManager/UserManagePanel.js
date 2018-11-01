/**
 * Created by Administrator on 2018/10/24.
 */
Ext.onReady(function() {
    Ext.define("FireWallManager.model.User", {
        extend: "Ext.data.Model",
        fields: [
            { name: 'id', type: 'string' },
            { name: 'name', type: 'string' },
            { name: 'password', type: 'string' },
            { name: 'type', type: 'string' },
            { name:'createTime',type:'string'},
            { name:'updateTime',type:'string'}
        ]
    });

    var userStore = Ext.create("Ext.data.Store", {
        model: "FireWallManager.model.User",
        autoLoad: true,
        //pageSize: 5,
        proxy: {
            type: "ajax",
            url: "/user/list",
            reader: {
                root: "rows"
            }
        }
    });
    var grid = Ext.create("Ext.grid.Panel", {
        xtype: "grid",
        title:'用户管理界面',
        store: userStore,
        width: 1280,
        height: 720,
        //margin: 30,
        columnLines: true,
        renderTo: Ext.getBody(),
        selModel: {
            injectCheckbox: 0,
            mode: "MULTI",     //"SINGLE"/"SIMPLE"/"MULTI"
            checkOnly: true     //只能通过checkbox选择
        },
        selType: "checkboxmodel",
        columns: [
            { dataIndex: 'id',  text: 'ID'},
            { dataIndex: 'name', text: '用户名' , editor: "textfield"},
            { dataIndex: 'password', text: '用户密码' , editor: "textfield"},
            { dataIndex: 'type', text: '用户类型' , editor: "textfield"},
            { text: '创建时间', dataIndex: 'createTime',renderer:function(val){
                if(val){
                    var date = Date.parse(val.replace('T',' ') );
                    return new Date(date).toLocaleString()
                }

            } },
            { text: '更新时间', dataIndex: 'updateTime',renderer:function(val){
                if(val){
                    var date = Date.parse(val.replace('T',' ') );
                    return new Date(date).toLocaleString()
                }

            } },

        ],
        plugins: [
            Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit: 1
            })
        ],
        listeners: {
            itemdblclick: function (me, record, item, index, e, eOpts) {
                //双击事件的操作
                {
                    console.log(record)

                    //创建window
                    let win = Ext.create("Ext.window.Window", {
                        id: "UserAddWindow",
                        title: "编辑",
                        width: 300,
                        height: 400,
                        layout: "fit",
                        items: [
                            {
                                xtype: "form",
                                
                                defaults: {
                                    anchor: '100%'
                                },
                                fieldDefaults: {
                                    labelWidth: 80,
                                    labelAlign: "left",
                                    flex: 1,
                                    margin: 5
                                },
                                items: [
                                    {
                                        xtype: "container",
                                        layout: "vbox",
                                        items: [
                                            {
                                                xtype: "combobox",
                                                id:'ip_add_type',
                                                fieldLabel: "类型",
                                                store: {
                                                    xtype:'store',
                                                    fields: ["Name", "Value"],
                                                    data: [
                                                        { Name: "管理员", Value:'manager' },
                                                        { Name: "普通用户", Value: 'user' }
                                                    ]
                                                },
                                                editable: false,
                                                displayField: "Name",
                                                valueField: "Value",
                                                emptyText: "--请选择--",
                                                queryMode: "local",
                                                editable:true,
                                                anyMatch: true,
                                                value:record.raw.type
                                            },
                                            { id: 'ip_add_name', fieldLabel: '用户名' , xtype: "textfield",value:record.raw.name},
                                            { id: 'ip_add_password', fieldLabel: '密码' , xtype: "textfield",value:record.raw.password},

                                        ]
                                    }
                                ]
                            }
                        ],
                        buttons: [
                            { xtype: "button", text: "确认",
                                handler: function ()
                                {

                                let ip_add_name=Ext.getCmp('ip_add_name').getValue();
                                let ip_add_password=Ext.getCmp('ip_add_password').getValue();
                                let ip_add_type=Ext.getCmp('ip_add_type').getValue();

                                Ext.Ajax.request({
                                    url: '/user/save',
                                    params: {
                                        data:JSON.stringify({
                                            id:record.raw.id,
                                            createTime:record.raw.createTime,
                                            name:ip_add_name,
                                            password:ip_add_password,
                                            type:ip_add_type
                                        })
                                    },
                                    method: 'POST',
                                    success: function (response, options) {
                                        let result=Ext.decode(response.responseText);
                                        if(result.success){
                                            Ext.MessageBox.alert('成功', '成功 ');
                                            ipStore.reload(true)
                                        }else{
                                            Ext.MessageBox.alert('失败', result['message'] );

                                        }

                                    },
                                    failure: function (response, options) {
                                        Ext.MessageBox.alert('失败', '请求超时或网络故障,错误编号：' + response.status);
                                    }
                                });
                                this.up("window").close();
                            } },
                            { xtype: "button", text: "取消", handler: function () { this.up("window").close(); } }
                        ]
                    });
                    win.show()
                }
            }
        },
        tbar:[
            {
                xtype:'button',
                text:'添加',
                handler:function(){
                    //创建window
                    let win = Ext.create("Ext.window.Window", {
                        id: "IPAddWindow",
                        title: "添加",
                        width: 300,
                        height: 600,
                        layout: "fit",
                        items: [
                            {
                                xtype: "form",
                                defaultType: 'textfield',
                                defaults: {
                                    anchor: '100%'
                                },
                                fieldDefaults: {
                                    labelWidth: 80,
                                    labelAlign: "left",
                                    flex: 1,
                                    margin: 5
                                },
                                items: [
                                    {
                                        xtype: "container",
                                        layout: "vbox",
                                        items: [
                                            {
                                                xtype: "container",
                                                layout: "vbox",
                                                items: [
                                                    {
                                                        xtype: "combobox",
                                                        id:'ip_add_type',
                                                        fieldLabel: "类型",
                                                        store: {
                                                            xtype:'store',
                                                            fields: ["Name", "Value"],
                                                            data: [
                                                                { Name: "管理员", Value:'manager' },
                                                                { Name: "普通用户", Value: 'user' }
                                                            ]
                                                        },
                                                        editable: false,
                                                        displayField: "Name",
                                                        valueField: "Value",
                                                        emptyText: "--请选择--",
                                                        queryMode: "local",
                                                        editable:true,
                                                        anyMatch: true,

                                                    },
                                                    { id: 'ip_add_name', fieldLabel: '用户名' , xtype: "textfield"},
                                                    { id: 'ip_add_password', fieldLabel: '密码' , xtype: "textfield"},

                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ],
                        buttons: [
                            { xtype: "button", text: "确定", handler: function ()
                            {

                                let ip_add_name=Ext.getCmp('ip_add_name').getValue();
                                let ip_add_password=Ext.getCmp('ip_add_password').getValue();
                                let ip_add_type=Ext.getCmp('ip_add_type').getValue();

                                Ext.Ajax.request({
                                    url: '/user/save',
                                    params: {
                                        data:JSON.stringify({

                                            name:ip_add_name,
                                            password:ip_add_password,
                                            type:ip_add_type
                                        })
                                    },
                                    method: 'POST',
                                    success: function (response, options) {
                                        let result=Ext.decode(response.responseText);
                                        if(result.success){
                                            Ext.MessageBox.alert('成功', '成功 ');
                                            userStore.reload(true)
                                        }else{
                                            Ext.MessageBox.alert('失败', result['message'] );

                                        }

                                    },
                                    failure: function (response, options) {
                                        Ext.MessageBox.alert('失败', '请求超时或网络故障,错误编号：' + response.status);
                                    }
                                });
                                this.up("window").close();
                            } },
                            { xtype: "button", text: "取消", handler: function () { this.up("window").close(); } }
                        ]
                    });
                    win.show()
                }

            },
            {
                xtype:'button',
                text:'删除',
                handler:function(){
                    let selectedData=grid.getSelectionModel().getSelection()[0]['data'];
                    console.log(selectedData);
                    let uuid=selectedData['id'];
                    Ext.MessageBox.show({
                        title: "提示",
                        msg: "是否删除"+selectedData.name,
                        //animal: "id1",
                        buttons: Ext.MessageBox.YESNO,
                        //multiline: true,
                        //prompt: true,
                        width: 300,
                        height: 100,
                        modal: true,
                        closable: true,
                        progress: true,
                        icon: Ext.Msg.INFO,
                        fn: function (button) {
                            if(button=='yes'){
                                Ext.Ajax.request({
                                    url:'/user/delete',
                                    params: {
                                        uuid: uuid
                                    },
                                    method: 'POST',
                                    success: function (response, options) {
                                        userStore.reload(true)
                                        Ext.MessageBox.alert('成功', '成功 ');
                                    },
                                    failure: function (response, options) {
                                        Ext.MessageBox.alert('失败', '请求超时或网络故障,错误编号：' + response.status);
                                    }
                                })
                            }
                        }
                    });


                }
            },
            {
                xtype:'button',
                text:'刷新',
                handler:function(){
                    userStore.reload(true)
                }
            },
            {
                xtype:'button',
                text:'登出',
                handler:function(){

                    Ext.MessageBox.show({
                        title: "提示",
                        msg: "是否登出",
                        //animal: "id1",
                        buttons: Ext.MessageBox.YESNO,
                        //multiline: true,
                        //prompt: true,
                        width: 300,
                        height: 100,
                        modal: true,
                        closable: true,
                        progress: true,
                        icon: Ext.Msg.INFO,
                        fn: function (button) {
                            if(button=='yes'){
                                Ext.Ajax.request({
                                    url:'/user/logout',
                                    method: 'POST',
                                    success: function (response, options) {

                                        Ext.MessageBox.alert('成功', '成功 ');
                                        window.location.href="/FireWallManager/Login.html"
                                    },
                                    failure: function (response, options) {
                                        Ext.MessageBox.alert('失败', '请求超时或网络故障,错误编号：' + response.status);
                                    }
                                })
                            }
                        }
                    });


                }
            },
            {xtype:'textfield',id:'query'},
            {xtype:'button',text:'查询',handler:()=>{
                let query=Ext.getCmp('query').getValue();
                userStore.filterBy((record)=>{
                    let exist=false;
                    if(JSON.stringify(record.raw).indexOf(query)!=-1){
                        //console.log(query)
                        //console.log(JSON.stringify(record.raw).indexOf(query))
                        //console.log(JSON.stringify(record.raw))
                        exist=true;
                    }
                    return exist;
                });
            }},

        ]
    });
});