Ext.onReady(function() {
    Ext.create('Ext.Panel', {
        renderTo: 'main',
        height: 200,
        width: 300,
        region:'center',
        layout: {
            type: 'vbox',
            align: 'strench ',
            pack: 'center'
        },
        title: '登陆',
        items:[
            {
                xtype:'textfield',
                fieldLabel:'用户名',
                id:'username'
            },
            {
                xtype:'textfield',
                fieldLabel:'密码',
                inputType:'password',
                id:'userpassword'
            },
            {
                xtype:'button',
                align: 'center',
                text:'登陆',
                handler:Login
            }

        ],
        //bbar:[
        //
        //]
    });
});
function Login(){
    let username=Ext.getCmp('username').getValue();
    let password=Ext.getCmp('userpassword').getValue();
    Ext.Ajax.request({
        url: '/user/login',
        params: {
            userName: username,
            userPassword: password
        },
        method: 'POST',
        success: function (response, options) {
            let result=Ext.decode(response.responseText);
            if(result.success){
                Ext.MessageBox.alert('成功', '登陆成功 ');
                setTimeout(function()
                {
                    window.location.href='/FireWallManager/TotalManagePanel.html'
                },1000);
            }else{
                Ext.MessageBox.alert('失败', '密码账号错误' );
                Ext.getCmp('userpassword').setValue('');
            }

        },
        failure: function (response, options) {
            Ext.MessageBox.alert('失败', '请求超时或网络故障,错误编号：' + response.status);
        }
    });
}