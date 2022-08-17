<template>
<CodeHeader></CodeHeader>
<div class="editorwrap">
    <div class="left">
      <div class="editor">
        <div class="editorheader">
        <i class="fa fa-code" aria-hidden="true"></i>
          <label for="htmlmode">Markup</label>
          <select v-model="htmlmode">
            <option value="htmlmixed" class="option">HTML</option>
          </select>
        </div>
         <textarea ref="htmleditor"></textarea>
      </div>
      <div class="editor">
        <div class="editorheader">
        <i class="fa fa-snowflake-o" aria-hidden="true"></i>
          <label for="cssmode">Style</label>
          <select v-model="cssmode">
            <option value="css">CSS</option>
            <option value="sass">SASS</option>
            <option value="sytlus">Stylus</option>
          </select>
        </div>
         <textarea ref="csseditor"></textarea>
      </div>
      <div class="editor">
        <div class="editorheader">
        <i class="fa fa-superpowers" aria-hidden="true"></i>
          <label for="jsmode">Script</label>
          <select v-model="jsmode">
            <option value="javascript">JavaScript</option>
            <option value="vue">Vue</option>
          </select>
        </div>
         <textarea ref="jseditor"><script></script></textarea>
      </div>
    </div>
    <div class="right">
      <iframe class="iframe" ref="iframe" />
    </div>
  </div>
</template>

<script>
import CodeHeader from "./CodeHeader.vue";
import 'codemirror/lib/codemirror.css';
import codemirror from "codemirror";
import 'codemirror/theme/material.css';

import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';
import 'codemirror/mode/sass/sass';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/stylus/stylus'
import 'codemirror/mode/vue/vue';

import 'codemirror/addon/fold/foldcode.js';
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/fold/foldgutter.js';
import 'codemirror/addon/fold/brace-fold.js';
import 'codemirror/addon/fold/xml-fold.js';
import 'codemirror/addon/fold/indent-fold.js';
import 'codemirror/addon/fold/markdown-fold.js';
import 'codemirror/addon/fold/comment-fold.js';

import 'codemirror/addon/edit/closebrackets.js';
import 'codemirror/addon/edit/closetag.js';
import 'codemirror/keymap/sublime.js';

import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/hint/css-hint.js';
import 'codemirror/addon/hint/html-hint.js';
import 'codemirror/addon/hint/javascript-hint.js';
import 'codemirror/addon/scroll/simplescrollbars.js';
import emmet from '@emmetio/codemirror-plugin';
emmet(codemirror);

