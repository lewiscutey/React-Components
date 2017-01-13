import React,{Component} from "react";
import ReactDOM,{render} from "react-dom";
import 'antd/dist/antd.css';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;

class Main extends Component{
    constructor(){
        super();
        this.state={data:{}};
    }
    componentDidMount(){
        var that=this;
        var url=this.props.ajaxUrl;
        var xmlobj=new XMLHttpRequest();
        xmlobj.onload=function(){
               var data=JSON.parse(xmlobj.response);
               console.log(data);
               that.setState({data:data});
        }
        xmlobj.open("get",url);
        xmlobj.send();


    }
    down(zurl){
        console.log(zurl);
        this.setState({zurl:zurl})
    }
    render(){

        var that=this;
        var eles=[];
        for(var i in this.state.data){
            var newarr=this.state.data[i].map(function(a,b){
                return   <Menu.Item key={b}><a className="menuLink" href={a.url} target="content" title={a.zurl} onMouseDown={()=>{that.down(a.zurl)}}>{a.catname}</a></Menu.Item>
            })
            var menu= <SubMenu key={i} title={<span><Icon type="user" />{i}</span>}>{newarr}</SubMenu>;
            eles.push(menu);

        }

        return (
            <Layout>

                <Header className="header">
                    <div className="logo" />
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={['2']}
                        style={{ lineHeight: '64px' }}
                    >

                        <Menu.Item key="1">nav 1</Menu.Item>
                        <Menu.Item key="2">nav 2</Menu.Item>
                        <Menu.Item key="3">nav 3</Menu.Item>
                    </Menu>
                </Header>
                <Content style={{ padding: '0 50px' }}>
                    <Breadcrumb style={{ margin: '12px 0' }}>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                        <Breadcrumb.Item>List</Breadcrumb.Item>
                        <Breadcrumb.Item>App</Breadcrumb.Item>
                    </Breadcrumb>
                    <Layout style={{ padding: '24px 0', background: '#fff' }}>
                        <Sider width={200}>

                            <Menu
                                mode="inline"
                                defaultSelectedKeys={['1']}
                                defaultOpenKeys={['sub1']}
                            >
                                {eles}



                            </Menu>


                        </Sider>
                        <Content style={{ padding: '0 24px', minHeight: 280 }}>
                            <a href={that.state.zurl} >下载</a>
                            <iframe name="content"></iframe>
                        </Content>
                    </Layout>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Ant Design ©2016 Created by Ant UED
                </Footer>
            </Layout>

        )
    }
}
render(<Main ajaxUrl="/ajaxUrl"/>,document.querySelector("#root"))





