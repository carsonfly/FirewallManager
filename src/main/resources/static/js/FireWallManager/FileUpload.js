/**
 * Created by Administrator on 2018/10/30.
 */

Ext.define('Ext.carson.UploadWindow', {
    extend:'Ext.window.Window',
    xtype:'upload_window',
    url:'',
    store:'',
    items: [{
        xtype:'form',
        title:'上传文件',
        width:360,
        layout:'vbox',
        items: [{
            xtype:'filefield',
            width:'100%',
            name:'file',
        }, {
            xtype:'button',
            //width:45,
            text:'上传文件',
            listeners: {
                click:function (btn,e,opts) {

                    this.up('form').submit({
                        method:'post',
                        url:this.up('window').url,
                        waitMsg:'文件上传中...',
                        success: function() {
                            this.up('window').store.reload(true);
                            Ext.Msg.alert("系统提示", "文件上传成功！");
                        },
                        failure: function() {
                            Ext.Msg.alert("系统提示", "文件上传失败！");
                        }
                    })
                }
            }
        }]
    }]
});
