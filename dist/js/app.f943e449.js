webpackJsonp([1],{0:function(e,t,n){e.exports=n("NHnr")},"1/oy":function(e,t){},"1IbK":function(e,t){},"7X33":function(e,t){},"9M+g":function(e,t){},EZog:function(e,t){},Id91:function(e,t){},Jmt5:function(e,t){},LMjS:function(e,t){},NHnr:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=n("4bK6"),i=n.n(a),o={name:"aLogo",props:{router:{type:Boolean,required:!1,default:!0},linkTo:{type:String,required:!1,default:"/"},src:{type:String,required:!1,default:"../../assets/logo.png"},alt:{type:String,required:!1,default:"Aileron Airways"}}},r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"logo"},[!0===e.router?a("router-link",{attrs:{to:e.linkTo}},[a("img",{attrs:{src:n("iQH9"),alt:e.alt}})]):a("a",{attrs:{href:"link"}},[a("img",{attrs:{src:n("iQH9"),alt:e.alt}})])],1)},l=[],c=n("XyMi");function s(e){n("ywOJ")}var u=!1,d=s,m="data-v-6038cb86",f=null,h=Object(c["a"])(o,r,l,u,d,m,f),p=h.exports,v={name:"aSearch",data:function(){return{searchValue:""}},props:{placeholder:{type:String,required:!1,default:"Search..."}},methods:{search:function(){this.$emit("searched",this.searchValue)}}},b=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"search"},[n("span",[n("i",{staticClass:"material-icons icon",on:{click:e.search}},[e._v("search")]),n("input",{directives:[{name:"model",rawName:"v-model",value:e.searchValue,expression:"searchValue"}],attrs:{type:"text",placeholder:e.placeholder},domProps:{value:e.searchValue},on:{keyup:function(t){if(!("button"in t)&&e._k(t.keyCode,"enter",13,t.key))return null;e.search(t)},input:function(t){t.target.composing||(e.searchValue=t.target.value)}}}),n("i",{staticClass:"material-icons arrow-down"},[e._v("arrow_drop_down")])])])},T=[];function g(e){n("EZog")}var w=!1,y=g,C="data-v-0941f99e",_=null,k=Object(c["a"])(v,b,T,w,y,C,_),M=k.exports,E={name:"aHeader",components:{aLogo:p,aSearch:M},data:function(){return{searchValue:""}},methods:{search:function(e){console.log(e)}}},x=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("b-row",{staticClass:"header",attrs:{"align-v":"start"}},[n("b-col",{attrs:{md:"6"}},[n("a-logo")],1),n("b-col",{attrs:{md:"6","align-self":"center"}},[n("a-search",{on:{searched:e.search}})],1)],1)},$=[];function I(e){n("7X33")}var K=!1,S=I,H=null,O=null,D=Object(c["a"])(E,x,$,K,S,H,O),q=D.exports,j={name:"app",components:{aHeader:q}},V=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("b-container",{attrs:{id:"app",fluid:""}},[n("a-header"),n("router-view")],1)},Z=[];function R(e){n("Q6DT")}var L=!1,Q=R,F=null,N=null,Y=Object(c["a"])(j,V,Z,L,Q,F,N),z=Y.exports,A=n("e6fC"),B=n("/ocq"),W=(n("Jmt5"),n("9M+g"),n("VjuZ"),{name:"aSelectionHandler",props:{selectCount:{type:Number,required:!0}},methods:{del:function(){this.$emit("del")},cancel:function(){this.$emit("cancel")}}}),G=function(){var e=this,t=e.$createElement,n=e._self._c||t;return e.selectCount>0?n("b-row",{staticClass:"selection-handler"},[n("b-col",{attrs:{lg:"8","offset-lg":"2",md:"10","offset-md":"1"}},[n("h2",[e._v(e._s(e.selectCount)+" timeline"),this.selectCount>1?n("span",[e._v("s")]):e._e(),e._v(" selected")]),n("b-btn",{attrs:{id:"delete"},on:{click:e.del}},[e._v("Delete")]),n("b-btn",{attrs:{id:"cancel"},on:{click:e.cancel}},[e._v("Cancel")])],1)],1):e._e()},X=[];function J(e){n("1IbK")}var P=!1,U=J,ee="data-v-a6413dec",te=null,ne=Object(c["a"])(W,G,X,P,U,ee,te),ae=ne.exports,ie=n("mtWM"),oe=n.n(ie),re=[{key:"title",sortable:!0},{key:"date",sortable:!0,formatter:"dateFormatter"}],le={by:"date",desc:!1};function ce(e,t){le.by=e,le.desc=t}function se(){le.by="",le.desc=""}var ue=0;function de(e){for(var t=0;t<ve.length;t++){var n=ve[t];n.selected=!1,n._rowVariant=""}e.selectCount=0}function me(e,t){e.selected=!0,e._rowVariant="select",t.selectCount++}function fe(e,t){e.selected=!1,e._rowVariant="",t.selectCount--}function he(e,t){console.log(e,t),console.log(ve)}function pe(e){var t=e.replace(/\s/g,"");return t.length>=5}var ve=[];oe.a.get("https://b0qss3eydk.execute-api.eu-west-2.amazonaws.com/aileron/GetTimelines",{headers:{"X-Api-Key":"zQfYRHZ1vY3GFnvDZep8Z5KqlHsOKxgf1vnldchF"}}).then(function(e){for(var t=0;t<e.data.length;t++){var n=e.data[t],a={title:n.Title,date:n.CreationTimeStamp,isDeleted:n.isDeleted,id:n.Id,selected:!1,_rowVariant:""};ve.push(a)}}).catch(function(e){console.log(e)});var be={name:"aRegister",components:{aSelectionHandler:ae},data:function(){return{fields:re,sort:le,selectCount:ue,clearSelected:de,timelines:ve,createTimelineModal:!1,newTimelineTitle:"",showTitleWarning:!1}},methods:{cancel:function(){de(this)},del:function(){for(var e=this,t=0;t<ve.length;t++)if(!0===ve[t].selected)var n=oe.a.put("https://b0qss3eydk.execute-api.eu-west-2.amazonaws.com/aileron/DeleteTimeline",{TimelineId:ve[t].id},{headers:{"X-Api-Key":"zQfYRHZ1vY3GFnvDZep8Z5KqlHsOKxgf1vnldchF"}}).catch(function(e){console.log(e)});n.then(function(t){e.$router.go(e.$router.currentRoute)})},sortChanged:function(e){e.sortBy===le.by&&!1===e.sortDesc&&!0===le.desc?se():ce(e.sortBy,e.sortDesc)},rowClicked:function(e,t,n){e.selected?n.ctrlKey?fe(e,this):n.shiftKey||(this.selectCount>1?(de(this),me(e,this)):fe(e,this)):n.ctrlKey?me(e,this):n.shiftKey?(me(e,this),this.selectCount>1&&he(e,this)):(this.selectCount>0&&de(this),me(e,this))},openTimeline:function(e){this.$router.push({name:"TIMELINE",params:{timeline:e}})},dateFormatter:function(e){var t=621355968e9,n=e-t,a=n/1e4,i=new Date(a);return i.toLocaleDateString()},closeCreateTimelineModal:function(){this.createTimelineModal=!this.createTimelineModal},createTimeline:function(){var e=this;if(!pe(this.newTimelineTitle))return document.getElementById("createTimelineInput").focus(),void(this.showTitleWarning=!0);var t=oe.a.put("https://b0qss3eydk.execute-api.eu-west-2.amazonaws.com/aileron/CreateTimeline",{Title:this.newTimelineTitle},{headers:{"X-Api-Key":"zQfYRHZ1vY3GFnvDZep8Z5KqlHsOKxgf1vnldchF"}}).catch(function(e){console.log(e)});this.newTimelineTitle="",this.createTimelineModal=!this.createTimelineModal,t.then(function(t){e.$router.go(e.$router.currentRoute)})},createModalOpened:function(){document.getElementById("createTimelineInput").focus()},createModalClosed:function(){this.newTimelineTitle="",this.showTitleWarning=!1},checkTitleInput:function(){!0===this.showTitleWarning&&pe(this.newTimelineTitle)&&(this.showTitleWarning=!1)}}},Te=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("b-row",{staticClass:"register",attrs:{"align-v":"center"}},[n("b-col"),n("b-col",{attrs:{md:"11"}},[n("b-btn",{attrs:{id:"create"},on:{click:function(t){e.createTimelineModal=!e.createTimelineModal}}},[e._v("+")]),n("b-table",{attrs:{items:e.timelines,"bordered:false":"","sort-by":e.sort.by,"sort-desc":e.sort.desc,fields:e.fields},on:{"update:sortBy":function(t){e.$set(e.sort,"by",t)},"update:sortDesc":function(t){e.$set(e.sort,"desc",t)},"row-clicked":e.rowClicked,"sort-changed":e.sortChanged,"row-dblclicked":e.openTimeline}})],1),n("b-col")],1),n("a-selection-handler",{attrs:{"select-count":e.selectCount},on:{del:e.del,cancel:e.cancel}}),n("b-modal",{attrs:{title:"Create",id:"createModal"},on:{shown:e.createModalOpened,hidden:e.createModalClosed},model:{value:e.createTimelineModal,callback:function(t){e.createTimelineModal=t},expression:"createTimelineModal"}},[n("b-container",{attrs:{fluid:""}},[n("b-row",[n("b-col",[n("input",{directives:[{name:"model",rawName:"v-model",value:e.newTimelineTitle,expression:"newTimelineTitle"}],attrs:{type:"text",placeholder:"Enter title",id:"createTimelineInput"},domProps:{value:e.newTimelineTitle},on:{keyup:[function(t){if(!("button"in t)&&e._k(t.keyCode,"enter",13,t.key))return null;e.createTimeline(t)},e.checkTitleInput],input:function(t){t.target.composing||(e.newTimelineTitle=t.target.value)}}}),n("b-alert",{attrs:{variant:"danger",show:e.showTitleWarning}},[e._v("Title must be at least 5 characters long")])],1)],1)],1),n("div",{staticClass:"w-100",attrs:{slot:"modal-footer"},slot:"modal-footer"},[n("b-btn",{staticClass:"float-left",on:{click:e.closeCreateTimelineModal}},[e._v("CANCEL")]),n("b-btn",{staticClass:"float-right",on:{click:e.createTimeline}},[e._v("CREATE")])],1)],1)],1)},ge=[];function we(e){n("LMjS")}var ye=!1,Ce=we,_e=null,ke=null,Me=Object(c["a"])(be,Te,ge,ye,Ce,_e,ke),Ee=Me.exports,xe={name:"aTimeline",data:function(){return{title:this.$route.params.timeline.title}},methods:{back:function(){this.$router.push({name:"REGISTER"})}}},$e=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"timeline"},[n("b-row",{staticClass:"head",attrs:{"align-v":"start"}},[n("b-col",{attrs:{md:"6"}},[n("b-btn",{on:{click:e.back}},[e._v("Back")])],1),n("b-col",[n("h3",[e._v(e._s(e.title))])])],1),n("b-row")],1)},Ie=[];function Ke(e){n("dLvY")}var Se=!1,He=Ke,Oe=null,De=null,qe=Object(c["a"])(xe,$e,Ie,Se,He,Oe,De),je=qe.exports;i.a.use(A["a"]),i.a.use(B["a"]);var Ve=[{name:"REGISTER",path:"/",component:Ee},{name:"TIMELINE",path:"/timeline",component:je}],Ze=new B["a"]({routes:Ve});i.a.config.productionTip=!1,new i.a({render:function(e){return e(z)},router:Ze}).$mount("#app")},Q6DT:function(e,t){},dLvY:function(e,t){},iQH9:function(e,t,n){e.exports=n.p+"img/logo.2847cb02.png"},ywOJ:function(e,t){},zj2Q:function(e,t){}},[0]);
//# sourceMappingURL=app.f943e449.js.map