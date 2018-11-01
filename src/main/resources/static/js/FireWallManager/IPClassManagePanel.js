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
    var ipClassStore = Ext.create("Ext.data.Store", {
        model: "FireWallManager.model.IPClass",
        autoLoad: true,
        //pageSize: 5,
        proxy: {
            type: "ajax",
            url: "/ip_class/list",
            reader: {
                root: "rows"
            }
        }
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
        title:'IP组管理界面',
        store: ipClassStore,
        width: 1280,
        height: 720,
        //margin: 30,
        columnLines: true,
        renderTo: Ext.getBody(),
        selModel: {
            injectCheckbox: 0,
            mode: "SIMPLE",     //"SINGLE"/"SIMPLE"/"MULTI"
            checkOnly: true     //只能通过checkbox选择
        },
        selType: "checkboxmodel",
        columns: [
            { dataIndex: 'ip_class_id',  text: 'ID'},
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
                {
                    console.log(record)
                    var ips_ids=[];
                    var ips_ipAddress=[];
                    var ips=record.raw.ips;
                    for(let i=0;i<ips.length;i++){
                        let ip=ips[i];
                        console.log(ip);
                        ips_ipAddress.push(ip.ipAddress);
                        ips_ids.push(ip.ip_id);
                    }
                    console.log(ips_ids);
                    //创建window
                    let win = Ext.create("Ext.window.Window", {
                        id: "IPClassAddWindow",
                        title: "编辑",
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
                                                xtype:"combobox",
                                                id:'ipClass_add_ip',
                                                editable: false,
                                                multiSelect: true,//启用多选
                                                fieldLabel: 'IP地址',
                                                store: ipStore,//数据
                                                queryMode: 'remote',//加载本地数据
                                                displayField: 'ipAddress',//显示的字段，对应store中的text值
                                                valueField: 'ip_id',//实际传递到后台的值
                                                value:ips_ids
                                            },
                                            { fieldLabel: 'IP地址',xtype: "textareafield",height:150,value:ips_ipAddress},
                                            { id: 'ipClass_add_name', fieldLabel: '业务' , xtype: "textfield",value:record.raw.name},
                                            { id: 'ipClass_add_department', fieldLabel: '部门',xtype: "textfield",value:record.raw.department},
                                            { id: 'ipClass_add_comment', fieldLabel: '备注', xtype: "textfield",value:record.raw.comment },
                                        ]
                                    }
                                ]
                            }
                        ],
                        buttons: [
                            { xtype: "button", text: "confirm", handler: function () {

                                let ipClass_add_name=Ext.getCmp('ipClass_add_name').getValue();
                                let ipClass_add_department=Ext.getCmp('ipClass_add_department').getValue();
                                let ipClass_add_comment=Ext.getCmp('ipClass_add_comment').getValue();
                                let ipClass_add_ip=Ext.getCmp('ipClass_add_ip').getValue();
                                let ips=[];
                                for(let i=0;i<ipClass_add_ip.length;i++){
                                    var index=ipStore.find('ip_id',ipClass_add_ip[i]);
                                    var ip=ipStore.getAt(index).raw;
                                    ips.push(ip);
                                }
                                Ext.Ajax.request({
                                    url: '/ip_class/save',
                                    params: {
                                        data:JSON.stringify({
                                            ip_class_id:record.raw.ip_class_id,
                                            createTime:record.raw.createTime,
                                            name:ipClass_add_name,
                                            department:ipClass_add_department,
                                            comment:ipClass_add_comment,
                                            ips:ips
                                        })
                                    },
                                    method: 'POST',
                                    success: function (response, options) {
                                        let result=Ext.decode(response.responseText);
                                        if(result.success){
                                            Ext.MessageBox.alert('成功', '成功 ');
                                            ipClassStore.reload(true)
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
            }
        },
        tbar:[
            {
                xtype:'button',
                text:'添加',
                handler:function()
                {
                    //创建window
                    let win = Ext.create("Ext.window.Window", {
                        id: "IPClassAddWindow",
                        title: "添加",
                        width: 300,
                        height: 200,
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
                                                xtype:"combobox",
                                                id:'ipClass_add_ip',
                                                editable: false,
                                                multiSelect: true,//启用多选
                                                fieldLabel: 'IP地址',
                                                store: ipStore,//数据
                                                queryMode: 'remote',//加载本地数据
                                                displayField: 'ipAddress',//显示的字段，对应store中的text值
                                                valueField: 'ip_id'//实际传递到后台的值
                                            },
                                            { id: 'ipClass_add_name', fieldLabel: '业务' , xtype: "textfield"},
                                            { id: 'ipClass_add_department', fieldLabel: '部门',xtype: "textfield"},
                                            { id: 'ipClass_add_comment', fieldLabel: '备注', xtype: "textfield" },
                                        ]
                                    }
                                ]
                            }
                        ],
                        buttons: [
                            { xtype: "button", text: "confirm", handler: function () {

                                let ipClass_add_name=Ext.getCmp('ipClass_add_name').getValue();
                                let ipClass_add_department=Ext.getCmp('ipClass_add_department').getValue();
                                let ipClass_add_comment=Ext.getCmp('ipClass_add_comment').getValue();
                                let ipClass_add_ipsId=Ext.getCmp('ipClass_add_ip').getValue();
                                let ipClass_add_ips=[];
                                for(let i=0;i<ipClass_add_ipsId.length;i++){
                                    var index=ipStore.find('ip_id',ipClass_add_ipsId[i]);
                                    var ip=ipStore.getAt(index).raw;
                                    ipClass_add_ips.push(ip);
                                }
                                Ext.Ajax.request({
                                    url: '/ip_class/save',
                                    params: {
                                        data:JSON.stringify({
                                            name:ipClass_add_name,
                                            department:ipClass_add_department,
                                            comment:ipClass_add_comment,
                                            ips:ipClass_add_ips
                                        })
                                    },
                                    method: 'POST',
                                    success: function (response, options) {
                                        let result=Ext.decode(response.responseText);
                                        if(result.success){
                                            Ext.MessageBox.alert('成功', '成功 ');
                                            ipClassStore.reload(true)
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
                                let uuid=selectedData['ip_class_id'];
                                Ext.Ajax.request({
                                    url:'/ip_class/delete',
                                    params: {
                                        uuid: uuid
                                    },
                                    method: 'POST',
                                    success: function (response, options) {
                                        ipClassStore.reload(true)
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
                    ipClassStore.reload(true)
                }
            },
            {xtype:'textfield',id:'ip_class_query'},
            {xtype:'button',text:'查询',handler:()=>{
                let query=Ext.getCmp('ip_class_query').getValue();
                ipClassStore.filterBy((record)=>{
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
            {xtype:'button',text:'导出',handler:()=>{
                let ids=[];
                ipClassStore.each(function(record) {
                    ids.push(record.get('ip_class_id'));
                });
                Ext.Ajax.request({
                    url:'/ip_class/download',
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