import _ from 'lodash';
// const sass = require('sass');
export default {
  components:{
    CodeHeader,
  },
  data(){
    return{
      htmleditor:'',
      htmloptions:{
        lineNumbers: true,//显示行号
        line: true,
        tabSize: 4,//tab代表空格数
        theme: 'material',//主题
        foldGutter: true,
        scrollbarStyle:null,//滚动条
        cursorBlinkRate: 400,//光标闪烁速率
        cursorHeight:1,//游标高度
        spellcheck:true,//拼写检查
        autocorrect: true,//自动更正
        matchBrackets: true,//括号匹配
        autoCloseTags: true,
        autoCloseBrackets: true,
        extraKeys: {
        "Ctrl-Q": function(cm){ cm.foldCode(cm.getCursor()); },
        'Tab': 'emmetExpandAbbreviation',
        'Esc': 'emmetResetAbbreviation',
        'Enter': 'emmetInsertLineBreak'
        }
      },
      htmlmode:'htmlmixed',

      csseditor:'',
      cssoptions:{
        lineNumbers: true,
        line: true,
        tabSize: 2,
        theme: 'material',
        foldGutter: true,
        scrollbarStyle:null,
        cursorBlinkRate: 400,
        cursorHeight:1,
        spellcheck:true,
        autocorrect: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        
        extraKeys: {
        "Ctrl-Q": function(cm){ cm.foldCode(cm.getCursor()); },
        'Tab': 'emmetExpandAbbreviation',
        'Esc': 'emmetResetAbbreviation',
        'Enter': 'emmetInsertLineBreak'
        }
      },
      cssmode:'css',

      jseditor:'',
      jsoptions:{
        lineNumbers: true,
        line: true,
        tabSize: 2,
        theme: 'material',
        foldGutter: true,
        scrollbarStyle:null,
        cursorBlinkRate: 400,
        cursorHeight:1,
        spellcheck:true,
        autocorrect: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        extraKeys: {"Ctrl-Q": function(cm){ cm.foldCode(cm.getCursor()) },"Ctrl-W": "autocomplete"},
        keyMap: "sublime",
      },
      jsmode:'javascript',

      htmlcontent:'',
      csscontent:'',
      jscontent:'',
    }
  },
  watch:{//监听语言风格变化
    htmlmode() {
      this.htmleditor.setOption("mode", this.htmlmode);
    },
    cssmode() {
      this.csseditor.setOption("mode", this.cssmode);
    },
    jsmode() {
      this.jseditor.setOption("mode", this.jsmode);
    },
  },
  methods:{
    initeditor(){//自动编译
      this.htmleditor = codemirror.fromTextArea(this.$refs.htmleditor, Object.assign(this.htmloptions, {mode: this.htmlmode}));
      this.htmleditor.foldCode(codemirror.Pos(0, 0));
      this.htmleditor.on('change',_.debounce((editor) =>{
        this.htmlcontent = editor.getValue();
        this.renderCode()
      },100));

      this.csseditor = codemirror.fromTextArea(this.$refs.csseditor,Object.assign(this.cssoptions, {mode: this.cssmode}));
      this.csseditor.foldCode(codemirror.Pos(0, 0));
      this.csseditor.on('change',_.debounce((editor) =>{
        this.csscontent = editor.getValue();
        if(this.cssmode == 'css'){
          this.renderCode()
        }
        
      },100));

      this.jseditor = codemirror.fromTextArea(this.$refs.jseditor,Object.assign(this.jsoptions, {mode: this.jsmode}));
      this.jseditor.foldCode(codemirror.Pos(0, 0));
      this.jseditor.on('change',_.debounce((editor) =>{
        this.jscontent = editor.getValue();
        if(this.jsmode == 'javascript'){
          this.renderCode()
        }
      },1000));
    },
    compilehtml(){
        return this.htmlcontent;
    },
   
    renderCode(){
      var html;
      if(this.jscontent != ''){
        html = this.compilehtml(this.htmlcontent) + this.jscontent;
      }else{
        html = this.compilehtml(this.htmlcontent);
      } 
      let css = this.csscontent;
      const iframe = this.$refs.iframe;
      console.log('iframe',this.jscontent,html);
      const document = iframe.contentDocument;
      const documentContents = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <title>Document</title>
            <style>
              ${css}
            </style>
          </head>
          <body>
            ${html}
          </body>
          </html>
        `;

      document.open();
      document.write(documentContents);
      document.close();
    }
  },
  mounted(){
    this.initeditor();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
:deep(.CodeMirror){
  width:800px;
  height:185px;
}
.editorwrap{
  display: flex;
  width: 100%;
  height: 640px;
  .left,.right{
    flex:1;
    height: 640px;
  }
  .left{
    display: flex;
    flex-direction: column;
  }
  .editor{
    flex:1;
  }
  .editorheader{
    height: 40px;
    border-width:1px;
    border-style:solid;
    border-color:#2f3742;
    background-color:#18212d;
    color:#fff;
    display: flex;
    align-items: center;
    padding-left: 20px;
  }
  .iframe{
    width: 100%;
    height: 680px;
  }
  label{
    margin-left:10px;
    margin-right:15px;
    font-weight:bold;
  }
  select{
    margin-right:30px;
    width:100px;
    height:24px;
    background-color:hsla(0,0%,100%,.12);
    border:none;
    cursor:pointer;
  }
}


</style>