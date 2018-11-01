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
    var strategyStore = Ext.create("Ext.data.Store", {
        model: "FireWallManager.model.Strategy",
        autoLoad: true,
        //pageSize: 5,
        proxy: {
            type: "ajax",
            url: "/strategy/list",
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
    var portStore = Ext.create("Ext.data.Store", {
        model: "FireWallManager.model.Port",
        autoLoad: true,
        //pageSize: 5,
        proxy: {
            type: "ajax",
            url: "/port/list",
            reader: {
                root: "rows"
            }
        }
    });
    var grid = Ext.create("Ext.grid.Panel", {
        xtype: "grid",
        title:'策略管理界面',
        store: strategyStore,
        width: 1280,
        height: 720,
        renderTo: Ext.getBody(),
        selModel: {
            injectCheckbox: 0,
            mode: "SIMPLE",     //"SINGLE"/"SIMPLE"/"MULTI"
            checkOnly: true     //只能通过checkbox选择
        },
        selType: "checkboxmodel",
        columns: [
            { dataIndex: 'id',  text: 'ID'},
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
                    //console.log(record)
                    var targetPortID=[];
                    var targetPorts=record.raw.targetPorts;
                    for(let i=0;i<targetPorts.length;i++){
                        let ip=targetPorts[i];
                        //console.log(ip);
                        targetPortID.push(ip.id);
                    }
                    //console.log(targetPortID);
                    var sourceIpsID=[];
                    var sourceIps=record.raw.sourceIps;
                    for(let i=0;i<sourceIps.length;i++){
                        let ip=sourceIps[i];
                        //console.log(ip);
                        sourceIpsID.push(ip.ip_id);
                    }
                    //console.log(sourceIps);
                    var targetIpsID=[];
                    var targetIps=record.raw.targetIps;
                    for(let i=0;i<targetIps.length;i++){
                        let ip=targetIps[i];
                        //console.log(ip);
                        targetIpsID.push(ip.ip_id);
                    }
                    //console.log(targetIps);
                    var sourceIpsClassID=[];
                    var sourceIpClasses=record.raw.sourceIpClasses;
                    for(let i=0;i<sourceIpClasses.length;i++){
                        let ip=sourceIpClasses[i];
                        //console.log(ip);
                        sourceIpsClassID.push(ip.ip_class_id);
                    }
                    //console.log(sourceIpsClassID);
                    var targetIpsClassID=[];
                    var targetIpClasses=record.raw.targetIpClasses;
                    for(let i=0;i<targetIpClasses.length;i++){
                        let ip=targetIpClasses[i];
                        //console.log(ip);
                        targetIpsClassID.push(ip.ip_class_id);
                    }
                    //console.log(targetIpsClassID);
                    //创建window
                    let win = Ext.create("Ext.window.Window", {
                        id: "StrategyAddWindow",
                        title: "编辑",
                        width: 600,
                        height: 800,
                        layout: {
                            type:'vbox',
                            align : 'stretch'
                        },
                        items: [

                            {
                                xtype: "combobox",
                                id:'strategy_add_type',
                                fieldLabel: "类型",
                                store: {
                                    xtype:'store',
                                    fields: ["Name", "Value"],
                                    data: [
                                        { Name: "允许", Value:'Allowed' },
                                        { Name: "禁止", Value: 'Forbidden' }
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
                            {
                                xtype:"combobox",
                                id:'strategy_add_target_port',
                                editable: false,
                                multiSelect: true,//启用多选
                                fieldLabel: '目的端口',
                                editable:true,
                                anyMatch: true,
                                store: portStore,//数据
                                queryMode: 'remote',//加载本地数据
                                displayField: 'port',//显示的字段，对应store中的text值
                                valueField: 'id',//实际传递到后台的值
                                value:targetPortID
                            },
                            {
                                xtype:"combobox",
                                id:'strategy_add_source_ip',
                                editable: false,
                                multiSelect: true,//启用多选
                                fieldLabel: '源IP地址',
                                editable:true,
                                anyMatch: true,
                                store: ipStore,//数据
                                queryMode: 'remote',//加载本地数据
                                displayField: 'ipAddress',//显示的字段，对应store中的text值
                                valueField: 'ip_id',//实际传递到后台的值
                                value:sourceIpsID
                            },
                            {
                                xtype:"combobox",
                                id:'strategy_add_target_ip',
                                editable: false,
                                editable:true,
                                anyMatch: true,
                                multiSelect: true,//启用多选
                                fieldLabel: '目的IP地址',
                                store: ipStore,//数据
                                queryMode: 'remote',//加载本地数据
                                displayField: 'ipAddress',//显示的字段，对应store中的text值
                                valueField: 'ip_id',//实际传递到后台的值
                                value:targetIpsID
                            },
                            {
                                xtype:"combobox",
                                id:'strategy_add_source_ip_class',
                                editable: false,
                                editable:true,
                                anyMatch: true,
                                multiSelect: true,//启用多选
                                fieldLabel: '源IP地址组',
                                store: ipClassStore,//数据
                                queryMode: 'remote',//加载本地数据
                                displayField: 'name',//显示的字段，对应store中的text值
                                valueField: 'ip_class_id',//实际传递到后台的值
                                value:sourceIpsClassID
                            },
                            {
                                xtype:"combobox",
                                id:'strategy_add_target_ip_class',
                                editable: false,
                                editable:true,
                                anyMatch: true,
                                multiSelect: true,//启用多选
                                fieldLabel: '目的IP地址组',
                                store: ipClassStore,//数据
                                queryMode: 'remote',//加载本地数据
                                displayField: 'name',//显示的字段，对应store中的text值
                                valueField: 'ip_class_id',//实际传递到后台的值
                                value:targetIpsClassID
                            },
                            { id: 'strategy_add_name', fieldLabel: '业务' , xtype: "textfield",value:record.raw.name},
                            { id: 'strategy_add_department', fieldLabel: '部门',xtype: "textfield",value:record.raw.department},
                            { id: 'strategy_add_comment', fieldLabel: '备注', xtype: "textfield",value:record.raw.comment },
                            {id: 'strategy_add_raw', fieldLabel: '原始数据', xtype: "textarea",height:500,value:formatJson(record.raw)}
                        ],
                        buttons: [
                            { xtype: "button", text: "confirm", handler: function () {

                                let strategy_add_type=Ext.getCmp('strategy_add_type').getValue();
                                let strategy_add_target_port=Ext.getCmp('strategy_add_target_port').getValue();
                                let strategy_add_name=Ext.getCmp('strategy_add_name').getValue();
                                let strategy_add_department=Ext.getCmp('strategy_add_department').getValue();
                                let strategy_add_comment=Ext.getCmp('strategy_add_comment').getValue();
                                let strategy_add_source_ip=Ext.getCmp('strategy_add_source_ip').getValue();
                                let strategy_add_target_ip=Ext.getCmp('strategy_add_target_ip').getValue();
                                let strategy_add_source_ip_class=Ext.getCmp('strategy_add_source_ip_class').getValue();
                                let strategy_add_target_ip_class=Ext.getCmp('strategy_add_target_ip_class').getValue();
                                let strategy_add_target_ports=[];
                                for(let i=0;i<strategy_add_target_port.length;i++){
                                    var index=portStore.find('id',strategy_add_target_port[i]);
                                    var port=portStore.getAt(index).raw;
                                    //console.log(port)
                                    if(port.port.indexOf('禁止')!=-1){
                                        Ext.Msg.alert("警告",port.port);
                                        return
                                    }
                                    strategy_add_target_ports.push(port);
                                }

                                let strategy_add_source_ips=[];
                                for(let i=0;i<strategy_add_source_ip.length;i++){
                                    var index=ipStore.find('ip_id',strategy_add_source_ip[i]);
                                    var ip=ipStore.getAt(index).raw;
                                    strategy_add_source_ips.push(ip);
                                }
                                let strategy_add_target_ips=[];
                                for(let i=0;i<strategy_add_target_ip.length;i++){
                                    var index=ipStore.find('ip_id',strategy_add_target_ip[i]);
                                    var ip=ipStore.getAt(index).raw;
                                    strategy_add_target_ips.push(ip);
                                }
                                let strategy_add_source_ip_classes=[];
                                for(let i=0;i<strategy_add_source_ip_class.length;i++){
                                    var index=ipClassStore.find('ip_class_id',strategy_add_source_ip_class[i]);
                                    var ip=ipClassStore.getAt(index).raw;
                                    strategy_add_source_ip_classes.push(ip);
                                }
                                let strategy_add_target_ip_classes=[];
                                for(let i=0;i<strategy_add_target_ip_class.length;i++){
                                    var index=ipClassStore.find('ip_class_id',strategy_add_target_ip_class[i]);
                                    var ip=ipClassStore.getAt(index).raw;
                                    strategy_add_target_ip_classes.push(ip);
                                }
                                Ext.Ajax.request({
                                    url: '/strategy/save',
                                    params: {
                                        data:JSON.stringify({
                                            id:record.raw.id,
                                            createTime:record.raw.createTime,
                                            type:strategy_add_type,
                                            name:strategy_add_name,
                                            department:strategy_add_department,
                                            comment:strategy_add_comment,
                                            targetPorts:strategy_add_target_ports,
                                            sourceIps:strategy_add_source_ips,
                                            targetIps:strategy_add_target_ips,
                                            sourceIpClasses:strategy_add_source_ip_classes,
                                            targetIpClasses:strategy_add_target_ip_classes
                                        })
                                    },
                                    method: 'POST',
                                    success: function (response, options) {
                                        let result=Ext.decode(response.responseText);
                                        if(result.success){
                                            Ext.MessageBox.alert('成功', '成功 ');
                                            strategyStore.reload(true)
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

                                            { id: 'strategy_add_name', fieldLabel: '业务' , xtype: "textfield"},
                                            { id: 'strategy_add_department', fieldLabel: '部门',xtype: "textfield"},
                                            { id: 'strategy_add_comment', fieldLabel: '备注', xtype: "textfield" },
                                            {
                                                xtype: "combobox",
                                                id:'strategy_add_type',
                                                fieldLabel: "类型",
                                                store: {
                                                    xtype:'store',
                                                    fields: ["Name", "Value"],
                                                    data: [
                                                        { Name: "允许", Value:'Allowed' },
                                                        { Name: "禁止", Value: 'Forbidden' }
                                                    ]
                                                },
                                                editable: false,
                                                displayField: "Name",
                                                valueField: "Value",
                                                emptyText: "--请选择--",
                                                queryMode: "local"
                                            },
                                        ]
                                    }
                                ]
                            }
                        ],
                        buttons: [
                            { xtype: "button", text: "confirm", handler: function () {

                                let strategy_add_name=Ext.getCmp('strategy_add_name').getValue();
                                let strategy_add_department=Ext.getCmp('strategy_add_department').getValue();
                                let strategy_add_comment=Ext.getCmp('strategy_add_comment').getValue();
                                let strategy_add_type=Ext.getCmp('strategy_add_type').getValue();
                                Ext.Ajax.request({
                                    url: '/strategy/save',
                                    params: {
                                        data:JSON.stringify({
                                            name:strategy_add_name,
                                            department:strategy_add_department,
                                            comment:strategy_add_comment,
                                            type:strategy_add_type
                                        })
                                    },
                                    method: 'POST',
                                    success: function (response, options) {
                                        let result=Ext.decode(response.responseText);
                                        if(result.success){
                                            Ext.MessageBox.alert('成功', '成功 ');
                                            strategyStore.reload(true)
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
                    //console.log(selectedData);
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
                                    url:'/strategy/delete',
                                    params: {
                                        uuid: uuid
                                    },
                                    method: 'POST',
                                    success: function (response, options) {
                                        strategyStore.reload(true)
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
                    strategyStore.reload(true)
                }
            },
            {xtype:'textfield',id:'strategy_query'},
            {xtype:'button',text:'查询',handler:()=>{
                let query=Ext.getCmp('strategy_query').getValue();
                strategyStore.filterBy((record)=>{
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
                strategyStore.each(function(record) {
                    ids.push(record.get('id'));
                });
                Ext.Ajax.request({
                    url:'/strategy/download',
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
function formatJson(json,options) {


    var reg = null,
        formatted = '',
        pad = 0,
        PADDING = '    '; // one can also use '\t' or a different number of spaces

    // optional settings
    options = options || {};
    // remove newline where '{' or '[' follows ':'
    options.newlineAfterColonIfBeforeBraceOrBracket = (options.newlineAfterColonIfBeforeBraceOrBracket === true) ? true : false;
    // use a space after a colon
    options.spaceAfterColon = (options.spaceAfterColon === false) ? false : true;

    // begin formatting...
    if (typeof json !== 'string') {
        // make sure we start with the JSON as a string
        json = JSON.stringify(json);
    } else {
        // is already a string, so parse and re-stringify in order to remove extra whitespace
        json = JSON.parse(json);
        json = JSON.stringify(json);
    }

    // add newline before and after curly braces
    reg = /([\{\}])/g;
    json = json.replace(reg, '\r\n$1\r\n');

    // add newline before and after square brackets
    reg = /([\[\]])/g;
    json = json.replace(reg, '\r\n$1\r\n');

    // add newline after comma
    reg = /(\,)/g;
    json = json.replace(reg, '$1\r\n');

    // remove multiple newlines
    reg = /(\r\n\r\n)/g;
    json = json.replace(reg, '\r\n');

    // remove newlines before commas
    reg = /\r\n\,/g;
    json = json.replace(reg, ',');

    // optional formatting...
    if (!options.newlineAfterColonIfBeforeBraceOrBracket) {
        reg = /\:\r\n\{/g;
        json = json.replace(reg, ':{');
        reg = /\:\r\n\[/g;
        json = json.replace(reg, ':[');
    }
    if (options.spaceAfterColon) {
        reg = /\:/g;
        json = json.replace(reg, ': ');
    }
    var jsonSplit=json.split('\r\n');
    for(let index=0;index<jsonSplit.length;index++) {
        var node=jsonSplit[index]
        var i = 0,
            indent = 0,
            padding = '';

        if (node.match(/\{$/) || node.match(/\[$/)) {
            indent = 1;
        } else if (node.match(/\}/) || node.match(/\]/)) {
            if (pad !== 0) {
                pad -= 1;
            }
        } else {
            indent = 0;
        }

        for (i = 0; i < pad; i++) {
            padding += PADDING;
        }

        formatted += padding + node + '\r\n';
        pad += indent;
    };
    //dataform.down("[name='actConfigValue']").setValue(formatted);
     return formatted;
}