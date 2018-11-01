/**
 * Created by Administrator on 2018/10/24.
 */
Ext.onReady(function() {
    Ext.define("FireWallManager.model.IP", {
        extend: "Ext.data.Model",
        fields: [
            { name: 'ip_id', type: 'string' },
            { name: 'ipAddress', type: 'string' },
            { name: 'ipAddressStart', type: 'string' },
            { name: 'ipAddressEnd', type: 'string' },
            { name: 'type', type: 'string' },
            { name: 'name', type: 'string' },
            { name: 'department', type: 'string' },
            { name: 'comment', type: 'string' },
            { name:'createTime',type:'string'},
            { name:'updateTime',type:'string'}
        ],
        hasMany:[{model:"MyApp.model.IPClass",name:"ipClasses"}]
    });
    Ext.define("FireWallManager.model.IPClass", {
        extend: "Ext.data.Model",
        fields: [
            { name: 'ip_class_id', type: 'string' },
            { name: 'name', type: 'string' },
            { name: 'department', type: 'string' },
            { name: 'comment', type: 'string' },
            { name:'createTime',type:'string'},
            { name:'updateTime',type:'string'}
        ],
        hasMany:[
            {
                model:"MyApp.model.Strategy",
                name:"sourceStrategies"
            },
            {
                model:"MyApp.model.Strategy",
                name:"targetStrategies"
            },
            {
                model:"MyApp.model.IP",
                name:"ips"
            },


        ]
    });
    Ext.define("FireWallManager.model.Port", {
        extend: "Ext.data.Model",
        fields: [
            { name: 'port_id', type: 'string' },
            { name: 'port', type: 'string' },
            { name: 'name', type: 'string' },
            { name: 'comment', type: 'string' },
            { name:'createTime',type:'string'},
            { name:'updateTime',type:'string'}
        ],
        hasMany:[{model:"MyApp.model.Strategy",name:"targetStrategies"}]
    });
    Ext.define("FireWallManager.model.Strategy", {
        extend: "Ext.data.Model",
        fields: [
            { name: 'strategy_id', type: 'string' },
            { name: 'department', type: 'string' },
            { name: 'type', type: 'string' },
            { name: 'name', type: 'string' },
            { name: 'comment', type: 'string' },
            { name:'createTime',type:'string'},
            { name:'updateTime',type:'string'}
        ],
        hasMany:
            [
            {
                model:"MyApp.model.IP",
                name:"sourceIps"
            },
            {
                model:"MyApp.model.IP",
                name:"targetIps"
            },
            {
                model:"MyApp.model.IPClass",
                name:"sourceIpClasses"
            },
            {
                model:"MyApp.model.IPClass",
                name:"targetIpClasses"
            },
            {
                model:"MyApp.model.Port",
                name:"targetPorts"
            },


        ]
    });
    var ipStore = Ext.create("Ext.data.Store", {
        model: "FireWallManager.model.IP",
        autoLoad: true,
        //pageSize: 5,
        proxy: {
            type: "ajax",
            url: "/ip/list",
            reader: {
                root: "rows"
            }
        }
    });
    var grid = Ext.create("Ext.grid.Panel", {
        xtype: "grid",
        title:'IP管理界面',
        store: ipStore,
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
            { dataIndex: 'ip_id',  text: 'ID'},
            { dataIndex: 'ipAddress', text: 'IP地址' , editor: "textfield"},
            { dataIndex: 'ipAddressStart', text: '起始IP地址' , editor: "textfield"},
            { dataIndex: 'ipAddressEnd', text: '结束IP地址' , editor: "textfield"},
            { dataIndex: 'type', text: '地址类型' , editor: "textfield"},
            { dataIndex: 'name', text: '业务' , editor: "textfield"},
            { dataIndex: 'department', text: '部门', editor: "textfield" },
            { dataIndex: 'comment', text: '备注', editor: "textfield" },
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
                        id: "IPClassAddWindow",
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
                                                        { Name: "IP地址", Value:'Single' },
                                                        { Name: "IP地址段", Value: 'Multi' }
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
                                            { id: 'ip_add_ipAddress', fieldLabel: 'IP地址' , xtype: "textareafield",value:record.raw.ipAddress},
                                            { id: 'ip_add_ipAddressStart', fieldLabel: '起始IP地址' , xtype: "textfield",value:record.raw.ipAddressStart},
                                            { id: 'ip_add_ipAddressEnd', fieldLabel: '结束IP地址' , xtype: "textfield",value:record.raw.ipAddressEnd},
                                            { id: 'ip_add_name', fieldLabel: '业务' , xtype: "textfield",value:record.raw.name},
                                            { id: 'ip_add_department', fieldLabel: '部门',xtype: "textfield",value:record.raw.department},
                                            { id: 'ip_add_comment', fieldLabel: '备注', xtype: "textfield",value:record.raw.comment },
                                        ]
                                    }
                                ]
                            }
                        ],
                        buttons: [
                            { xtype: "button", text: "确认", handler: function () {

                                let ip_add_name=Ext.getCmp('ip_add_name').getValue();
                                let ip_add_department=Ext.getCmp('ip_add_department').getValue();
                                let ip_add_comment=Ext.getCmp('ip_add_comment').getValue();
                                let ip_add_ipAddress=Ext.getCmp('ip_add_ipAddress').getValue();
                                let ip_add_ipAddressStart=Ext.getCmp('ip_add_ipAddressStart').getValue();
                                let ip_add_ipAddressEnd=Ext.getCmp('ip_add_ipAddressEnd').getValue();
                                let ip_add_type=Ext.getCmp('ip_add_type').getValue();

                                Ext.Ajax.request({
                                    url: '/ip/save',
                                    params: {
                                        data:JSON.stringify({
                                            ip_id:record.raw.ip_id,
                                            createTime:record.raw.createTime,
                                            name:ip_add_name,
                                            department:ip_add_department,
                                            comment:ip_add_comment,
                                            ipAddress:ip_add_ipAddress,
                                            ipAddressStart:ip_add_ipAddressStart,
                                            ipAddressEnd:ip_add_ipAddressEnd,
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
                                                xtype: "combobox",
                                                id:'ip_add_type',
                                                fieldLabel: "类型",
                                                store: {
                                                    xtype:'store',
                                                    fields: ["Name", "Value"],
                                                    data: [
                                                        { Name: "IP地址", Value:'Single' },
                                                        { Name: "IP地址段", Value: 'Multi' }
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
                                            { id: 'ip_add_ipAddress',height:150, fieldLabel: 'IP地址' , xtype: "textareafield"},
                                            { id: 'ip_add_ipAddressStart', fieldLabel: '起始IP地址' , xtype: "textfield"},
                                            { id: 'ip_add_ipAddressEnd', fieldLabel: '结束IP地址' , xtype: "textfield"},
                                            { id: 'ip_add_name', fieldLabel: '业务' , xtype: "textfield"},
                                            { id: 'ip_add_department', fieldLabel: '部门',xtype: "textfield"},
                                            { id: 'ip_add_comment', fieldLabel: '备注', xtype: "textfield" },
                                            { id: 'ip_add_ip_class_name', fieldLabel: 'IP组名', xtype: "textfield" },
                                        ]
                                    }
                                ]
                            }
                        ],
                        buttons: [
                            { xtype: "button", text: "confirm", handler: function () {
                                let ip_add_ipAddress=Ext.getCmp('ip_add_ipAddress').getValue();
                                let ip_add_ipAddressStart=Ext.getCmp('ip_add_ipAddressStart').getValue();
                                let ip_add_ipAddressEnd=Ext.getCmp('ip_add_ipAddressEnd').getValue();
                                let ip_add_name=Ext.getCmp('ip_add_name').getValue();
                                let ip_add_department=Ext.getCmp('ip_add_department').getValue();
                                let ip_add_comment=Ext.getCmp('ip_add_comment').getValue();
                                let ip_add_type=Ext.getCmp('ip_add_type').getValue();
                                let ip_add_ip_class_name=Ext.getCmp('ip_add_ip_class_name').getValue();
                                Ext.Ajax.request({
                                    url: '/ip/save',
                                    params: {
                                        data:JSON.stringify({
                                            ipAddress:ip_add_ipAddress,
                                            name:ip_add_name,
                                            department:ip_add_department,
                                            comment:ip_add_comment,
                                            ipAddressStart:ip_add_ipAddressStart,
                                            ipAddressEnd:ip_add_ipAddressEnd,
                                            type:ip_add_type

                                        }),
                                        ipClassName:ip_add_ip_class_name
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
                            { xtype: "button", text: "cancel", handler: function () { this.up("window").close(); } }
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
                    let uuid=selectedData['ip_id'];
                    Ext.MessageBox.show({
                        title: "提示",
                        msg: "是否删除"+selectedData.ipAddress,
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
                                    url:'/ip/delete',
                                    params: {
                                        uuid: uuid
                                    },
                                    method: 'POST',
                                    success: function (response, options) {
                                        ipStore.reload(true)
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
                    ipStore.reload(true)
                }
            },
            {xtype:'textfield',id:'ip_query'},
            {xtype:'button',text:'查询',handler:()=>{
                let query=Ext.getCmp('ip_query').getValue();
                ipStore.filterBy((record)=>{
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
            {xtype:'button',text:'导入',handler:()=>{

                let win=Ext.create('Ext.carson.UploadWindow',{
                    url:'/ip/upload',
                    store:ipStore
                });
                win.show();

            }},
            {xtype:'button',text:'导出',handler:()=>{
                let ids=[];
                ipStore.each(function(record) {
                    ids.push(record.get('ip_id'));
                });
                Ext.Ajax.request({
                    url:'/ip/download',
                    params: {
                        ids: ids
                    },
                    method: 'POST',
                    success: function (response, options) {
                        //ipStore.reload(true)
                        window.open("/temp/data.xls","_blank");
                        Ext.MessageBox.alert('成功', '成功 ');

                    },
                    failure: function (response, options) {
                        Ext.MessageBox.alert('失败', '请求超时或网络故障,错误编号：' + response.status);
                    }
                })
            }}
        ]
    });
});